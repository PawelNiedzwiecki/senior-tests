# DeepL interview prep — two tracks

> ## ⚠️ Which track do you need?
>
> | If the round is… | Go to |
> | --- | --- |
> | **Live Coding 1 — Fundamentals & Problem Solving** (HackerRank, algorithms, complexity) | **[`algo/`](./algo/README.md)** ← start here |
> | A frontend TypeScript round (types, React, DOM, a11y) — likely **Live Coding 2** | this folder, below |
>
> These are different interviews and the preparation barely overlaps. The
> algorithms round tests abstract problem solving in a browser IDE with no test
> framework; this folder tests applied frontend TypeScript in your own editor.
> Opening the wrong one wastes a day you may not have.

---

# Frontend TypeScript track

A six-day sprint for a **live coding interview in your own IDE**, with one
interviewer checking TypeScript depth.

Everything here is runnable. Drills fail until you implement them; solutions
are written out with the talking points an interviewer is actually listening
for.

---

## Setup (2 minutes)

```bash
npm install
npm run drills:watch      # leave this running while you work
```

| Command | What it does |
| --- | --- |
| `npm run drills` | Run every drill once (runtime + type tests) |
| `npm run drills:watch` | Re-run on save — **this is the one you want** |
| `npm run drills -- 02-async` | Run one track, or pass any filename fragment |
| `npm run drills:types` | Type-level tests only (fast) |
| `npm run drills:solutions` | Run the same tests against `prep/solutions` |
| `npm run drills:types:check` | Plain `tsc` over the drills, no test runner |

`npm run drills:solutions` sets `SOLUTIONS=1`, which repoints the `@impl` alias
from `prep/drills` to `prep/solutions`. The tests are identical either way —
use it to confirm a test is passable when you are convinced it is not.

> On Windows without a POSIX shell: `set SOLUTIONS=1 && npx vitest run`.

### Layout

```
prep/
├── algo/           ← THE ALGORITHMS ROUND (HackerRank). Separate track, own README.
├── drills/         ← you work here. Every file has a spec, hints and a time box
├── solutions/      ← reference implementations + the explanations that score points
├── cheatsheets/    ← read these on the train, not at the keyboard
├── mocks/          ← four timed interview simulations with rubrics
└── support/        ← test helpers (Equal/Expect, deferred, concurrency tracker)
```

---

## How to actually practise

This matters more than which drills you pick.

1. **Set a timer to the drill's time box.** Every drill has one. If you blow
   through it, stop, read the solution, and redo the drill from scratch
   tomorrow. Untimed practice teaches you to be slow.
2. **Talk out loud the entire time, to an empty room.** This is the single
   highest-yield thing in this repo. In a live interview you are assessed on
   your narration at least as much as your code, and narrating while coding is
   a motor skill that degrades under stress. It will feel ridiculous. Do it.
3. **Read the spec, then write the test names you expect** before implementing.
   The drills already have tests; predicting them trains the habit of finding
   edge cases before the interviewer does.
4. **Read the solution's talking points even when your code passed.** The code
   is half the mark. The comment block at the top of each solution is the
   other half — it is written as things to say, not things to know.
5. **Do not read a solution before your time box expires.** A drill you looked
   up teaches you almost nothing.

### Say these things out loud, every time

Interviewers score signals, and these four are the ones that separate senior
from mid. Force them into every drill until they are automatic:

- **Restate the problem and name the hard part** before writing anything.
  *"The tricky bit is that responses can arrive out of order."*
- **Name the trade-off you are taking.** *"I'm caching the promise rather than
  the value — that gives me deduplication for free, but I have to be careful
  not to cache a rejection."*
- **Say what you are not doing, and why.** *"I'd reach for TanStack Query in
  production; I'm hand-rolling it here because that's the question."*
- **Volunteer the limitation before it is found.** *"This doesn't handle
  abbreviations like 'Dr.' — `Intl.Segmenter` is the real answer if this were
  user-facing."*

---

## The six-day plan

Built for **3–4 focused hours a day**. Each day is one warm-up, two to four new
drills, and a mock on four of the six days.

**If you have fewer days than six, do the ★ drills and mocks A and C.** They
cover the highest-probability ground.

### Day 1 — Type system foundations (~3h)

| | |
| --- | --- |
| Read first | `cheatsheets/01-type-system.md` (30 min) |
| Drills | ★ 1.1 translation params · 1.2 message keys · 1.3 DeepReadonly |
| Close with | Re-read your three solutions' talking points |

Goal: stop reaching for `any` under time pressure, and be fluent in template
literal types and recursive conditionals — the most likely deep-end topics.

### Day 2 — Type system depth + mock (~4h)

| | |
| --- | --- |
| Warm-up | Redo 1.1 from a blank file, timed at 15 min |
| Drills | ★ 1.4 typed events · 1.5 state machine · ★ 1.7 inference control |
| Mock | **Mock A — Typed i18n helper** (45 min, strict timing) |
| Close with | Score yourself against the rubric, honestly |

1.6 (variadic tuples) is optional today — pick it up on Day 6 if you have time.

### Day 3 — Async and concurrency (~3.5h)

| | |
| --- | --- |
| Read first | `cheatsheets/02-async.md` |
| Drills | ★ 2.1 concurrency pool · ★ 2.2 debounce · 2.3 retry/backoff |
| Then | 2.4 async cache — the coalescing insight is the point |

Goal: be able to write a rolling concurrency pool without hesitating, and to
explain jitter and retry budgets as judgement rather than trivia.

### Day 4 — Async finish + React + mock (~4h)

| | |
| --- | --- |
| Drills | 2.5 emitter runtime · 2.6 streaming sentences · 2.7 abort composition |
| Read | `cheatsheets/03-react-ts.md` |
| Mock | **Mock B — Streaming translation client** (50 min) |

### Day 5 — React under the microscope (~4h)

| | |
| --- | --- |
| Warm-up | ★ 3.1 useDebouncedValue, timed at 15 min |
| Drills | ★ 3.2 useAsyncResource — **do this one twice** · 3.3 useControllableState · 3.4 useEventCallback |
| Mock | **Mock C — The race condition** (45 min) |

3.2 is the highest-probability question in this entire repo. If a React hook
comes up at all, it is likely to be this one or a cousin of it.

### Day 6 — Components, DOM, a11y, and consolidation (~4h)

| | |
| --- | --- |
| Read | `cheatsheets/04-dom-perf-a11y.md` |
| Drills | 3.5 generic Select · ★ 4.1 listbox keyboard · 4.3 virtual window |
| Mock | **Mock D — Accessible language picker** (50 min) |
| Close with | `cheatsheets/05-talking-points.md` and the questions to ask them |

Leftovers if you have time: 1.6, 3.6 polymorphic `Text`, 4.2 focus trap,
4.4 frame scheduler. 3.6 is the hardest typing drill here — worth it only if
the role leans design-system.

---

## Drill index

★ = do these first if you are short on time.

### Track 1 — Type system (`prep/drills/01-types/`)

| | Drill | Min | What it trains |
| --- | --- | --- | --- |
| ★ | 1.1 translation params | 20 | Template literal types, `infer`, recursion, conditional arity |
| | 1.2 message keys | 25 | Recursive object paths, map-then-index, leaf filtering |
| | 1.3 DeepReadonly | 20 | Homomorphic mapped types, branch ordering, modifiers |
| ★ | 1.4 typed events | 25 | Tuple payloads, key remapping, `interface` vs `type` |
| | 1.5 state machine | 20 | Discriminated unions, exhaustiveness, `assertNever` |
| | 1.6 variadic batch | 25 | Tuple-preserving generics, `Awaited`, the `\| []` trick |
| ★ | 1.7 inference control | 25 | `const` params, `NoInfer`, distribution, `satisfies` |

### Track 2 — Async (`prep/drills/02-async/`)

| | Drill | Min | What it trains |
| --- | --- | --- | --- |
| ★ | 2.1 concurrency pool | 25 | Rolling pool vs chunking, ordering, fail-fast, abort |
| ★ | 2.2 debounce | 25 | Leading/trailing edges, cancel/flush, `this`, typing |
| | 2.3 retry/backoff | 25 | Exponential backoff, jitter, retryable errors, abortable sleep |
| | 2.4 async cache | 30 | Request coalescing, LRU via `Map`, TTL, not caching rejections |
| | 2.5 emitter runtime | 25 | Snapshot-and-recheck dispatch, error isolation |
| | 2.6 stream sentences | 30 | Async generators, buffering, laziness, `finally` on `break` |
| | 2.7 abort composition | 25 | `withTimeout`, signal composition, listener leaks |

### Track 3 — React + TypeScript (`prep/drills/03-react/`)

| | Drill | Min | What it trains |
| --- | --- | --- | --- |
| ★ | 3.1 useDebouncedValue | 20 | Effect cleanup, derived state, StrictMode safety |
| ★ | 3.2 useAsyncResource | 35 | **The race condition.** Two guards, abort, reducer state |
| | 3.3 useControllableState | 25 | Controlled/uncontrolled API design, stable identity |
| | 3.4 useEventCallback | 15 | Stale closures, ref-through-callback, `useEffectEvent` |
| | 3.5 generic Select | 25 | Generic components, `NoInfer`, accessor APIs |
| | 3.6 polymorphic Text | 30 | `as` prop, `ComponentPropsWithoutRef`, the `Omit` |

### Track 4 — DOM, perf, a11y (`prep/drills/04-dom-a11y/`)

| | Drill | Min | What it trains |
| --- | --- | --- | --- |
| ★ | 4.1 listbox keyboard | 35 | ARIA APG key matrix as a pure reducer, type-ahead |
| | 4.2 focus trap | 30 | Tabbable detection, boundary-only interception, focus restore |
| | 4.3 virtual window | 30 | Windowing arithmetic, binary search over offsets |
| | 4.4 frame scheduler | 25 | Layout thrash, read/write batching, rAF |

Every drill file opens with its spec, hints, a time box and stretch questions.
Every solution file opens with the talking points that earn the marks.

---

## The day before

- **Do not learn anything new.** Redo 1.1, 2.1 and 3.2 from blank files, timed.
  Three wins in a row is the point; new material the night before only creates
  fresh doubt.
- Re-read `cheatsheets/05-talking-points.md`.
- Check your setup end to end: editor, TypeScript version, a scratch project
  that compiles, screen share, camera, the actual meeting link.
- Prepare your questions for them (there is a list at the end of cheatsheet 05).
- Sleep. It outperforms one more drill by a wide margin.

## The morning of

- One easy drill to warm up your hands — 3.1 or 1.1. Do not attempt a hard one;
  a failure at 09:00 is not information, it is just noise in your head.
- Have open before the call starts: a blank TS scratch file that compiles, and
  nothing else. No notes to scroll through, no half-read tabs.
- Water within reach. It is a talking interview.

---

## What is likely to come up

Based on how "verify your TypeScript skills" rounds are usually run at product
companies, in rough order of likelihood:

1. **A hook or utility with an async race in it** — drill 3.2, mock C.
2. **A generic function or component where inference must flow** — 1.1, 3.5.
3. **Debounce/throttle with follow-ups** — 2.2, then "now put it in React".
4. **A type-level puzzle from a string or object shape** — 1.1, 1.2.
5. **Bounded concurrency or retry** — 2.1, 2.3.
6. **Discriminated unions and exhaustiveness** — 1.5.
7. **"Make this API type-safe"** on an emitter or similar — 1.4 + 2.5.

Type-level gymnastics for their own sake (mapped-type golf, `type-challenges`
hard tier) are *less* likely in a product-company round than applied typing.
Drills 1.1–1.5 are deliberately applied rather than puzzle-like for that reason.

---

## Note on the rest of this repository

`src/` holds the pre-existing React exercise app, which is separate from this
prep kit and unchanged. Be aware that `npm run build` fails there — the
exercise stubs deliberately import hooks they do not yet use, which trips
`noUnusedLocals`. That is by design in the original exercises, not something
this kit broke. Nothing in `prep/` depends on it: the drills have their own
`tsconfig.json` and their own commands.
