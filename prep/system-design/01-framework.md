# How to run the 60 minutes

Unfamiliar term? Look it up in [00-glossary.md](00-glossary.md).

Keep a clock visible. Announce your plan out loud, for example: "I'll spend about 5 minutes on requirements, then move to the high-level design."

| Time (minutes) | Phase | What ends up on the whiteboard |
|------|-------|--------------------------|
| 0–5 | Read the task, repeat it back in your own words | One-sentence problem statement |
| 5–12 | Requirements and clarifying questions | List of functional requirements, non-functional requirements, and what is out of scope |
| 12–15 | Rough size estimates | 4–5 numbers |
| 15–30 | High-level design | Boxes and arrows, plus the API (the list of endpoints and messages) |
| 30–50 | Deep dives (let the interviewers steer) | Message sending flow, reconnect and sync, pagination, browser data |
| 50–57 | Monitoring, security, scaling, trade-off recap | Metrics list, trade-off bullets |
| 57–60 | Your questions for them | — |

## Minutes 0–5: repeat the task back

> "So we're building a real-time, one-to-one messaging web app. The core is: send and receive messages in real time, show whether each message was delivered, keep the user's devices in sync, and make sure no message is lost when the network is unreliable. Let me check a few assumptions before I design anything."

## Minutes 5–12: clarifying questions

Pick 6–8. Ask them conversationally, not as a rapid-fire list.

**Scope**
- One-to-one conversations only, no group chats? (Assume yes. Mention groups as a possible extension.)
- Text only, or also images and attachments? (Assume text. Files would go to file storage plus a content delivery network later.)
- Web only, or mobile apps too? (Web. Mobile changes push notifications and battery concerns.)
- Delivery states: sent, delivered, read? Are "online" status and "typing…" indicators in scope?
- Message history: how long do we keep it? Forever? Do we need search?
- Can the same user be logged in on several devices or tabs at once?
- Editing and deleting messages? (Assume out of scope.)

**Scale and quality**
- How many daily active users? How many messages does a user send per day?
- Where are the users? (United Kingdom and Europe only, or worldwide? Worldwide means multiple regions, plus rules on where data may be stored.)
- How fast must messages arrive? (e.g. 95% of messages within 500 milliseconds when both users are online.)
- What uptime target? (99.9% is about 43 minutes of downtime a month; 99.99% is about 4 minutes.)
- Can a message ever be lost? (No. Once the server confirms it, it must be saved permanently.)
- Is end-to-end encryption required? (Usually out of scope. Mention it as a trade-off.)
- What monitoring tools already exist? (e.g. Prometheus and Grafana, Datadog, OpenTelemetry.)

**Write this on the whiteboard**

```
FUNCTIONAL REQUIREMENTS (what it does)
  - send and receive one-to-one text messages in real time
  - show delivery status: pending → sent → delivered → read (or failed)
  - load message history page by page
  - offline: keep unsent messages, retry them, and fetch missed
    messages when the connection comes back
  - nice to have: online status, "typing…", unread counts

NON-FUNCTIONAL REQUIREMENTS (how well it does it)
  - fast: 95% of messages arrive within 500 ms (both users online)
  - no message lost once the server has confirmed it
  - messages appear in the same order for both users
  - highly available: 99.95% uptime or better
  - scale: X daily users, Y messages per second, Z open connections
  - secure and monitorable

OUT OF SCOPE
  - group chats, images/files, end-to-end encryption, search, edit/delete
```

## Minutes 12–15: rough size estimates

Say out loud that these are rough.

- **Message rate:** 10 million daily active users × 50 messages a day = 500 million messages a day. That's about **6,000 messages per second on average**, and **about 20,000 per second at peak** (roughly 3× average).
- **Storage:** one message is about 200 bytes of text plus metadata, so about 500 bytes in total. 500 million × 500 bytes = **about 250 gigabytes per day, about 90 terabytes per year**. That means the database must be split across many machines, and old messages may move to cheaper storage.
- **Open connections:** if 20% of daily users are online at the busiest time, that's **2 million open WebSocket connections**. One connection server can hold roughly 50,000–100,000, so we need **about 20–40 connection servers**, plus spare capacity.
- **Reads vs writes:** loading history happens more often than sending. But sending is constant and must be fast.

Then say: "So the hard part isn't the number of messages. It's keeping millions of connections open and reliably routing each message to the right one."

## Minutes 15–30: high-level design

**The grading leans towards the frontend. Backend integration is bonus points.** Draw the browser side in detail and keep the backend to about a 3-minute explanation.

1. **Browser app, in detail:**
   - the user interface, with a virtualised message list
   - the Zustand state store
   - IndexedDB, holding the message cache, the outbox of unconfirmed messages, and the "last seen" positions
   - a connection manager that owns the WebSocket, the heartbeat and reconnect-with-backoff
2. **Backend, as one block (about 3 minutes):**
   - load balancer
   - WebSocket gateway servers that hold the open connections
   - message service that removes duplicates, assigns the sequence number and saves the message
   - message database
   - delivery path: publish/subscribe plus a connection registry that knows which gateway the recipient is connected to
   - push notification service for users who are offline
   - regular HTTP (REST) API for history and sync

   Add one sentence of why: "The gateways hold connections, so they scale with the number of users online. The message service holds no connections, so it scales with message volume. Splitting them lets each grow independently."

   Only go deeper on the backend if they ask.

**API sketch** (the messages and endpoints between browser and server):
```
WebSocket connection: /ws   (user is authenticated when the connection opens)

  Browser → server:
    {type: "send",    clientMessageId, conversationId, body}
    {type: "delivered", conversationId, sequenceNumber}   // "I received up to here"
    {type: "read",    conversationId, sequenceNumber}       // "I've seen up to here"

  Server → browser:
    {type: "sent",    clientMessageId, messageId, sequenceNumber, createdAt}  // confirmation
    {type: "message", conversationId, sequenceNumber, messageId, senderId, body, createdAt}
    {type: "receipt", conversationId, sequenceNumber, status: "delivered" | "read"}

Regular HTTP (REST) endpoints:
  GET  /conversations?cursor=…                                  // conversation list
  GET  /conversations/:id/messages?before=<sequenceNumber>&limit=50   // older history
  GET  /sync?since=<position>                                   // everything missed while offline
  POST /conversations/:id/messages                              // backup way to send if WebSocket is down
                                                                //   (same clientMessageId)
```

## Minutes 30–50: deep dives

Ask: "Where would you like me to go deeper? I'd suggest the sending and delivery flow, and reconnecting and syncing, since those are the core of the problem."

If they let you choose, use this order. It follows the hiring manager's own list.

1. **Real-time technology:** WebSocket vs Server-Sent Events vs polling. You've already justified it, so recap in one line.
2. **Sending and delivery states:** optimistic update, the outbox, duplicate prevention with `clientMessageId`, confirmations.
3. **Ordering and pagination:** server-assigned sequence number; cursor vs page-number pagination while new messages keep arriving.
4. **Errors and reconnecting:**
   - heartbeat
   - exponential backoff with jitter
   - sync "since my last sequence number"
   - spotting missing messages
5. **Browser data management:**
   - Zustand plus IndexedDB, vs localStorage
   - local-first vs server-first rendering
   - multiple tabs
6. **Rendering and performance:**
   - virtualisation for 10,000 messages
   - keeping only recent messages in memory
   - small payloads
   - battery
7. **Monitoring:** the 4 headline metrics.
8. **Security:**
   - login and tokens
   - encrypted connections
   - permission checks
   - rate limiting
   - firewall
9. **Scaling the backend:** only if asked, or if there is time left.

**Depth levels**
- **"Must defend" topics:** lead with these.
- **"Only if asked" topics:** mention in one sentence, and never volunteer detail. These are:
  - which database engine
  - Kafka vs Redis internals
  - running in multiple regions
  - backpressure
  - how exactly sequence numbers are generated

## Minutes 50–57: wrap up

- **Monitoring:** the 4 headline metrics (see the reference design).
- **Security:** 4–5 bullet points.
- **"If I had more time…":** group chats (sending one message to many people), images and files, end-to-end encryption, search.
- **Trade-off recap:** "The main decisions were:
  - WebSockets rather than polling
  - retry-until-confirmed plus duplicate removal, instead of trying for exactly-once
  - server-assigned sequence numbers for ordering
  - cursor pagination
  - IndexedDB with local-first rendering

  The biggest risk is…"

## Useful phrases

- "My assumption is X. Is that right, or should I design for Y?"
- "There are two options here: A and B. I'd pick A because… The cost is… I'd switch to B if…"
- "Good point, I hadn't considered that. That changes… so I'd adjust by…"
- "I haven't run that in production, but my understanding is…"
- "Let me note that down and come back to it if we have time."
- "I'm conscious of time. Should I go deeper here or move on to…?"
