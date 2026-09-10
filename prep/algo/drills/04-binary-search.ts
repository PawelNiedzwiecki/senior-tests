/**
 * MODULE 04 — Binary search
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 55 min      DIFFICULTY: ●●●○○ (and ●●●●○ for problem 4)
 *
 * THE PATTERN
 * Halve the search space each step: O(log n). Trivial to describe, notoriously
 * easy to get wrong — the bugs are all in the boundaries. Interviewers know
 * this, which is why it comes up so often.
 *
 * THE DISCIPLINE THAT PREVENTS OFF-BY-ONES
 * Before writing the loop, say what your interval means, then keep every line
 * consistent with it. This file uses INCLUSIVE bounds throughout:
 *
 *   "lo and hi are both inside the range still under consideration."
 *
 * Which forces, mechanically:
 *   - `while (lo <= hi)`     — a single-element range lo === hi is still live
 *   - `hi = mid - 1`         — mid is excluded, so step past it
 *   - `lo = mid + 1`         — same on the other side
 *
 * The alternative convention is half-open [lo, hi), which gives `while (lo < hi)`
 * and `hi = mid`. Both are correct. Mixing them is the bug. Pick one, say which
 * you are using, and never mix.
 *
 * OVERFLOW: `(lo + hi) / 2` can overflow in Java/C++. It cannot in JavaScript
 * until 2^53, so it is safe here — but say "in a language with 32-bit ints I'd
 * write lo + (hi - lo) / 2". It is a free signal that you know why the idiom
 * exists.
 *
 * BIGGER IDEA — BINARY SEARCH THE ANSWER (problem 4). If you can write a
 * monotonic predicate `isOk(x)` — false, false, …, false, true, true, … — you
 * can binary search over the ANSWER SPACE rather than over an array. This turns
 * a huge class of "minimum X such that Y" problems into O(n log range). It is
 * the single highest-value pattern in this module.
 *
 * RECOGNITION CUES: "sorted", "O(log n) required", "minimum/maximum value such
 * that…", "how many days/hours/capacity do we need".
 */

/**
 * PROBLEM 1 — Classic binary search
 * Return the index of `target`, or -1.
 *
 *   binarySearch([-1, 0, 3, 5, 9, 12], 9) → 4
 *   binarySearch([-1, 0, 3, 5, 9, 12], 2) → -1
 *
 * TARGET: O(log n) time, O(1) space.
 * Write it iteratively. Recursion here costs O(log n) stack for no benefit.
 */
export function binarySearch(_nums: number[], _target: number): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — First and Last Position
 * Return [firstIndex, lastIndex] of `target` in a sorted array with duplicates,
 * or [-1, -1].
 *
 *   searchRange([5, 7, 7, 8, 8, 10], 8) → [3, 4]
 *   searchRange([5, 7, 7, 8, 8, 10], 6) → [-1, -1]
 *
 * TARGET: O(log n) time. Finding one match then scanning outwards is O(n) in
 * the worst case (all elements equal) — the interviewer will construct exactly
 * that input, so do not offer it as your answer.
 * HINT: two separate searches. For the FIRST occurrence, on a match record it
 *       and keep searching LEFT. For the LAST, keep searching RIGHT.
 */
export function searchRange(_nums: number[], _target: number): [number, number] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Search in a Rotated Sorted Array
 * A sorted array rotated at an unknown pivot, no duplicates. Find `target`.
 *
 *   searchRotated([4, 5, 6, 7, 0, 1, 2], 0) → 4
 *   searchRotated([4, 5, 6, 7, 0, 1, 2], 3) → -1
 *   searchRotated([1], 1)                   → 0
 *
 * TARGET: O(log n) time.
 * HINT: at any mid, at least one half is properly sorted — compare
 *       `nums[lo] <= nums[mid]` to find out which. If the target lies inside
 *       that sorted half's range, search it; otherwise search the other half.
 *       Use <= on that comparison, or a two-element range misbehaves.
 */
export function searchRotated(_nums: number[], _target: number): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 4 — Binary search the ANSWER  ★ the pattern worth the most ★
 *
 * Piles of bananas; `piles[i]` is how many are in pile i. You may eat at a
 * chosen integer speed of k bananas/hour. Each hour you pick one pile and eat
 * up to k from it (if the pile has fewer than k left, you finish it and the
 * hour is still used). Find the SMALLEST k that clears every pile within `h`
 * hours.
 *
 *   minEatingSpeed([3, 6, 7, 11], 8)      → 4
 *   minEatingSpeed([30, 11, 23, 4, 20], 5) → 30
 *
 * TARGET: O(n log(max pile)) time.
 * HINT: hours needed at speed k is `sum(ceil(pile / k))`. That is MONOTONIC:
 *       faster eating never needs more hours. So `canFinish(k)` is
 *       false…false,true…true, and you binary search for the boundary.
 *       Range: k from 1 to max(piles).
 * SAY THIS: "I'm binary searching the answer space, not the array. The key
 *       property is that the predicate is monotonic in k."
 */
export function minEatingSpeed(_piles: number[], _h: number): number {
  throw new Error('Not implemented');
}
