# Cheatsheet 5 — Narration, signals and the meta-game

The code is roughly half the mark in a live round. This is the other half.
Read it Day 1, re-read it the night before.

---

## 1. The shape of a live coding round

A 45–60 minute round usually runs:

| Phase | Minutes | What is actually assessed |
| --- | --- | --- |
| Framing | 3–5 | Do you clarify, or start typing on assumptions? |
| First working version | 15–25 | Can you get to *something correct* quickly? |
| Follow-ups | 15–25 | Can you extend your own code? Did you leave room? |
| Wrap-up | 5 | Do you know what is still wrong with it? |

The most common failure is not "couldn't solve it". It is **spending 20 minutes
in silence** and arriving at something clever the interviewer could not follow.
A simple correct solution, narrated, beats a clever one delivered mute.

---

## 2. Opening: the first ninety seconds

Do these four things, in order, every time:

1. **Restate the problem in your own words.** Cheap, and it catches
   misunderstandings while they are still free.
2. **Ask one or two real clarifying questions.** Not ritual ones — pick the
   ambiguity that would change your design.
   *"Do results need to stay in input order, or is completion order fine?"*
   *"Should a failure abort the batch or just that item?"*
3. **State your assumptions out loud** so the interviewer can correct them.
   *"I'll assume the input fits in memory, and that we're in a browser so I have
   AbortController."*
4. **Write the signature first, then agree on it.**
   ```ts
   function mapWithConcurrency<T, R>(
     items: readonly T[],
     worker: (item: T, index: number) => Promise<R>,
     options: { concurrency: number; signal?: AbortSignal },
   ): Promise<R[]>;
   ```
   A types-first opening is *especially* effective in a round advertised as
   "verifying TypeScript skills". It shows you design at the interface before
   the implementation, and it gives the interviewer somewhere to steer.

---

## 3. Narration templates

Keep these on hand until they are automatic.

**Naming the hard part** (do this before writing anything):
> "The tricky bit here is that two requests can be in flight and the responses
> can arrive in any order. So I need each run to know whether it's still the
> current one."

**Taking a trade-off deliberately:**
> "I'm caching the promise rather than the resolved value. That gives me
> deduplication for free, but it means I have to be careful not to cache a
> rejection — otherwise one blip poisons the key until reload."

**Deferring something on purpose:**
> "I'll get the happy path working first and come back to cancellation. Shout
> if you'd rather I do it the other way round."

**Volunteering a limitation before it is found:**
> "This splits on '.' followed by whitespace, so 'Dr. Müller' would break. For
> anything user-facing I'd use `Intl.Segmenter` with sentence granularity."

**Knowing when not to hand-roll:**
> "In production I'd reach for TanStack Query — this is its whole job. I'm
> writing it out because that's the exercise, and it's worth knowing what it's
> doing for you."

**Naming a thing you're about to do that looks wrong:**
> "I'm going to need one cast here, because the compiler can't see that `.map`
> preserves arity. The signature stays honest — the unsound step is one line and
> it's covered by the tests."

---

## 4. When you get stuck

Stuck is normal and is not itself a negative signal. Silence is.

1. **Say you are stuck, and say where.** *"I've got the wrapping arithmetic
   wrong for the backwards case — let me work an example."*
2. **Work a concrete example out loud.** Three items, index 0, press Up. Nearly
   every off-by-one falls out of one worked example.
3. **Weaken the problem.** Solve it for fixed heights, then generalise. Solve it
   without cancellation, then add it.
4. **Take the hint.** If the interviewer offers one, take it visibly and
   gratefully. Refusing help reads far worse than needing it.
5. **Write the brute-force version.** A working O(n) solution you can then
   improve is worth much more than an unfinished elegant one.

---

## 5. When you make a mistake

Fix it plainly and move on. Do not over-apologise — it costs time and makes the
error look bigger than it is.

> "That's wrong — I'm mutating the array while iterating it. Let me snapshot
> first."

If you notice a bug *after* moving on, say so. Catching your own bug is a
positive signal; the interviewer catching a bug you knew about is not.

---

## 6. Signals interviewers actually score

| Signal | How to show it |
| --- | --- |
| Problem framing | Restate, clarify, state assumptions before coding |
| Type-first thinking | Write signatures before bodies; use types to force correctness |
| Edge-case instinct | Say "empty input, single item, all identical" *unprompted* |
| Testing habit | Name the test cases you'd write, even if you don't write them |
| Trade-off awareness | Every choice named as a choice, with the cost stated |
| Knowing the platform | Name the built-in (`Intl.Segmenter`, `AbortSignal.any`, `ResizeObserver`) |
| Knowing when to stop | "I'd use the library here" — with an explanation of what it does |
| Receiving feedback | Take hints visibly; change direction without defensiveness |
| Honest scope | Say what's not handled rather than hoping it isn't noticed |

Anti-signals, in rough order of damage: long silences; defending a wrong
approach after a hint; `any` under pressure without acknowledging it; claiming
something works when it obviously doesn't; needing the interviewer to find every
edge case.

---

## 7. Edge cases to name out loud, every time

Reciting this list takes fifteen seconds and it consistently reads as senior:

- empty input / single element
- all elements identical
- the boundary (first, last, wrap-around)
- concurrent callers of the same thing
- the operation being cancelled halfway
- the error path — and whether it should be cached, retried or surfaced
- unmount / teardown while work is in flight

---

## 8. If they ask about the codebase, not the code

Common senior follow-ups and what a good answer contains:

**"How would you test this?"**
Name the levels: pure logic as unit tests (fast, exhaustive), interaction via
Testing Library queried by role, and one end-to-end path. Say what you would
*not* test (implementation details, third-party behaviour).

**"How would you review this PR?"**
Correctness first, then API design, then naming, then style — and say that style
should be a linter's job, not a human's.

**"How do you keep types from rotting?"**
Types generated from the source of truth (OpenAPI, GraphQL codegen, Zod at the
boundary), `strict` on, and no `any` in shared code. Validate at the edge, trust
inside.

**"This is slow. What do you do?"**
Measure first — always say this. Profile, find the actual bottleneck, then fix.
Volunteering a fix before measuring is the wrong answer even when the fix is
right.

---

## 9. Questions to ask them

Have four or five ready; ask two or three. Good questions are specific and
signal that you are evaluating them back.

- "How much of the frontend is shared between the web app, the extension and
  the desktop clients — and how do you keep them consistent?"
- "Where does i18n live in the stack? Given the product, I'd guess the tooling
  around it is more serious than most places."
- "What does the TypeScript configuration look like — how strict, and is there
  legacy that predates it?"
- "How do you handle streaming translation results in the UI — is that
  server-sent events, WebSocket, something else?"
- "What does the review process look like for a frontend change, and what
  usually holds a PR up?"
- "What would you want the person in this role to have shipped in their first
  three months?"

Avoid asking things the careers page answers. Asking about the *shape of the
work* is what reads as senior.

---

## 10. A note on the day

You are being assessed on whether people would want to work through a hard
problem with you for the next few years. Being pleasant, curious about the
problem, and honest about what you don't know is not separate from the technical
assessment — it *is* a large part of it.

Slow down. Say the obvious thing. Ask the clarifying question. That is the job.
