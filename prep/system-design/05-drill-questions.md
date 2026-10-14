# Practice questions

Unfamiliar term? Look it up in [00-glossary.md](00-glossary.md).

Answer out loud **before** opening each answer. Aim for 30–60 seconds that include a **reason** and a **trade-off**.

## Requirements and real-time technology

<details><summary>1. Why WebSockets and not polling?</summary>

Chat is two-way and needs to be fast.
- Short polling (asking "anything new?" every few seconds) wastes requests and adds delay.
- Long polling (the server holds each request open until something arrives) carries a full HTTP request for every message.

A WebSocket gives one open connection with very small messages in both directions.

The cost: servers have to hold connections, and I have to write the reconnect logic. I'd keep long polling as a backup for networks that block WebSockets.
</details>

<details><summary>2. Why not Server-Sent Events?</summary>

Server-Sent Events only lets the server send. The browser would need separate HTTP requests to send messages, confirmations and read receipts, which doubles the number of requests.

Its strengths: it reconnects automatically, can resume from the last event it received, and works over plain HTTP infrastructure.

For an app where users mostly receive (notifications, live feeds) I'd pick it. For chat, WebSocket.
</details>

<details><summary>3. What questions would you ask first?</summary>

- **Scope:** one-to-one only? Text only? Web only? Read receipts, online status?
- **Scale:** daily active users, messages per day, how many online at once.
- **Geography:** which regions, and rules on where data must be stored.
- **Targets:** speed and uptime.
- **Durability:** can a message ever be lost?
- **Multiple devices** for one user.
- **Security needs:** end-to-end encryption?
- **Existing monitoring tools.**
</details>

<details><summary>4. Give me rough numbers.</summary>

- **Messages:** 10 million daily active users × 50 messages = 500 million a day. That's about 6,000 per second on average and about 20,000 at peak.
- **Storage:** about 500 bytes per message, so about 250 gigabytes a day.
- **Connections:** if 20% are online at once, that's 2 million open connections, so about 20–40 connection servers.

The hard part is holding the connections and routing messages, not the raw message count.
</details>

## Delivery and ordering

<details><summary>5. How do you know a message was delivered?</summary>

Three confirmations:
1. **Sent:** the server confirms after saving it.
2. **Delivered:** the recipient's browser confirms after receiving and storing it.
3. **Read:** a read receipt when it's actually visible on screen and the tab is in focus.

These are stored as positions per user: "delivered up to sequence number N" and "read up to N". The sender is told over their WebSocket.
</details>

<details><summary>6. The browser retries and the server receives the message twice. What happens?</summary>

The browser creates a `clientMessageId` once and reuses it on every retry. The server checks for an existing message with the same sender and `clientMessageId`, using a unique index or a short-lived duplicate-check table, and sends back the original confirmation instead of saving it again.

It's the same principle as idempotency keys for payments, which stop a card being charged twice.
</details>

<details><summary>7. Can you guarantee exactly-once delivery?</summary>

Not end to end over an unreliable network. If a confirmation is lost, the sender can't tell whether the message or only the reply was lost.

So I retry until confirmed and make the server ignore duplicates. To the user, that looks exactly-once.
</details>

<details><summary>8. How do you order messages? Why not timestamps?</summary>

The server gives each message in a conversation the next sequence number: 1, 2, 3…

Why not timestamps:
- Users' clocks can be wrong.
- Server clocks drift slightly apart.
- Two messages can share the same millisecond.

Sequence numbers also make gaps visible: if 105 arrives after 102, fetch 103 and 104.
</details>

<details><summary>9. How do you generate the sequence number safely?</summary>

Any of these:
- increment a counter on the conversation in the database with compare-and-set ("set it to 6 only if it's still 5")
- Redis's atomic increment command
- make one server responsible for each conversation

One-to-one conversations rarely have two messages at the exact same instant, so contention is low and this is cheap.
</details>

<details><summary>10. Two users send at exactly the same moment. Which comes first?</summary>

Whichever the server numbers first gets the lower sequence number. Both browsers sort by sequence number, so both users see the same order.

The sender's own pending message might sit at the bottom for a moment and then move into place once confirmed. That's acceptable; WhatsApp and Slack behave the same way.
</details>

## Sync, pagination, offline

<details><summary>11. A user was offline for 3 hours. What happens when they come back?</summary>

1. The browser's `online` event fires.
2. Reconnect, with backoff and random delay.
3. Authenticate.
4. Open the WebSocket and hold incoming messages in a buffer.
5. Fetch `GET /sync?since=<last position>`.
6. Merge the two, removing duplicates by id.
7. Send the outbox in order, with the same `clientMessageId`s.
8. Update the screen.

Unread counts come from the "read up to N" positions.
</details>

<details><summary>12. Why cursor pagination instead of page numbers?</summary>

Messages keep arriving, so page numbers shift and you get duplicates or gaps.

A cursor ("50 messages before sequence number X") never shifts, and is a fast ordered lookup in the database.

Page numbers are fine for static tables, not live feeds.
</details>

<details><summary>13. How do you avoid missing messages between the sync and opening the WebSocket?</summary>

Open the WebSocket first and hold incoming messages in a buffer. Then sync. Then merge both, removing duplicates by id or sequence number.

Alternatively, the sync response returns a position, and the WebSocket subscribes "from" that position.
</details>

<details><summary>14. Where do you store messages in the browser? Why not localStorage?</summary>

IndexedDB:
- It's asynchronous, so it doesn't freeze the page.
- It has a large storage limit.
- It stores real objects with indexes.
- It can be used from background scripts.

localStorage is synchronous (it blocks the page), holds about 5 MB, and stores text only. Fine for a theme preference, not for a message cache.
</details>

<details><summary>15. Local-first or server-first rendering?</summary>

**Local-first:** show messages from IndexedDB instantly, sync in the background, and the server still decides the order. The app opens instantly and is readable offline.

The cost:
- data is briefly out of date
- merging logic
- data stored on the device, which must be cleared on logout

Server-first is simpler, but shows nothing when offline.
</details>

## Frontend

<details><summary>16. How do you show 10,000 messages without crashing the tab?</summary>

**Virtualisation** (TanStack Virtual or react-window): only the visible messages, plus a few extra, exist as page elements.

Things to handle:
- **Varying heights:** measure each row.
- **The list starts at the bottom:** keep the view steady when older messages load above.
- **Memory:** keep only about 500 messages in memory and leave the rest in IndexedDB.
- **Re-renders:** memoise rows and select by id, so a status change re-renders one row only.
</details>

<details><summary>17. How does the optimistic update work, and what if sending fails?</summary>

1. Show the message immediately with a temporary id and "pending" status, and save it in the outbox.
2. When the server confirms, replace it with the server's id and sequence number and mark it "sent".
3. On a temporary error, keep retrying with backoff.
4. On a permanent error, or after a time limit, mark it "failed" with a Retry button.

Never drop it silently.
</details>

<details><summary>18. The user has the app open in 3 tabs.</summary>

One **leader tab**, picked with Web Locks, owns the single connection and sends the outbox. It passes events to the other tabs with BroadcastChannel.

Alternative: a Shared Worker used by all tabs.

At minimum: a lock around sending the outbox, so nothing is sent twice.
</details>

<details><summary>19. How do you manage state? Why Zustand?</summary>

Store messages by id with an ordered list of ids per conversation, plus the outbox and connection status.

Why Zustand:
- Components subscribe to small slices through selectors, so they don't all re-render on every change.
- It can be used outside React too, so the connection manager can write to it directly.

Redux Toolkit would work just as well. The pattern matters more than the library.
</details>

<details><summary>20. Accessibility in a chat app?</summary>

- `aria-live="polite"` so screen readers announce new messages without interrupting.
- Text labels on status icons ("Delivered", "Failed, tap to retry").
- Keyboard navigation through the list and its actions.
- Sensible focus after sending or retrying.
- Respect the user's reduced-motion setting.
- Enough colour contrast on status indicators.
</details>

## Backend and scale

<details><summary>21. The sender and recipient are connected to different gateway servers. How does the message get there?</summary>

1. The connection registry (in Redis) records "user B is connected to gateway 7". The entry expires unless the heartbeat refreshes it.
2. The message service saves the message.
3. It publishes it on gateway 7's Redis publish/subscribe channel.
4. Gateway 7 pushes it down user B's open connection.

Publish/subscribe is fire-and-forget, which is fine because the database plus sync is the safety net. I'd use Kafka if we needed replay.

If user B isn't connected, send a push notification instead.
</details>

<details><summary>22. What if Redis (the registry) goes down?</summary>

Real-time delivery gets worse, but nothing is lost, because messages are in the database.

Fallbacks:
- Send every message to every gateway. Expensive, but it works at moderate scale.
- Browsers notice missing messages through gap detection or periodic sync.

Run Redis with a replica and automatic failover. Gateways re-register users when they reconnect.
</details>

<details><summary>23. How do you handle 10 times more connections?</summary>

- Add more gateway servers. They hold nothing except the connections.
- The load balancer sends new connections to the least busy server.
- Raise the operating system's open-connection limit, and keep gateways thin.
- The registry and publish/subscribe scale by splitting them across machines.
- The database is already split by conversation.
</details>

<details><summary>24. How do you deploy gateways without disconnecting everyone?</summary>

A rolling deploy, a few servers at a time.

Each server:
1. stops taking new connections
2. sends a "please reconnect" close code
3. lets clients reconnect, with random delay, to other servers

Spread this over minutes so everyone doesn't reconnect at once.
</details>

<details><summary>25. Users all over the world. What changes?</summary>

- Gateway servers in several regions, close to users, for speed.
- Each user has a home region where their data is stored, for data-protection laws.
- A conversation between users in different regions needs **one** region responsible for writing it, so sequence numbers stay in order. That region copies data to the other in the background.

The trade-off is extra delay between regions versus consistency.
</details>

<details><summary>26. PostgreSQL or a NoSQL database?</summary>

The access pattern is "messages of a conversation, ordered by sequence number", and the workload is mostly adding new rows.

- **Cassandra or DynamoDB:** split by conversation, ordered by sequence number. They spread writes over many machines.
- **PostgreSQL:** transactions and easy queries, and enough until thousands of writes per second.

I'd start with PostgreSQL, split it when needed, and move when required.
</details>

## Monitoring and security

<details><summary>27. How do you know the system is healthy?</summary>

The four headline metrics:
- delivery latency at the 95th and 99th percentile (Send to confirmation, and Send to delivered)
- WebSocket drop and reconnect rates, and connection success rate
- queue depth or backlog
- undelivered message rate

Plus:
- open connections per server
- how often duplicate checks fire
- real user monitoring from browsers (outbox age, failed sends)

Use tracing by `messageId`, and alerts tied to targets.
</details>

<details><summary>28. How do you detect messages being silently lost?</summary>

- **Undelivered rate:** messages saved but not confirmed as delivered within X minutes while the recipient had an open connection.
- **In the browser:** report gap detections (jumps in sequence number) as a metric.
- **A background check:** compare each recipient's "delivered up to" position with the conversation's latest sequence number.
</details>

<details><summary>29. How do you authenticate a WebSocket connection?</summary>

Browsers can't add an authorisation header when opening a WebSocket. Options:
- **The login cookie**, which is sent automatically, plus an Origin check so other websites can't hijack the connection.
- **A short-lived, single-use ticket** fetched over HTTPS and passed when connecting.
- **Authenticate in the first message**, and accept nothing until it arrives.

Never put long-lived tokens in URLs, because URLs end up in logs.

When the token expires, the server closes with a special code and the browser refreshes the token and reconnects.
</details>

<details><summary>30. What security measures overall?</summary>

- **Login:** OAuth / OpenID Connect, with short-lived access tokens and a refresh token in an HttpOnly cookie.
- **Encryption in transit:** Secure WebSocket and HTTPS everywhere, plus the HTTP Strict Transport Security header.
- **Permissions:** check on every action that the user is in this conversation.
- **Abuse limits:** rate limiting per user and per connection, including connection attempts, and a maximum message size.
- **At the edge:** a web application firewall and denial-of-service protection.
- **Message display:** render messages as plain text (prevents cross-site scripting), plus a Content Security Policy.
- **Data:** encrypt stored data and clear browser data on logout.
- **End-to-end encryption:** optional, and a trade-off.
</details>

## Pushback practice (no right answer: practise the tone)

- **"I think long polling would be simpler. Convince me."**
  Agree it's simpler. Put a number on the cost (an extra HTTP request per message). Say when you'd accept it.
- **"Your registry is a single point of failure."**
  Acknowledge it. Explain how the system degrades gracefully (the database plus sync still delivers everything), and that Redis runs with a replica.
- **"This is too complex for a first version."**
  Agree. Describe the simplest version: one service, PostgreSQL and Redis publish/subscribe. Then explain which boundaries make it easy to scale later.
