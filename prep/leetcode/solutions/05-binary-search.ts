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

/**
 * PROBLEM 2 — Kth smallest in a sorted matrix
 *
 * COMPLEXITY: O(n · log(max - min)) time, O(1) space. Each of the O(log range)
 * probes does an O(n) staircase count on an n × n matrix.
 *
 * NARRATION:
 *   "I'll binary search the value range rather than any index. For a candidate
 *    value I can count the entries <= it in linear time by walking a staircase
 *    from the bottom-left corner. That count is monotonic in the candidate, so
 *    the smallest candidate whose count reaches k is the answer — and because
 *    the count only jumps at real elements, that candidate is guaranteed to be
 *    one of them."
 *
 * THE STAIRCASE is the part worth drawing. From the bottom-left, the two
 * directions carry opposite information: moving right increases the value,
 * moving up decreases it. So each step eliminates a whole row or a whole
 * column, and the walk is at most 2n steps with no backtracking. The same walk
 * is the O(m + n) answer to "search a 2D matrix II" (§ 19).
 *
 * `count < k → lo = mid + 1` — a value whose count falls short cannot be the
 * answer. Otherwise `hi = mid`: mid still might be, so keep it. Same boundary
 * form as problem 1.
 *
 * WHY NOT JUST FLATTEN AND SORT: O(n² log n) time and O(n²) space, and it
 * throws away the sortedness the problem handed you. Offer it as the baseline,
 * then improve on it — interviewers like seeing the ladder.
 */
export function kthSmallestInMatrix(matrix: number[][], k: number): number {
  const n = matrix.length;

  /** Staircase walk from the bottom-left: how many entries are <= value. */
  const countLessOrEqual = (value: number): number => {
    let count = 0;
    let row = n - 1;
    let col = 0;

    while (row >= 0 && col < n) {
      if (matrix[row]![col]! <= value) {
        count += row + 1; // this cell and everything above it in the column
        col += 1;
      } else {
        row -= 1;
      }
    }

    return count;
  };

  let lo = matrix[0]![0]!;
  let hi = matrix[n - 1]![n - 1]!;

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (countLessOrEqual(mid) < k) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}
