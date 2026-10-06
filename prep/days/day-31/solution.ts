/**
 * SOLUTIONS — Monotonic stack
 */

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
