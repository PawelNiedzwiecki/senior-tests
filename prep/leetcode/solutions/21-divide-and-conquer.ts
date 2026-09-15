/**
 * SOLUTIONS — Divide and conquer
 */

/**
 * PROBLEM 1 — Sort an array (merge sort)
 *
 * COMPLEXITY: O(n log n) time — the recurrence is T(n) = 2T(n/2) + O(n) — and
 * O(n) auxiliary space.
 *
 * NARRATION:
 *   "Merge sort: split at the midpoint, sort both halves recursively, then
 *    merge them with two pointers. Every level of recursion does O(n) merging
 *    work and there are log n levels, so it's n log n regardless of the input —
 *    unlike quicksort, whose worst case is quadratic and which I'd only choose
 *    if the O(log n) space mattered more than the guarantee."
 *
 * `<=` IN THE MERGE PRESERVES STABILITY. For raw numbers it is unobservable,
 * but the habit matters: the moment the elements are objects sorted by one
 * field, `<` silently reorders equal keys. Saying this while writing the line
 * costs nothing and signals experience.
 *
 * THE BASE CASE is length <= 1, which is trivially sorted. This is where
 * infinite recursion comes from if the split is written so that one side can be
 * the whole input.
 *
 * NOT MUTATING THE INPUT: `slice` copies, so the caller's array is untouched.
 * If the problem wanted in-place behaviour, an index-range merge sort with a
 * shared scratch buffer avoids the per-level allocation — mention it, since the
 * allocations are this implementation's real cost.
 *
 * AND THE ONE-LINER TO SAY FIRST: `[...nums].sort((a, b) => a - b)` is what you
 * would actually ship. The comparator is mandatory — the default sort compares
 * stringified values, so [3, 10, 2] sorts to [10, 2, 3].
 */
export function sortArray(nums: number[]): number[] {
  if (nums.length <= 1) return [...nums];

  const mid = nums.length >> 1;
  const left = sortArray(nums.slice(0, mid));
  const right = sortArray(nums.slice(mid));

  const merged: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    // `<=` keeps equal elements in their original order — stability.
    if (left[i]! <= right[j]!) merged.push(left[i++]!);
    else merged.push(right[j++]!);
  }

  while (i < left.length) merged.push(left[i++]!);
  while (j < right.length) merged.push(right[j++]!);

  return merged;
}

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
