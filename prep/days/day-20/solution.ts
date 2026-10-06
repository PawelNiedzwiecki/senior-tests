/**
 * SOLUTIONS — Sorting + greedy on intervals
 */

export type Interval = [start: number, end: number];

/**
 * PROBLEM 1 — Non-overlapping intervals
 *
 * COMPLEXITY: O(n log n) for the sort, O(n) for the sweep, O(1) extra space.
 *
 * NARRATION:
 *   "Removing the fewest is the same as keeping the most, which is activity
 *    selection. I sort by end time and greedily keep any interval that starts
 *    at or after the last kept end. Earliest-finishing leaves the most room for
 *    what follows — that is the exchange argument — so the greedy choice is
 *    optimal."
 *
 * THE COUNTEREXAMPLE FOR SORTING BY START: [[1,100],[2,3],[4,5]]. By start you
 * are led to keep [1,100] and lose two; by end you keep [2,3] and [4,5]. Have
 * this ready — it is the standard follow-up question.
 *
 * `>=` NOT `>`: touching intervals are allowed to coexist here, so [1,2]
 * followed by [2,3] keeps both. If the problem said touching counts as
 * overlapping, this single character changes.
 *
 * NON-DESTRUCTIVE SORT: copy before sorting. Mutating the caller's array is a
 * side effect nobody asked for, and in a review it is exactly the kind of thing
 * that gets flagged.
 */
export function eraseOverlapIntervals(intervals: Interval[]): number {
  if (intervals.length === 0) return 0;

  const byEnd = [...intervals].sort((a, b) => a[1] - b[1]);

  let kept = 1;
  let lastEnd = byEnd[0]![1];

  for (let i = 1; i < byEnd.length; i += 1) {
    if (byEnd[i]![0] >= lastEnd) {
      kept += 1;
      lastEnd = byEnd[i]![1];
    }
  }

  return intervals.length - kept;
}

