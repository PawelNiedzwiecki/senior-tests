/**
 * PATTERN 04 — Prefix sum / running aggregate            [LeetCode 525, 304]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 4
 *
 * THE PATTERN
 * Precompute cumulative totals once, then answer any range question by
 * subtracting two of them:
 *
 *     sum(i..j) = prefix[j + 1] - prefix[i]
 *
 * Rearranged, the same identity answers "which earlier prefix would make this
 * range equal X?" — and that lookup goes in a hash map. Almost every prefix-sum
 * problem is one of those two readings.
 *
 * THE TELL
 *   "sum of a range", asked many times  ·  "subarray summing to K"
 *   "equal numbers of X and Y"          ·  "running total / balance"
 *
 * WHEN IT BEATS A SLIDING WINDOW
 * A window needs the aggregate to be monotonic in the window size — in
 * practice, all-positive values. The moment negatives (or a +1/-1 encoding)
 * appear, the window is unsound and prefix sums are the tool. Saying this
 * distinction unprompted is worth a lot.
 *
 * TEMPLATE
 *   const prefix = [0];                                  // the empty prefix
 *   for (const x of xs) prefix.push(prefix.at(-1)! + x);
 *   // …or, streaming, with a map of prefixValue → firstIndex / count
 *
 * COST — O(n) to build, O(1) per query, O(n) space.
 *
 * THE LEADING ZERO IS NOT DECORATION. `prefix[0] = 0` is what removes the
 * "what if the range starts at 0" special case from every query below.
 */

/**
 * PROBLEM 1 — Contiguous array (equal 0s and 1s)                [LeetCode 525]
 * ────────────────────────────────────────────────────────────────────────────
 * Given a binary array, return the length of the longest contiguous subarray
 * with an EQUAL number of 0s and 1s.
 *
 *   findMaxLength([0, 1])           → 2
 *   findMaxLength([0, 1, 0])        → 2
 *   findMaxLength([0, 0, 1, 0, 0, 0, 1, 1])  → 6
 *   findMaxLength([0, 0, 0])        → 0
 *
 * TARGET: O(n) time, O(n) space.
 *
 * THE REFRAME THAT SOLVES IT: treat 0 as -1. "Equal counts" becomes "sums to
 *       zero", which becomes "two prefixes are equal". Once you have said that
 *       sentence, the code is six lines. Getting to that sentence is the
 *       problem.
 *
 * HINT: keep a map of prefixValue → FIRST index at which it occurred. When you
 *       see a value again at index j, the subarray between them sums to zero
 *       and has length `j - firstIndex`. Store the first occurrence only —
 *       overwriting would shorten your answer.
 *
 * THE SEED: the map must start with `{0: -1}` — a balance of zero "before the
 *       array began". Without it you miss every answer that starts at index 0,
 *       which is exactly what `[0, 1]` tests.
 *
 * NOTE THIS IS A LONGEST PROBLEM, so you store first occurrences; the closely
 *       related "count subarrays summing to K" stores COUNTS instead. Know
 *       which variant you are in before you write the map.
 */
export function findMaxLength(_nums: number[]): number {
  throw new Error('Not implemented');
}

