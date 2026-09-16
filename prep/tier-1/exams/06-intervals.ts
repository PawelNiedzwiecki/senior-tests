/**
 * TIER 1 · PATTERN 06 — Sorting + greedy (intervals)
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 75 min total    Catalogue: ../../patterns/CATALOGUE.md § 6
 *
 * THE PATTERN
 * Sort the intervals, then sweep them once holding a tiny amount of state.
 * Sorting is what turns "does this overlap anything" — a quadratic question —
 * into "does this overlap the previous one", which is O(1).
 *
 * THE TELL
 *   "intervals" · "meetings" · "ranges" · "overlap" · "merge" · "book a room"
 *   anything with a start and an end on a line
 *
 * THE ONE DECISION THAT MATTERS: SORT BY START, OR BY END?
 *   BY START — you are BUILDING something that spans: merging, inserting,
 *              intersecting, counting rooms. You need adjacency.
 *   BY END   — you are KEEPING AS MANY AS POSSIBLE or paying as little as
 *              possible: non-overlapping selection, minimum arrows, scheduling
 *              the most jobs. Finishing earliest leaves the most room for what
 *              follows, and that exchange argument is the proof.
 * Choosing wrongly still produces plausible code that fails on one test.
 * Say which you chose and why before you write the comparator.
 *
 * OVERLAP, DEFINED ONCE: `a` and `b` overlap iff `a.start <= b.end && b.start
 * <= a.end`. Whether touching endpoints ([1,2] and [2,3]) count as overlapping
 * is a CLARIFYING QUESTION, not an assumption — ask it.
 *
 * TEMPLATE (merge)
 *   intervals.sort((a, b) => a[0] - b[0]);
 *   for (const [start, end] of intervals) {
 *     const last = out[out.length - 1];
 *     if (last && start <= last[1]) last[1] = Math.max(last[1], end);
 *     else out.push([start, end]);
 *   }
 *
 * COST — O(n log n), dominated by the sort; the sweep is O(n).
 *
 * THE NEIGHBOUR: when the question is "how many are active at once" rather
 * than "which ones overlap", stop thinking in intervals and split each one
 * into a +1 event and a -1 event — that is the line sweep (exam 5, and
 * CATALOGUE § 20).
 *
 * THE SENTENCE WORTH SAYING
 *   "Sorting by end and taking greedily is optimal by an exchange argument:
 *    swapping in the earliest-finishing interval never reduces how many fit
 *    afterwards."
 */

export type Interval = [start: number, end: number];

/**
 * EXAM 1 — Merge intervals                                      [LeetCode 56]
 * ────────────────────────────────────────────────────────────────────────────
 * Merge every overlapping interval and return the result sorted by start.
 * Touching intervals ([1, 4] and [4, 5]) DO merge here.
 *
 *   mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])  → [[1, 6], [8, 10], [15, 18]]
 *   mergeIntervals([[1, 4], [4, 5]])                     → [[1, 5]]
 *
 * TARGET: O(n log n) time, O(n) space for the output.
 *
 * HINT: sort BY START — you are building spans, so you need adjacency. Then
 *       one sweep comparing each interval to the LAST ONE YOU EMITTED, not to
 *       the previous input.
 *
 *       The detail that catches people: extend with
 *       `Math.max(last.end, current.end)`. A fully contained interval
 *       ([1, 10] then [2, 3]) would otherwise shrink the span.
 */
export function mergeIntervals(_intervals: Interval[]): Interval[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Minimum meeting rooms                               [LeetCode 253]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the smallest number of rooms needed to hold every meeting. A meeting
 * ending at time t and another starting at t can share a room.
 *
 *   minMeetingRooms([[0, 30], [5, 10], [15, 20]])  → 2
 *   minMeetingRooms([[7, 10], [2, 4]])             → 1
 *   minMeetingRooms([])                            → 0
 *
 * TARGET: O(n log n) time.
 *
 * HINT: the answer is the MAXIMUM NUMBER OVERLAPPING AT ANY INSTANT, and the
 *       intervals themselves are a distraction. Two equivalent ways to see it:
 *
 *       · sort the starts and the ends into two separate arrays and walk them
 *         with two pointers — a start before the next end needs a new room;
 *       · or make +1/-1 events and prefix-sum them (the line sweep).
 *
 *       Either way, process an END BEFORE A START at the same timestamp —
 *       that is exactly the "can share a room" rule, and it is the single
 *       assertion this exam checks.
 */
export function minMeetingRooms(_intervals: Interval[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Minimum arrows to burst balloons                    [LeetCode 452]
 * ────────────────────────────────────────────────────────────────────────────
 * Each balloon spans [start, end] on the x-axis. An arrow shot at x bursts
 * every balloon whose span contains x, endpoints included. Return the minimum
 * number of arrows needed to burst them all.
 *
 *   findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]])  → 2
 *   findMinArrowShots([[1, 2], [3, 4], [5, 6], [7, 8]])     → 4
 *   findMinArrowShots([[1, 2], [2, 3], [3, 4], [4, 5]])     → 2
 *
 * TARGET: O(n log n) time, O(1) space beyond the sort.
 *
 * HINT: sort BY END, and shoot at the end of the first balloon still
 *       unburst — the earliest possible ending is the shot that covers the
 *       most of what follows. Then skip every balloon that starts at or before
 *       that arrow.
 *
 *       The exchange argument is the answer: any optimal solution can have its
 *       first arrow moved to this position without bursting fewer balloons.
 *       Sorting by start here is the classic wrong turn — it produces an
 *       answer, and the answer is wrong on the first example.
 */
export function findMinArrowShots(_points: Interval[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Interval list intersections                         [LeetCode 986]
 * ────────────────────────────────────────────────────────────────────────────
 * `a` and `b` are each sorted and internally disjoint. Return every
 * intersection between them, sorted. Touching intervals intersect in a single
 * point ([1, 3] ∩ [3, 5] = [3, 3]) and that counts.
 *
 *   intervalIntersection([[0, 2], [5, 10]], [[1, 5], [8, 12]])
 *     → [[1, 2], [5, 5], [8, 10]]
 *   intervalIntersection([[1, 3]], [])  → []
 *
 * TARGET: O(m + n) time — no sort needed, both inputs are already sorted.
 *
 * HINT: the PARALLEL two-pointer shape. The intersection of the two current
 *       intervals is `[max(starts), min(ends)]`, which is non-empty exactly
 *       when `max(starts) <= min(ends)`. Emit it if it is.
 *
 *       Then advance whichever interval ENDS FIRST — it cannot intersect
 *       anything further along in the other list, so it is finished. That
 *       discard rule is the whole algorithm; getting it backwards loops or
 *       drops matches.
 */
export function intervalIntersection(_a: Interval[], _b: Interval[]): Interval[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Car pooling                                        [LeetCode 1094]
 * ────────────────────────────────────────────────────────────────────────────
 * Each trip is `[passengers, from, to]`: that many people board at `from` and
 * leave at `to`. The car only drives east and starts empty. Return whether
 * every trip fits within `capacity`.
 *
 *   carPooling([[2, 1, 5], [3, 3, 7]], 4)  → false
 *   carPooling([[2, 1, 5], [3, 3, 7]], 5)  → true
 *   carPooling([[2, 1, 5], [3, 5, 7]], 3)  → true   (the first trip ends as the second starts)
 *
 * TARGET: O(n + maxLocation) with a difference array, or O(n log n) sorting
 * events.
 *
 * HINT: this is the interval pattern's other face — you do not care WHICH
 *       trips overlap, only how many passengers are aboard at each point. So
 *       stop thinking in intervals: `+passengers` at `from`, `-passengers` at
 *       `to`, then sweep and watch the running total.
 *
 *       Dropping off at `to` happens BEFORE picking up at `to`, which the
 *       difference array gives you for free — the two cancel at the same
 *       index. That is why example 3 fits in a 3-seat car.
 */
export function carPooling(_trips: Array<[number, number, number]>, _capacity: number): boolean {
  throw new Error('Not implemented');
}
