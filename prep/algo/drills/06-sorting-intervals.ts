/**
 * MODULE 06 — Sorting, comparators and intervals
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      DIFFICULTY: ●●○○○ (problem 1) / ●●●○○ (2 and 3)
 *
 * THE JAVASCRIPT TRAP YOU MUST KNOW
 *
 *   [10, 9, 1].sort()            → [1, 10, 9]     ← NOT a bug in your code
 *
 * `Array.prototype.sort` with no comparator converts every element to a STRING
 * and sorts lexicographically. '10' < '9' because '1' < '9'. This is the single
 * most common JavaScript interview bug there is, and an interviewer watching you
 * write `.sort()` on numbers is watching to see whether you catch it.
 *
 *   nums.sort((a, b) => a - b)     ascending numbers
 *   nums.sort((a, b) => b - a)     descending numbers
 *   words.sort((a, b) => a.localeCompare(b))   locale-aware strings
 *
 * TWO MORE FACTS WORTH SAYING:
 *   - `sort` MUTATES and returns the same array. `toSorted()` (ES2023) returns
 *     a copy. Mutating an input the caller still owns is a real bug.
 *   - `sort` is stable in every modern engine (spec-required since ES2019), so
 *     equal elements keep their relative order. That is what makes multi-key
 *     sorting by repeated passes work.
 *   - The comparator must return a NUMBER, not a boolean. `(a, b) => a > b` is
 *     wrong and produces engine-dependent nonsense.
 *
 * THE INTERVAL PATTERN
 * Almost every interval problem starts with "sort by start time". Once sorted,
 * you only ever need to compare each interval with the one you are currently
 * accumulating — which turns an O(n²) pairwise comparison into O(n log n)
 * dominated by the sort.
 *
 * RECOGNITION CUES: "merge", "overlap", "meeting rooms", "schedule",
 * "minimum number of X to cover Y".
 */

export type Interval = [start: number, end: number];

/**
 * PROBLEM 1 — Sort numbers correctly, without mutating the input
 * A warm-up that exists purely to make the trap muscle memory.
 *
 *   sortNumbers([10, 9, 1]) → [1, 9, 10]
 *
 * TARGET: O(n log n). Must NOT mutate the argument.
 */
export function sortNumbers(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Merge Intervals
 * Merge all overlapping intervals. Touching counts as overlapping:
 * [1,4] and [4,5] merge into [1,5].
 *
 *   mergeIntervals([[1,3], [2,6], [8,10], [15,18]]) → [[1,6], [8,10], [15,18]]
 *   mergeIntervals([[1,4], [4,5]])                  → [[1,5]]
 *
 * TARGET: O(n log n) time, O(n) space for the output.
 * HINT: sort by start. Then walk: if the current interval starts at or before
 *       the end of the one you are building, extend that end to the MAX of the
 *       two ends; otherwise close it off and start a new one.
 * THE BUG: using `current[1]` instead of `Math.max(...)` when extending. A
 *       fully-contained interval like [1,10] then [2,3] would shrink the end
 *       to 3. That is what the "contained interval" test catches.
 */
export function mergeIntervals(_intervals: Interval[]): Interval[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Minimum Meeting Rooms
 * Given meeting intervals, how many rooms are needed at once? Meetings that
 * touch ([1,5] and [5,8]) do NOT conflict — one ends as the other starts.
 *
 *   minMeetingRooms([[0,30], [5,10], [15,20]]) → 2
 *   minMeetingRooms([[7,10], [2,4]])           → 1
 *
 * TARGET: O(n log n) time, O(n) space.
 * HINT — the elegant solution stops thinking about intervals at all: separate
 *       the start times and the end times, sort each, then sweep. Every start
 *       before the next end needs a new room; every end frees one. Track the
 *       running maximum.
 *       "I'm going to decouple starts from ends — I don't care WHICH meeting
 *        ends, only that one does" is the sentence that shows the insight.
 * ALTERNATIVE: a min-heap of end times (module 10). Same complexity. Know both.
 */
export function minMeetingRooms(_intervals: Interval[]): number {
  throw new Error('Not implemented');
}
