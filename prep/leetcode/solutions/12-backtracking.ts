/**
 * SOLUTIONS — Backtracking
 */

/**
 * PROBLEM 1 — Word search in a grid
 *
 * COMPLEXITY: O(rows × cols × 4^L) worst case, O(L) extra space (recursion
 * depth; the marking is done in place).
 *
 * NARRATION:
 *   "DFS from every cell, matching one letter per level. The part that makes it
 *    backtracking rather than plain DFS is that the visited mark has to be
 *    UNDONE when a path fails — a cell that blocks one route is free for
 *    another. I mark in place with a sentinel and restore on the way out, which
 *    keeps the extra space at O(1)."
 *
 * PRUNE AT THE TOP: the mismatch test is the first thing in the recursion, so a
 * wrong letter costs one call rather than four recursive ones.
 *
 * THE RESTORE LINE (`board[r][c] = letter`) runs on BOTH the success and the
 * failure path here, because we return `found` after restoring. Leaving the
 * board mutated on success would be a nasty surprise for the caller — the tests
 * check for it.
 *
 * THE REVERSAL OPTIMISATION: count the grid occurrences of the word's first and
 * last letters; if the last is rarer, search for the reversed word. Identical
 * answer, potentially far fewer starting cells. Cheap to add, and exactly the
 * sort of thing that reads as experience rather than recall.
 */
export function wordExists(board: string[][], word: string): boolean {
  if (word.length === 0) return true;

  const rows = board.length;
  const cols = rows === 0 ? 0 : board[0]!.length;
  if (rows === 0 || cols === 0) return false;

  const search = (r: number, c: number, index: number): boolean => {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r]![c] !== word[index]) return false; // prune before descending
    if (index === word.length - 1) return true;

    const letter = board[r]![c]!;
    board[r]![c] = '#'; // mark: this cell is on the current path

    const found =
      search(r + 1, c, index + 1) ||
      search(r - 1, c, index + 1) ||
      search(r, c + 1, index + 1) ||
      search(r, c - 1, index + 1);

    board[r]![c] = letter; // UNDO — the line that makes this backtracking
    return found;
  };

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (search(r, c, 0)) return true;
    }
  }

  return false;
}

/**
 * PROBLEM 2 — N-Queens
 *
 * COMPLEXITY: the search tree is bounded by O(n!) but the three conflict sets
 * prune it hard in practice; n = 8 is instant. Space is O(n) for the path and
 * the sets.
 *
 * NARRATION:
 *   "One queen per row, so rows can never conflict and the decision at each
 *    level is just the column. I keep three sets — used columns, used ↘
 *    diagonals keyed by row - col, and used ↙ diagonals keyed by row + col — so
 *    checking a square is O(1) rather than a scan of the board."
 *
 * THE DIAGONAL KEYS are the memorable part: `row - col` is constant along a ↘
 * diagonal and `row + col` along a ↙ one. Deriving them at the whiteboard by
 * writing out a 3×3 grid of each value takes twenty seconds and is more
 * convincing than reciting them.
 *
 * THE UNDO IS THREE DELETES PLUS A POP. Every piece of state applied before the
 * recursive call must be reverted after it. Grouping the applies together and
 * the undos together, in mirror order, makes an omission visible on sight.
 *
 * RECORDING: the board is rendered from the path only when a complete
 * arrangement is reached, so nothing is copied speculatively. Note the
 * `[...path]` habit still applies to any solution that records the raw path.
 *
 * THE FOLLOW-UP: "just count them" (LeetCode 52) is the same search without the
 * rendering, and the bitmask version — three integers instead of three sets,
 * with `~(cols | diag | anti) & ((1 << n) - 1)` enumerating the free squares —
 * is the classic optimisation to name if asked to go faster.
 */
export function solveNQueens(n: number): string[][] {
  const solutions: string[][] = [];
  const queenColumnInRow: number[] = [];

  const usedColumns = new Set<number>();
  const usedDiagonals = new Set<number>(); // row - col
  const usedAntiDiagonals = new Set<number>(); // row + col

  const place = (row: number): void => {
    if (row === n) {
      solutions.push(
        queenColumnInRow.map((col) => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)),
      );
      return;
    }

    for (let col = 0; col < n; col += 1) {
      if (usedColumns.has(col)) continue;
      if (usedDiagonals.has(row - col)) continue;
      if (usedAntiDiagonals.has(row + col)) continue;

      usedColumns.add(col);
      usedDiagonals.add(row - col);
      usedAntiDiagonals.add(row + col);
      queenColumnInRow.push(col);

      place(row + 1);

      queenColumnInRow.pop(); // UNDO, in mirror order
      usedAntiDiagonals.delete(row + col);
      usedDiagonals.delete(row - col);
      usedColumns.delete(col);
    }
  };

  place(0);
  return solutions;
}
