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

/**
 * PROBLEM 2 — Sum of subarray minimums
 *
 * COMPLEXITY: O(n) time, O(n) space. Each index is pushed and popped once per
 * stack pass.
 *
 * NARRATION — lead with the inversion:
 *   "There are O(n²) subarrays so I can't enumerate them. Instead of asking for
 *    each subarray's minimum, I ask for each ELEMENT how many subarrays it is
 *    the minimum of. That count is (choices of start) × (choices of end), which
 *    the previous-smaller and next-smaller indices give me directly, and both
 *    come from monotonic stacks in linear time."
 *
 * THE TIE-BREAKING ASYMMETRY is the crux. For equal values I use STRICTLY
 * smaller on the left and smaller-OR-EQUAL on the right. That makes the
 * leftmost of a run of equal minima the unique owner of any subarray they share,
 * so nothing is counted twice. Symmetric rules give [2, 2] an answer of 8
 * instead of the correct 6 — a good sanity check to run aloud.
 *
 * SENTINELS INSTEAD OF BRANCHES: `previousSmaller[i] = -1` when there is none,
 * and `nextSmaller[i] = n` likewise. Those two values make the arithmetic
 * `i - previous` and `next - i` correct at the boundaries with no conditionals.
 *
 * ON PRECISION: `value * left * right` is exact while it stays under 2^53. At
 * the real LeetCode limits (n up to 3·10⁴, values up to 3·10⁴) it can exceed
 * that, so a production answer would use BigInt or reduce each factor modulo
 * 1e9+7 before multiplying in stages. Name the limit rather than hoping.
 */
export function sumSubarrayMins(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  if (n === 0) return 0;

  const previousSmaller = new Array<number>(n).fill(-1); // strictly smaller
  const nextSmaller = new Array<number>(n).fill(n); // smaller OR EQUAL
  const stack: number[] = [];

  for (let i = 0; i < n; i += 1) {
    while (stack.length > 0 && nums[stack[stack.length - 1]!]! > nums[i]!) {
      stack.pop();
    }
    previousSmaller[i] = stack.length === 0 ? -1 : stack[stack.length - 1]!;
    stack.push(i);
  }

  stack.length = 0;

  for (let i = n - 1; i >= 0; i -= 1) {
    // `>=` here is the asymmetry: equal values are owned by the LEFTMOST one.
    while (stack.length > 0 && nums[stack[stack.length - 1]!]! >= nums[i]!) {
      stack.pop();
    }
    nextSmaller[i] = stack.length === 0 ? n : stack[stack.length - 1]!;
    stack.push(i);
  }

  let total = 0;
  for (let i = 0; i < n; i += 1) {
    const left = i - previousSmaller[i]!; // choices of start
    const right = nextSmaller[i]! - i; // choices of end
    total = (total + nums[i]! * left * right) % MOD;
  }

  return total;
}
