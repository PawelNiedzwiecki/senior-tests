/**
 * SOLUTIONS — Hash map / frequency counting
 */

/**
 * PROBLEM 1 — Longest consecutive sequence
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * NARRATION:
 *   "Sorting gives O(n log n) immediately. To get O(n) I put everything in a
 *    set and only start counting from the left end of a run — a number whose
 *    predecessor is absent. Each element is then walked at most once by an
 *    inner loop, so the whole thing is O(n) amortised despite the nested loop."
 *
 * THE GUARD `!set.has(num - 1)` IS THE ENTIRE ALGORITHM. Without it you re-walk
 * every run from every member and the solution degrades to O(n²) on input like
 * [1,2,3,...,n]. With it, the inner loop body executes exactly once per element
 * across the whole run.
 *
 * DUPLICATES are free: the Set collapses them, so [0, 0, 1] is a run of 2.
 */
export function longestConsecutive(nums: number[]): number {
  const set = new Set(nums);
  let best = 0;

  for (const num of set) {
    if (set.has(num - 1)) continue; // not the start of a run — skip

    let length = 1;
    while (set.has(num + length)) length += 1;
    if (length > best) best = length;
  }

  return best;
}

