/**
 * SOLUTIONS — Greedy
 */

/**
 * PROBLEM 2 — Gas station
 *
 * COMPLEXITY: O(n) time, O(1) space, one pass.
 *
 * NARRATION:
 *   "Two independent facts. First, a solution exists exactly when total gas is
 *    at least total cost — that settles possibility on its own. Second, if the
 *    tank goes negative somewhere between my current candidate start and
 *    station i, then no station in between works either, because each of them
 *    would set out with less fuel than I arrived with. So I skip the whole
 *    stretch and restart the candidate at i + 1. One pass."
 *
 * THE LEMMA IS THE ANSWER TO "WHY IS THIS GREEDY VALID?" — and you will be
 * asked. Arriving at an intermediate station with a non-negative tank and still
 * failing means starting there with an empty tank fails too. Every candidate in
 * the failed stretch is therefore eliminated by the single failure.
 *
 * THE TWO SUMS DO DIFFERENT JOBS: `total` answers "is it possible at all" over
 * the whole circle, while `tank` tests the current candidate and is reset on
 * failure. Conflating them is the usual bug.
 *
 * WHY THE FINAL CANDIDATE IS CORRECT WITHOUT RE-VERIFYING: if a solution exists
 * at all (total >= 0), and every station before `start` has been eliminated,
 * then `start` must be it. No second pass and no wraparound simulation is
 * needed — worth stating, because the code looks like it is missing a check.
 *
 * THE UNIQUENESS in the problem statement is load-bearing. With ties permitted
 * this returns the first valid start, which is a fine answer but a different
 * one; say which you are giving.
 */
export function canCompleteCircuit(gas: number[], cost: number[]): number {
  let total = 0; // feasibility over the whole circle
  let tank = 0; // fuel since the current candidate start
  let start = 0;

  for (let i = 0; i < gas.length; i += 1) {
    const net = gas[i]! - cost[i]!;
    total += net;
    tank += net;

    if (tank < 0) {
      start = i + 1; // nothing in [start, i] can work — skip the lot
      tank = 0;
    }
  }

  return total >= 0 ? start : -1;
}
