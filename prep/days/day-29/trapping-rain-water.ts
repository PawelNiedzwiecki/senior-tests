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
 * In counting problems (like sum of subarray minimums, day-31) getting this wrong double-counts, and
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

