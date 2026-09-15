/**
 * PATTERN 05 — Binary search (including on the answer)   [LeetCode 153, 378]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 5
 *
 * THE PATTERN
 * Halve a search space using a test that is MONOTONIC: true for everything on
 * one side of a boundary and false for everything on the other. A sorted array
 * is the obvious case ("is nums[mid] >= target?"), but the space being searched
 * does not have to be the input — it can be the range of possible answers.
 *
 * THE TELL
 *   sorted input + find one thing in O(log n)
 *   "minimum X such that…" / "maximum X such that…" where X is a number
 *   a sorted structure that has been rotated, or sorted in two dimensions
 *
 * THE TEMPLATE WORTH MEMORISING — the boundary form, not the "find target"
 * form. It returns the first index where the predicate holds, never overshoots
 * and never needs a post-loop fix-up:
 *
 *   let lo = 0, hi = n;                     // hi is EXCLUSIVE
 *   while (lo < hi) {
 *     const mid = lo + Math.floor((hi - lo) / 2);
 *     if (predicate(mid)) hi = mid;         // mid might be the answer — keep it
 *     else lo = mid + 1;                    // mid is definitely not
 *   }
 *   return lo;
 *
 * Use `lo + (hi - lo) / 2` rather than `(lo + hi) / 2` out of habit: in a
 * fixed-width language the latter overflows, and saying why shows the habit is
 * deliberate rather than superstitious.
 *
 * COST — O(log n) probes; times the cost of each predicate evaluation.
 *
 * THE SENTENCE TO SAY OUT LOUD
 *   "I'm binary searching the ANSWER space, not the array. What licenses it is
 *    that feasibility is monotonic in the answer: if X works, everything bigger
 *    works too."
 */

/**
 * PROBLEM 1 — Minimum in a rotated sorted array                 [LeetCode 153]
 * ────────────────────────────────────────────────────────────────────────────
 * A sorted array of DISTINCT values has been rotated an unknown number of
 * times. Return the smallest element, in O(log n).
 *
 *   findMinRotated([3, 4, 5, 1, 2])       → 1
 *   findMinRotated([4, 5, 6, 7, 0, 1, 2]) → 0
 *   findMinRotated([11, 13, 15, 17])      → 11    (not rotated at all)
 *
 * TARGET: O(log n) time, O(1) space.
 *
 * WHAT MAKES IT WORK: the array is not sorted, but it is still monotonic in the
 *       property you test. Compare `nums[mid]` with `nums[hi]`:
 *         · nums[mid] > nums[hi] → the rotation point is strictly right of mid
 *         · otherwise            → mid could itself be the minimum, so keep it
 *
 * COMPARE AGAINST `hi`, NOT `lo`. Against `lo` the non-rotated case
 *       ([1,2,3]) is ambiguous and needs an extra branch. Against `hi` there is
 *       no special case at all — a small choice that halves the bug surface.
 *
 * THE FOLLOW-UP TO PRE-EMPT: with DUPLICATES allowed (LeetCode 154) the worst
 *       case degrades to O(n), because [2,2,2,1,2] gives you no information at
 *       all when nums[mid] === nums[hi]; the repair is `hi -= 1` in that case.
 *       Naming this before being asked is a strong signal.
 */
export function findMinRotated(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Kth smallest element in a sorted matrix           [LeetCode 378]
 * ────────────────────────────────────────────────────────────────────────────
 * Each row and each column of `matrix` is sorted ascending. Return the kth
 * smallest element in the whole matrix (1-indexed, counting duplicates).
 *
 *   kthSmallestInMatrix([[1, 5, 9], [10, 11, 13], [12, 13, 15]], 8)  → 13
 *   kthSmallestInMatrix([[-5]], 1)                                   → -5
 *
 * TARGET: O(n · log(max - min)) time, O(1) space — better than the O(k log n)
 *       heap answer when k is large, and with no auxiliary structure.
 *
 * THE MOVE: binary search the VALUE range, not any index. For a candidate value
 *       v, count how many matrix entries are <= v. That count is non-decreasing
 *       in v, which is the monotonicity the search needs. The answer is the
 *       smallest v whose count is >= k.
 *
 * WHY THE ANSWER IS ALWAYS A REAL MATRIX ENTRY: the count only increases when v
 *       crosses an actual element, so the smallest v with count >= k is one of
 *       them. Say this — otherwise the interviewer will ask whether you might
 *       return a value that is not in the matrix.
 *
 * COUNTING IN O(n), the staircase walk: start at the BOTTOM-LEFT corner. If the
 *       cell is <= v, every cell above it in that column is too — add `row + 1`
 *       and step right. Otherwise step up. One pass, never backtracking.
 *
 * MENTION THE ALTERNATIVE: a min-heap seeded with the first column, popping k
 *       times, is O(k log n) and easier to write. Offer both and say which you
 *       would pick for which k.
 */
export function kthSmallestInMatrix(_matrix: number[][], _k: number): number {
  throw new Error('Not implemented');
}
