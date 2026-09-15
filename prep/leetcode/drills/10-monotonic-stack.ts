/**
 * PATTERN 10 — Monotonic stack                            [LeetCode 42, 907]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 10
 *
 * THE PATTERN
 * A stack whose contents are kept sorted — increasing or decreasing — by
 * popping anything that would break the order BEFORE pushing. What you pop is
 * not waste: the element that caused the pop is the answer for everything it
 * evicted. That is the whole pattern in one sentence.
 *
 * THE TELL
 *   "next greater" / "previous smaller" / "days until a warmer temperature"
 *   "largest rectangle" / "trapped water" / "how far until X"
 *   any problem where each element's answer depends on the nearest element on
 *   one side that beats it
 *
 * WHICH DIRECTION
 *   NEXT GREATER  → keep a DECREASING stack; pop while stack top < current
 *   NEXT SMALLER  → keep an INCREASING stack; pop while stack top > current
 * Store INDICES, not values — you almost always need the distance too.
 *
 * TEMPLATE
 *   const stack: number[] = [];                      // indices
 *   for (let i = 0; i < n; i += 1) {
 *     while (stack.length > 0 && nums[stack.at(-1)!]! < nums[i]!) {
 *       const j = stack.pop()!;                      // nums[i] is j's answer
 *     }
 *     stack.push(i);
 *   }
 *
 * WHY IT IS O(n) WITH A NESTED LOOP — say this out loud, every time:
 *   "Each index is pushed once and popped at most once, so the total work is
 *    bounded by 2n regardless of how the inner loop is distributed. O(n)
 *    amortised."
 *
 * DUPLICATES ARE A DESIGN DECISION, not a detail: popping on `<` versus `<=`
 * decides whether equal elements are counted by the left one or the right one.
 * In counting problems (problem 2 below) getting this wrong double-counts, and
 * it is the single most common bug in the pattern.
 *
 * COST — O(n) time, O(n) space.
 */

/**
 * PROBLEM 1 — Trapping rain water                                [LeetCode 42]
 * ────────────────────────────────────────────────────────────────────────────
 * Each bar has width 1 and the given height. Return how much water is trapped
 * after it rains.
 *
 *   trap([0,1,0,2,1,0,1,3,2,1,2,1])  → 6
 *   trap([4,2,0,3,2,5])              → 9
 *   trap([3, 2, 1])                  → 0     (no right wall)
 *
 * TARGET: O(n) time. O(n) space with a stack; O(1) with two pointers.
 *
 * THE GOVERNING FACT, and you should state it before writing anything:
 *
 *     water above column i = min(maxToTheLeft, maxToTheRight) - height[i]
 *
 *     Water is held by the SHORTER of the two walls. Once that sentence is
 *     said, every solution below is just a way of computing those two maxima.
 *
 * THREE SOLUTIONS, in the order you should present them:
 *   1. PRECOMPUTED MAXIMA — two passes filling leftMax[] and rightMax[], then
 *      one pass summing. O(n) time, O(n) space. Obvious and correct; lead here.
 *   2. MONOTONIC STACK — a decreasing stack of indices; each pop closes a
 *      horizontal basin bounded by the popped bar's new neighbour and the
 *      current bar. Fills the water in LAYERS rather than columns.
 *   3. TWO POINTERS — O(1) space. Move whichever side has the smaller wall,
 *      because that side's answer is already determined by the wall you know.
 *
 * THE TWO-POINTER ARGUMENT, if you go that way: "if leftMax < rightMax, then
 *       for the left column the minimum of the two maxima is leftMax no matter
 *       what happens further right — so I can settle it now."
 */
export function trap(_heights: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Sum of subarray minimums                          [LeetCode 907]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the sum of `min(subarray)` over EVERY contiguous subarray, modulo
 * 1e9 + 7.
 *
 *   sumSubarrayMins([3, 1, 2, 4])  → 17
 *       subarrays: [3],[1],[2],[4],[3,1],[1,2],[2,4],[3,1,2],[1,2,4],[3,1,2,4]
 *       minimums:   3 + 1 + 2 + 4 +  1  +  1  +  2  +   1   +   1   +    1  = 17
 *   sumSubarrayMins([11, 81, 94, 43, 3])  → 444
 *
 * TARGET: O(n) time, O(n) space. There are O(n²) subarrays, so enumerating them
 *       is not an option — the answer has to come from counting, not listing.
 *
 * THE FLIP THAT SOLVES IT: instead of asking "what is the minimum of each
 *       subarray", ask "FOR HOW MANY SUBARRAYS IS THIS ELEMENT THE MINIMUM?"
 *       Then the answer is Σ value × count. This inversion — from iterating
 *       over subarrays to iterating over elements — is a genuinely reusable
 *       idea and shows up across counting problems.
 *
 * THE COUNT: let `left` be the number of choices for the subarray's start and
 *       `right` the number for its end, with element i as the minimum:
 *
 *         left  = i - (index of the previous strictly smaller element)
 *         right = (index of the next smaller-or-equal element) - i
 *         contribution = value × left × right
 *
 *       Two monotonic stacks (or one, computing both sides in a single pass).
 *
 * THE ASYMMETRY IS DELIBERATE — "strictly smaller" on one side and
 *       "smaller OR EQUAL" on the other. With equal values, ties must be broken
 *       consistently or subarrays whose minimum appears twice get counted
 *       twice. Test `[2, 2]`: the answer is 6, not 8. This is the detail the
 *       problem exists to test.
 *
 * ON THE MODULO: apply it as you accumulate. Under the real LeetCode
 *       constraints the products can exceed 2^53, where JavaScript numbers stop
 *       being exact — the honest fixes are BigInt or splitting the multiply.
 *       Say this; quietly overflowing is worse than knowing you might.
 */
export function sumSubarrayMins(_nums: number[]): number {
  throw new Error('Not implemented');
}
