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

