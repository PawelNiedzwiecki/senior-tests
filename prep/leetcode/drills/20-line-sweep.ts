/**
 * PATTERN 20 — Line sweep / event-based                 [LeetCode 1109, 218]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 20
 *
 * THE PATTERN
 * Stop thinking about intervals as objects and start thinking about their
 * ENDPOINTS as events on a timeline. Sort the events, sweep left to right, and
 * maintain a running state. "What is true at every point" becomes "what changes
 * at each event", which is a far smaller question.
 *
 * THE TELL
 *   "maximum concurrent X"  ·  "at any point in time"  ·  "how many overlap"
 *   "minimum rooms / servers / platforms"  ·  "the visible outline"
 *   any range update applied many times, then read once
 *
 * TWO DISTINCT TOOLS LIVE UNDER THIS HEADING and they are worth separating:
 *
 *   A. THE DIFFERENCE ARRAY — when the domain is small integers and you only
 *      need the final state. `delta[start] += v; delta[end + 1] -= v` for each
 *      range, then one prefix-sum pass reconstructs everything. Turns m range
 *      updates from O(m × n) into O(m + n). Problem 1.
 *
 *   B. THE EVENT SWEEP WITH A HEAP — when the domain is large or continuous
 *      and you need the state AT each event. Sort the endpoints, and keep the
 *      active set in a heap so the current maximum (or count) is O(1). Problem
 *      2, and also "minimum meeting rooms".
 *
 * THE SORTING RULE THAT DECIDES CORRECTNESS: when a start and an end coincide,
 * which goes first? If intervals that merely touch should count as overlapping,
 * process the START first; if not, the END. Say which convention you chose out
 * loud — this single tie-break is where most line-sweep bugs live.
 *
 * COST — O(n log n) dominated by the sort, or O(n + domain) for a difference
 * array, which is linear when the domain is bounded.
 *
 * THE CONNECTION WORTH NAMING: a difference array is the INVERSE of a prefix
 * sum (§ 4). Prefix sums turn point updates into range queries; difference
 * arrays turn range updates into point queries. Recognising them as a pair is
 * what lets you pick the right one instantly.
 */

/**
 * PROBLEM 1 — Corporate flight bookings                        [LeetCode 1109]
 * ────────────────────────────────────────────────────────────────────────────
 * There are `n` flights labelled 1..n. Each booking `[first, last, seats]`
 * reserves `seats` on every flight from `first` to `last` INCLUSIVE. Return an
 * array of the total seats booked on each flight.
 *
 *   corpFlightBookings([[1,2,10], [2,3,20], [2,5,25]], 5)  → [10, 55, 45, 25, 25]
 *   corpFlightBookings([[1,2,10], [2,2,15]], 2)            → [10, 25]
 *
 * TARGET: O(bookings + n) time, O(n) space. The naive loop-over-each-range
 *       solution is O(bookings × n) and is what this problem exists to beat.
 *
 * THE DIFFERENCE ARRAY: instead of adding `seats` to every flight in the range,
 *       record only the two moments the total CHANGES:
 *           delta[first - 1] += seats       (from here on, add seats)
 *           delta[last]      -= seats       (from here on, stop adding)
 *       Then a single running sum over `delta` reproduces every flight's total.
 *
 * THE INDEX SHIFT is the whole bug surface here. Flights are 1-indexed and the
 *       array is 0-indexed, and the "-=" belongs at `last` in 0-indexed terms
 *       (which is `last + 1` in 1-indexed terms, i.e. just past the end). Write
 *       one tiny example out by hand before coding.
 *
 * SIZE THE ARRAY AT n + 1 so that a booking ending at the last flight can
 *       subtract one past the end without a bounds check — the same
 *       leading/trailing-padding idea as prefix sums.
 *
 * SAY THE GENERALISATION: this is how you apply thousands of range updates
 *       cheaply when all the reads happen at the end. If reads and writes were
 *       interleaved you would need a Fenwick tree instead.
 */
export function corpFlightBookings(_bookings: Array<[number, number, number]>, _n: number): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — The skyline problem                               [LeetCode 218]
 * ────────────────────────────────────────────────────────────────────────────
 * Each building is `[left, right, height]`. Return the skyline as a list of
 * "key points" `[x, height]` — the left endpoint of each horizontal segment of
 * the outline, sorted by x. The last point has height 0, where the rightmost
 * building ends. Consecutive points must never repeat a height.
 *
 *   getSkyline([[2,9,10], [3,7,15], [5,12,12], [15,20,10], [19,24,8]])
 *       → [[2,10], [3,15], [7,12], [12,0], [15,10], [20,8], [24,0]]
 *   getSkyline([[0,2,3], [2,5,3]])  → [[0,3], [5,0]]
 *
 * TARGET: O(n log n) time, O(n) space.
 *
 * THIS IS A GENUINELY HARD PROBLEM and it is here because it is the purest
 *       version of the pattern: the answer is entirely "what changes, and
 *       where".
 *
 * THE KEY INSIGHT: the skyline only changes at a building's left or right edge,
 *       and at any x the visible height is the MAXIMUM over all buildings
 *       currently active. So sweep the edges and keep the active heights in a
 *       max-heap.
 *
 * THE EVENTS: emit `[left, -height, right]` for a start and `[right, 0, 0]` for
 *       an end. Sorting by x, then by the second field ascending, gives exactly
 *       the right tie-breaks for free:
 *         · at equal x, STARTS come before ENDS (so touching buildings do not
 *           produce a spurious drop to 0)
 *         · among starts, the TALLER one comes first (negative heights sort
 *           ascending)
 *       Encoding tie-breaks in the sort key rather than in branches is the
 *       trick that makes this tractable.
 *
 * LAZY DELETION: a binary heap cannot remove an arbitrary element. Store
 *       `[height, endX]` and, at each event, discard from the top while the top
 *       entry's `endX <= x`. Stale entries below the top are harmless, because
 *       they can only ever be popped once they reach it.
 *
 * EMIT ONLY ON CHANGE: after processing an event, compare the current maximum
 *       height with the last emitted one and push a point only if it differs.
 *       That single check is what satisfies "no two consecutive equal heights"
 *       and what makes the final `[x, 0]` appear exactly once.
 */
export function getSkyline(_buildings: Array<[number, number, number]>): Array<[number, number]> {
  throw new Error('Not implemented');
}
