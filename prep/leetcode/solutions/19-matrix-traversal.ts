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

/**
 * PROBLEM 2 — Game of Life
 *
 * COMPLEXITY: O(rows × cols) time, O(1) extra space.
 *
 * NARRATION:
 *   "The rule is a simultaneous update, so I can't overwrite cells as I go —
 *    neighbours would read the new value. The obvious fix is a copy of the
 *    board, O(n) space. To do it in place I store both states in one integer:
 *    the low bit is the current state and the second bit is the next one. I
 *    always read neighbours with `& 1`, so they see the original board, and a
 *    final pass shifts every cell right by one to reveal the result."
 *
 * `|= 2` ONLY WHEN THE CELL SHOULD LIVE. The second bit starts at 0 everywhere,
 * so "dies" needs no write at all — which halves the number of branches and
 * makes the loop body short enough to verify by eye.
 *
 * `& 1` ON EVERY NEIGHBOUR READ is the correctness condition. Reading the raw
 * value would pick up the next-state bit of an already-processed neighbour,
 * which reintroduces exactly the sequential-update bug the trick exists to
 * avoid.
 *
 * THE BOUNDS CHECK is ordinary, but note that counting the cell itself and then
 * subtracting is a common simplification that trades a branch for an
 * arithmetic step — either is fine, but be consistent about which you wrote.
 *
 * THE INFINITE-BOARD FOLLOW-UP: keep a Set of live coordinates keyed as
 * strings or packed integers, and iterate over live cells plus their
 * neighbourhoods. That is O(live cells), independent of the board's extent, and
 * it is the answer the question is fishing for.
 */
export function gameOfLife(board: number[][]): number[][] {
  const rows = board.length;
  const cols = rows === 0 ? 0 : board[0]!.length;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      let liveNeighbours = 0;

      for (let dr = -1; dr <= 1; dr += 1) {
        for (let dc = -1; dc <= 1; dc += 1) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          liveNeighbours += board[nr]![nc]! & 1; // `& 1`: the ORIGINAL state
        }
      }

      const isLive = (board[r]![c]! & 1) === 1;
      const survives = isLive ? liveNeighbours === 2 || liveNeighbours === 3 : liveNeighbours === 3;
      if (survives) board[r]![c]! |= 2; // record the next state in bit 1
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) board[r]![c]! >>= 1; // reveal it
  }

  return board;
}
