/**
 * TIER 1 · PATTERN 05 — Binary search
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 75 min total    Catalogue: ../../patterns/CATALOGUE.md § 5
 *
 * THE PATTERN
 * Halve the search space on every step. Sortedness is not the requirement —
 * MONOTONICITY is. If you can state a predicate that is false, false, …,
 * false, true, true, …, true over the space, you can binary search for the
 * boundary, and the space does not have to be an array.
 *
 * THE TELL
 *   sorted input + "find one thing" + O(log n) expected
 *   "minimum X such that…" / "maximum X such that…" where X is a NUMBER
 *   the input is huge and a linear scan is the obvious-but-too-slow answer
 *
 * THE TWO FORMS
 *   ON AN ARRAY       the index is what you search
 *   ON THE ANSWER     the ANSWER is what you search; a feasibility function
 *                     decides each guess. This is the senior version, and it
 *                     is what "minimum capacity / speed / time such that…"
 *                     always means.
 *
 * WRITE ONE FORM AND WRITE IT THE SAME WAY EVERY TIME. This one is the
 * least error-prone — half-open, converging on the boundary, no `found` flag:
 *
 *   let lo = 0, hi = n;                 // hi is EXCLUSIVE
 *   while (lo < hi) {
 *     const mid = lo + ((hi - lo) >> 1);   // no overflow, floors correctly
 *     if (predicate(mid)) hi = mid;        // mid might be the answer — keep it
 *     else lo = mid + 1;                   // mid is definitely not — drop it
 *   }
 *   return lo;                          // lo === hi === the boundary
 *
 * THE TERMINATION ARGUMENT: every iteration must strictly shrink [lo, hi).
 * `hi = mid` shrinks because mid < hi; `lo = mid + 1` shrinks because
 * mid >= lo. Get one of those wrong and you have an infinite loop, which is
 * the classic way this pattern fails in an interview.
 *
 * COST — O(log n) for an array, O(log(range) · cost(feasible)) on the answer.
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * First/last occurrence (two boundaries), rotated arrays (one half is always
 * sorted), and "minimise the maximum" problems, where feasibility is itself a
 * greedy pass.
 *
 * THE SENTENCE WORTH SAYING
 *   "Feasibility is monotonic in the answer — if capacity c works, so does
 *    c + 1 — so I can binary search the answer space rather than scan it."
 */

/**
 * EXAM 1 — First and last position of a value                   [LeetCode 34]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` is sorted ascending and may contain duplicates. Return the first and
 * last index of `target`, or [-1, -1] if it is absent.
 *
 *   searchRange([5, 7, 7, 8, 8, 10], 8)  → [3, 4]
 *   searchRange([5, 7, 7, 8, 8, 10], 6)  → [-1, -1]
 *   searchRange([], 0)                   → [-1, -1]
 *
 * TARGET: O(log n) time, O(1) space.
 *
 * HINT: do not scan outwards after finding a hit — that is O(n) when the array
 *       is all one value. Run the SAME boundary search twice with different
 *       predicates: `nums[i] >= target` gives the first position, and
 *       `nums[i] > target` gives one past the last. Writing both as
 *       lower-bound searches — rather than one lower and one upper — is how
 *       you avoid rewriting the loop under pressure.
 */
export function searchRange(_nums: number[], _target: number): [number, number] {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Search in a rotated sorted array                     [LeetCode 33]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` was sorted ascending with DISTINCT values, then rotated at some
 * unknown pivot. Return the index of `target`, or -1.
 *
 *   searchRotated([4, 5, 6, 7, 0, 1, 2], 0)  → 4
 *   searchRotated([4, 5, 6, 7, 0, 1, 2], 3)  → -1
 *   searchRotated([1], 1)                    → 0
 *
 * TARGET: O(log n) time, O(1) space.
 *
 * HINT: the array is not monotonic, but AT LEAST ONE HALF ALWAYS IS — compare
 *       `nums[lo]` with `nums[mid]` to find out which. Then ask whether the
 *       target lies inside that sorted half's range: if it does, recurse
 *       there; if it does not, the answer must be in the other half. Two
 *       questions, not four.
 *
 *       Follow-up to have ready: with duplicates allowed (LeetCode 81) the
 *       `nums[lo] === nums[mid]` case tells you nothing, you shrink by one,
 *       and the worst case degrades to O(n).
 */
export function searchRotated(_nums: number[], _target: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Find a peak element                                 [LeetCode 162]
 * ────────────────────────────────────────────────────────────────────────────
 * A peak is any element strictly greater than both neighbours; treat
 * out-of-bounds neighbours as -Infinity. Adjacent elements are never equal.
 * Return the index of ANY peak.
 *
 *   findPeakElement([1, 2, 3, 1])        → 2
 *   findPeakElement([1, 2, 1, 3, 5, 6, 4]) → 1 or 5
 *   findPeakElement([1])                 → 0
 *
 * TARGET: O(log n) time — and the array is NOT sorted, which is the point.
 *
 * HINT: this exam exists to break the "binary search needs a sorted array"
 *       reflex. If `nums[mid] < nums[mid + 1]`, the slope is rising, so SOME
 *       peak must exist to the right (the array ends, or it must turn over) —
 *       and symmetrically going left. That existence argument is the
 *       monotone predicate, and it is the whole answer. Say it before you
 *       write the loop.
 */
export function findPeakElement(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Koko eating bananas                                 [LeetCode 875]
 * ────────────────────────────────────────────────────────────────────────────
 * Given piles of bananas and `hours` available, find the smallest integer
 * eating speed k (bananas per hour) that finishes every pile in time. Each
 * hour Koko eats from one pile only: a pile of size p takes ceil(p / k) hours.
 * `hours` is always at least `piles.length`.
 *
 *   minEatingSpeed([3, 6, 7, 11], 8)          → 4
 *   minEatingSpeed([30, 11, 23, 4, 20], 5)    → 30
 *   minEatingSpeed([30, 11, 23, 4, 20], 6)    → 23
 *
 * TARGET: O(n log(max pile)) time.
 *
 * HINT: BINARY SEARCH ON THE ANSWER — the template case. Write
 *       `hoursNeeded(k)` first and notice it is NON-INCREASING in k: a faster
 *       speed never takes more hours. That monotonicity is what licenses the
 *       search; say it out loud before coding.
 *
 *       The space is speeds 1..max(piles), not array indices. Bound it that
 *       way and the loop is the same boundary template as exam 1.
 */
export function minEatingSpeed(_piles: number[], _hours: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Split array largest sum                             [LeetCode 410]
 * ────────────────────────────────────────────────────────────────────────────
 * Split `nums` (non-negative) into exactly `k` non-empty contiguous subarrays
 * so that the LARGEST subarray sum is as small as possible. Return that sum.
 *
 *   splitArrayLargestSum([7, 2, 5, 10, 8], 2)  → 18   ([7, 2, 5] | [10, 8])
 *   splitArrayLargestSum([1, 2, 3, 4, 5], 2)   → 9    ([1, 2, 3] | [4, 5])
 *   splitArrayLargestSum([1, 4, 4], 3)         → 4
 *
 * TARGET: O(n log(sum)) time. The DP solution is O(k · n²) and is the answer
 * most people give first — give it, then improve it.
 *
 * HINT: "minimise the maximum" is binary search on the answer, almost always.
 *       Guess a cap; feasibility is a single GREEDY pass — walk the array
 *       adding to the current chunk, and start a new chunk whenever the cap
 *       would be exceeded. If the number of chunks needed is at most k, the
 *       cap works.
 *
 *       The search space is `[max(nums), sum(nums)]`: below the largest single
 *       element nothing is splittable, and the total is always achievable with
 *       one chunk. Getting those bounds right — and saying why — is half of
 *       what is being assessed.
 */
export function splitArrayLargestSum(_nums: number[], _k: number): number {
  throw new Error('Not implemented');
}
