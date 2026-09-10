/**
 * SOLUTIONS — Matrix traversal
 */

/**
 * PROBLEM 1 — Spiral order
 *
 * COMPLEXITY: O(rows × cols) time, O(1) extra space beyond the output.
 *
 * FOUR BOUNDARIES, each adjusted immediately after its pass. The loop continues
 * while `top <= bottom && left <= right`.
 *
 * THE TWO GUARDS are the whole difficulty. After emitting the top row and the
 * right column, the remaining region may have collapsed to nothing — but the
 * bottom-row and left-column passes would still run and re-emit cells. Checking
 * `top <= bottom` before the bottom row and `left <= right` before the left
 * column prevents it. Non-square matrices (`[[1,2,3]]`, `[[1],[2],[3]]`) are
 * where this shows up, which is why those tests exist.
 *
 * TRACE `[[1,2,3]]` BY HAND if it ever looks wrong: top row emits 1,2,3 and
 * `top` becomes 1, which now exceeds `bottom` (0) — so the bottom-row pass must
 * be skipped, or you get 3,2,1 appended.
 */
export function spiralOrder(matrix: number[][]): number[] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return [];

  const out: number[] = [];
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = cols - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c += 1) out.push(matrix[top]![c]!);
    top += 1;

    for (let r = top; r <= bottom; r += 1) out.push(matrix[r]![right]!);
    right -= 1;

    // Guard: the region may have collapsed after the two passes above.
    if (top <= bottom) {
      for (let c = right; c >= left; c -= 1) out.push(matrix[bottom]![c]!);
      bottom -= 1;
    }

    if (left <= right) {
      for (let r = bottom; r >= top; r -= 1) out.push(matrix[r]![left]!);
      left += 1;
    }
  }

  return out;
}

/**
 * PROBLEM 2 — Rotate 90° clockwise in place
 *
 * NARRATION:
 *   "Rotating clockwise is the same as transposing across the main diagonal and
 *    then reversing each row. Both steps are in place, so it's O(1) extra space."
 *
 * COMPLEXITY: O(n²) time, O(1) space.
 *
 * `c = r + 1` IS THE WHOLE TRANSPOSE. Starting at `c = 0` visits each pair
 * twice — swapping it back — so the matrix comes out unchanged. That failure
 * mode looks like your code did nothing, which is a confusing way to lose five
 * minutes. Starting above the diagonal touches each pair exactly once.
 *
 * ANTICLOCKWISE: transpose, then reverse the order of the ROWS
 * (`matrix.reverse()`) rather than reversing within each row. Worth knowing
 * both, since the follow-up is usually "now the other way".
 */
export function rotateInPlace(matrix: number[][]): number[][] {
  const n = matrix.length;

  // Transpose: swap across the main diagonal, touching each pair once.
  for (let r = 0; r < n; r += 1) {
    for (let c = r + 1; c < n; c += 1) {
      const temp = matrix[r]![c]!;
      matrix[r]![c] = matrix[c]![r]!;
      matrix[c]![r] = temp;
    }
  }

  for (const row of matrix) row.reverse();

  return matrix;
}

/**
 * PROBLEM 3 — Set matrix zeroes
 *
 * THE TRAP, said before coding:
 *   "I can't zero a row the moment I find a zero — the zeroes I write become
 *    indistinguishable from the originals and the whole matrix cascades. So I
 *    have to record which rows and columns to clear, then apply."
 *
 * THE LADDER OF SOLUTIONS, worth walking explicitly:
 *   O(m·n) space — a copy of the matrix. Correct, wasteful.
 *   O(m + n)     — a Set of rows and a Set of columns. What most people write.
 *   O(1)         — store the markers IN the first row and first column.
 *
 * COMPLEXITY: O(rows × cols) time, O(1) space.
 *
 * WHY THE EXTRA BOOLEAN: cell (0,0) would have to mark both "row 0 has a zero"
 * and "column 0 has a zero". One cell cannot hold two independent facts, so the
 * first column's flag lives in a separate variable. This is the only subtle
 * part, and being able to say *why* it exists is the point.
 *
 * WHY APPLY BACKWARDS: the markers live in row 0 and column 0. Applying
 * top-left first would overwrite markers before later cells read them. Iterating
 * from the bottom-right means every cell reads its markers before they are
 * themselves cleared.
 */
export function setZeroes(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return matrix;

  // (0,0) can only hold one fact, so column 0 gets its own flag.
  let firstColumnHasZero = false;

  for (let r = 0; r < rows; r += 1) {
    if (matrix[r]![0] === 0) firstColumnHasZero = true;

    for (let c = 1; c < cols; c += 1) {
      if (matrix[r]![c] === 0) {
        matrix[r]![0] = 0; // mark the row
        matrix[0]![c] = 0; // mark the column
      }
    }
  }

  // Apply from the bottom-right so markers are read before being overwritten.
  for (let r = rows - 1; r >= 0; r -= 1) {
    for (let c = cols - 1; c >= 1; c -= 1) {
      if (matrix[r]![0] === 0 || matrix[0]![c] === 0) matrix[r]![c] = 0;
    }

    if (firstColumnHasZero) matrix[r]![0] = 0;
  }

  return matrix;
}
