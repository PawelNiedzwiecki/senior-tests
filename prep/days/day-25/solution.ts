/**
 * SOLUTIONS — Matrix traversal
 */

/**
 * PROBLEM 1 — Search a 2D matrix II
 *
 * COMPLEXITY: O(rows + cols) time, O(1) space.
 *
 * NARRATION:
 *   "Binary searching each row is O(rows × log cols) and throws away the column
 *    ordering. Instead I start at the top-right corner, where moving left
 *    strictly decreases the value and moving down strictly increases it. One
 *    comparison therefore eliminates a whole column or a whole row, so the walk
 *    is at most rows + cols steps."
 *
 * THE CORNER IS THE ALGORITHM. At the top-left, both moves increase the value,
 * so a comparison gives no direction — the search would have to branch and
 * degenerate. Top-right and bottom-left are the two corners where the available
 * moves disagree, which is what makes the elimination sound.
 *
 * TERMINATION: each step decrements `col` or increments `row` and neither is
 * ever undone, so the loop runs at most rows + cols times and cannot cycle.
 *
 * THE CONTRAST WITH LEETCODE 74 is worth drawing: there the whole matrix is one
 * sorted sequence read row-major, so a single binary search over
 * rows × cols indices works in O(log(rows × cols)). Here the rows restart, so
 * that is invalid. Confusing the two problems is the usual mistake, and naming
 * the difference shows you read the constraints.
 */
export function searchMatrix(matrix: number[][], target: number): boolean {
  const rows = matrix.length;
  const cols = rows === 0 ? 0 : matrix[0]!.length;
  if (rows === 0 || cols === 0) return false;

  let row = 0;
  let col = cols - 1; // top-right: left decreases, down increases

  while (row < rows && col >= 0) {
    const value = matrix[row]![col]!;
    if (value === target) return true;
    if (value > target) col -= 1; // drop this column
    else row += 1; // drop this row
  }

  return false;
}

