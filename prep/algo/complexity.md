# Complexity — saying it correctly

DeepL named this explicitly: *"be prepared to discuss the time and space
complexity of your solution."* You will be asked. Have the answer ready before
they ask.

---

## The growth rates, with a feel for scale

| | Name | n = 10 | n = 1,000 | n = 1,000,000 |
| --- | --- | --- | --- | --- |
| O(1) | constant | 1 | 1 | 1 |
| O(log n) | logarithmic | 3 | 10 | 20 |
| O(n) | linear | 10 | 1,000 | 1,000,000 |
| O(n log n) | linearithmic | 33 | 10,000 | 20,000,000 |
| O(n²) | quadratic | 100 | 1,000,000 | 10¹² — too slow |
| O(2ⁿ) | exponential | 1,024 | astronomical | — |
| O(n!) | factorial | 3.6M | — | — |

**The rule of thumb worth memorising:** a modern machine does roughly 10⁸
simple operations per second. So:

| Input size | What fits |
| --- | --- |
| n ≤ 10 | O(n!) — permutations are fine |
| n ≤ 20 | O(2ⁿ) — subsets are fine |
| n ≤ 500 | O(n³) |
| n ≤ 5,000 | O(n²) |
| n ≤ 10⁶ | O(n log n) |
| n ≤ 10⁸ | O(n) |

This is *why* you ask about input size in framing. "How large can n get?" is not
a polite question — the answer tells you which algorithm is acceptable, and
saying that connection out loud is exactly the "handles constraints" signal.

---

## The operations you will be asked about

| Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array (by index) | O(1) | O(n) | O(n) | O(n) | insert/delete shift everything after |
| Array `push`/`pop` | — | — | O(1)* | O(1) | *amortised — occasional resize |
| Array `shift`/`unshift` | — | — | O(n) | O(n) | re-indexes the whole array |
| `Map` / `Set` | — | O(1)* | O(1)* | O(1)* | *amortised; O(n) worst case |
| Sorted array + binary search | O(1) | O(log n) | O(n) | O(n) | |
| Binary heap | peek O(1) | O(n) | O(log n) | O(log n) | JS has none built in |
| Balanced BST | — | O(log n) | O(log n) | O(log n) | JS has none built in |

**JavaScript specifics worth naming:**

- `Array.prototype.sort` is O(n log n). V8 uses TimSort, which is stable and
  adaptive — nearly-sorted input runs closer to O(n).
- `.includes` / `.indexOf` on an array is O(n). Inside a loop that is O(n²), and
  it is the most common accidental quadratic in JavaScript. A `Set` fixes it.
- String concatenation in a loop can be O(n²). Push into an array and `join('')`.
- `.slice()` is O(k) and allocates. Slicing inside a loop is another quiet
  quadratic — pass indices instead.
- Spreading (`[...arr]`) is O(n) and allocates. Cheap once, expensive in a loop.

---

## How to state it, in one sentence

Not: *"it's O(n)."*

Instead: **what** is linear, **why**, and the space separately.

> "Time is O(n) — one pass, and each Map operation is amortised constant.
> Space is O(n) in the worst case, when every element is distinct and ends up
> in the map."

> "Time is O(n log n), dominated by the sort; the merge pass afterwards is
> linear. Space is O(n) for the output, O(log n) auxiliary for the sort's stack."

**Distinguish auxiliary space from output space.** Producing 2ⁿ subsets is
inherently O(n · 2ⁿ) of output, but the *auxiliary* space is only O(n) for the
recursion and the path. Making that distinction unprompted is a strong signal.

---

## Amortised — know what it means

Some operations are occasionally expensive but cheap on average across a
sequence. `array.push` is O(1) amortised: most pushes are constant, and the
occasional resize copies everything, but the cost spread over all pushes is
constant.

**Where it comes up in these drills:**

- **Monotonic stack** (module 05): the inner `while` looks quadratic. It is not
  — each element is pushed once and popped at most once, so total work is
  bounded by 2n.
- **Sliding window** (module 03): `left` and `right` each advance at most n
  times over the whole run, so the nested loop is O(n).

Being able to make this argument is the difference between reciting a
complexity and understanding one. Both of those modules are asked *because* of it.

---

## Best, average and worst

Say which one you mean when they differ:

- **Quicksort**: O(n log n) average, O(n²) worst (already-sorted input with a
  naive pivot). Randomising the pivot makes the worst case improbable rather
  than impossible.
- **Hash map**: O(1) average, O(n) worst with adversarial keys.
- **Quickselect**: O(n) average, O(n²) worst — same pivot caveat.
- **Binary search in a rotated array with duplicates**: degrades to O(n),
  because `nums[lo] === nums[mid] === nums[hi]` tells you nothing.

Knowing where a guarantee *breaks* is more valuable than knowing the headline
number.

---

## Common mistakes when stating complexity

**Nested loops are not automatically O(n²).**
```ts
for (let i = 0; i < n; i++)
  for (let j = i; j < n; j += k)   // depends on k
```
Count the total iterations, do not pattern-match on nesting depth.

**Two sequential loops are O(n), not O(n²).** O(n) + O(n) = O(2n) = O(n).
Candidates routinely apologise for a second pass that costs nothing. Two passes
is often the clearest solution — say "still linear" and move on.

**Recursion cost is depth × work-per-frame**, and the stack counts as space.
A recursive tree traversal is O(h) space, and h is n for a degenerate tree.

**Sorting inside a loop.** `for (…) { arr.sort() }` is O(n² log n). Sort once,
outside.

**Hidden linear operations.** `.includes`, `.indexOf`, `.slice`, spread — each
is O(n) and each is easy to miss inside a loop.
