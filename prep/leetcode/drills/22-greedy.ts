/**
 * PATTERN 22 — Greedy (without sorting)                   [LeetCode 45, 134]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 22
 *
 * THE PATTERN
 * Make the locally best choice at each step and never revisit it. That is
 * trivial to write and easy to get wrong — greedy is only correct when the
 * problem has a specific structure, and the interview is really about whether
 * you can tell the difference.
 *
 * THE TELL
 *   "minimum number of steps / jumps / coins"  ·  "is it possible at all"
 *   "maximum profit with unlimited transactions"  ·  a DP formulation whose
 *   table turns out to only ever need its previous entry
 *
 * HOW TO KNOW GREEDY IS VALID — one of these two arguments, stated explicitly:
 *   · EXCHANGE ARGUMENT — take any optimal solution that disagrees with the
 *     greedy choice; show you can swap in the greedy choice without making it
 *     worse. (This is what justifies earliest-finishing-interval scheduling.)
 *   · GREEDY STAYS AHEAD — show that after every step, the greedy solution is
 *     at least as far along as any other. (This is what justifies problem 1
 *     below.)
 *
 * If you cannot produce either argument, say so and reach for DP. "Greedy feels
 * right" is how candidates lose this question — the classic counterexample is
 * making change for 30 with coins {25, 10, 1}: greedy takes 25 and needs six
 * more coins; the optimum is three tens.
 *
 * WHAT IT BUYS: greedy usually turns an O(n²) DP into a single O(n) pass with
 * O(1) memory. That is a large win when it is valid, which is exactly why the
 * validity argument carries the weight.
 *
 * THE SHAPE, when it works: one pass, a couple of running variables, no
 * auxiliary structure at all. If your greedy solution needs a data structure,
 * be suspicious — you may be reconstructing a DP table by accident.
 *
 * COST — O(n) time, O(1) space, almost always.
 */

/**
 * PROBLEM 1 — Jump game II                                        [LeetCode 45]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums[i]` is the maximum jump length from index i. Starting at index 0,
 * return the MINIMUM number of jumps needed to reach the last index. The input
 * always permits reaching it.
 *
 *   jump([2, 3, 1, 1, 4])  → 2      (0 → 1, then 1 → 4)
 *   jump([2, 3, 0, 1, 4])  → 2
 *   jump([0])              → 0      (already at the end)
 *
 * TARGET: O(n) time, O(1) space. The DP — `dp[i]` = fewest jumps to reach i —
 *       is O(n²) and is a perfectly good first answer to state and then beat.
 *
 * THE REFRAME THAT MAKES IT GREEDY: think of it as BFS over levels. Everything
 *       reachable in one jump is level 1, everything reachable from those in
 *       one more is level 2, and so on. The answer is the level containing the
 *       last index — and you can sweep those levels with two indices instead of
 *       an actual queue.
 *
 * THE THREE VARIABLES:
 *       · `jumps`        how many levels deep you are
 *       · `currentEnd`   the last index of the current level
 *       · `farthest`     the furthest index reachable from anything seen so far
 *       When `i` reaches `currentEnd`, the level is exhausted: take a jump and
 *       set `currentEnd = farthest`.
 *
 * THE LOOP STOPS AT n - 2, not n - 1. Standing on the last index never requires
 *       another jump, and looping to the end adds a spurious one. This is the
 *       off-by-one the problem is built around.
 *
 * WHY GREEDY IS VALID HERE — "greedy stays ahead": after k jumps, this method
 *       has reached the furthest index reachable in k jumps, so no other
 *       strategy can arrive earlier. Say that sentence; it is the answer to
 *       "how do you know this is optimal?"
 */
export function jump(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Gas station                                        [LeetCode 134]
 * ────────────────────────────────────────────────────────────────────────────
 * Stations are arranged in a circle. `gas[i]` is the fuel available at station
 * i, and `cost[i]` the fuel needed to travel from i to i + 1. Starting with an
 * empty tank, return the index of the station from which you can complete the
 * whole circuit, or -1 if there is none. If one exists it is unique.
 *
 *   canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])  → 3
 *   canCompleteCircuit([2,3,4],     [3,4,3])      → -1
 *   canCompleteCircuit([5],         [4])          → 0
 *
 * TARGET: O(n) time, O(1) space, ONE pass. Trying every start is O(n²).
 *
 * THE TWO FACTS, and together they are the entire solution:
 *
 *   1. FEASIBILITY — if the total gas is less than the total cost, no start
 *      works. If it is at least equal, some start does. So the answer to "is it
 *      possible?" and the answer to "where?" can be computed separately.
 *
 *   2. THE KEY LEMMA — if you run out of fuel somewhere between station `start`
 *      and station `i`, then NO STATION IN BETWEEN can be a valid start either.
 *      Any of them would begin with less fuel than you arrived with. So skip
 *      past all of them and restart at `i + 1`. That is what collapses O(n²) to
 *      one pass.
 *
 * BE READY TO PROVE THE LEMMA, because it is the question: arriving at station
 *       j from a valid earlier start means you had a non-negative tank on
 *       arrival. Starting AT j instead means starting with zero. If you could
 *       not get past the failure point with a head start, you certainly cannot
 *       with none.
 *
 * THE IMPLEMENTATION is two running sums and a candidate index — no array, no
 *       structure. If your solution needs either, reread the lemma.
 *
 * THE FOLLOW-UP TO PRE-EMPT: with ties allowed — several valid starts — this
 *       returns the first. The uniqueness in the problem statement is doing
 *       real work, and noticing that is a good sign.
 */
export function canCompleteCircuit(_gas: number[], _cost: number[]): number {
  throw new Error('Not implemented');
}
