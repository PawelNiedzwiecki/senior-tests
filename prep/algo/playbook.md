# The playbook — HackerRank, TypeScript, and how to run the hour

DeepL named four things they are assessing. This document is organised around
them, because they told you the mark scheme:

> **Structure your approach** · **Communicate clearly** · **Focus on
> fundamentals** · **Testing is key**

---

## 1. The protocol — what to do, minute by minute

A 45–60 minute pair-programming round. Run it the same way every time so you
never have to improvise the process, only the problem.

### Minutes 0–2 · Configure

They explicitly invite you to set the IDE up. Do it, briefly, and say what you
are doing — it is free rapport and it settles your hands.

- Pick TypeScript at the language prompt.
- Set the font size so *they* can read it on a shared screen.
- Type a one-line `console.log('ready')` and hit Run once. **Confirm the
  toolchain works before you need it.** Discovering the run button is broken at
  minute 40 is a disaster you can cheaply avoid.

### Minutes 2–6 · Frame, before writing any logic

Do all four of these, out loud, in order:

1. **Restate the problem in your own words.** Cheap insurance against solving
   the wrong problem.
2. **Ask about the constraints that change the design.** Not ritual questions —
   real ones:
   - "How big can the input get?" (decides O(n log n) vs O(n²) vs needing O(n))
   - "Can values be negative? Zero? Duplicated?"
   - "Is the input sorted? Can I sort it, or does order matter?"
   - "What should I return for empty input / no answer?"
   - "Is the input mutable — may I modify it in place?"
3. **State your assumptions** so they can be corrected for free.
4. **Write the signature and agree it.**
   ```ts
   function solve(nums: number[], target: number): number[] | null
   ```

### Minutes 6–9 · Harness first

Type the ten-line harness (`hackerrank/blank-template.ts`), then paste the
prompt's examples in as assertions. You now have a runnable file that fails for
the right reason, and you have demonstrated the "testing is key" criterion
before being asked.

Keep talking while you type it. This is not dead time.

### Minutes 9–14 · Brute force, out loud

**Say the brute force before you write the good solution.** Every time.

> "The obvious approach is to check every pair — that's O(n²) time, O(1) space.
> Let me get that clear first, then see where the waste is."

Two reasons this is worth the ninety seconds: it proves you understand the
problem, and it gives you something correct to fall back on. A working O(n²)
solution beats a broken O(n) one, always.

Then find the waste:

> "The repeated work is re-scanning for the complement. If I remember what I've
> already seen, each lookup is O(1) — that gets me to O(n) time and O(n) space.
> Shall I go straight to that?"

### Minutes 14–35 · Implement

- Narrate as you go: what this variable is for, why this loop bound.
- **Run the tests after each meaningful chunk.** Do not write forty lines and
  then run. Small increments make bugs obvious and show a working process.
- When you hit a wall, say so and say where. Silence is the failure mode.

### Minutes 35–45 · Test properly, then optimise

Add the edge cases you named in framing — this is the second half of "testing
is key", and most candidates stop at the happy path:

- empty input, single element
- all elements identical
- the boundary: first, last, wrap-around
- negatives, zero, duplicates
- no valid answer

Then state the complexity of what you actually wrote, and what you would do
with more time.

### The last two minutes

Volunteer what is missing before they find it:

> "This handles the cases we discussed. What I haven't done: the input is
> mutated in place, which I'd change if the caller owns it, and I'd want a
> property test against a brute-force implementation for confidence."

---

## 2. Communicating clearly — phrases that carry weight

Keep these until they are automatic.

**Naming the hard part** (before writing anything):
> "The tricky bit is that the array isn't sorted, so I can't binary search
> directly. The question is whether sorting first is worth O(n log n)."

**Trading off, deliberately:**
> "I'm trading space for time here — O(n) memory to get from O(n²) to O(n).
> If memory were the constraint I'd use the two-pointer version instead, which
> is O(1) space but needs the input sorted."

**Justifying a non-obvious step** (this is what separates senior):
> "Moving the taller pointer can never help, because the area is capped by the
> shorter line and the width only shrinks. So discarding the shorter one
> discards nothing better."

**Amortised complexity** (for monotonic stacks and sliding windows):
> "The inner while makes it look quadratic, but each element is pushed once and
> popped at most once, so it's O(n) in total."

**Taking a hint well:**
> "That's a better idea — let me redo it that way."
> Never argue with a hint. Take it visibly and move.

**Being stuck, productively:**
> "I've got the boundary wrong for the two-element case. Let me trace [3, 1] by
> hand." — then actually trace it, out loud.

---

## 3. TypeScript in HackerRank — the practical notes

**Types help you think; do not let them slow you down.** Annotate the signature
properly, then use ordinary inference inside. If the type checker starts
fighting you mid-problem, an `as` cast with "I'd tighten this after" said aloud
is much better than losing four minutes.

**Things that bite in an unfamiliar editor:**

| | |
| --- | --- |
| `[10, 9, 1].sort()` → `[1, 10, 9]` | Default sort is lexicographic. Always `(a, b) => a - b`. |
| `arr[i]` may be `undefined` | Under `noUncheckedIndexedAccess`. Use `arr[i]!` and move on. |
| `map.get(k)` is `T \| undefined` | `map.get(k) ?? 0` is the counting idiom. |
| `sort` mutates | Copy first: `[...arr].sort(...)` or `arr.toSorted(...)`. |
| `shift()` is O(n) | Fine at interview scale — but say so and offer a head index. |
| No built-in heap | JS has no `PriorityQueue`. Write one, sort, or bucket. |
| `structuredClone` may be missing | Older runtimes. `JSON.parse(JSON.stringify(x))` for plain data. |
| `parameter properties` may not compile | `constructor(public val: number)` fails under `erasableSyntaxOnly`. Spell fields out. |
| Big numbers | Integers are exact only to 2^53. Mention `BigInt` if the problem implies more. |

**Reading stdin** — for a *pair-programming* session you usually just call your
function and `console.log`. If they hand you a stdin-style skeleton:

```ts
const lines: string[] = require('fs').readFileSync(0, 'utf8').split('\n');
```

Do not spend time on I/O plumbing unless the problem is about it. Ask.

**If the type checker blocks the run:** HackerRank's TS runner can refuse to
execute on a type error, unlike plain JS. If that starts costing you time, say
so and loosen the type — the interviewer will not mark you down for
pragmatism they can see you reasoning about.

---

## 4. Testing is key — what "tested" looks like here

They said candidates are expected to *provide a working solution and test their
code*, and to *identify bugs and fix them*. That is a scored criterion, not a
nicety.

**What good looks like:**

1. The harness exists before the solution does.
2. The prompt's own examples are in it, as assertions.
3. Edge cases are added deliberately, and you say why each one is interesting.
4. You run after each chunk, not once at the end.
5. When something fails, you **read the output and reason** — not
   guess-and-re-run. Say: "expected 3, got 4 — that's an off-by-one on the
   inclusive bound, let me check the loop condition."

**The strongest single move**, if you have time: test against brute force.

```ts
for (let trial = 0; trial < 200; trial += 1) {
  const nums = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
  eq(optimised(nums), bruteForce(nums), `random ${JSON.stringify(nums)}`);
}
```

Very few candidates do this. It catches real bugs, and it demonstrates that you
understand the optimised version is supposed to be *equivalent* to the obvious
one — which is exactly the kind of thinking the round is looking for.

---

## 5. Recovering when it goes wrong

**You are stuck and the clock is moving.**
Say it, then downgrade deliberately: "I'll write the O(n²) version so we have
something correct, then optimise if there's time." This is a strong move, not a
concession — it shows you manage risk.

**Your solution is wrong and you cannot see why.**
Stop editing. Trace the smallest failing input by hand, out loud, one step at a
time. Almost every bug at this level is a boundary, and hand-tracing finds
boundaries faster than staring does.

**You realise your whole approach is wrong.**
Say so immediately, say what you now think is right, and ask whether to switch.
Discovering it yourself is a positive signal. Being led there slowly is not.

**They ask something you do not know.**
"I don't know that one — my guess would be X, but I'd want to check." Never
bluff. Interviewers ask follow-ups precisely to find your edge; finding it
honestly is not a failure, and a confident wrong answer is much worse than an
honest unknown.

---

## 6. Questions to ask at the end

Two or three, specific:

- "How much of the day-to-day work is algorithmic versus product-shaped?"
- "What does the next stage look like — is there a frontend-specific round?"
- "What's the TypeScript setup like — how strict, and is there legacy?"
- "What would you want someone in this role to have shipped in three months?"
