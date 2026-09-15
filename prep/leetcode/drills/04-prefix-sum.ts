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

/**
 * PROBLEM 2 — 2D range sum, queried many times                  [LeetCode 304]
 * ────────────────────────────────────────────────────────────────────────────
 * Build a structure over an immutable matrix that returns the sum of the
 * rectangle from (row1, col1) to (row2, col2) INCLUSIVE, in O(1).
 *
 *   const rs = createMatrixRangeSum([
 *     [3, 0, 1, 4],
 *     [5, 6, 3, 2],
 *     [1, 2, 0, 1],
 *   ]);
 *   rs.query(0, 0, 1, 1)  → 14      (3 + 0 + 5 + 6)
 *   rs.query(1, 1, 2, 2)  → 11
 *
 * TARGET: O(rows × cols) to build, O(1) per query.
 *
 * THE IDENTITY, in two dimensions (inclusion–exclusion):
 *
 *     rect = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
 *
 *     where P[r][c] is the sum of everything strictly above and left of (r, c).
 *     You subtract the strip above and the strip to the left, then add back the
 *     corner you just subtracted twice. Draw it — the diagram is the proof, and
 *     drawing it in the interview is the expected move.
 *
 * HINT: the same leading-zero trick, now as a full zero row and zero column, so
 *       every one of those four terms is in range without a special case.
 *
 * BUILD RECURRENCE: P[r+1][c+1] = m[r][c] + P[r][c+1] + P[r+1][c] - P[r][c].
 */
export interface MatrixRangeSum {
  query(row1: number, col1: number, row2: number, col2: number): number;
}

export function createMatrixRangeSum(_matrix: number[][]): MatrixRangeSum {
  throw new Error('Not implemented');
}
