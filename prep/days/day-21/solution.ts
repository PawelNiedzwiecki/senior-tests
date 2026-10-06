/**
 * SOLUTIONS — Sorting + greedy on intervals
 */

export type Interval = [start: number, end: number];

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
