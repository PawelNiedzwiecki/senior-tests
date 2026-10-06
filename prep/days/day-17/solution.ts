/**
 * SOLUTIONS — Binary search
 */

/**
 * PROBLEM 1 — Minimum in a rotated sorted array
 *
 * COMPLEXITY: O(log n) time, O(1) space.
 *
 * NARRATION:
 *   "The array is not sorted, but it is still binary-searchable, because the
 *    predicate 'is the rotation point to my right?' is monotonic. Comparing
 *    nums[mid] to nums[hi] answers it: if nums[mid] is bigger, the wrap must be
 *    to the right, so the minimum is after mid; otherwise mid itself is still a
 *    candidate and I keep it."
 *
 * THE INVARIANT: the minimum always lies within [lo, hi]. `lo = mid + 1` is
 * safe because nums[mid] > nums[hi] proves mid is not the minimum; `hi = mid`
 * keeps mid because it might be.
 *
 * WHY NOT COMPARE TO nums[lo]: on [1, 2, 3] (no rotation) nums[mid] > nums[lo]
 * and yet the minimum is to the LEFT, so that comparison needs an extra
 * "already sorted" guard. Comparing to nums[hi] eliminates the case.
 *
 * TERMINATION: `lo < hi` with `hi = mid` and `lo = mid + 1` always shrinks the
 * range, and the loop exits with lo === hi pointing at the answer. No post-loop
 * adjustment, which is exactly why this loop form is the one to memorise.
 */
export function findMinRotated(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (nums[mid]! > nums[hi]!) lo = mid + 1; // wrap point is strictly right
    else hi = mid; // mid may be the minimum — keep it
  }

  return nums[lo]!;
}

