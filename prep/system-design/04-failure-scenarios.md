# Failure scenarios: where the design can break

Unfamiliar term? Look it up in [00-glossary.md](00-glossary.md).

The hiring manager hinted they will ask "where could your design break on a bad network?". For each scenario, answer in three parts:
1. **How do we detect it?**
2. **How do we recover?**
3. **What does the user see?**

| # | Scenario | Detect | Recover | User sees |
|---|---|---|---|---|
| 1 | **Connection drops while sending** (message sent, no confirmation came back) | WebSocket closes, or the heartbeat gets no reply. The message is still in the outbox, unconfirmed | Reconnect with backoff and resend with the **same `clientMessageId`**. The server recognises the duplicate | Clock icon stays a moment, then one tick ✓. No duplicate message |
| 2 | **Server saved the message, but the confirmation got lost** | Same as above: the browser can't tell the difference | The retry hits the duplicate check, and the server sends back the original confirmation (same `messageId` and `sequenceNumber`) | Normal tick ✓ |
| 3 | **Connection looks open but is dead** (laptop slept, phone switched Wi-Fi to mobile data) | Our heartbeat: no reply within ~10 seconds | Close it, reconnect, sync | "Reconnecting…" banner after a short grace period |
| 4 | **Offline for hours** | Browser reports offline (`navigator.onLine` is false); connection attempts fail | The outbox is saved in IndexedDB. When the browser comes back online: reconnect, fetch everything since the last sequence number, then send the outbox in order | Offline banner. History still readable. New messages show as pending. If too old, they turn into "failed" with a Retry button |
| 5 | **Messages arrive out of order, or one is missing** | Arriving sequence number isn't "last seen + 1" (got 105, last seen 102) | Fetch the missing range (103–104), insert sorted by sequence number | Nothing: it just works |
| 6 | **Same message received twice** (from sync and from the WebSocket) | That `messageId` is already in the store | Insert-or-update by id, so the second copy is ignored | Nothing |
| 7 | **A gateway server crashes** | Browsers: connection closes. Servers: health checks fail, and registry entries expire | Browsers reconnect, with random delay, to other servers. Undelivered messages are already in the database and arrive via sync | Brief "Reconnecting…" |
| 8 | **Everyone reconnects at once** (after a crash or a deployment) | Spike in connection attempts | Random delay in the backoff (jitter), servers suggest a retry delay in their close message, restart servers gradually, limit connection attempts per second | Reconnecting takes a little longer |
| 9 | **Delivery backlog** (work piling up faster than it's processed) | Queue depth and lag metrics trigger an alert | Add more processing servers. Messages are already saved, so sync covers any delay | Messages arrive later. The "sent ✓" tick is still honest |
| 10 | **Connection registry out of date** (says the user is on gateway 7, but they've moved) | Gateway 7 has no connection for that user | Drop the delivery attempt; the message is in the database and the user gets it via sync on their new connection. Expired entries clean up the registry | Nothing |
| 11 | **Login token expires during a long-open connection** | Server closes the connection with an "authentication expired" close code (e.g. 4001) | Get a new token using the refresh cookie and reconnect. If that fails, ask the user to log in again, keeping the outbox and drafts | Nothing, or a login prompt with drafts kept |
| 12 | **App open in two tabs** | Tabs coordinate through BroadcastChannel and Web Locks | One leader tab owns the connection and sends the outbox. Other tabs get events through BroadcastChannel | Both tabs stay in sync; nothing is sent twice |
| 13 | **Browser storage full or unavailable** (e.g. Safari private browsing) | Saving throws a `QuotaExceededError` | Delete the oldest cached conversations (**never the outbox**); fall back to memory only | App works, but no offline history |
| 14 | **Recipient never comes online** | Message saved, but no "delivered" signal ever arrives | Push notification. Status stays "sent ✓" | Honest status: one tick, not two |
| 15 | **User's computer clock is wrong** | Can't be detected directly, and doesn't need to be | Order by the server's sequence number and show the server's `createdAt` time. Own pending messages stay at the bottom | Correct order |
| 16 | **Recipient on a very slow connection** | Data for that user piles up on the gateway | Cap how much is held for them. If exceeded, close their connection and let them sync | A reconnect, then everything catches up |
| 17 | **🟡 A whole region goes down** | Health checks and DNS failover | Switch to a copy in another region. Copying between regions is slightly delayed, so the last few seconds of messages could be missing (a recovery-point trade-off) | Reconnect, possibly a few messages missing briefly until they catch up |
| 18 | **Message rejected** (too large, not allowed, sender not in the conversation) | Server replies with an error that says "don't retry" | **Don't retry.** Mark it "failed" with the reason | Red "Not sent: reason" |
| 19 | **Huge conversation** (100,000 messages) | — | Cursor pagination, virtualised list, only recent messages in memory, IndexedDB keeps only the last N | Smooth scrolling; older messages load when scrolling up |

## Principles to say out loud

- **Retry temporary errors; don't retry permanent ones.**
  - Network problems and server errors (500-range status codes): retry with backoff.
  - Request errors like "too large" or "not allowed" (400-range): fail straight away and show the reason.
- **The database plus sync is the safety net.**
  - Real-time delivery is a speed-up. Correctness comes from the saved sequence numbers and syncing on reconnect.
  - So every failure in the real-time path is recoverable.
- **Never lose a user's message silently.** The outbox is saved in IndexedDB, and there's an explicit "failed" state.
- **Honest status.** One tick means the server has it. Two ticks mean their device has it.
