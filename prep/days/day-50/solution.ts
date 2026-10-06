/**
 * SOLUTIONS — Backtracking
 */

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
