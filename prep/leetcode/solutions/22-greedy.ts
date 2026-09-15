/**
 * SOLUTIONS — Greedy
 */

/**
 * PROBLEM 1 — Jump game II
 *
 * COMPLEXITY: O(n) time, O(1) space. The DP formulation is O(n²), so this is a
 * real improvement rather than a stylistic one.
 *
 * NARRATION:
 *   "I think of it as BFS over levels: level k is everything reachable in k
 *    jumps. I sweep the array tracking the end of the current level and the
 *    furthest index anything in it can reach. When I reach the end of a level I
 *    take a jump and the furthest becomes the new boundary. It's optimal by a
 *    'greedy stays ahead' argument — after k jumps I'm at the furthest index
 *    any k jumps could reach, so nothing can beat it."
 *
 * THE LOOP ENDS AT n - 2. Arriving at the final index does not require another
 * jump, and including it makes `currentEnd` advance one time too many. This is
 * the single off-by-one that decides the problem.
 *
 * `farthest` IS COMPUTED ACROSS THE WHOLE LEVEL before it is used. That is why
 * the update comes before the boundary check: every index in the level gets to
 * contribute its reach before the jump is taken.
 *
 * NO QUEUE IS NEEDED even though the reasoning is BFS, because the levels are
 * contiguous index ranges. Recognising when a BFS collapses into two pointers
 * is a genuinely transferable observation.
 *
 * THE EDGE CASE: a single-element array returns 0 without entering the loop —
 * you are already at the end.
 */
export function jump(nums: number[]): number {
  let jumps = 0;
  let currentEnd = 0; // last index of the current BFS level
  let farthest = 0; // furthest index reachable from this level

  for (let i = 0; i < nums.length - 1; i += 1) {
    farthest = Math.max(farthest, i + nums[i]!);

    if (i === currentEnd) {
      jumps += 1; // the level is exhausted — take a jump
      currentEnd = farthest;
    }
  }

  return jumps;
}

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
