/**
 * SOLUTIONS — Dynamic programming
 */

/**
 * PROBLEM 1 — Longest increasing subsequence
 *
 * COMPLEXITY: O(n log n) time, O(n) space in this patience-sorting form. The
 * straightforward DP is O(n²) / O(n) and you should write that one first in an
 * interview, then offer this.
 *
 * NARRATION:
 *   "The quadratic DP is dp[i] = longest subsequence ending at i, taking the
 *    best compatible predecessor — I'd write that first. To do better I keep an
 *    array where tails[k] is the smallest tail value achievable by an
 *    increasing subsequence of length k + 1. That array is sorted by
 *    construction, so each new value gets placed with a binary search: it either
 *    extends the longest run or lowers an existing tail, giving n log n."
 *
 * WHAT `tails` IS AND IS NOT: it is not a subsequence of the input — its
 * contents can be a mix of values that never co-occur. Only its LENGTH is
 * meaningful. Expect to be asked; it is the standard probe for whether the
 * algorithm is understood or recited.
 *
 * WHY KEEPING TAILS SMALL IS RIGHT: a shorter tail for a given length can be
 * extended by strictly more future values, and never by fewer. Overwriting is
 * therefore always at least as good — the exchange argument.
 *
 * STRICTNESS LIVES IN THE BINARY SEARCH: `tails[mid] < value` finds the first
 * tail >= value, which enforces STRICT increase. Changing it to `<=` finds the
 * first tail > value and gives the non-decreasing variant. One character, and
 * [7,7,7,7] is the test that tells you which you wrote.
 *
 * TO RECOVER THE SUBSEQUENCE ITSELF you must also store, for each element, the
 * index it was placed at and a predecessor pointer — the length alone does not
 * let you reconstruct it. Worth saying before being asked.
 */
export function lengthOfLIS(nums: number[]): number {
  const tails: number[] = []; // tails[k] = smallest tail of an LIS of length k+1

  for (const value of nums) {
    // First index whose tail is >= value (strict increase).
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      if (tails[mid]! < value) lo = mid + 1;
      else hi = mid;
    }

    if (lo === tails.length) tails.push(value); // extends the longest run
    else tails[lo] = value; // lowers an existing tail
  }

  return tails.length;
}

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
