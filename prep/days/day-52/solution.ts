/**
 * SOLUTIONS — Dynamic programming
 */

/**
 * PROBLEM 2 — Longest common subsequence
 *
 * COMPLEXITY: O(m × n) time, O(min(m, n)) space with the two-row form.
 *
 * NARRATION:
 *   "Classic grid DP. dp[i][j] is the LCS of the first i characters of one
 *    string and the first j of the other. If the two current characters match,
 *    the answer is the diagonal plus one; if not, it is the better of dropping
 *    a character from either side. The padded row and column encode 'one string
 *    is empty', so there are no boundary cases in the loop. Each row only needs
 *    the one above it, so I keep two rows rather than the whole table."
 *
 * THE MATCH CASE TAKES THE DIAGONAL, not the maximum of the neighbours. Taking
 * a max there is the classic bug: it double-counts a character by allowing the
 * same match to be reused from an adjacent state.
 *
 * ITERATING OVER THE SHORTER STRING for the row dimension makes the space
 * O(min(m, n)). Cheap, and it shows you thought about which dimension to roll.
 *
 * THE TRADE-OFF TO NAME: with two rows you can report the LENGTH but you cannot
 * reconstruct the subsequence — that needs the full table to walk back through.
 * If the interviewer wants the string itself, keep the O(m × n) table.
 *
 * WHAT THIS UNLOCKS: edit distance is this table with three predecessors
 * instead of two; `git diff` is LCS over lines rather than characters. Saying
 * that connects the exercise to something real, which interviewers remember.
 */
export function longestCommonSubsequence(a: string, b: string): number {
  // Roll over the shorter string so the rows stay small.
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];

  let previous = new Array<number>(short.length + 1).fill(0); // the padding row
  let current = new Array<number>(short.length + 1).fill(0);

  for (let i = 1; i <= long.length; i += 1) {
    for (let j = 1; j <= short.length; j += 1) {
      if (long[i - 1] === short[j - 1]) {
        current[j] = previous[j - 1]! + 1; // match: take the DIAGONAL
      } else {
        current[j] = Math.max(previous[j]!, current[j - 1]!);
      }
    }

    [previous, current] = [current, previous]; // reuse the buffer, no allocation
    current.fill(0);
  }

  return previous[short.length]!;
}
