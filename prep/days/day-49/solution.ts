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

