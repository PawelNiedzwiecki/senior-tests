# Glossary: every term used in these notes

Read this first. Every other file uses these terms. Each entry gives a plain-English meaning, an example from the chat app, and why it matters in the interview.

Terms are grouped by topic, not alphabetically, so you can read top to bottom and build understanding.

---

## 1. Interview and planning terms

**Functional requirements**
What the system must *do*. Features a user can see.
Example: "A user can send a text message to another user."

**Non-functional requirements**
How *well* the system must do it. Qualities, not features: speed, reliability, scale, security.
Example: "A message reaches the other person in under half a second."

**Daily Active Users (DAU)**
How many different people use the app on a given day. The starting number for every size estimate.
Example: 10 million daily active users × 50 messages each = 500 million messages per day.

**Back-of-the-envelope estimate**
A quick, rough calculation done in your head or on the whiteboard to understand the size of the problem. Nobody expects exact numbers; they want to see that you reason about scale.

**Peak traffic**
The busiest moment of the day. Usually estimated as 2–3× the average. You design for the peak, not the average.

**Messages per second (throughput)**
How many messages the system handles every second. 500 million messages ÷ 86,400 seconds in a day ≈ 6,000 per second.

**Latency**
How long one thing takes. Here: the time from pressing "Send" to the message appearing on the other person's screen.

**Percentiles: p50, p95, p99**
A way to describe latency that isn't fooled by averages.
- **p50 (median):** half of messages are faster than this.
- **p95:** 95 out of 100 messages are faster than this. The slowest 5 are slower.
- **p99:** 99 out of 100 are faster. Shows the worst experiences.

Example: "p95 delivery latency under 500 milliseconds" means 95% of messages arrive within half a second.
Why: an average can look fine while 1 in 20 users has a terrible experience. Percentiles expose that.

**Service Level Indicator, Objective and Agreement (SLI, SLO, SLA)**
- **Indicator:** the thing you measure, e.g. delivery latency.
- **Objective:** the internal target for it, e.g. "95% of messages delivered in under 500 ms, measured monthly".
- **Agreement:** a contract with customers, with penalties if missed. Usually looser than the objective.

**Uptime / availability (99.9%, 99.99%)**
Percentage of time the system works.
- 99.9% ("three nines") ≈ 43 minutes down per month.
- 99.99% ("four nines") ≈ 4 minutes down per month.

**Scope / out of scope**
What you agree to design now, and what you deliberately leave out (e.g. group chats, images). Stating it early saves time.

**Minimum Viable Product (MVP)**
The simplest version that works, which you can improve later.

**Trade-off**
Every choice gains something and costs something. Saying both sides out loud is the main thing that separates a senior answer from a mid-level one.

**STAR (Situation, Task, Action, Result)**
Structure for answering behavioural questions ("Tell me about a time…"). See `06-behavioral-star.md`.

---

## 2. Networking and real-time communication

**Hypertext Transfer Protocol (HTTP) / HTTPS**
How browsers talk to servers: the browser sends a request, the server sends one response, done. HTTPS is the encrypted version.

**Request / response**
One question, one answer. The server can't speak first; it can only reply.

**Transmission Control Protocol (TCP)**
The underlying network connection that HTTP and WebSockets run on. It guarantees bytes arrive in order, *while the connection is alive*.

**WebSocket**
A connection between browser and server that stays open, so **both sides can send messages at any time**. Starts as an HTTP request that "upgrades" into a WebSocket.
Why for chat: the server can push a new message the moment it arrives, without the browser asking.

**Secure WebSocket (WSS)**
WebSocket over an encrypted connection, the same way HTTPS is encrypted HTTP. Always use it in production.

**Server-Sent Events (SSE)**
A connection that stays open, but **only the server can send** down it. The browser has to use normal HTTP requests to send anything back. Reconnects automatically and can say "give me everything after event number X".
Good for notifications and live feeds. Weaker for chat, where both sides talk constantly.

**Short polling**
The browser asks "anything new?" every few seconds. Simple, but wasteful (most answers are "no") and slow (you wait for the next ask).

**Long polling**
The browser asks "anything new?" and the server *holds the request open* until there is something, then answers. The browser immediately asks again. Feels real-time, but each message carries full HTTP overhead.

**Handshake / upgrade**
The opening exchange when a WebSocket starts: an HTTP request saying "please switch to WebSocket", and the server agreeing.

**Heartbeat (ping / pong)**
A tiny "are you there?" message sent every ~25 seconds. If no reply ("pong") comes back in time, the connection is treated as dead.
Why: a connection can look open while actually being dead (see "half-open connection").

**Half-open connection**
Both sides think the connection is open, but it's actually broken. Example: a laptop goes to sleep, or a phone switches from Wi-Fi to mobile data. Nothing errors. Messages just silently go nowhere. Heartbeats detect this.

**Close code**
A number sent when a WebSocket closes, saying why. Example: a custom code 4001 could mean "your login token expired, refresh it and reconnect".

**Reconnect**
Opening a new connection after the old one dropped. WebSockets don't do this automatically; your code must.

**Exponential backoff**
Wait longer after each failed retry: 1 s, 2 s, 4 s, 8 s… up to a maximum (e.g. 30 s). Stops a broken client from hammering the server.

**Jitter**
Add randomness to the backoff wait (e.g. somewhere between 50% and 100% of it). If 50,000 users disconnect at the same moment, jitter spreads their reconnects out instead of all hitting at once.

**Thundering herd**
Many clients all doing the same thing at the same moment (e.g. reconnecting after a server restart), overwhelming the server. Jitter prevents it.

**Payload**
The actual data inside a message (the content), as opposed to the wrapping around it.

**JavaScript Object Notation (JSON)**
The common text format for data: `{"type": "send", "body": "hi"}`.

**Compression (`permessage-deflate`)**
A WebSocket option that compresses each message to save bandwidth.

**Bandwidth**
How much data is transferred. Less data = cheaper, faster, better on poor mobile connections and battery.

---

## 3. Backend building blocks

**Client**
The user's side: here, the web app running in the browser.

**Server / backend**
The machines and services running on our side.

**Load balancer**
The front door that spreads incoming connections across many servers so no single server is overloaded. Often also handles encryption.

**Layer 4 / Layer 7 load balancer**
- Layer 4 routes raw network connections without looking inside them. Good for long-lived WebSocket connections.
- Layer 7 understands HTTP and can route by URL, header, etc.
You won't be grilled on this. Just know both exist.

**WebSocket gateway (connection server)**
A server whose job is to hold thousands of open WebSocket connections and pass messages in and out. "Stateful" because it holds those connections in memory.

**Stateful vs stateless**
- **Stateful:** the server remembers something between requests (e.g. which users are connected to it). If it dies, that's lost, and users must reconnect.
- **Stateless:** every request carries everything needed. Any server can handle any request. Easy to add more servers.

**Message service**
A stateless service holding the business logic: check permissions, remove duplicates, assign the sequence number, save the message, hand it on for delivery.

**Representational State Transfer (REST) API**
Normal HTTP endpoints like `GET /conversations/123/messages`. Used for loading history, syncing, logging in, and as a fallback for sending.

**Application Programming Interface (API)**
The defined way one piece of software talks to another (endpoints, message formats).

**Database**
Where messages are permanently stored.

**Partition / shard**
Splitting a big database across many machines. Each piece (partition) holds part of the data.

**Partition key**
The value that decides which machine a row lives on. Here: `conversationId`, so all messages of one conversation sit together and load quickly.

**Sort key**
The order rows are kept in within a partition. Here: the message sequence number, so "latest 50 messages" is one fast read.

**Primary key**
The unique identifier of a row.

**Index**
A lookup structure that makes searches by a certain column fast, like the index at the back of a book.

**Wide-column database (Cassandra, DynamoDB)**
A type of database built to spread huge amounts of data across many machines. Great when you always read data the same way ("messages of conversation X, newest first"). Weaker at flexible queries.

**PostgreSQL ("Postgres")**
A traditional relational (SQL) database. Flexible queries, transactions, very reliable. Harder to spread across many machines at huge scale.

**Transaction**
A group of database changes that either all happen or none happen.

**Redis**
A very fast in-memory data store. Used here for:
- the connection registry (who is connected where)
- publish/subscribe messaging between servers
- counters

**Publish / subscribe (pub/sub)**
A messaging pattern: one service *publishes* a message on a named channel; whoever *subscribed* to that channel receives it. Lets the message service say "deliver this to gateway 7" without knowing gateway 7 directly.

**Channel / topic**
A named stream in a pub/sub system, e.g. one channel per gateway server.

**Fire-and-forget**
Send a message without any guarantee it arrived and without storing it. Redis publish/subscribe works this way. Fine here because the message is already saved in the database.

**Kafka**
A durable message log: messages are written to disk and kept, so consumers can re-read ("replay") them and you can measure how far behind consumers are. Slower and more complex to run than Redis publish/subscribe.

**Queue**
A line of work items waiting to be processed, first in, first out.

**Queue depth**
How many items are waiting in a queue. Growing depth = the system is falling behind.

**Consumer / consumer lag**
A consumer is a service that reads from a queue. Lag = how far behind it is. Same warning sign as queue depth.

**Connection registry**
A lookup table: "user 42 is connected to gateway server 7". Needed because the sender and recipient are usually connected to different servers.

**Time to live (TTL)**
An expiry time on stored data. Example: a registry entry expires after 60 seconds unless refreshed by a heartbeat, so dead entries clean themselves up.

**Push notification**
A notification sent through the operating system or browser (Web Push for browsers; Apple Push Notification service and Firebase Cloud Messaging for phones) when the user doesn't have the app open.

**Fan-out**
Sending one message to many recipients. Trivial for one-to-one chat (one recipient). Big topic for group chats.

**Horizontal scaling**
Handling more load by adding more machines. Vertical scaling = buying a bigger machine.

**Autoscaling**
Automatically adding or removing machines based on load.

**Sticky sessions**
The load balancer always sends the same user to the same server. We don't need it because the connection registry tracks where everyone is.

**File descriptor limit**
The operating system limits how many open connections one process may have. Must be raised on servers holding tens of thousands of WebSockets.

**Draining (graceful shutdown)**
Before restarting a server, stop sending it new connections and politely ask existing clients to reconnect elsewhere, spread over time.

**Rolling deploy**
Releasing a new version to servers a few at a time, so the service never fully goes down.

**Backpressure**
When a receiver can't keep up, the sender is slowed down or the receiver is cut off, instead of piling data up until memory runs out.

**Out of memory (OOM)**
A process uses up all its memory and crashes.

**Single point of failure**
One component whose failure brings the whole system down.

**Replication**
Keeping copies of data on multiple machines (or regions) so one failure doesn't lose it.

**Failover**
Automatically switching to a backup when the main component fails.

**Region / multi-region**
A region is a group of data centres in one geographic area (e.g. London, Frankfurt). Multi-region = running in several, for lower latency and survival if one region fails.

**Active-active**
Several regions all accepting writes at the same time. Hard for messaging because of ordering. Admit this rather than pretend it's easy.

**Recovery Point Objective / Recovery Time Objective (RPO / RTO)**
- Recovery point: how much recent data you could lose in a disaster (e.g. the last 5 seconds).
- Recovery time: how long until service is back.

**Data residency / General Data Protection Regulation (GDPR)**
Laws on where personal data may be stored and how it's handled (GDPR is the European Union and United Kingdom privacy law).

**Content Delivery Network (CDN)**
Servers around the world caching static files (images, scripts) close to users. Relevant if images or attachments are added.

**Object storage**
Storage for files like images and videos (e.g. Amazon S3).

---

## 4. Messaging correctness

**Acknowledgement ("ack")**
A reply saying "I got it". The server acknowledges a sent message; the recipient's browser acknowledges a delivered one.

**Delivery states**
- **Pending:** shown locally, not yet confirmed by the server (clock icon).
- **Sent:** the server has saved it permanently (one tick ✓).
- **Delivered:** the recipient's device has received it (two ticks ✓✓).
- **Read:** the recipient has actually seen it on screen.
- **Failed:** couldn't be sent after retries; the user can tap "Retry".

**Read receipt**
The signal that the recipient has seen the message.

**Durable**
Saved in a way that survives crashes (written to the database), not just held in memory.

**Delivery guarantees**
- **At-most-once:** sent once, never retried. It may be lost. Fine for "typing…" indicators.
- **At-least-once:** retried until confirmed. It is never lost but may arrive twice.
- **Exactly-once:** never lost, never duplicated. Not achievable over an unreliable network by itself.
- **Effectively-once:** at-least-once plus removing duplicates on arrival, so it *looks* exactly-once to the user. This is what we build.

**Idempotent / idempotency**
Doing the same operation twice has the same effect as doing it once. A retried "send" must not create a second message.

**Idempotency key (`clientMessageId`)**
A unique id the browser creates for each message *before* sending (a random UUID), and reuses on every retry. The server uses it to recognise duplicates. Payment systems use the same idea to avoid charging a card twice, which is a good link to Checkout's world.

**Universally Unique Identifier (UUID)**
A random 128-bit id like `3f2b…`, practically guaranteed never to clash. Can be created in the browser.

**Deduplication ("dedupe")**
Detecting and dropping duplicates. Done on the server (by `clientMessageId`) and in the browser (by message id).

**Sequence number (`sequenceNumber`)**
A counter the **server** gives each message in a conversation: 1, 2, 3… Defines the official order and lets the browser spot missing messages.

**Monotonic**
Only ever increases, never goes backwards or repeats.

**Atomic**
Happens as one indivisible step. "Atomic increment" means two simultaneous requests can never get the same number.

**Compare-and-set**
A database operation: "set the counter to 6 *only if* it is still 5". A safe way to do atomic updates.

**Gap detection**
The browser last saw message 102, and message 105 arrives, so it knows 103 and 104 are missing and fetches them.

**Clock skew**
Different computers' clocks disagree, sometimes by seconds or minutes. That's why we don't order messages by the sender's clock.

**Sync (synchronisation)**
Bringing the browser up to date with the server after being offline: "give me everything since sequence number X".

**Cursor**
A bookmark for "where I got up to". For history: "give me 50 messages before sequence number 500". For sync: "everything after my last seen position".

**Pagination**
Loading a long list in pages instead of all at once.

**Offset pagination ("page number" pagination)**
"Skip the first 100, give me the next 50." Breaks when new items keep arriving, because everything shifts and you get duplicates or gaps.

**Cursor pagination**
"Give me 50 items before this bookmark." Stable no matter what arrives in the meantime.

**Source of truth**
The one place whose data wins when there's disagreement. Here: the server, for message order and state.

**Race condition**
A bug where the result depends on which of two things happens first. Example: a message arrives in the gap between finishing a sync and opening the live connection, and is missed.

---

## 5. Frontend / browser terms

**Optimistic update (optimistic UI)**
Show the result immediately, assuming success, before the server confirms. The message appears instantly as "pending", then switches to "sent" when confirmed.

**Outbox**
A list of messages the user has sent but the server hasn't confirmed yet. Saved in the browser's database so nothing is lost if the tab closes or the network drops. Emptied as confirmations arrive.

**Zustand**
A small React state-management library: a global store that components read from. Similar role to Redux.

**Store / state**
The data the app currently holds in memory (messages, connection status, and so on).

**Normalised state**
Storing each item once, keyed by id, plus separate ordered lists of ids. Updating one message's status then touches only that message, not a whole array.

**Selector**
A function that picks just the slice of the store a component needs, so the component only re-renders when that slice changes.

**localStorage**
A simple key–value storage in the browser.
- Synchronous: it blocks the page while reading or writing.
- About 5 MB maximum.
- Strings only.

Good for tiny preferences only.

**IndexedDB**
A real database built into the browser.
- Asynchronous: it doesn't freeze the page.
- Much larger storage limit.
- Stores structured objects, with indexes and transactions.

Right choice for cached messages and the outbox. Usually used through a small wrapper library like `idb` or Dexie.

**Synchronous vs asynchronous**
- Synchronous: the code waits and nothing else runs until it finishes, so the page can freeze.
- Asynchronous: starts the work, carries on, and gets the result later.

**Main thread**
The single thread where the browser runs your JavaScript *and* draws the page. Blocking it freezes the user interface.

**Worker (background script)**
Browsers run your page's JavaScript on one thread, the main thread, which also draws the screen. A worker is an extra background script. It can't touch the page elements, and talks to the page by sending messages. There are three kinds:
- **Web Worker:** a helper that belongs to one tab. Does heavy work (sorting 50,000 stored messages, searching history) off the main thread so scrolling stays smooth. Dies when the tab closes. Analogy: a cook in the back kitchen while the waiter keeps serving.
- **Service Worker:** a script that sits between the site and the network and lives separately from any tab, so it can wake up with every tab closed. It can intercept network requests (serve cached files so the app opens offline), receive push notifications (show "New message from Anna" while the site is closed), and on Chrome-based browsers retry requests when the network returns (Background Sync; Safari doesn't support it). Needs HTTPS. Analogy: a doorman who handles deliveries even when nobody is home.
- **Shared Worker:** one script shared by all tabs of the same site. Could hold the single WebSocket connection for every tab. Dies when the last tab closes. Browser support has been patchy (Safari only added it recently), so many teams avoid relying on it. Analogy: one receptionist for the whole office.

| | Lives with | Survives tab close? | Main use |
|---|---|---|---|
| Web Worker | One tab | No | Heavy computation |
| Service Worker | The whole site | Yes | Offline, push notifications, caching |
| Shared Worker | All tabs together | No (dies with the last tab) | Share one connection or state |

In this design: a Service Worker for push notifications. Leader election with Web Locks (below) for sharing one connection. A Web Worker only if local search or sorting gets heavy.

**Quota**
The storage limit the browser gives a site.

**Local-first rendering**
Show data from the browser's own database instantly when the app opens, then update from the server in the background. Works offline.

**Server-first rendering**
Wait for the server, then show data. Always fresh, but slower, and empty when offline.

**Reconciliation**
Merging local data with server data when they differ (the server wins on order).

**Virtualisation (windowing)**
Only creating page elements (DOM nodes) for the messages actually visible on screen, plus a few extra. Scrolling swaps which ones are rendered. 10,000 messages then costs the same as 30. Libraries: TanStack Virtual, react-window.

**Document Object Model (DOM)**
The browser's tree of page elements. Too many elements = slow page and high memory.

**Scroll anchoring / reverse scroll**
Chat lists start at the bottom and load older messages *above*. When older messages are inserted, the view must stay where the user was looking instead of jumping.

**Memoisation**
Remembering a computed result (or rendered component) so it isn't redone when nothing changed.

**Memory window**
Keeping only the most recent (say) 500 messages per open conversation in memory, and the rest only in IndexedDB.

**Eviction**
Removing data from memory or cache to free space.

**Multi-tab / leader tab**
The same user with the app open in several tabs. One tab is elected "leader" and owns the single WebSocket connection, and shares events with the other tabs.

**Leader election**
Several tabs need to agree on exactly one "boss". The boss does the work that must happen once (hold the WebSocket, send the outbox). The others just listen. Without it, 3 tabs open 3 connections and each sends the same queued message, causing duplicates and wasted server resources.
- When the leader tab closes or crashes, another tab must take over automatically, with no gap where nobody is in charge.
- Analogy: one person in the office answers the phone. If they leave, someone else picks it up.

**BroadcastChannel**
A browser feature that lets tabs of the same site send messages to each other. Used by the leader to pass incoming messages and status changes to the other tabs.

**Web Locks**
A browser feature that lets only one tab at a time hold a named lock. Everyone else asks for the same lock and waits in line. It is the simplest way to do leader election:
1. Every tab asks for the lock named, say, `"chat-connection"`.
2. The browser gives it to exactly one tab. That tab is the leader. The others wait.
3. The lock is released automatically when the leader tab closes or crashes, so the browser hands it to the next waiting tab. No manual "who's alive?" checking.

```js
navigator.locks.request("chat-connection", async () => {
  // Only the leader runs this block.
  openWebSocket();
  await new Promise(() => {}); // hold the lock until this tab closes
});
```

Why it beats the alternatives: a flag in localStorage ("I'm the leader") goes stale if the tab crashes. Web Locks is cleaned up by the browser itself. It works in all modern browsers.

**`online` / `offline` events**
Browser events fired when the network connection appears or disappears.

**`visibilitychange` event**
Fired when the user switches to or away from the tab. Useful for reconnecting immediately when the user comes back.

**IntersectionObserver**
A browser feature telling you when an element becomes visible on screen. Used to send read receipts only when a message is truly seen.

**Real User Monitoring (RUM)**
Collecting performance and error data from real users' browsers and sending it to your monitoring system.

**Accessibility (`aria-live`)**
`aria-live="polite"` marks an area of the page so screen readers announce new content (new messages) without interrupting the user.

**User experience / user interface (UX / UI)**
How the product feels and works for the user / what it looks like on screen.

---

## 6. Security

**Authentication**
Proving *who* you are (logging in).

**Authorisation**
Checking *what* you're allowed to do (e.g. "is this user part of this conversation?").

**OAuth 2.0 / OpenID Connect**
Standard protocols for logging in and getting access tokens. OpenID Connect is the login part, built on OAuth.

**Access token / JSON Web Token (JWT)**
A signed piece of data proving you're logged in, sent with each request. Kept short-lived (e.g. 15 minutes) so a stolen one stops working soon.

**Refresh token**
A longer-lived token used only to get new access tokens. Stored in an HttpOnly cookie.

**HttpOnly cookie**
A cookie that JavaScript can't read. Protects tokens from being stolen by injected scripts.

**One-time ticket**
A short-lived, single-use code fetched over HTTPS and passed when opening the WebSocket. Browsers can't add custom headers to WebSocket requests, so this is a safe way to authenticate.

**Origin check**
The server checks which website the WebSocket request came from, and rejects other sites.

**Cross-Site WebSocket Hijacking**
An attack where a malicious website opens a WebSocket to our server using the victim's cookies. Prevented by the origin check.

**Insecure Direct Object Reference**
A bug where changing an id in a request (e.g. `conversationId=124`) lets you see someone else's data. Prevented by an authorisation check on every request.

**Cross-Site Scripting (XSS)**
An attacker sends a "message" containing code that runs in the recipient's browser. Prevented by treating message text as plain text (React escapes it by default; never use `dangerouslySetInnerHTML`).

**Content Security Policy (CSP)**
A browser header restricting which scripts may run on the page. Extra defence against cross-site scripting.

**Transport Layer Security (TLS)**
The encryption behind HTTPS and secure WebSockets.

**HTTP Strict Transport Security (HSTS)**
A header telling browsers "only ever use HTTPS for this site".

**Web Application Firewall (WAF)**
Filters malicious traffic (known attack patterns) before it reaches the servers.

**Distributed Denial of Service (DDoS)**
An attack flooding the service with traffic from many machines to take it down.

**Rate limiting**
Capping how many actions a user or connection may do per time period (e.g. 10 messages per second).

**Encryption at rest**
Data is encrypted while stored on disk.

**End-to-end encryption**
Only the sender and recipient can read messages; even our servers can't. Big privacy win, but the server can't moderate, search or easily sync between devices.

---

## 7. Observability (knowing the system is healthy)

**Observability**
Being able to tell what the system is doing and why, from the outside, using metrics, logs and traces.

**Metric**
A number tracked over time (e.g. messages per second, delivery latency).

**Log**
A recorded event with details ("user 42 connection closed, code 1006"). "Structured" logs are JSON, so they're searchable.

**Trace / distributed tracing**
Following one request (one message) through every service it touches, using a shared id, to see where time went or where it failed.

**OpenTelemetry**
The standard open-source toolkit for producing metrics, logs and traces.

**Dashboard / alert**
- Dashboard: graphs of metrics.
- Alert: an automatic notification to the on-call engineer when a metric crosses a threshold.

**On-call**
The engineer responsible for responding to alerts out of hours.

**Delivery latency**
Time from "Send" to server confirmation, and to the recipient's device.

**Undelivered message rate**
Share of messages saved by the server but not delivered within X minutes while the recipient was online. Detects silent message loss.

**Connection drop rate / reconnect rate**
How often WebSockets drop and reconnect. A spike points to network or server problems.

**Error rate (4xx / 5xx)**
HTTP status codes in the 400s mean the request was bad (client's fault). Codes in the 500s mean the server broke.

**Retryable vs non-retryable error**
- Retryable: temporary, worth trying again (network down, server error 5xx).
- Non-retryable: will fail again however many times you try (message too large, not allowed, 4xx). Show the reason instead of retrying.

---

## 8. Identifier names used in the diagrams and code snippets

| Name | Meaning |
|---|---|
| `conversationId` | Id of a one-to-one conversation |
| `messageId` | Permanent id the server gives a saved message |
| `clientMessageId` | Id the browser creates before sending; used to detect duplicate retries |
| `sequenceNumber` | Server-assigned position of the message in its conversation (1, 2, 3…) |
| `senderId` | User who sent the message |
| `lastSequenceNumber` | Highest sequence number in a conversation (server), or the highest one this browser has seen (client) |
| `lastDeliveredSequenceNumber` | Everything up to this number has reached the recipient's device |
| `lastReadSequenceNumber` | Everything up to this number has been read by the recipient |
| `createdAt` | Time the server saved the message |
| `before` (query parameter) | "Give me messages older than this sequence number" (history) |
| `since` (query parameter) | "Give me everything newer than this position" (sync after reconnect) |
