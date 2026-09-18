/**
 * SOLUTIONS — Sorting + greedy (intervals)
 */

export type Interval = [start: number, end: number];

/**
 * EXAM 1 — Merge intervals
 *
 * COMPLEXITY: O(n log n) time for the sort, O(n) space for the output.
 *
 * NARRATION:
 *   "Sort by start, because I'm building spans and need adjacency. Then one
 *    sweep: if the next interval starts at or before the end of the span I'm
 *    currently building, it extends it; otherwise the span is finished and a
 *    new one begins."
 *
 * `Math.max` ON THE EXTENSION is the detail. `[1, 10]` followed by `[2, 3]`
 * must stay `[1, 10]`; assigning the end unconditionally shrinks it. Nesting
 * is the case interviewers reach for.
 *
 * COMPARE AGAINST THE LAST EMITTED interval, not the previous input one —
 * after a merge the running span is wider than either input.
 *
 * TOUCHING ENDPOINTS merge here because the test is `<=`. Which behaviour is
 * wanted is a question to ask, not to assume; flipping it is one character.
 *
 * SORT A COPY. Mutating an argument's order is a side effect the caller did
 * not ask for — cheap to avoid, and worth saying out loud.
 */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out: Interval[] = [];

  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last !== undefined && start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }

  return out;
}

/**
 * EXAM 2 — Minimum meeting rooms
 *
 * COMPLEXITY: O(n log n) time — two sorts — and O(n) space.
 *
 * NARRATION:
 *   "The rooms needed is the maximum number of meetings live at one instant,
 *    so the pairing between starts and ends doesn't matter. I sort the starts
 *    and the ends independently and walk them: each start before the next end
 *    opens a room, each end passed frees one. The high-water mark is the
 *    answer."
 *
 * DECOUPLING THE ENDPOINTS is the insight, and it surprises people — the two
 * sorted arrays no longer describe the original meetings, and that is fine,
 * because occupancy only depends on the multiset of events.
 *
 * `starts[i] >= ends[j]` FREES FIRST, which encodes "a meeting ending at t and
 * one starting at t share a room". If the requirement were the opposite, this
 * comparison is the one character that changes.
 *
 * THE HEAP VARIANT — push end times into a min-heap, pop while the earliest
 * end is no later than the current start, answer is the peak heap size — is
 * the same algorithm, and worth naming because it generalises to "which room
 * is each meeting in".
 */
export function minMeetingRooms(intervals: Interval[]): number {
  const starts = intervals.map(([s]) => s).sort((a, b) => a - b);
  const ends = intervals.map(([, e]) => e).sort((a, b) => a - b);

  let rooms = 0;
  let peak = 0;
  let j = 0;

  for (let i = 0; i < starts.length; i += 1) {
    while (j < ends.length && ends[j]! <= starts[i]!) {
      rooms -= 1; // a meeting has finished; its room is free
      j += 1;
    }
    rooms += 1;
    peak = Math.max(peak, rooms);
  }

  return peak;
}

/**
 * EXAM 3 — Minimum arrows to burst balloons
 *
 * COMPLEXITY: O(n log n) time, O(1) space beyond the sort.
 *
 * NARRATION:
 *   "Sort by END and shoot at the end of the first balloon still unburst. That
 *    arrow is optimal by an exchange argument: in any optimal solution, moving
 *    the first arrow to this x still bursts everything it burst before,
 *    because every balloon it hit must span this earliest ending point. Then
 *    skip everything that arrow covers and repeat."
 *
 * SORT BY START IS THE TRAP. It looks reasonable and gives 3 on the first
 * example instead of 2 — a long early balloon anchors an arrow in the wrong
 * place. If you catch yourself sorting by start on a "how few" problem, stop
 * and ask which end the greedy choice lives on.
 *
 * COVERAGE TEST: a balloon is burst iff `start <= arrow`. Its own end is
 * irrelevant once its start is covered, which is why one comparison suffices.
 *
 * "AT MOST HOW MANY NON-OVERLAPPING" (LeetCode 435) is the same sort, the same
 * sweep, and the complementary count. Recognising them as one problem is the
 * point of the pattern.
 */
export function findMinArrowShots(points: Interval[]): number {
  if (points.length === 0) return 0;

  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let arrowAt = sorted[0]![1];

  for (const [start, end] of sorted) {
    if (start > arrowAt) {
      arrows += 1;
      arrowAt = end; // the earliest ending among what remains
    }
  }

  return arrows;
}

/**
 * EXAM 4 — Interval list intersections
 *
 * COMPLEXITY: O(m + n) time, O(1) space beyond the output. No sort — both
 * inputs are given sorted, and paying for a sort here would be a tell that you
 * did not read the constraints.
 *
 * NARRATION:
 *   "Two pointers walking two sorted lists. The overlap of the current pair is
 *    [max(starts), min(ends)], which is real when max(starts) <= min(ends).
 *    Then I advance whichever interval ends first — it can't reach anything
 *    further along in the other list, so it's done."
 *
 * THE DISCARD RULE IS THE ALGORITHM. Advancing the one that ends LAST would
 * skip intersections; advancing both would skip them too. One sentence of
 * justification — "the earlier end cannot meet anything later" — is what makes
 * this a two-pointer solution rather than a guess.
 *
 * TOUCHING COUNTS because the test is `<=`, producing single-point intervals
 * like [5, 5]. Ask whether that is wanted; it is the kind of clarification
 * interviewers like to be asked for.
 */
export function intervalIntersection(a: Interval[], b: Interval[]): Interval[] {
  const out: Interval[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    const start = Math.max(a[i]![0], b[j]![0]);
    const end = Math.min(a[i]![1], b[j]![1]);
    if (start <= end) out.push([start, end]);

    if (a[i]![1] < b[j]![1]) i += 1; // a's interval is exhausted
    else j += 1;
  }

  return out;
}

/**
 * EXAM 5 — Car pooling
 *
 * COMPLEXITY: O(n + maxLocation) time and O(maxLocation) space with the
 * difference array; O(n log n) and O(n) if you sort events instead, which is
 * the better choice when coordinates are large or sparse.
 *
 * NARRATION:
 *   "I don't need to know which trips overlap, only how full the car is at
 *    each point — so I turn each trip into two events, +passengers where they
 *    board and -passengers where they leave, and prefix-sum along the road.
 *    If the running total ever exceeds capacity, it fails."
 *
 * DROP-OFF BEFORE PICK-UP AT THE SAME POINT falls out for free: both events
 * land on the same index of the difference array and cancel before the running
 * total is tested. With a sorted event list you would have to order -1 events
 * ahead of +1 events explicitly — the same rule, stated rather than inherited.
 *
 * THIS IS THE INTERVAL PATTERN'S OTHER FACE: "which overlap" → sort the
 * intervals; "how many overlap at once" → events. Recognising which question
 * is being asked is most of the work; see also § 20, line sweep.
 */
export function carPooling(trips: Array<[number, number, number]>, capacity: number): boolean {
  if (trips.length === 0) return true;

  const last = Math.max(...trips.map(([, , to]) => to));
  const diff = new Array<number>(last + 2).fill(0);

  for (const [passengers, from, to] of trips) {
    diff[from] = diff[from]! + passengers;
    diff[to] = diff[to]! - passengers; // they leave AT `to`, freeing the seats
  }

  let aboard = 0;
  for (const delta of diff) {
    aboard += delta;
    if (aboard > capacity) return false;
  }

  return true;
}
