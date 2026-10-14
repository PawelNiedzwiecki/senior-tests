# Trade-offs table

Unfamiliar term? Look it up in [00-glossary.md](00-glossary.md).

**The senior signal is the last column.** For every decision, be ready to say "I would switch if…".

| Decision | What I chose | Alternative | Why I chose it | Cost I accept | I would switch if… |
|---|---|---|---|---|---|
| Real-time technology | **WebSocket** | Server-Sent Events plus normal HTTP requests for sending; long polling | Two-way, fastest, very small messages for confirmations and read receipts | Servers must hold connection state; we write our own reconnect and heartbeat; some networks block it | Traffic is mostly server-to-user (Server-Sent Events is simpler and reconnects by itself), or users are on networks that block WebSockets (fall back to long polling) |
| Delivery guarantee | **Retry until confirmed, plus duplicate removal using an idempotency key** | Trying to guarantee exactly-once delivery | Exactly-once isn't achievable over an unreliable network. Retrying plus removing duplicates looks exactly-once to the user | Need a duplicate-check table or index, plus duplicate handling in the browser | Never for messages. Sending once with no retry is fine for unimportant things like "typing…" |
| Message ordering | **Server-assigned sequence number per conversation** | Sender's clock time; server clock time | Only increases, never repeats, makes missing messages detectable, same order on every device | Need a safe counter per conversation | Ordering across *all* conversations is needed (rare). Then a single central counter, or accept per-conversation ordering |
| Pagination | **Cursor ("before sequence number X")** | Page number / skip-and-take | Stays correct while new messages arrive, and is a fast lookup | Can't jump straight to "page 7" | Never for a live feed. Page numbers are fine for static admin tables |
| Browser storage | **IndexedDB** | localStorage | Doesn't freeze the page, large storage limit, real objects, usable from background scripts | More complex to use (use a wrapper like Dexie or `idb`) | Only tiny preferences need storing. Then localStorage |
| Rendering strategy | **Local-first (show stored data instantly, sync in background)** | Server-first (wait for server, then show) | Instant opening, readable offline, copes with bad networks | Data briefly out of date, merging logic, storage limits, data left on shared devices | Data must always be exactly current (strict compliance), or the app is very simple |
| Storing delivery and read status | **One "read up to N" position per user per conversation** | A status field on every message | One update per receipt, unread count is simple subtraction | Can't mark one old message as unread | Status per message per person is needed (group chats) |
| 🟡 Message database | **Wide-column database (Cassandra, DynamoDB)** | PostgreSQL | Mostly writes, only ever adds rows, always read the same way, spreads easily over many machines | Weaker querying; data copies may be briefly inconsistent | Small or medium scale: start with PostgreSQL and move later |
| Routing between gateway servers | **Publish/subscribe plus connection registry** | Sticky sessions; sending every message to every gateway | Any gateway can deliver to any user; scales | One extra step; registry can be briefly out of date (entries expire) | Small scale: one server, or broadcast to all gateways, is enough |
| 🟡 Publish/subscribe technology | **Redis publish/subscribe (one channel per gateway)** | Kafka (stored message log) | Fastest and simple. The message is already saved, so if a publish is lost, sync or gap detection recovers it | Nothing is stored, so there's no replay; a publish is lost if the gateway is down at that moment | We need replayable delivery, several background consumers (push, analytics, moderation), or queue-based load control. Then Kafka |
| Recipient offline | **Save it, send a push notification, sync when they come back** | Keep retrying delivery | Simple, no wasted work | Depends on the push notification service working | — |
| Multiple tabs | **One leader tab owns the connection (BroadcastChannel plus Web Locks)** | One connection per tab | One connection, no double sending | Logic to pick the leader | Few users open multiple tabs. Then a connection per tab, with a lock around sending the outbox |
| Long message lists | **Virtualisation plus only recent messages kept in memory** | Render everything; "load more" buttons | Same number of page elements however long the chat, smooth scrolling | Varying heights and scroll-from-bottom are tricky; the browser's own find-in-page can't see hidden messages | Conversations are always short |
| Gateway vs message service | **Separate services** | One combined WebSocket server | Scale connections and message volume independently; gateways deployed rarely | More services to run | Early stage: start as one service, split later |
| Authenticating the WebSocket | **Short-lived single-use ticket, or login cookie plus Origin check** | Long-lived token in the URL | Tokens don't leak into logs; protects against other sites hijacking the connection | Extra HTTP request, or cookie setup | — |
| Encryption | **Encrypted connections plus encrypted storage** | End-to-end encryption | Server can still moderate, search and sync between devices simply | The server can read messages | Privacy is a core product requirement. Then end-to-end encryption, with encryption keys managed per device |

## Two-sentence answers to practise out loud

- **"Why WebSockets?"**
  Chat is two-way and busy: messages, confirmations, read receipts. One fast, open connection beats making a new HTTP request every time.
  The cost is servers holding connections and reconnect logic I have to write. If traffic were mostly one-way, I'd pick Server-Sent Events for its simplicity.
- **"Why not exactly-once delivery?"**
  Over an unreliable network you can't know whether a lost confirmation means the message was lost or only the reply was, so you either risk a duplicate or a loss.
  So I retry until confirmed and make the server ignore duplicates using an id the browser creates. To the user, that looks exactly-once.
- **"Why cursor pagination?"**
  Page numbers shift when new messages arrive, which causes duplicates or gaps. A sequence-number cursor never shifts and is a fast database lookup.
- **"Why local-first?"**
  Chat users expect the app to open instantly and work offline. The server still decides the final order; the local database is a cache plus messages waiting to be sent.
