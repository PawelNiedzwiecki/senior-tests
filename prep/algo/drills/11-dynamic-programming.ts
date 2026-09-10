/**
 * MODULE 11 — Dynamic programming (the entry level)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 55 min      DIFFICULTY: ●●●●○
 *
 * WHAT DP ACTUALLY IS
 * Recursion where the same subproblem comes up more than once, so you store the
 * answer instead of recomputing it. That is the whole idea. Two ways to write it:
 *
 *   TOP-DOWN (memoised recursion)  — write the recurrence naturally, cache
 *                                    results in a Map or array. Easier to
 *                                    derive; costs stack depth.
 *   BOTTOM-UP (tabulation)         — fill an array from the base case upward.
 *                                    No recursion, and usually lets you drop to
 *                                    O(1) space when only the last few entries
 *                                    matter.
 *
 * THE FOUR QUESTIONS — answer these OUT LOUD, in order, before writing code.
 * This is the reusable method, and doing it visibly is worth more than the code:
 *   1. What is the STATE? ("dp[i] = the best I can do considering the first i")
 *   2. What is the RECURRENCE? ("dp[i] depends on dp[i-1] and dp[i-2] because…")
 *   3. What are the BASE CASES?
 *   4. What ORDER fills the table so dependencies are ready?
 *
 * HOW TO SPOT IT: "how many ways", "minimum/maximum cost to", "can you reach",
 * plus overlapping subproblems. If subproblems do NOT overlap it is plain
 * recursion or greedy, not DP.
 *
 * GREEDY vs DP — a standard follow-up. Greedy commits to the locally best
 * choice and never reconsiders; it is correct only when the problem has the
 * "greedy choice property". Coin change is the classic counterexample: with
 * coins [1, 3, 4] and amount 6, greedy takes 4+1+1 = 3 coins, but 3+3 = 2 is
 * optimal. Have that example ready — it is the cleanest way to show you know
 * the difference.
 */

/**
 * PROBLEM 1 — Climbing Stairs
 * You climb 1 or 2 steps at a time. How many distinct ways to reach step n?
 *
 *   climbStairs(2) → 2   (1+1, 2)
 *   climbStairs(3) → 3   (1+1+1, 1+2, 2+1)
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: to arrive at step n you came from n-1 or n-2, so
 *       ways(n) = ways(n-1) + ways(n-2). It is Fibonacci wearing a hat.
 *       Naive recursion is O(2ⁿ) — say that, then fix it.
 *       Only the last two values matter, so two variables beat an array.
 */
export function climbStairs(_n: number): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — House Robber
 * Non-negative values in a row. You cannot take two ADJACENT ones. Maximise the
 * total.
 *
 *   houseRobber([1, 2, 3, 1]) → 4   (1 + 3)
 *   houseRobber([2, 7, 9, 3, 1]) → 12  (2 + 9 + 1)
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: at each house the choice is binary — take it and add the best up to
 *       i-2, or skip it and keep the best up to i-1:
 *         dp[i] = max(dp[i-1], dp[i-2] + nums[i])
 *       Watch the greedy trap: taking the largest values first is wrong, as
 *       [2, 7, 9, 3, 1] shows — 7 + 3 = 10 loses to 2 + 9 + 1 = 12.
 */
export function houseRobber(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Coin Change
 * Fewest coins summing exactly to `amount`, using unlimited coins of each
 * denomination. Return -1 if impossible. Amount 0 needs 0 coins.
 *
 *   coinChange([1, 3, 4], 6)  → 2   (3 + 3, NOT greedy's 4 + 1 + 1)
 *   coinChange([2], 3)        → -1
 *
 * TARGET: O(amount × coins) time, O(amount) space.
 * HINT: dp[a] = fewest coins to make exactly `a`.
 *       dp[a] = 1 + min(dp[a - c]) over every coin c that fits.
 *       Base case dp[0] = 0. Use Infinity for "unreachable" so the min works
 *       without a separate flag, then convert to -1 at the end.
 * THE POINT OF THIS PROBLEM is that greedy fails. Say so, with the example.
 */
export function coinChange(_coins: number[], _amount: number): number {
  throw new Error('Not implemented');
}
