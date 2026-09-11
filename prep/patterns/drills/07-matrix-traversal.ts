/**
 * PATTERN 19 — Matrix traversal
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: CATALOGUE.md § 19
 *
 * THE TELL: "spiral", "rotate", "transpose", "in place" on a 2D grid.
 *
 * THESE ARE NOT ALGORITHM PROBLEMS. There is no clever insight to find — they
 * test whether you can manage indices under time pressure without an
 * off-by-one. That makes them excellent warm-ups and genuinely common at
 * screening stage.
 *
 * DECLARING A GRID — the bug that bites everyone once:
 *
 *   const bad  = new Array(rows).fill(new Array(cols).fill(0));   // ✗ WRONG
 *   const good = Array.from({ length: rows }, () => new Array(cols).fill(0));
 *
 * `fill` puts the SAME array reference in every row, so writing one cell writes
 * a whole column. `Array.from` with a factory builds a fresh row each time.
 */

/**
 * PROBLEM 1 — Spiral order
 * Return every element in clockwise spiral order, starting at the top-left.
 *
 *   [[1,2,3],
 *    [4,5,6],
 *    [7,8,9]]  → [1,2,3,6,9,8,7,4,5]
 *
 * TARGET: O(rows × cols) time, O(1) extra space.
 * HINT: four moving boundaries — top, bottom, left, right — shrinking inward.
 *       Emit the top row, then the right column, then the bottom row, then the
 *       left column, adjusting the boundary after each.
 * THE TWO GUARDS: before emitting the bottom row, check `top <= bottom`; before
 *       the left column, check `left <= right`. Without them, a matrix with a
 *       single remaining row or column emits it twice. That is the bug this
 *       problem is built to catch, and non-square matrices are where it shows.
 */
export function spiralOrder(_matrix: number[][]): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Rotate an n×n matrix 90° clockwise, in place
 * Mutate and return the same matrix.
 *
 *   [[1,2],       [[3,1],
 *    [3,4]]   →    [4,2]]
 *
 * TARGET: O(n²) time, O(1) extra space.
 * HINT: transpose (swap across the main diagonal), then reverse each row.
 *       Convince yourself on a 2×2 before trusting it.
 * THE OFF-BY-ONE: the transpose inner loop must start at `c = r + 1`, not
 *       `c = 0`. Starting at 0 swaps every pair twice and returns the original
 *       matrix — which looks like "nothing happened" and is very confusing if
 *       you have not seen it.
 * FOLLOW-UP: anticlockwise is transpose then reverse the COLUMN order (i.e.
 *       reverse the array of rows). Know both directions.
 */
export function rotateInPlace(_matrix: number[][]): number[][] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Set matrix zeroes
 * If a cell is 0, set its entire row and column to 0. Mutate in place.
 *
 *   [[1,1,1],       [[1,0,1],
 *    [1,0,1],   →    [0,0,0],
 *    [1,1,1]]        [1,0,1]]
 *
 * TARGET: O(rows × cols) time, O(1) extra space.
 * THE TRAP: you cannot zero a row as you find it — the zeroes you write are
 *       indistinguishable from the originals, so the whole matrix cascades to
 *       zero. You must record first, then apply.
 * THE O(m + n) ANSWER: two sets of row and column indices. Perfectly good, and
 *       what most candidates produce.
 * THE O(1) ANSWER: use the first row and first column AS the marker storage,
 *       with one extra boolean for "did the first column itself contain a
 *       zero?" — because cell (0,0) has to serve two purposes. Then apply
 *       markers from the bottom-right backwards so you do not overwrite them
 *       before reading. Offer the O(m + n) version first, then this.
 */
export function setZeroes(_matrix: number[][]): number[][] {
  throw new Error('Not implemented');
}
