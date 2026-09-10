# Mock 1 — Longest consecutive run

**45 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only. Do not scroll ahead.

> Run this in a plain editor with no autocomplete if you can — a scratch file
> and `node file.ts`. The point is to rehearse the HackerRank environment, not
> your own.

---

## Part 1 — the brief

> Given an unsorted array of integers, return the length of the longest run of
> **consecutive** integers. The run does not have to appear contiguously in the
> array — only the values matter.
>
> ```
> [100, 4, 200, 1, 3, 2]        → 4     (1, 2, 3, 4)
> [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] → 9    (0 through 8)
> []                             → 0
> ```
>
> Take it however you like. Talk me through your thinking as you go.

**Start the timer. Come back at 15 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~15 minutes)

> Good. What's the complexity of that?
>
> Can you do it in linear time?

**Continue. Come back at 30 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — testing and pressure (at ~30 minutes)

> Let's make sure it's right. Write some tests — including whatever edge cases
> you think matter.
>
> Then: what happens if the array has ten million elements? And what if it's
> a stream and you can't hold it all in memory?

**Stop at 45 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### Framing — what the first three minutes should contain

Questions worth asking (any two):
- "Can there be duplicates?" (yes, and they must not extend a run)
- "Negative numbers?" (yes)
- "How large can the array be?" (decides whether O(n log n) is acceptable)
- "Can I modify the input?"

### The brute force, said out loud

> "Sorting makes it easy: sort, then walk and count runs, skipping duplicates.
> That's O(n log n) time and O(n) space if I copy, O(1) if I'm allowed to sort
> in place. Let me write that first."

This is a perfectly good answer and worth having on the board. It also sets up
the follow-up cleanly.

```ts
function longestRunSorted(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);

  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] === sorted[i - 1]) continue;          // duplicates don't extend
    if (sorted[i] === sorted[i - 1] + 1) current += 1;
    else current = 1;
    best = Math.max(best, current);
  }
  return best;
}
```

Note `.sort((a, b) => a - b)` — if you wrote `.sort()` here, that is the single
most valuable bug this mock could have caught for you.

### The linear solution — and the part that is actually asked

```ts
function longestRun(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;

  for (const num of set) {
    // Only start counting from the START of a run.
    if (set.has(num - 1)) continue;

    let length = 1;
    while (set.has(num + length)) length += 1;
    best = Math.max(best, length);
  }

  return best;
}
```

**The `if (set.has(num - 1)) continue` is the whole problem.** Without it you
walk every run from every one of its members and it is O(n²). With it, you only
ever walk a run from its smallest element, so across the entire loop each value
is visited at most twice — once by the outer iteration, once by an inner walk.

**Say that amortised argument explicitly.** The interviewer is looking at a
nested loop and waiting to see whether you can justify calling it O(n). "The
inner while only runs for run-starts, and the total work across all runs is
bounded by the number of distinct values" is the answer.

Complexity: **O(n) time, O(n) space.** Iterating the Set rather than the array
also handles duplicates for free — worth pointing out.

### Part 3 — testing

Edge cases that should appear without prompting:
- `[]` → 0
- `[5]` → 1
- all duplicates `[2, 2, 2]` → 1
- negatives `[-3, -2, -1]` → 3
- two runs, longer one second `[1, 2, 10, 11, 12]` → 3
- already consecutive
- a run spanning zero `[-1, 0, 1]`

The strongest move here is a randomised comparison against the sorted version:

```ts
for (let t = 0; t < 200; t += 1) {
  const nums = Array.from({ length: 12 }, () => Math.floor(Math.random() * 15) - 5);
  eq(longestRun(nums), longestRunSorted(nums), `random ${JSON.stringify(nums)}`);
}
```

Two independent implementations agreeing on random input is real evidence.

### Part 3 — the scale questions

**Ten million elements:** O(n) is fine on time; the concern is memory. A `Set`
of 10⁷ numbers is a few hundred megabytes in V8, because each entry carries
object overhead. Options: sort in place (O(1) extra, O(n log n) time — often the
right trade at that size), or a typed array plus sorting, or a bitset if the
value range is bounded and dense.

**A stream you cannot hold:** you cannot answer exactly — the last element could
join two earlier runs, so nothing can be finalised until the stream ends. Say
that clearly; recognising that a problem is *not* solvable in one pass under a
memory bound is the correct answer, not a failure. Then offer what is possible:
external sort, or an approximate structure if the interviewer will accept one.

### Score yourself

Use `../../mocks/rubric.md`. The two dimensions that matter most here:
**did you say the brute force before optimising**, and **did you justify O(n)
in the presence of a nested loop**.
