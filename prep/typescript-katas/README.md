# Kata — domain-modelling exercises like the bowling game

These are **not** algorithm puzzles. Nobody is checking whether you know a
trick. You get a small set of real-world rules (bowling, tennis, a checkout)
and turn them into clean, typed, tested TypeScript in 30–60 minutes while
someone watches.

What's being assessed is **how you work**: whether you clarify the rules,
choose a sensible data model, handle edge cases, write readable code and
explain your trade-offs. A correct answer with messy reasoning scores lower
than a nearly-finished answer with clear reasoning.

```bash
yarn drills typescript-katas               # all katas (fail until you implement them)
yarn drills 03-tennis                      # one kata
yarn drills:watch typescript-katas         # re-run on save — the one you want
SOLUTIONS=1 yarn drills typescript-katas   # same tests against the reference solutions
```

Each kata has three files:

| File | What it is |
| --- | --- |
| `exercises/NN-name.ts` | **Your workspace.** The rules, examples, decisions already made, questions to ask, a hint and follow-ups. The stub throws until you implement it. |
| `exercises/NN-name.test.ts` | **The specification.** Read it after you've had a go — or before, if you're practising pure TDD. |
| `solutions/NN-name.ts` | **A reference answer** with the reasoning an interviewer listens for. Read it *after* you finish. |

---

## The katas

Ordered roughly by difficulty. Use the time box. Stop when it runs out and
compare with the solution — finishing in time is part of the skill.

| # | Kata | Time | What it trains | Main trap |
| --- | --- | --- | --- | --- |
| 00 | [Bowling](./exercises/00-bowling.ts) | 30m | Iterating over the right unit (frames, not rolls), lookahead | 10th-frame fill balls counted as frames |
| 01 | [String calculator](./exercises/01-string-calculator.ts) | 30m | Requirements arriving one at a time; parse/compute seam | User input used as a raw RegExp |
| 02 | [Roman numerals](./exercises/02-roman-numerals.ts) | 30m | Table-driven code; validating via round-trip | Hand-written list of illegal patterns |
| 03 | [Tennis](./exercises/03-tennis.ts) | 30m | Stateful class, derived state, discriminated unions | Checking "advantage" before "win" |
| 04 | [Checkout](./exercises/04-checkout.ts) | 40m | Money as integers, pricing strategies, open/closed | Storing prices instead of counts |
| 05 | [Yatzy](./exercises/05-yatzy.ts) | 35m | Histogram first, `Record<Union, Fn>` for exhaustiveness | One giant `if/else` per category |
| 06 | [Mars rover](./exercises/06-mars-rover.ts) | 40m | Lookup tables, wrapping with `mod`, immutable steps | `-1 % 5 === -1` in JS |
| 07 | [Game of Life](./exercises/07-game-of-life.ts) | 40m | Same rule over two storages (dense vs sparse) | Updating the grid in place |
| 08 | [Word wrap](./exercises/08-word-wrap.ts) | 25m | Tokenise-then-layout, property-style tests | Off-by-one on the "+1 space" |
| 09 | [Poker hands](./exercises/09-poker-hands.ts) | 60m | Reducing a domain to one comparable key | Nine bespoke tie-break functions |

**Suggested order:** start with 00 again (from memory, against the clock), then
01 → 03 → 04 → 06 → 05 → 02 → 08 → 07 → 09.

---

## How to approach any kata — the 6-step loop

Practise saying each step **out loud**. In the interview, silence reads as
being stuck, even when you're thinking well.

### 1. Restate and clarify (2–5 min)

Read the brief, then say it back in your own words. Then ask questions. The
interviewer often leaves something ambiguous on purpose. Every kata header has
a **CLARIFYING QUESTIONS** section; these come up again and again:

- **Input shape:** "Is it a flat array or already grouped? Can it be empty?"
- **Validity:** "Can I assume valid input, or should I validate? Throw, or
  return an error value?"
- **Completeness:** "A whole game, or one in progress?"
- **Boundaries:** "Is 1000 included? Do touching edges count?"
- **Scale:** "Ten items or ten million?" — this changes the data structure.

If they say "your call", **state your decision and write it down** (a comment
at the top of the file). That counts in your favour.

### 2. Work two examples by hand (2 min)

Before you write code, compute one normal case and one awkward case on paper
or in a comment. For bowling: a spare, then a strike in the 10th frame. This
is where you notice the rule you misunderstood, and it costs a lot less than
noticing it in a failing test 20 minutes later.

### 3. Choose the data model — and say why (2–3 min)

This decision matters more than any other. Get it right and the code is short;
get it wrong and everything after fights you.

| Kata | Weak model | Strong model |
| --- | --- | --- |
| Bowling | Loop over rolls, track "which frame am I in" | Loop over 10 **frames**, cursor into rolls |
| Tennis | Store the label string / a state machine | Store **two integers**, derive the label |
| Checkout | List of scanned prices | `Map<sku, count>`, price at `total()` time |
| Yatzy | Sorted dice + neighbour checks per category | **Histogram** of faces, computed once |
| Poker | Per-category comparison functions | One **sortable key** per hand |
| Game of Life (infinite) | Huge 2-D array | `Set` of live cells + neighbour **counts** |

A good rule of thumb: **store the minimum state and derive everything else.**
Derived values can't go out of sync.

### 4. Write the type signatures first (1–2 min)

In TypeScript, writing the types first is a design step. Write the types
before any logic:

```ts
type Offer =
  | { kind: 'multiBuy'; quantity: number; price: number }
  | { kind: 'bulkPrice'; minQuantity: number; unitPrice: number };

type RoverResult =
  | { status: 'ok'; rover: Rover }
  | { status: 'blocked'; rover: Rover; obstacle: Point };
```

Discriminated unions make illegal states impossible to represent. A `blocked`
result without an `obstacle` won't compile.

### 5. Build it test-first, simplest case upward (most of the time)

Red → green → refactor, in small steps. The classic bowling order:

1. gutter game (all zeros) → `return 0` passes
2. all ones → now you need a sum
3. one spare → now you need frames
4. one strike → now frames have different lengths
5. perfect game → now the 10th frame matters
6. invalid input

Each test should force **one** new idea. If a test forces three, you skipped
a step. Commit (or at least pause and re-read) on every green.

If the interviewer doesn't want TDD, still work in this order. A partial
solution that handles the simple cases correctly beats a full solution that
handles none of them.

### 6. Refactor, then walk through the edge cases (last 5 min)

With green tests, clean up. Name the magic numbers (`PINS = 10`), extract
helpers, delete duplication. Then list the edge cases out loud, even ones
you didn't handle: "empty input, negative values, the 10th frame, extra rolls
— I validate the first three; the last I'd ask about."

---

## TypeScript techniques these katas keep using

**Exhaustive `switch` with `never`.** When the union grows, the compiler
points you at every place that needs updating.

```ts
switch (offer.kind) {
  case 'multiBuy': ...
  case 'bulkPrice': ...
  default: {
    const unreachable: never = offer; // compile error if a case is missing
    throw new Error(`Unhandled offer ${JSON.stringify(unreachable)}`);
  }
}
```

**`Record<Union, Fn>` instead of a long if/else.** It's exhaustive too, and
it turns logic into data.

```ts
const SCORERS: Record<Category, Scorer> = { ones: ..., pair: ..., ... };
return SCORERS[category](counts);
```

**Lookup tables over branches.** Mars rover's directions are an array, so
turning is `index ± 1 mod 4`. Roman numerals is a 13-row table. Most of the
time, data you can extend is better than an `if` you have to edit.

**`as const` for fixed tables.** It keeps literal types (`'IV'`, not
`string`) and makes them `readonly`.

**`noUncheckedIndexedAccess` is on in this repo.** `rolls[i + 1]` has type
`number | undefined`. Don't scatter `?? 0` around to silence it. In bowling,
`?? 0` would silently score an incomplete game. Write one guarded accessor
that throws the right domain error.

**Types don't validate runtime data.** `Dice` is a tuple of `1..6` at compile
time, but values from an API can be anything. Validate at the boundary (the
public function) and trust the data everywhere inside it. "Parse, don't
validate": turn a raw string into a typed value once, or throw.

**Immutability by default.** Don't mutate inputs. Return new objects (rover
steps, Game of Life grids). If you must mutate, copy first (`[...arr].sort()`)
and say so out loud.

**Money is integers.** `0.1 + 0.2 !== 0.3`. Use pence or cents.

---

## Pure function or class?

Interviewers often ask for one and then switch to the other.

| | Pure function `score(rolls)` | Stateful class `game.roll(); game.score()` |
| --- | --- | --- |
| Testing | Trivial: input → output | Need setup and a sequence of calls |
| Fits when | All the data arrives at once | Events arrive over time (UI, a live game) |
| Danger | — | State that can get out of sync |

**Senior answer:** make the class a thin wrapper around a pure core.

```ts
class BowlingGame {
  private rolls: number[] = [];
  roll(pins: number) { this.rolls.push(pins); }
  score() { return bowlingScore(this.rolls); } // pure function does the work
}
```

---

## Error handling: throw or return?

Pick one and say why.

- **Throw** (used in these katas) when bad input is a **programmer error** or
  can't happen in normal use. Use `RangeError` for out-of-range numbers, and
  make the message say what was wrong (`Invalid roll: 11`, not `error`).
- **Return a `Result`** when failure is a **normal outcome** the caller must
  handle (user-typed input, a parser):

  ```ts
  type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
  ```

- **Validate the whole input before acting** if partial work would leave
  things in an unknown state. Mars rover checks every command before it moves.

---

## What separates senior from mid-level answers

| Mid-level | Senior |
| --- | --- |
| Starts coding straight away | Clarifies, works an example, picks a model, *then* codes |
| Assumes valid input | Asks, decides, validates at the boundary |
| Big `if/else` chains | Tables, unions, `Record`s; exhaustive by construction |
| Stores derived state | Stores minimal state, derives the rest |
| Magic numbers (`10`, `3`) | Named constants (`PINS`, `FRAMES`) |
| Tests the happy path | Tests boundaries, invalid input, invariants |
| Codes in silence | Narrates: decision, reason, trade-off |
| "It works" | "It's O(n); if X changed I'd change Y" |
| Gets stuck on the follow-up | The design already has a seam where the follow-up fits |

---

## The follow-up is the real interview

Once the base kata passes, interviewers **change the requirements** to see
whether your design bends or breaks. Every kata header lists likely
follow-ups. Before you start, ask yourself: *"If they add X, which function
changes?"* If the answer is "all of them", rethink the model.

Common escalations:

- **Score in progress / running totals** (bowling, tennis)
- **Make it a class / make it a pure function** (any)
- **New rule variant** (new offer type, US Yahtzee, Hold'em) → open/closed
- **Scale it up** (infinite grid, a million hands/second) → data structure
- **Render it** (scoreboard, receipt, grid in React) → keep logic separate
  from presentation

---

## Practice routine

1. **First pass:** follow the 6-step loop with the time box. Don't look at
   the tests until you've written at least the simplest version.
2. **Compare:** read the solution's header. What did they model differently?
   Which sentence would you have wanted to say?
3. **Redo cold, 2–3 days later**, against the clock, from an empty file. You're
   aiming for fluency, not memorising the answer.
4. **Do a follow-up** from the header as a fresh 20-minute exercise.
5. **Rehearse the narration:** say steps 1–3 out loud to an empty room. It
   feels silly, and it works.
