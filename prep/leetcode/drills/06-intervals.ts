/**
 * PATTERN 06 — Sorting + greedy on intervals              [LeetCode 435, 57]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 6
 *
 * THE PATTERN
 * Sort the intervals, then make one irreversible decision per interval as you
 * sweep left to right. The whole skill is knowing WHICH KEY to sort by, because
 * the key encodes the greedy choice:
 *
 *     sort by START  → merging, inserting, "do any overlap?"
 *     sort by END    → fitting the most intervals in ("how many can I keep?")
 *
 * WHY SORT BY END FOR SCHEDULING — the exchange argument, which is the thing
 * interviewers actually want to hear:
 *   "Taking the interval that finishes earliest leaves the most room for
 *    everything after it. Any optimal solution that picks something else can be
 *    rewritten to pick this one without getting worse, so greedy is optimal."
 *
 * THE OVERLAP TEST, worth having reflexively:
 *     a and b overlap  ⟺  a.start < b.end && b.start < a.end
 *   Whether touching endpoints ([1,2] and [2,3]) count as overlapping is a
 *   PROBLEM-SPECIFIC decision — ask, and say which convention you are using.
 *
 * COST — O(n log n) dominated by the sort, O(1) extra space beyond the output.
 * If the input is already sorted, say so: the problem drops to O(n).
 */
export type Interval = [start: number, end: number];

/**
 * PROBLEM 1 — Non-overlapping intervals                          [LeetCode 435]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the MINIMUM number of intervals you must remove so that the rest do
 * not overlap. Intervals that merely touch ([1,2] and [2,3]) do NOT overlap.
 *
 *   eraseOverlapIntervals([[1,2], [2,3], [3,4], [1,3]])  → 1   (remove [1,3])
 *   eraseOverlapIntervals([[1,2], [1,2], [1,2]])         → 2
 *   eraseOverlapIntervals([[1,2], [2,3]])                → 0
 *
 * TARGET: O(n log n) time, O(1) extra space.
 *
 * THE REFRAME: "remove the fewest" is the same as "KEEP THE MOST", which is the
 *       classic activity-selection problem. Flip it — minimisation problems of
 *       this shape are almost always easier to reason about as maximisation.
 *
 * HINT: sort by END. Walk through, keeping an interval whenever its start is
 *       >= the end of the last one you kept. The answer is
 *       `total - kept`.
 *
 * WHY NOT SORT BY START: consider [[1,100], [2,3], [4,5]]. Sorting by start
 *       tempts you to keep [1,100] first, which blocks both of the others. The
 *       earliest-ending interval is the one that costs the least future room.
 *       Be ready with a counterexample like this — an interviewer will ask.
 */
export function eraseOverlapIntervals(_intervals: Interval[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Insert interval                                     [LeetCode 57]
 * ────────────────────────────────────────────────────────────────────────────
 * `intervals` is already sorted by start and contains no overlaps. Insert
 * `newInterval`, merging where needed, and return the result — still sorted.
 *
 *   insertInterval([[1,3], [6,9]], [2,5])                  → [[1,5], [6,9]]
 *   insertInterval([[1,2], [3,5], [6,7], [8,10], [12,16]], [4,8])
 *                                                          → [[1,2], [3,10], [12,16]]
 *   insertInterval([], [5,7])                              → [[5,7]]
 *
 * TARGET: O(n) time — no sort, because the input is already ordered. Spotting
 *       that the sort is unnecessary is most of the point of this problem.
 *
 * THE THREE-PHASE SHAPE, and it is worth writing as three explicit loops rather
 *       than one clever loop with branches:
 *         1. copy every interval that ENDS BEFORE the new one starts
 *         2. absorb every interval that overlaps, widening the new one:
 *              start = min(start, current.start), end = max(end, current.end)
 *            then push the widened interval ONCE
 *         3. copy the rest
 *
 * TOUCHING COUNTS AS OVERLAPPING HERE: [1,3] and [3,5] merge into [1,5],
 *       because these are closed intervals. That is why phase 1's test is
 *       `current.end < newStart` and not `<=`. This single comparison is the
 *       most common failure in this problem.
 */
export function insertInterval(_intervals: Interval[], _newInterval: Interval): Interval[] {
  throw new Error('Not implemented');
}
