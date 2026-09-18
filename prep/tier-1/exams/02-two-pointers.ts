/**
 * TIER 1 · PATTERN 02 — Two pointers
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 60 min total    Catalogue: ../../patterns/CATALOGUE.md § 2
 *
 * THE PATTERN
 * Two indices walk the array and never go backwards. Because each one moves at
 * most n times, the whole scan is O(n) even though it looks like a nested
 * loop. What makes it correct is not the pointers — it is the argument that
 * whatever you step over cannot be part of the answer.
 *
 * THE TELL
 *   the input is SORTED  ·  "in place"  ·  "O(1) extra space"
 *   the problem is symmetric from both ends (palindromes, pairs)
 *
 * WHEN IT IS VALID — say this or you have not earned the pattern
 * A comparison at the current pair must tell you WHICH SIDE CANNOT POSSIBLY
 * BE PART OF THE ANSWER. In sorted two-sum: if the sum is too small, no
 * partner for the left element exists to its right that is any smaller, so the
 * left element is dead and lo advances. Without a discard argument you have a
 * guess with two variables, not an algorithm.
 *
 * THE THREE SHAPES
 *   CONVERGING   lo = 0, hi = n - 1, walk inward       — sorted pairs, palindromes
 *   READ/WRITE   a slow write index and a fast read    — in-place filtering
 *   PARALLEL     one index per input, take the smaller — merging sorted runs
 *
 * TEMPLATE (converging)
 *   let lo = 0, hi = nums.length - 1;
 *   while (lo < hi) {
 *     const sum = nums[lo]! + nums[hi]!;
 *     if (sum === target) return [lo, hi];
 *     if (sum < target) lo += 1; else hi -= 1;
 *   }
 *
 * COST — O(n) time, O(1) space. If you must sort first it is O(n log n) time,
 * and the sort usually costs you the O(1)-space claim in JavaScript.
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * Duplicates in the output (3Sum), three pointers (fix one, two-pointer the
 * rest), writing from the back so you never overwrite unread input (exam 5).
 *
 * THE SENTENCE WORTH SAYING
 *   "It's sorted, so a comparison at the ends tells me which end is useless.
 *    Each pointer moves at most n times — O(n), constant space."
 */

/**
 * EXAM 1 — Squares of a sorted array                           [LeetCode 977]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` is sorted ascending and may contain negatives. Return the squares,
 * sorted ascending.
 *
 *   sortedSquares([-4, -1, 0, 3, 10])  → [0, 1, 9, 16, 100]
 *   sortedSquares([-7, -3, 2, 3, 11])  → [4, 9, 9, 49, 121]
 *
 * TARGET: O(n) time, O(n) space for the output. Sorting the squares is
 * O(n log n) and will be called out.
 *
 * HINT: the largest square is at one END or the other, never in the middle.
 *       So compare the two ends and FILL THE OUTPUT FROM THE BACK. Trying to
 *       fill from the front means looking for the smallest, which is in the
 *       middle somewhere — that is the version that does not work.
 */
export function sortedSquares(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Remove duplicates, keeping at most two                [LeetCode 80]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` is sorted ascending. MUTATE it in place so each value appears at most
 * twice, and return the new length k. The first k slots must hold the result;
 * what is left beyond k does not matter.
 *
 *   nums = [1, 1, 1, 2, 2, 3]  → 5, nums starts [1, 1, 2, 2, 3]
 *   nums = [0, 0, 1, 1, 1, 1, 2, 3, 3]  → 7, nums starts [0, 0, 1, 1, 2, 3, 3]
 *
 * TARGET: O(n) time, O(1) space.
 *
 * HINT: the READ/WRITE shape. The whole problem collapses to one condition:
 *       keep `nums[read]` if `write < 2 || nums[read] !== nums[write - 2]`.
 *       Look backwards at what you have already KEPT, not forwards at the
 *       input — that generalises to "at most k" for free, which is the
 *       follow-up.
 */
export function removeDuplicatesAtMostTwice(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Container with most water                            [LeetCode 11]
 * ────────────────────────────────────────────────────────────────────────────
 * `heights[i]` is a vertical line at x = i. Pick two lines so that the
 * container they form with the x-axis holds the most water. Return that area.
 * Area is `min(heights[lo], heights[hi]) * (hi - lo)`.
 *
 *   maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])  → 49
 *   maxArea([1, 1])                       → 1
 *
 * TARGET: O(n) time, O(1) space.
 *
 * HINT: start at the widest pair and always move the SHORTER line inward.
 *       The exchange argument is the answer they want: the shorter line caps
 *       the area, and every remaining pairing for it is narrower, so it can
 *       never do better than the area you just recorded. Discarding it loses
 *       nothing. If you cannot say that sentence, you are guessing.
 */
export function maxArea(_heights: number[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — 3Sum closest                                         [LeetCode 16]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the sum of the three values whose total is closest to `target`.
 * `nums` has at least three elements; exactly one answer exists.
 *
 *   threeSumClosest([-1, 2, 1, -4], 1)  → 2     (-1 + 2 + 1)
 *   threeSumClosest([0, 0, 0], 1)       → 0
 *
 * TARGET: O(n²) time, O(1) space beyond the sort.
 *
 * HINT: sort, then FIX the first index and two-pointer the rest — that is the
 *       standard way to spend one loop to buy sortedness for the other two.
 *       Track the best distance as you go; an exact hit is an early return.
 *       Mention that sorting is what makes the inner scan linear, so O(n log n)
 *       is absorbed into O(n²).
 */
export function threeSumClosest(_nums: number[], _target: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Merge a sorted array into another, in place           [LeetCode 88]
 * ────────────────────────────────────────────────────────────────────────────
 * `a` has length m + n: its first m slots are sorted values and the last n are
 * padding. `b` holds n sorted values. Merge b into a so that a is sorted.
 * Return nothing — the mutation IS the answer.
 *
 *   a = [1, 2, 3, 0, 0, 0], m = 3, b = [2, 5, 6], n = 3  → a = [1, 2, 2, 3, 5, 6]
 *   a = [1], m = 1, b = [], n = 0                        → a = [1]
 *   a = [0], m = 0, b = [1], n = 1                       → a = [1]
 *
 * TARGET: O(m + n) time, O(1) space.
 *
 * HINT: merging forwards would overwrite values of `a` you have not read yet.
 *       WRITE FROM THE BACK — largest first — into the padding, which is by
 *       definition the region you no longer need. Then the leftovers of `b`
 *       need draining and the leftovers of `a` do not: they are already in
 *       position. Knowing which of the two tails you may skip is the point of
 *       this exam.
 */
export function mergeInto(_a: number[], _m: number, _b: number[], _n: number): void {
  throw new Error('Not implemented');
}
