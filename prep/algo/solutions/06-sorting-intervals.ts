/**
 * SOLUTIONS 06 — Sorting, comparators and intervals
 */

export type Interval = [start: number, end: number];

/**
 * PROBLEM 1 — Sort numbers correctly
 *
 * THE POINT: `[10, 9, 1].sort()` gives `[1, 10, 9]` because the default
 * comparator stringifies. Always pass `(a, b) => a - b` for numbers.
 *
 * NOT MUTATING: `sort` sorts in place and returns the same reference. Copy
 * first — `[...nums].sort(...)` — or use `toSorted()` (ES2023, Node 20+).
 * Mutating an argument the caller still holds is a real bug, and volunteering
 * that you avoided it is a cheap, genuine signal.
 *
 * COMPLEXITY: O(n log n) time, O(n) space for the copy.
 */
export function sortNumbers(nums: number[]): number[] {
  return [...nums].sort((a, b) => a - b);
}

/**
 * PROBLEM 2 — Merge Intervals
 *
 * NARRATION:
 *   "Unsorted, deciding whether two intervals overlap means comparing every
 *    pair — O(n²). If I sort by start time, then any interval that overlaps the
 *    one I'm currently building must come immediately next, because everything
 *    after it starts even later. So one pass after the sort: O(n log n),
 *    dominated by the sort."
 *
 * COMPLEXITY: O(n log n) time, O(n) space for the output.
 *
 * THE `Math.max` IS LOAD-BEARING. When extending the open interval, the new end
 * is `max(currentEnd, incomingEnd)` — not `incomingEnd`. Merging [1,10] with
 * [2,3] must give [1,10]; taking the incoming end shrinks it to [1,3]. This is
 * the most common bug in the problem.
 *
 * `<=` NOT `<` for the overlap test, because touching intervals merge here.
 * That is a spec decision — ask, or state your assumption.
 *
 * MUTATION: `[...intervals].sort(...)` avoids reordering the caller's array.
 * Cheap; say you did it.
 */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged: Interval[] = [[...sorted[0]!] as Interval];

  for (let i = 1; i < sorted.length; i += 1) {
    const [start, end] = sorted[i]!;
    const open = merged[merged.length - 1]!;

    if (start <= open[1]) {
      // Overlapping or touching — extend. max(), never the incoming end.
      open[1] = Math.max(open[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}

/**
 * PROBLEM 3 — Minimum Meeting Rooms
 *
 * THE INSIGHT — say this before any code:
 *   "I don't care which meeting ends, only that one does. So I'll throw away
 *    the pairing entirely: sort all the start times, sort all the end times,
 *    and sweep with two pointers. Each start before the next end needs a new
 *    room; otherwise a room frees up. The running maximum is the answer."
 *
 * COMPLEXITY: O(n log n) time (two sorts), O(n) space.
 *
 * `<` NOT `<=` on the sweep comparison: a meeting starting exactly when another
 * ends reuses the room. That is the "back-to-back" test. If the spec said
 * otherwise you'd flip it — which is why it's worth asking.
 *
 * THE HEAP ALTERNATIVE: sort by start, keep a min-heap of end times; for each
 * meeting, pop every end that is <= its start, then push its own end. The heap
 * size is the rooms in use. Same O(n log n). The two-pointer sweep is simpler
 * to write correctly under time pressure and needs no heap implementation —
 * which in JavaScript you'd have to write yourself (module 10). Offer both,
 * pick the sweep, say why.
 *
 * GENERALISATION worth naming: this is the SWEEP LINE pattern. Convert
 * intervals into +1/-1 events at their endpoints, sort by position, and track a
 * running total. It solves "maximum concurrent X" for any X.
 */
export function minMeetingRooms(intervals: Interval[]): number {
  if (intervals.length === 0) return 0;

  const starts = intervals.map(([start]) => start).sort((a, b) => a - b);
  const ends = intervals.map(([, end]) => end).sort((a, b) => a - b);

  let rooms = 0;
  let peak = 0;
  let endIndex = 0;

  for (const start of starts) {
    // `<` : a meeting starting exactly as another ends reuses the room.
    while (endIndex < ends.length && ends[endIndex]! <= start) {
      rooms -= 1;
      endIndex += 1;
    }

    rooms += 1;
    peak = Math.max(peak, rooms);
  }

  return peak;
}
