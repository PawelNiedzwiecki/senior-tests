/**
 * SOLUTIONS — Monotonic stack
 */

/**
 * PROBLEM 1 — Trapping rain water
 *
 * COMPLEXITY: O(n) time, O(1) space in this two-pointer form.
 *
 * NARRATION:
 *   "Water above a column is min(maxLeft, maxRight) minus the column's own
 *    height — the shorter wall governs. The straightforward version precomputes
 *    both maxima in two passes, O(n) space. I can do better: walk two pointers
 *    inward and always advance the side whose running max is SMALLER, because
 *    for that side the minimum of the two maxima is already known — nothing
 *    further in can change it."
 *
 * WHY THE SMALLER SIDE IS SAFE TO SETTLE: if leftMax < rightMax, then whatever
 * the true right-hand maximum for the left column turns out to be, it is at
 * least rightMax, so the min is leftMax. The column's water is determined now.
 * That is the whole correctness argument and it is worth stating explicitly.
 *
 * THE STACK SOLUTION fills water in horizontal LAYERS instead of columns: each
 * pop closes a basin whose floor is the popped bar and whose walls are the new
 * stack top and the current bar. It is O(n) space and no faster, but it is the
 * one to reach for in the "largest rectangle" family, so it is worth being able
 * to write both.
 *
 * NO WATER AT THE EDGES falls out for free: the first and last columns always
 * have a zero-height wall on one side, so their contribution is zero without a
 * special case.
 */
export function trap(heights: number[]): number {
  let lo = 0;
  let hi = heights.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (lo < hi) {
    if (heights[lo]! < heights[hi]!) {
      // The left wall is the binding constraint — settle the left column.
      leftMax = Math.max(leftMax, heights[lo]!);
      water += leftMax - heights[lo]!;
      lo += 1;
    } else {
      rightMax = Math.max(rightMax, heights[hi]!);
      water += rightMax - heights[hi]!;
      hi -= 1;
    }
  }

  return water;
}

