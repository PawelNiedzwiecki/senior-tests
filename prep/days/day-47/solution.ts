/**
 * SOLUTIONS — Divide and conquer
 */

/**
 * PROBLEM 2 — Count of smaller numbers after self
 *
 * COMPLEXITY: O(n log n) time, O(n) space.
 *
 * NARRATION:
 *   "This is inversion counting, credited to the left element of each pair. A
 *    merge sort gives it away for free: every time the merge takes an element
 *    from the right half, that element is smaller than everything still waiting
 *    on the left. So when I finally take a left element, I add the number of
 *    right-half elements already taken — that is exactly how many smaller
 *    values sat to its right."
 *
 * SORT INDICES, NOT VALUES. The counts must land at ORIGINAL positions, and
 * sorting values destroys that mapping. Carrying an index array and comparing
 * through `nums[indices[…]]` keeps both the order and the provenance. This
 * indirection is the only genuinely fiddly part; write it slowly.
 *
 * `j - mid` IS THE CREDIT: `j` is the read pointer into the right half and
 * `mid` is where that half begins, so their difference is the number of
 * right-half elements already merged — that is, already known to be smaller
 * than the left element about to be taken.
 *
 * THE DRAIN LOOP NEEDS THE SAME CREDIT. When the right half empties first, the
 * remaining left elements are each larger than ALL of it, and forgetting to
 * credit them there is the bug that makes the answer correct on small inputs
 * and wrong on large ones.
 *
 * STRICTLY SMALLER: the comparison `nums[b] < nums[a]` takes from the right
 * only when it is strictly smaller, so equal values are not counted — which is
 * what the problem asks, and what [-1, -1] → [0, 0] checks.
 *
 * THE FENWICK ALTERNATIVE: walk right to left, querying how many values smaller
 * than the current one have been inserted so far, then insert it. Same
 * complexity, needs coordinate compression for large values, and some people
 * find it much easier to reason about. Worth naming as a second route.
 */
export function countSmaller(nums: number[]): number[] {
  const n = nums.length;
  const counts = new Array<number>(n).fill(0);
  if (n <= 1) return counts;

  const indices = nums.map((_, i) => i); // sort INDICES so counts stay attributable
  const buffer = new Array<number>(n).fill(0);

  const sortRange = (lo: number, hi: number): void => {
    if (hi - lo <= 1) return;

    const mid = (lo + hi) >> 1;
    sortRange(lo, mid);
    sortRange(mid, hi);

    let i = lo;
    let j = mid;
    let k = lo;

    while (i < mid && j < hi) {
      if (nums[indices[j]!]! < nums[indices[i]!]!) {
        buffer[k] = indices[j]!; // a right element jumps ahead
        j += 1;
      } else {
        counts[indices[i]!]! += j - mid; // …and it was smaller than this one
        buffer[k] = indices[i]!;
        i += 1;
      }
      k += 1;
    }

    // The right half emptied first: every remaining left element is larger
    // than ALL of it, so it earns the full credit too.
    while (i < mid) {
      counts[indices[i]!]! += j - mid;
      buffer[k] = indices[i]!;
      i += 1;
      k += 1;
    }

    while (j < hi) {
      buffer[k] = indices[j]!;
      j += 1;
      k += 1;
    }

    for (let t = lo; t < hi; t += 1) indices[t] = buffer[t]!;
  };

  sortRange(0, n);
  return counts;
}
