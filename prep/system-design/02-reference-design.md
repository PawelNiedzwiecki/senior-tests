# Reference design: real-time one-to-one messaging web app

The model answer. Learn the **shape and the reasons**, not the exact words.
Unfamiliar term? Look it up in [00-glossary.md](00-glossary.md).

> **How deep to go** (the hiring manager warned against buzzwords you can't back up)
>
> 🟢 **Must defend.** Know these well and lead with them:
> - §1 requirements
> - §4 sending flow
> - §5 real-time technology choice
> - §6 connection and retry
> - §7 sync and ordering
> - §8 pagination
> - §9 browser data
> - §11 security basics
> - §12 monitoring
>
> 🟡 **Only if asked.** Have a one-sentence answer, plus "I haven't run that in production, but…":
> - §3 which database engine
> - §10 scaling details: Redis vs Kafka internals, multiple regions, backpressure
> - how exactly sequence numbers are generated

---

## 1. Requirements

**Functional requirements: what it does**
- Send and receive one-to-one text messages in real time.
- Delivery status for each message:
  - **pending:** shown locally, not yet confirmed
  - **sent:** the server has saved it
  - **delivered:** the recipient's device has it
  - **read:** the recipient has seen it
  - **failed:** gave up after retries
- A conversation list with unread counts, and message history loaded page by page.
- Offline and unreliable network: keep unsent messages, retry them, and fetch missed messages after reconnecting.
- Nice to have: online status, "typing…" indicator.

**Non-functional requirements: how well it does it**
- **Speed:** 95% of messages arrive within 500 milliseconds when both users are online.
- **Durability:** once the server confirms a message as "sent", it is never lost.
- **Ordering:** messages in a conversation appear in the same order for both users and on every device.
- **Delivery guarantee:** keep retrying until confirmed (it may arrive twice), and remove duplicates on arrival. To the user, every message arrives exactly once.
- **Availability:** 99.95% uptime or better. People expect messaging to always work.
- **Scale:**
  - about 10 million daily active users
  - about 20,000 messages per second at peak
  - about 2 million open connections at once
- Secure, monitorable and accessible.

**Out of scope:** group chats, images and files, end-to-end encryption, search, editing and deleting.

---

## 2. High-level architecture

```
 ┌──────────────────────────── Browser ─────────────────────────────┐
 │  React user interface                                            │
 │    (virtualised message list, status icons, screen-reader        │
 │     announcements)                                               │
 │      ▲            │                                              │
 │  Zustand store (data held in memory, each message stored by id)  │
 │      ▲            │                                              │
 │  IndexedDB (browser database):                                   │
 │    cached messages + OUTBOX (unconfirmed messages)               │
 │    + last seen sequence number per conversation                  │
 │      ▲            │                                              │
 │  Connection manager                                              │
 │    (WebSocket, heartbeat, retry with backoff, re-sync)           │
 └──────────────────────┬───────────────────────────────────────────┘
                        │ Secure WebSocket (real-time messages)
                        │ HTTPS (history, sync, login)
                        ▼
                ┌───────────────┐
                │ Load balancer │  encryption, firewall, rate limiting,
                └───┬───────┬───┘  spreads connections across servers
                    │       │
       ┌────────────▼──┐  ┌─▼──────────────┐
       │ WebSocket     │  │ Regular HTTP   │  holds no state
       │ gateway       │  │ (REST) API     │
       │ servers       │  │ login, history,│
       │ (hold open    │  │ sync           │
       │  connections) │  └──────┬─────────┘
       └──┬──────▲─────┘         │
          │      │               │
          ▼      │               ▼
   ┌──────────────┴──┐    ┌───────────────────────┐
   │ Message service │───▶│ Message database      │
   │ - remove dupes  │    │ split by conversation │
   │ - assign        │    │ id, ordered by        │
   │   sequence no.  │    │ sequence number       │
   │ - save          │    │ (Cassandra/DynamoDB)  │
   │ - route         │    └───────────────────────┘
   └───┬─────────────┘
       │ publish "deliver to user B"
       ▼
  ┌──────────────────┐  look up   ┌─────────────────────────────┐
  │ Redis publish/   │◀──────────▶│ Connection registry (Redis) │
  │ subscribe        │            │ "user B is connected to     │
  │ (one channel per │            │  gateway 7"; entries expire │
  │  gateway server) │            │  unless refreshed           │
  └──┬───────────────┘            └─────────────────────────────┘
     │       └──▶ Push notification service
     │            (recipient offline → browser/phone notification)
     ▼
  recipient's gateway server → recipient's browser
```

**Why each part is there**

- **Gateway servers are separate from the message service.**
  - Gateways hold open connections, so they grow with the number of users online.
  - The message service holds nothing between requests, so it grows with message volume.
  - Splitting them lets each scale and be deployed independently.
  - Restarting a gateway disconnects its users, so deploy gateways less often and let users move off gradually.
- **Connection registry.** The sender and recipient are usually connected to *different* gateway servers, so we need a lookup of where each user is connected.
  - Each gateway writes "user → this gateway" when a user connects.
  - Entries expire automatically unless refreshed by the heartbeat, so stale entries clean themselves up.
- **Redis publish/subscribe, one channel per gateway.** The message service publishes "deliver this" on the recipient's gateway channel, and that gateway pushes it down the open connection.
  - This is fire-and-forget: nothing is stored, and there is no guarantee.
  - That's fine, because the message is **already saved** in the database. If the publish is lost, the recipient's browser catches up through sync or gap detection.
  - Kafka would add stored, replayable messages, at the cost of speed and complexity. It's the "I'd switch if…" option.
- **Push notification service.** If the recipient has no open connection, send a browser or phone notification. The message is already saved and arrives via sync when they open the app.
- **Regular HTTP (REST) API next to the WebSocket.** Loading history and syncing are simple question-and-answer requests, and HTTP handles them well: caching, retrying and tooling.
  - Don't force everything through the WebSocket.
  - It's also the backup way to send when the WebSocket is down.

---

## 3. Data model (what we store)

```
conversations
  conversationId (primary key), userA, userB, createdAt,
  lastSequenceNumber, lastMessageAt

userConversations   (one row per user per conversation)
  userId (partition key), lastMessageAt (sort key), conversationId,
  lastReadSequenceNumber, lastDeliveredSequenceNumber

messages
  conversationId (partition key), sequenceNumber (sort key),
  messageId, clientMessageId, senderId, body, createdAt

duplicateCheck      (or a unique index instead of a table)
  senderId + clientMessageId → messageId, expires after ~24 hours
```

- **Split by `conversationId`, ordered by `sequenceNumber`.** "The latest 50 messages of this conversation" becomes one fast read from one place. One-to-one conversations never get overloaded the way huge group chats can.
- **Delivery status stored as positions, not per message.** Each user has `lastDeliveredSequenceNumber` and `lastReadSequenceNumber` per conversation. "Everything up to number 120 is read" is a single update, instead of updating 20 messages one by one. The unread count is `conversation.lastSequenceNumber − lastReadSequenceNumber`.
- **Predictable conversation id.** For a one-to-one chat, build the id from the two user ids, always in the same order: `hash(smaller id, larger id)`. That way the same pair can never accidentally get two conversations.

🟡 **Why a wide-column database (Cassandra or DynamoDB) instead of PostgreSQL?**
- The workload is mostly writes and only ever adds rows. It's ordered by time, and we always read it the same way (by conversation).
- These databases spread such data across many machines easily.
- PostgreSQL is perfectly fine up to a decent scale, with transactions and easier queries for things like unread counts.
- Honest answer: "I'd start with PostgreSQL and move when write volume requires it." Saying this shows judgement.

---

## 4. Sending a message: the core flow (draw this step by step)

```
SENDER'S BROWSER              GATEWAY / MESSAGE SERVICE        DATABASE   RECIPIENT
 1 create clientMessageId
   (random unique id)
 2 add to store as "pending";
   show it immediately
   (optimistic update)
 3 save into IndexedDB outbox
 4 send over WebSocket ─────────▶
   {clientMessageId,
    conversationId, body}
                                 5 permission check: is the
                                   sender in this conversation?
                                 6 duplicate check on
                                   (senderId, clientMessageId)
                                   - already seen → resend the
                                     original confirmation
                                 7 assign next sequenceNumber
                                   for this conversation
                                 8 save ────────────────────────▶ write
                                 9 confirm ("sent") with
                                   messageId + sequenceNumber
 10 mark "sent" ✓; swap
    temporary entry for saved
    one; remove from outbox ◀───
                                 11 publish → look up recipient's
                                    gateway → push to recipient ─────────────▶ 12 receive
                                                                               13 save + show
                                 ◀────────────────────────────────────────── 14 "delivered up to N"
                                 15 update lastDeliveredSequenceNumber,
                                    tell sender
 16 mark "delivered" ✓✓ ◀──────
                                 ◀────────────────────────────────────────── 17 "read up to N"
                                                                               (when on screen)
 18 mark "read" ◀───────────────
```

Key points to say out loud:

- **Confirm only after saving.** "Sent" means "saved permanently".
  - If the server crashes before confirming, the browser retries.
  - Duplicate checking makes that retry safe.
- **`clientMessageId` is the idempotency key.**
  - It's created once and reused on every retry, so a retry can never create a second message.
  - Payment APIs use the same idea so a retried payment isn't charged twice. Link it to Checkout's world.
- **The server assigns `sequenceNumber`, not the browser.**
  - Users' clocks can be wrong or out of sync with each other.
  - 🟡 How to make the number safely unique: increment a counter in the database with compare-and-set, use Redis's atomic increment, or let one server own each conversation.
  - For one-to-one chats, two people rarely send at the exact same moment, so it's cheap.
- **"Read" is only sent when the message is really on screen** (IntersectionObserver plus the tab being visible). Just receiving it isn't enough.

---

## 5. Choosing the real-time technology

| | WebSocket | Server-Sent Events | Long polling | Short polling |
|---|---|---|---|---|
| Who can send | Both sides, any time | Server only (browser uses normal HTTP requests to send) | Server answers when it has something | Browser asks repeatedly |
| Speed | Fastest | Fast | Medium | Only as fast as the polling interval |
| Overhead per message | Tiny, once connected | Small | Full HTTP request each time | Wasteful: most answers are "nothing new" |
| Reconnect | **You must write it yourself** | Built in, and can resume from the last event | Natural (each request is new) | Natural |
| Infrastructure | Load balancer must support it; servers keep connection state | Plain HTTP, works through most proxies | Plain HTTP | Plain HTTP |

**Choice: WebSocket.**
- Chat is two-way and busy: messages, confirmations, delivered and read signals, "typing…". One fast, open, two-way connection fits best.
- **Cost:** servers have to hold connection state, we have to write our own reconnect and heartbeat logic, and some corporate networks block WebSockets.
- **Fallback:** long polling when WebSockets are blocked (that's what the Socket.IO library does). Server-Sent Events for receiving plus normal HTTP requests for sending is also a valid, simpler design.
- **When I'd switch:** if the interviewer says users mostly receive and rarely send (like a notification feed), Server-Sent Events is the better choice.

---

## 6. Connection lifecycle and retrying (in the browser)

```
CONNECTING → OPEN → (heartbeat replies keep coming) …
          → CLOSED or DEAD → WAIT (backoff) → CONNECTING again

When OPEN:
  1. authenticate
  2. sync: fetch everything since my last sequence number
  3. resend the outbox, in order
```

- **Heartbeat.** Send a small "ping" message every ~25 seconds and expect a "pong" reply within ~10 seconds.
  - Why: a connection can look open while being dead (laptop sleeps, phone switches from Wi-Fi to mobile data), and nothing reports an error.
  - Browsers don't give JavaScript access to the WebSocket's built-in ping, so we send our own.
  - No reply → close the connection and reconnect.
- **Exponential backoff with jitter.**
  - Formula: `wait = min(maximum, base × 2^attempt) × random number between 0.5 and 1`
  - Example values: base 1 second, maximum 30 seconds.
  - Jitter stops a "thundering herd": if a gateway dies, its 50,000 users would otherwise all reconnect at exactly the same moment.
- **When to try reconnecting:**
  - on the browser's `online` event
  - when the user comes back to the tab (`visibilitychange`)
  - reset the backoff once a connection has been stable for a while
- **Resending the outbox.** Resend every pending message in order, with the **same** `clientMessageId`. After N attempts, or after a time limit, mark it "failed" and show a "Tap to retry" button.
- **Expired login token.** Get a fresh token before reconnecting. If the server closes the connection with an "authentication expired" close code (e.g. 4001), refresh the token and reconnect straight away. Don't just back off and retry blindly.

---

## 7. Sync, ordering and recovering missing messages

- The browser stores the **last sequence number it has seen** for each conversation (or one overall position per user) in IndexedDB.
- **After reconnecting:** call `GET /sync?since=<position>`, which returns all messages and status changes missed while offline, then continue live over the WebSocket.
- **Spotting gaps:** a live message arrives with sequence number 105, but the browser's last seen is 102. It knows 103 and 104 are missing, fetches them, and then shows everything in order (or shows a placeholder while loading).
- **Remove duplicates in the browser too.** Messages are stored by `messageId`, so a message received both from sync and from the WebSocket is shown only once.
- **Display order:**
  - Sort by `sequenceNumber`.
  - The user's own pending messages (no sequence number yet) sit at the bottom, in the order they were written, until confirmed.
- **Race condition to mention:** open the WebSocket and **hold incoming messages in a buffer first**, *then* call sync, then merge both. Otherwise a message arriving between "sync finished" and "WebSocket opened" would be missed.

---

## 8. Pagination: cursor, not page numbers

- Request: `GET /conversations/:id/messages?before=<sequenceNumber>&limit=50`
- Response: `{ messages, nextCursor }`
- **Why not page numbers ("skip 100, take 50")?**
  - New messages keep arriving, which shifts everything. Page 2 then contains messages you already saw, or skips some.
  - Skipping is also slow in many databases, because the database still has to step over all the skipped rows.
- **The cursor is the sequence number** (or a token that encodes it, so the client can treat it as an opaque value). It never shifts, and it maps directly to a fast lookup on the conversation's ordered messages.
- **Why the sequence number and not the timestamp?** Two messages can share the same millisecond, and server clocks drift. If you must use time, combine it with the message id so it stays unique: `(createdAt, messageId)`.
- **Two directions:**
  - New messages arrive live over the WebSocket.
  - Older history is fetched with the cursor as the user scrolls up.
- **Conversation list:** cursor on `lastMessageAt` plus `conversationId`.

---

## 9. Browser data management (frontend depth: lean in here)

**Three layers**
1. **Zustand store (in memory).**
   - Messages are stored by id, with a separate ordered list of ids per conversation: `messagesByConversation: { [conversationId]: { ids: [...], byId: { [messageId]: message } } }`.
   - It also holds the outbox and the connection status.
   - Components use selectors, so they re-render only when their own slice changes.
2. **IndexedDB (saved in the browser).** Recent messages per conversation, the outbox, and the last seen sequence numbers. Accessed through a small wrapper library such as Dexie or `idb`.
3. **The server is the source of truth** for order and status. Local data is a cache plus messages waiting to be sent.

**IndexedDB vs localStorage**

| | localStorage | IndexedDB |
|---|---|---|
| Blocking? | **Yes: synchronous, freezes the page while working** | No: asynchronous |
| Size | About 5 MB | Hundreds of MB or more (browser-managed quota) |
| What it stores | Text only (objects must be turned into JSON text) | Real objects, with indexes and transactions |
| Usable from background scripts | No | Yes (including Service Workers) |
| Use it for | Tiny preferences: theme, last open conversation | Messages, outbox, sync positions |

**Local-first vs server-first rendering**
- **Local-first:** on opening the app, show messages from IndexedDB instantly, then sync with the server in the background and merge.
  - Benefits: instant, and readable offline (you can also write messages, which queue in the outbox).
  - Costs: data may be briefly out of date, merging is more complex, storage is limited, and data stays on the device. Clear it on logout, especially on shared computers.
- **Server-first:** fetch from the server, then show. Simpler and always fresh, but there's a loading spinner, and an empty screen when offline.
- **Choice: local-first for chat.** Users expect messaging to open instantly and work offline. The server still decides the final order.

**Optimistic update.** Show the message immediately as "pending" (clock icon), then:
- one tick ✓ when the server confirms
- two ticks ✓✓ when delivered
- a red marker with a "Retry" button if it fails

Never drop a message silently.

**Multiple tabs.** Two tabs would mean two WebSocket connections, the outbox sent twice, and wasted server connections. Options:
- one **leader tab** (chosen with Web Locks, with BroadcastChannel for the tabs to talk to each other) owns the single connection and passes events to the other tabs
- a Shared Worker that all tabs share

At minimum, sending the outbox must take a lock so only one tab does it.

**Rendering 10,000+ messages**
- **Virtualisation** (TanStack Virtual or react-window). Only the ~30 visible messages exist as page elements, however long the conversation is.
  - Messages have different heights, so they must be measured.
  - The list starts at the bottom, and loading older messages above must not make the view jump (scroll anchoring).
- Keep only a **window** in memory (e.g. the last 500 messages of each open conversation). The rest live only in IndexedDB.
- Memoise rows. A status change on one message should re-render that one row only, by selecting by id.

**Memory, bandwidth and battery**
- Small JSON messages (or a compact binary format like Protocol Buffers if needed).
- WebSocket compression (`permessage-deflate`).
- Batch status updates: send one "read up to 120" instead of 20 separate "read" signals.
- Send heartbeats less often when the tab is hidden. Never poll.

**User experience and accessibility (mention briefly)**
- A "Reconnecting…" banner, pending and failed indicators, and unread counters.
- A "New messages ↓" button instead of jumping the scroll position while the user is reading older messages.
- `aria-live="polite"` so screen readers announce new messages.
- Text labels on status icons ("Delivered", "Failed, tap to retry").
- Full keyboard navigation.

---

## 10. 🟡 Scaling

- **Gateway servers:**
  - Add more as needed. The load balancer sends new connections to the least busy server.
  - No "sticky sessions" needed, because the registry knows where everyone is.
  - Raise the operating system's open-connection limit. Each server holds roughly 50,000–100,000 connections.
- **Deploying new gateway versions:** take servers out a few at a time. Each sends a "please reconnect" close code, and clients reconnect with random delay so they spread across the other servers.
- **Message service:** holds no state, so add or remove servers automatically based on load.
- **Database:**
  - Split by `conversationId` across many machines.
  - Optionally move very old messages to cheaper storage.
- **Publish/subscribe:** Redis publish/subscribe with one channel per gateway. It's fastest, and fire-and-forget is safe because the database plus sync is the safety net. **Switch to Kafka** if we need stored, replayable delivery, or several background consumers such as notifications, analytics or moderation.
- **Multiple regions:**
  - Each user has a home region, for speed and for data-protection rules.
  - Conversations between users in different regions are routed between regions.
  - Having several regions all accept writes for the same conversation at once is hard because of ordering. Be honest: "I'd keep one region responsible for writing each conversation."
- **Backpressure:** if a recipient's connection is too slow to keep up, cap how much the gateway queues for them. If the cap is exceeded, close their connection and let them sync, instead of letting the gateway run out of memory.

---

## 11. Security

- **Login:** OAuth 2.0 / OpenID Connect.
  - A short-lived access token (a JSON Web Token, valid about 15 minutes).
  - A refresh token in an HttpOnly cookie, which JavaScript can't read.
- **Authenticating the WebSocket.** Browsers can't add custom headers when opening a WebSocket, so the options are:
  - the login cookie is sent automatically when the connection opens. The server must also **check the Origin header**, to stop other websites hijacking the connection (cross-site WebSocket hijacking).
  - a **short-lived, single-use ticket** fetched over HTTPS and passed when connecting
  - authenticate in the first message, and accept nothing else until it arrives

  Never put long-lived tokens in the URL, because URLs get written to logs.
- **Re-authentication:** a WebSocket can stay open for hours, longer than the token lives. When the token expires, the server closes with an "authentication expired" code, and the browser refreshes the token and reconnects.
- **Permission check:** on every send and every fetch, check that the user belongs to that conversation. This prevents reading other people's messages by changing an id in the request.
- **Encrypted connections only:** Secure WebSocket and HTTPS. Plus the HTTP Strict Transport Security header so browsers never use plain HTTP.
- **At the front door:**
  - a web application firewall
  - protection against denial-of-service attacks
  - rate limiting per user and per connection (messages per second, connection attempts)
  - a maximum message size
- **Message content:** always treat message text as plain text when displaying it. React does this by default; never use `dangerouslySetInnerHTML`. This prevents cross-site scripting. Add a Content Security Policy as extra defence.
- **Data:** encrypt stored data. Clear IndexedDB on logout.
- **End-to-end encryption** is a trade-off: much better privacy, but the server can no longer moderate, search, or easily sync between devices.

---

## 12. Monitoring (say these four first)

| Metric | Why it matters |
|---|---|
| **Message delivery latency** at the 50th, 95th and 99th percentile: from Send to server confirmation, and from Send to arriving on the recipient's device | The core user experience. This is what the uptime and speed targets are based on |
| **WebSocket connection drops and reconnect rate**, time to reconnect, percentage of successful connections | Shows network and gateway health |
| **Queue depth**: messages waiting in gateway send buffers, in the push notification queue, and in browsers' outboxes (plus how far behind consumers are, if we use Kafka) | A growing backlog shows delivery is slowing down before users notice |
| **Undelivered message rate**: saved by the server but not delivered within X minutes while the recipient was online. Also the share of sends ending as "failed" in browsers | Silent message loss is the worst failure, and this detects it |

Also useful:
- open connections per gateway server
- how often duplicate checks fire (high = clients retrying a lot)
- outbox size in browsers
- size of sync responses
- HTTP error rates (400-range = client errors, 500-range = server errors)
- database response times

Ways to collect and act on it:
- **Tracing:** carry `messageId` / `clientMessageId` through the gateway, service, publish/subscribe and database (with OpenTelemetry), so one message can be followed end to end.
- **Real user monitoring in the browser:** report outbox age, reconnect counts and delivery latency from users' browsers. Server metrics can't see problems that happen only on the client.
- **Alerts on targets:** for example, "95th-percentile delivery above 1 second for 5 minutes", "undelivered rate above 0.1%", "queue growing".
- **Logs:** structured, searchable logs. **Never log message content** (privacy).
