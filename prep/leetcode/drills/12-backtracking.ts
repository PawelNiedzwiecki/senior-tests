/**
 * PATTERN 12 — Backtracking                                [LeetCode 79, 51]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 12
 *
 * THE PATTERN
 * Build a candidate one decision at a time. When a decision cannot lead to a
 * solution, UNDO it and try the next one. The undo is what makes it
 * backtracking rather than plain recursion, and it is what keeps memory at
 * O(depth) instead of O(number of candidates).
 *
 * THE TELL
 *   "all combinations / permutations / subsets"  ·  "every valid arrangement"
 *   "find a path through a grid spelling X"      ·  "place N things without
 *   conflict"  ·  a problem whose answer is a LIST OF SOLUTIONS, not a number
 *
 * THE FOUR-PART SHAPE — write these four lines before any real code and the
 * problem usually collapses:
 *   1. CHOICE      what am I deciding at this level?
 *   2. CONSTRAINT  what makes a choice illegal?
 *   3. GOAL        when is the path complete?
 *   4. UNDO        what state must be restored on the way out?
 *
 * TEMPLATE
 *   const backtrack = (state) => {
 *     if (isGoal(state)) { record(state); return; }
 *     for (const choice of choices(state)) {
 *       if (!isLegal(choice)) continue;
 *       apply(choice);                 // mutate
 *       backtrack(next(state));
 *       undo(choice);                  // restore — the line people forget
 *     }
 *   };
 *
 * PRUNING IS THE ENTIRE PERFORMANCE STORY. The search tree is exponential;
 * every branch you cut before descending removes a whole subtree. Sorting the
 * input first so you can `break` rather than `continue`, or tracking used
 * columns in a Set instead of re-scanning, is what separates "runs" from "times
 * out".
 *
 * COST — exponential by nature: O(2^n), O(n!), O(4^L) depending on the branching
 * factor. State that plainly and then talk about pruning; interviewers want to
 * hear that you know it is exponential and why that is acceptable here.
 *
 * COPY WHEN YOU RECORD. `result.push(path)` pushes a REFERENCE that your undo
 * steps will then mutate into something else. `result.push([...path])` is the
 * fix, and this is the most common bug in the whole pattern.
 */

/**
 * PROBLEM 1 — Word search in a grid                              [LeetCode 79]
 * ────────────────────────────────────────────────────────────────────────────
 * Return true if `word` can be spelled by walking orthogonally adjacent cells,
 * using each cell AT MOST ONCE per path.
 *
 *   const board = [['A','B','C','E'], ['S','F','C','S'], ['A','D','E','E']];
 *   wordExists(board, 'ABCCED')  → true
 *   wordExists(board, 'SEE')     → true
 *   wordExists(board, 'ABCB')    → false   ('B' would have to be reused)
 *
 * TARGET: O(rows × cols × 4^L) worst case, where L is the word length. O(L)
 *       extra space if you mark cells in place.
 *
 * WHY THIS IS BACKTRACKING AND NOT DFS: the "visited" mark must be REMOVED when
 *       the path fails, because a cell unusable on one path is perfectly usable
 *       on another. A plain DFS visited-set — marked once, never cleared — is
 *       wrong here and is the mistake this problem is designed to catch.
 *
 * THE IN-PLACE MARK: overwrite the cell with a sentinel like '#' before
 *       recursing and restore it afterwards. O(1) extra space, and the restore
 *       line is the backtrack.
 *
 * PRUNE EARLY: check `board[r][c] !== word[index]` at the TOP of the recursion
 *       and return false immediately. Descending first and testing later
 *       multiplies the work by four.
 *
 * THE OPTIMISATION WORTH MENTIONING: if the word's last letter is rarer in the
 *       grid than its first, search for the REVERSED word. Same answer, far
 *       fewer starting points. Small, cheap, and a genuinely senior observation.
 */
export function wordExists(_board: string[][], _word: string): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — N-Queens                                            [LeetCode 51]
 * ────────────────────────────────────────────────────────────────────────────
 * Place `n` queens on an n × n board so that none attacks another, and return
 * every distinct solution. Each solution is an array of strings, one per row,
 * with 'Q' for a queen and '.' for an empty square.
 *
 *   solveNQueens(4)  → [['.Q..', '...Q', 'Q...', '..Q.'],
 *                       ['..Q.', 'Q...', '...Q', '.Q..']]
 *   solveNQueens(1)  → [['Q']]
 *   solveNQueens(2)  → []
 *   solveNQueens(3)  → []
 *
 * TARGET: correct first; the pruning below is what makes n = 8 or 9 instant.
 *
 * THE FRAMING THAT COLLAPSES THE PROBLEM: place ONE QUEEN PER ROW. Row
 *       conflicts then cannot happen by construction, and the choice at each
 *       level is simply "which column in this row?" — branching factor n rather
 *       than n².
 *
 * THE THREE CONFLICT SETS, and the diagonal identities are the thing to
 *       memorise:
 *         column        → col
 *         ↘ diagonal    → row - col   (constant along it; offset to stay >= 0)
 *         ↙ anti-diagonal → row + col (constant along it)
 *       With three Sets, legality is O(1) instead of an O(n) re-scan per
 *       candidate.
 *
 * THE UNDO is three deletes — one per Set — plus removing the queen from the
 *       path. Missing any one of them produces answers that look plausible and
 *       are wrong, which is why the tests below verify the boards themselves
 *       rather than just counting them.
 *
 * THE COUNTS worth knowing as a sanity check: n = 4 → 2 solutions, n = 5 → 10,
 *       n = 6 → 4, n = 7 → 40, n = 8 → 92.
 */
export function solveNQueens(_n: number): string[][] {
  throw new Error('Not implemented');
}
