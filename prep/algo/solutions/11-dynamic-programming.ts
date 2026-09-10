/**
 * SOLUTIONS 11 — Dynamic programming
 */

/**
 * PROBLEM 1 — Climbing Stairs
 *
 * THE FOUR QUESTIONS, answered out loud:
 *   STATE:      ways(i) = number of distinct ways to reach step i
 *   RECURRENCE: ways(i) = ways(i-1) + ways(i-2)  — the last move was 1 or 2
 *   BASE:       ways(0) = 1 (the empty climb), ways(1) = 1
 *   ORDER:      ascending
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * SAY THE NAIVE COST FIRST: plain recursion recomputes the same subtrees and is
 * O(2ⁿ) — climbStairs(40) would take minutes. Memoising makes it O(n) time and
 * O(n) space; noticing that only the last TWO values are ever read drops it to
 * O(1) space. Walking that ladder — exponential → memoised → two variables — is
 * a compact way to show optimisation thinking.
 *
 * ways(0) = 1 IS A REAL DECISION, not a fudge: there is exactly one way to
 * climb no stairs, namely doing nothing. Setting it to 0 breaks everything
 * above. Worth stating as an assumption.
 */
export function climbStairs(n: number): number {
  if (n <= 1) return 1;

  let twoBack = 1; // ways(0)
  let oneBack = 1; // ways(1)

  for (let step = 2; step <= n; step += 1) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }

  return oneBack;
}

/**
 * PROBLEM 2 — House Robber
 *
 * THE FOUR QUESTIONS:
 *   STATE:      best(i) = maximum takeable considering houses 0..i
 *   RECURRENCE: best(i) = max(best(i-1),            // skip house i
 *                             best(i-2) + nums[i])  // take it
 *   BASE:       best(-1) = 0, best(0) = nums[0]
 *   ORDER:      left to right
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * THE GREEDY TRAP, worth demonstrating: picking the largest values first gives
 * 7 + 3 = 10 on [2, 7, 9, 3, 1], while the optimum is 2 + 9 + 1 = 12. A local
 * choice forecloses a better global one, which is precisely the condition that
 * makes this DP rather than greedy. Saying that sentence is the answer to "how
 * did you know it was DP?".
 *
 * TWO ROLLING VARIABLES again, since only the previous two states are read.
 *
 * THE FOLLOW-UP: houses in a CIRCLE (first and last are now adjacent). Answer:
 * run this twice — once excluding the last house, once excluding the first —
 * and take the max. That reuse is the expected answer, not a new algorithm.
 */
export function houseRobber(nums: number[]): number {
  let skipCurrent = 0; // best(i-1)
  let takeCurrent = 0; // best(i-2)

  for (const value of nums) {
    const best = Math.max(skipCurrent, takeCurrent + value);
    takeCurrent = skipCurrent;
    skipCurrent = best;
  }

  return skipCurrent;
}

/**
 * PROBLEM 3 — Coin Change
 *
 * THE FOUR QUESTIONS:
 *   STATE:      dp[a] = fewest coins summing exactly to a
 *   RECURRENCE: dp[a] = 1 + min(dp[a - c]) over coins c <= a
 *   BASE:       dp[0] = 0
 *   ORDER:      ascending — dp[a] only needs strictly smaller amounts
 *
 * COMPLEXITY: O(amount × coins) time, O(amount) space.
 *
 * WHY NOT GREEDY — lead with this:
 *   "Greedy — take the largest coin that fits — is wrong here. With [1, 3, 4]
 *    and 6 it takes 4, then 1, then 1: three coins. The optimum is 3 + 3, two
 *    coins. Greedy is only correct for 'canonical' coin systems, which most
 *    real currencies happen to be — which is exactly why the intuition misleads
 *    people."
 * That example is the single most useful thing to have memorised in this module.
 *
 * `Infinity` AS THE SENTINEL means the `min` works with no special-casing, and
 * an unreachable amount stays Infinity so the final conversion to -1 is one
 * line. The `dp[a - coin] !== Infinity` guard stops `Infinity + 1` propagating
 * a bogus finite-looking value.
 *
 * FOLLOW-UPS: "how MANY ways to make the amount" swaps min for a sum and needs
 * the loop order flipped (coins outermost) to avoid counting permutations; and
 * "which coins?" needs a parent array to reconstruct the path. Both are common.
 */
export function coinChange(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(Number.POSITIVE_INFINITY);
  dp[0] = 0; // no coins needed for nothing

  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) {
      if (coin > a) continue;
      const rest = dp[a - coin]!;
      if (rest === Number.POSITIVE_INFINITY) continue; // unreachable
      dp[a] = Math.min(dp[a]!, rest + 1);
    }
  }

  return dp[amount] === Number.POSITIVE_INFINITY ? -1 : dp[amount]!;
}
