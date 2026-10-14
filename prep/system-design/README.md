# Checkout final stage: system design prep

**Interview:** Friday 16 October 2026, Senior Engineer, Checkout.

**Format:**
- 60-minute system design on a whiteboard. No coding.
- Behavioural questions (answered with the STAR structure) in the same interview loop.

**Expected task:** design a real-time **one-to-one messaging web app**. It needs to cover:
- sending and receiving messages
- keeping devices in sync and showing delivery status
- recovering messages that were lost or stuck in a queue
- retrying sends when the connection drops

Source notes from the hiring manager call: [`../../checkout-last-stage.md`](../../checkout-last-stage.md)

> **New to the terms?** Start with [00-glossary.md](00-glossary.md). Every abbreviation and technical term used in these notes is explained there in plain English.

## What they are grading (from the hiring manager)

1. **Requirements first.** Spend about 5 minutes reading the task. Then check your assumptions out loud and ask questions:
   - How many users?
   - Where in the world are they?
   - How much downtime is acceptable?
   - What monitoring already exists?
2. **Trade-offs and "why".** This is what separates senior from mid-level. For every part of the design, say:
   - why it is there
   - what the alternative was
   - when you would switch to that alternative
3. **No buzzwords.** Only say things you can explain and defend. It's fine to say "I haven't run this in production, but my understanding is…".
4. **Collaboration.** They will challenge you. Accept good points without getting defensive. Treat it like a design meeting with two colleagues.
5. **Frontend depth first.** Explaining how the frontend connects to the backend earns bonus points.

## Files

| # | File | What it is for |
|---|------|----------------|
| 0 | [00-glossary.md](00-glossary.md) | Plain-English explanation of every term. **Read first.** |
| 1 | [01-framework.md](01-framework.md) | How to spend the 60 minutes, and which questions to ask |
| 2 | [02-reference-design.md](02-reference-design.md) | The full model answer: diagram, message flow, data model |
| 3 | [03-tradeoffs.md](03-tradeoffs.md) | Each decision: what was chosen, the alternative, why, and when to switch |
| 4 | [04-failure-scenarios.md](04-failure-scenarios.md) | Where the design can break: how to detect it, recover, and what the user sees |
| 5 | [05-drill-questions.md](05-drill-questions.md) | 30 likely interviewer questions with hidden answers for self-testing |
| 6 | [06-behavioral-star.md](06-behavioral-star.md) | Template and slots for your behavioural stories |

## 4-day schedule (3–4 hours a day)

### Day 1, Tuesday 13 October: foundations
- [ ] Read `00-glossary` (skim, then come back to it whenever needed).
- [ ] Read `01-framework` and `02-reference-design` end to end.
- [ ] Outside material (pick 2, about 90 minutes in total):
  - Hello Interview, "Design WhatsApp" (backend breakdown and delivery guarantees)
  - Alex Xu, *System Design Interview*, Volume 1, chapter 12 "Design a Chat System"
  - GreatFrontEnd, front-end system design "Chat application" (browser side)
- [ ] Be able to explain without notes:
  - **WebSocket:** how the connection starts, the heartbeat, close codes, and the fact that it doesn't reconnect by itself.
  - **Server-Sent Events:** server-to-browser only, reconnects automatically, can resume from the last event.
  - **Long polling:** how it works.
- [ ] **End-of-day check:**
  - Redraw the high-level diagram from memory in under 5 minutes.
  - Explain how a message is sent, out loud, in 3 minutes.

### Day 2, Wednesday 14 October: deep dives (the core of the grading)
- [ ] Delivery states, duplicate prevention with the idempotency key, ordering with server-assigned sequence numbers, spotting missing messages, and syncing after a reconnect.
- [ ] Cursor pagination vs page-number pagination while new messages keep arriving.
- [ ] Browser side: the Zustand store, the IndexedDB outbox, optimistic updates, list virtualisation, multiple tabs.
- [ ] Say every row of `03-tradeoffs` out loud, including the "I would switch if…" column.
- [ ] Draft all behavioural stories in `06-behavioral-star` as bullet points, with **numbers** in the Result.
- [ ] **End-of-day check:** answer questions 1–15 of `05-drill-questions` without looking.

### Day 3, Thursday 15 October: full practice interviews
- [ ] Practice interview #1: 60 minutes, timed, on Excalidraw, talking out loud. Record yourself, or run it with Claude via `/grill-me`.
- [ ] Review it: which must-cover topics did you miss? Fill the gaps using `04-failure-scenarios` and the drill questions.
- [ ] Practice interview #2: 60 minutes, this time with pushback. Practise saying: "Good point. The trade-off there is… I would switch if…".
- [ ] Tell each behavioural story out loud, about 2 minutes each.
- [ ] **End-of-day check:** every must-cover topic below gets covered in a practice run without notes.

### Day 4, Friday 16 October: light morning only
- [ ] One 20-minute redraw of the diagram.
- [ ] Skim the trade-offs table, the metrics list and your story results.
- [ ] Prepare your questions for them (end of `06-behavioral-star`).
- [ ] Stop 1 hour before the interview. Test the whiteboard tool, microphone and camera.

## Must-cover checklist (tick off during practice interviews)

**Lead with the frontend.** Backend integration is bonus points.
🟡 = mention it in one sentence, and only go deeper if they ask.

- [ ] Clarifying questions:
  - scale (daily active users)
  - geography
  - uptime target
  - monitoring
  - scope: one-to-one, text only, web only
- [ ] Functional and non-functional requirements written on the board
- [ ] Rough size estimates
- [ ] WebSocket vs Server-Sent Events vs polling, with justification
- [ ] Backend integration in about 3 minutes:
  - connection gateway
  - message service
  - publish/subscribe
  - database
  - connection registry
  - push notifications
- [ ] Delivery states: pending, sent, delivered, read, and failed
- [ ] Duplicate prevention on retry (idempotency key)
- [ ] Ordering: server-assigned sequence number per conversation
- [ ] Cursor pagination, and why page-number pagination breaks
- [ ] Sync after reconnect ("everything since my last sequence number") and spotting gaps
- [ ] Reconnect: exponential backoff with jitter, heartbeat
- [ ] Optimistic updates and the outbox
- [ ] IndexedDB vs localStorage; local-first vs server-first rendering
- [ ] Virtualisation for 10,000+ messages; memory and bandwidth
- [ ] Security:
  - login with OAuth and short-lived tokens
  - encrypted connections
  - permission check on every conversation
  - rate limiting
  - cross-site scripting protection
  - web application firewall
- [ ] Monitoring:
  - delivery latency
  - WebSocket connection drops
  - queue depth
  - undelivered message rate
- [ ] 🟡 Scaling: adding more servers, splitting the database, multiple regions, database choice
- [ ] Accessibility and user experience mentioned briefly (screen-reader announcements, status indicators)
- [ ] Trade-off recap at the end
