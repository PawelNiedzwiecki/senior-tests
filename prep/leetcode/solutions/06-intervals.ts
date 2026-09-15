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

/**
 * PROBLEM 2 — Insert interval
 *
 * COMPLEXITY: O(n) time, O(n) space for the output. No sort — the input is
 * already ordered, and pointing that out is half the answer.
 *
 * NARRATION:
 *   "Three phases. Everything that ends before the new interval starts is
 *    untouched. Everything that overlaps gets absorbed into one widened
 *    interval, which I push once. Everything after is untouched. Because the
 *    input is sorted and non-overlapping, one pass is enough."
 *
 * THE BOUNDARY: phase 1 uses `end < newStart` (strict). With `<=`, [1,3] and a
 * new [3,5] would be emitted separately instead of merging into [1,5]. Closed
 * intervals touch-and-merge; half-open ones would not. Ask which convention the
 * problem wants — and if nobody says, state the one you picked.
 *
 * WIDEN, DON'T PUSH-THEN-FIX: the merge loop mutates local `start`/`end`
 * variables and pushes exactly once after the loop. Pushing inside the loop and
 * repairing the last element afterwards works, but it is where off-by-one bugs
 * live.
 *
 * THE VARIANT: if the input were unsorted, this becomes merge-intervals — sort
 * by start, then fold. Same shape, one extra O(n log n).
 */
export function insertInterval(intervals: Interval[], newInterval: Interval): Interval[] {
  const out: Interval[] = [];
  let [start, end] = newInterval;
  let i = 0;

  // 1. Strictly before the new interval — touching does NOT count.
  while (i < intervals.length && intervals[i]![1] < start) {
    out.push(intervals[i]!);
    i += 1;
  }

  // 2. Overlapping (or touching) — absorb them into one widened interval.
  while (i < intervals.length && intervals[i]![0] <= end) {
    start = Math.min(start, intervals[i]![0]);
    end = Math.max(end, intervals[i]![1]);
    i += 1;
  }
  out.push([start, end]);

  // 3. Strictly after.
  while (i < intervals.length) {
    out.push(intervals[i]!);
    i += 1;
  }

  return out;
}
