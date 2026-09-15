/**
 * SOLUTIONS — Prefix sum / running aggregate
 */

/**
 * PROBLEM 1 — Contiguous array
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * NARRATION — lead with the reframe:
 *   "Counting equal 0s and 1s is awkward; mapping 0 to -1 turns it into
 *    'longest subarray summing to zero', and a subarray sums to zero exactly
 *    when its two endpoint prefixes are equal. So I keep a running balance and
 *    remember the first index at which each balance occurred."
 *
 * FIRST OCCURRENCE ONLY. This is a LONGEST problem, so the earliest index that
 * produced a balance gives the widest span. Overwriting the stored index on a
 * repeat is the classic bug — it quietly returns a shorter answer and passes
 * the small examples.
 *
 * THE `{0: -1}` SEED means "balance was zero before index 0". With it, a
 * balance of zero at index j yields length `j - (-1) = j + 1`, which is the
 * whole prefix — correct. Without it, `[0, 1]` returns 0.
 *
 * THE VARIANT TO NAME: replace "first index" with "count of occurrences" and
 * the same loop counts subarrays summing to K instead of finding the longest
 * one. Same identity, different bookkeeping.
 */
export function findMaxLength(nums: number[]): number {
  const firstIndex = new Map<number, number>([[0, -1]]); // balance → first index
  let balance = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i += 1) {
    balance += nums[i] === 1 ? 1 : -1;

    const seen = firstIndex.get(balance);
    if (seen === undefined) {
      firstIndex.set(balance, i); // first time only — never overwrite
    } else {
      best = Math.max(best, i - seen);
    }
  }

  return best;
}

/**
 * PROBLEM 2 — 2D range sum
 *
 * COMPLEXITY: O(rows × cols) build, O(1) query, O(rows × cols) space.
 *
 * NARRATION:
 *   "I'll precompute, for every corner, the sum of the rectangle from the
 *    origin to it. Any rectangle is then four lookups: the big one, minus the
 *    strip above, minus the strip to the left, plus the top-left corner that I
 *    just subtracted twice. That is inclusion–exclusion, and it is easiest to
 *    show on a sketch."
 *
 * THE PADDING ROW AND COLUMN — `prefix` is (rows + 1) × (cols + 1) with zeroes
 * along the top and left — is what makes `row1 - 1` and `col1 - 1` unnecessary.
 * Every one of the four terms is always in range. Without the padding you write
 * four conditionals and get one of them wrong.
 *
 * THE BUILD is the same identity run forwards: each cell adds the one above and
 * the one to the left, then removes the overlap they share.
 *
 * WHEN THIS IS THE WRONG TOOL: if the matrix is MUTABLE, each update costs
 * O(rows × cols) to rebuild. That is the boundary at which you name a 2D
 * Fenwick tree — O(log r · log c) per update and query. Knowing where the
 * simple structure stops being right is the senior-level part of the answer.
 */
export interface MatrixRangeSum {
  query(row1: number, col1: number, row2: number, col2: number): number;
}

export function createMatrixRangeSum(matrix: number[][]): MatrixRangeSum {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0]!.length;

  // One extra row and column of zeroes: no boundary special cases anywhere.
  const prefix: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      prefix[r + 1]![c + 1] =
        matrix[r]![c]! + prefix[r]![c + 1]! + prefix[r + 1]![c]! - prefix[r]![c]!;
    }
  }

  return {
    query(row1, col1, row2, col2) {
      return (
        prefix[row2 + 1]![col2 + 1]! -
        prefix[row1]![col2 + 1]! -
        prefix[row2 + 1]![col1]! +
        prefix[row1]![col1]!
      );
    },
  };
}
