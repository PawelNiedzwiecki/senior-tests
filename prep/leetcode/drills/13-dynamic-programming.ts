/**
 * PATTERN 13 — Dynamic programming                      [LeetCode 300, 1143]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 60 min      Catalogue: ../patterns/CATALOGUE.md § 13
 *
 * THE PATTERN
 * A problem has DP structure when it has both:
 *   · OPTIMAL SUBSTRUCTURE — the best answer is built from best answers to
 *     smaller instances, and
 *   · OVERLAPPING SUBPROBLEMS — the plain recursion solves the same instance
 *     many times.
 * Memoise the recursion (top-down) or fill a table in dependency order
 * (bottom-up). Same recurrence either way; the difference is only who drives
 * the loop.
 *
 * THE TELL
 *   "how many ways"  ·  "minimum / maximum cost to reach"  ·  "longest
 *   subsequence"  ·  "can you partition / make change"  — and the brute force
 *   is exponential with repeated work.
 *
 * THE FIVE QUESTIONS — answer these in order, out loud, before writing code.
 * They produce the solution almost mechanically:
 *   1. What is the STATE? (the smallest set of variables identifying a
 *      subproblem)
 *   2. What does dp[state] MEAN? Say it as a full English sentence.
 *   3. What is the RECURRENCE?
 *   4. What are the BASE CASES?
 *   5. In what ORDER must the table be filled so dependencies come first?
 *
 * Getting question 2 right is most of the work. "dp[i] is the length of the
 * longest increasing subsequence ENDING AT i" and "…among the first i elements"
 * are different definitions with different recurrences, and mixing them is the
 * usual source of an unfixable table.
 *
 * SUBSEQUENCE VS SUBARRAY — the words matter:
 *   SUBARRAY / SUBSTRING  contiguous → often a window or Kadane, maybe not DP
 *   SUBSEQUENCE           order-preserving, gaps allowed → usually DP
 *
 * TOP-DOWN FIRST IS FINE and often faster to reach in an interview: write the
 * naive recursion, then add a memo Map. Say "this is O(2^n) without the memo
 * and O(n²) with it" as you add it — that sentence is the whole insight.
 *
 * COST — usually (number of states) × (work per state). Space is the table, and
 * "can I keep only the last row?" is the standard follow-up.
 */

/**
 * PROBLEM 1 — Longest increasing subsequence                    [LeetCode 300]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the length of the longest STRICTLY increasing subsequence. Elements
 * need not be adjacent, but must keep their relative order.
 *
 *   lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])  → 4     (2, 3, 7, 101)
 *   lengthOfLIS([0, 1, 0, 3, 2, 3])            → 4
 *   lengthOfLIS([7, 7, 7, 7])                  → 1     (strictly increasing)
 *
 * TARGET: O(n²) with the DP; O(n log n) with patience sorting. Get the O(n²)
 *       working first — a correct quadratic answer beats a broken clever one.
 *
 * THE O(n²) DP: `dp[i]` = the length of the longest increasing subsequence
 *       ENDING AT index i. Then
 *           dp[i] = 1 + max(dp[j]) over all j < i with nums[j] < nums[i]
 *       and the answer is max(dp). Note the answer is the maximum over the
 *       table, NOT dp[n - 1] — the longest run need not end at the last element.
 *
 * THE O(n log n) VERSION — patience sorting, and worth knowing because the
 *       trick generalises: keep an array `tails` where `tails[k]` is the
 *       SMALLEST possible tail value of an increasing subsequence of length
 *       k + 1. For each value, binary search for the first tail >= it and
 *       overwrite it; if there is none, append. The answer is `tails.length`.
 *
 * THE THING TO SAY ABOUT `tails`: it is NOT itself a valid subsequence — only
 *       its LENGTH is meaningful. Interviewers ask this to check whether you
 *       understand the algorithm or memorised it. Keeping tails as small as
 *       possible is what maximises future extension room, which is the greedy
 *       argument underneath.
 *
 * STRICTLY vs NON-DECREASING is one comparison: `>=` for strict, `>` for
 *       non-decreasing. `[7,7,7,7]` is the test that catches it.
 */
export function lengthOfLIS(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Longest common subsequence                       [LeetCode 1143]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the length of the longest subsequence common to both strings.
 *
 *   longestCommonSubsequence('abcde', 'ace')  → 3    ('ace')
 *   longestCommonSubsequence('abc', 'abc')    → 3
 *   longestCommonSubsequence('abc', 'def')    → 0
 *
 * TARGET: O(m × n) time, O(min(m, n)) space with the rolling-row optimisation.
 *
 * THIS IS THE GRID-DP ARCHETYPE. Once you can produce it cold, edit distance,
 *       shortest common supersequence and the diff algorithm behind `git diff`
 *       are all the same table with a different recurrence.
 *
 * THE STATE: `dp[i][j]` = the LCS length of the first i characters of `a` and
 *       the first j characters of `b`. Note "first i", not "ending at i" — the
 *       prefix formulation is what makes the base cases free.
 *
 * THE RECURRENCE, and there are only two cases:
 *       · a[i-1] === b[j-1] →  dp[i][j] = dp[i-1][j-1] + 1
 *         (the characters match: use them both and take the diagonal)
 *       · otherwise         →  dp[i][j] = max(dp[i-1][j], dp[i][j-1])
 *         (drop one character from one side, whichever is better)
 *
 * WHY THE TABLE IS (m + 1) × (n + 1): row 0 and column 0 mean "one string is
 *       empty", whose LCS is 0. Those padding entries remove every boundary
 *       check from the loop — the same leading-zero idea as prefix sums.
 *
 * THE SPACE OPTIMISATION: each row depends only on the row above, so two rows
 *       suffice — O(min(m, n)) if you iterate over the shorter string. Mention
 *       that reconstructing the actual subsequence (rather than its length)
 *       needs the full table, so the optimisation is not free.
 */
export function longestCommonSubsequence(_a: string, _b: string): number {
  throw new Error('Not implemented');
}
