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

