/**
 * PATTERN 19 — Matrix traversal                          [LeetCode 240, 289]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 19
 *
 * THE PATTERN
 * Grid problems are rarely algorithmically deep — they are INDEX DISCIPLINE.
 * The work is in choosing a traversal that makes the bookkeeping disappear, and
 * in respecting an in-place constraint when there is one.
 *
 * THE TELL
 *   "rotate / spiral / transpose"  ·  "in place, no extra matrix"
 *   "sorted rows AND sorted columns"  ·  "update every cell simultaneously"
 *
 * THE THREE IDEAS THAT COVER MOST OF IT
 *   1. LAYER BY LAYER — spiral order and rotation peel concentric rings. Four
 *      bounds (top, bottom, left, right) that close inwards beat any attempt at
 *      clever index arithmetic.
 *   2. COMPOSE SIMPLER OPERATIONS — a 90° clockwise rotation is TRANSPOSE then
 *      REVERSE EACH ROW. Two easy passes instead of one four-way swap that
 *      nobody gets right first time. Anticlockwise is transpose then reverse
 *      each COLUMN.
 *   3. THE STAIRCASE WALK — when rows and columns are both sorted, start at a
 *      corner where the two directions carry OPPOSITE information (top-right or
 *      bottom-left). Each step then eliminates a whole row or column.
 *
 * THE IN-PLACE TRICK WORTH KNOWING: when you must record information about
 * cells without a second matrix, encode it IN the cells — a sentinel value, a
 * sign bit, or a second bit of an integer (problem 2 below). Then decode in a
 * final pass. Say "I'm using the low bit for the current state and the second
 * bit for the next state" and the interviewer knows exactly where you are going.
 *
 * DIRECTION VECTORS keep neighbour loops readable and are worth writing once:
 *     const DIRS = [[1,0], [-1,0], [0,1], [0,-1]];             // orthogonal
 *     const DIAG = [[1,1], [1,-1], [-1,1], [-1,-1]];           // add for all 8
 *
 * COST — O(rows × cols) for anything that touches every cell; O(rows + cols)
 * for the staircase.
 */

/**
 * PROBLEM 1 — Search a 2D matrix II                             [LeetCode 240]
 * ────────────────────────────────────────────────────────────────────────────
 * Each ROW is sorted ascending left to right, and each COLUMN is sorted
 * ascending top to bottom. (The rows are NOT a single sorted sequence — row 2
 * may start below where row 1 ended.) Return whether `target` is present.
 *
 *   const m = [[1,  4,  7, 11], [2,  5,  8, 12], [3,  6,  9, 16], [10, 13, 14, 17]];
 *   searchMatrix(m, 5)   → true
 *   searchMatrix(m, 15)  → false
 *
 * TARGET: O(rows + cols) time, O(1) space.
 *
 * WHY BINARY SEARCH PER ROW IS NOT THE BEST ANSWER: it is O(rows × log cols)
 *       and, more importantly, it ignores the column ordering entirely. It is a
 *       perfectly good first answer — offer it, then improve.
 *
 * THE STAIRCASE: start at the TOP-RIGHT corner. From there
 *         · everything to the LEFT is smaller
 *         · everything BELOW is larger
 *       so one comparison eliminates an entire column or an entire row:
 *         value > target → move left   (drop the column)
 *         value < target → move down   (drop the row)
 *
 * WHY THAT CORNER: at the top-LEFT both directions increase, so a comparison
 *       tells you nothing about which way to go. The corner must be one where
 *       the two available moves have OPPOSITE effects. Bottom-left works
 *       equally well by symmetry — being able to say why both work and the
 *       other two corners do not is the real question.
 *
 * COUNT THE STEPS: at most rows + cols moves, since every step reduces one
 *       dimension and you never backtrack.
 */
export function searchMatrix(_matrix: number[][], _target: number): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Game of Life                                      [LeetCode 289]
 * ────────────────────────────────────────────────────────────────────────────
 * Each cell is 1 (live) or 0 (dead). All cells update SIMULTANEOUSLY from the
 * current state, using the eight neighbours:
 *   · a live cell with fewer than 2, or more than 3, live neighbours dies
 *   · a live cell with 2 or 3 live neighbours survives
 *   · a dead cell with exactly 3 live neighbours becomes live
 * Mutate `board` in place and return it.
 *
 *   gameOfLife([[0,1,0], [0,0,1], [1,1,1], [0,0,0]])
 *       → [[0,0,0], [1,0,1], [0,1,1], [0,1,0]]
 *   gameOfLife([[1,1], [1,0]])  → [[1,1], [1,1]]
 *
 * TARGET: O(rows × cols) time, O(1) extra space.
 *
 * THE WHOLE PROBLEM IS THE WORD "SIMULTANEOUSLY". Update a cell in place and
 *       its neighbours will read the NEW value when computing their own fate,
 *       which is wrong. Copying the board first is the honest O(rows × cols)
 *       space answer and you should state it — then be asked for O(1).
 *
 * THE BIT TRICK: store both states in one integer.
 *         bit 0 (value & 1)  = the CURRENT state — never overwritten
 *         bit 1 (value & 2)  = the NEXT state
 *       Write the next state with `board[r][c] |= 2` when a cell should be live,
 *       and read neighbours with `& 1` so they always see the ORIGINAL board.
 *       A final pass does `board[r][c] >>= 1` everywhere to reveal the result.
 *
 * WHY THIS IS MORE THAN A TRICK: it is the standard technique for simultaneous
 *       update under a space constraint, and the same idea — encode the new
 *       state in unused bits, then decode — appears in garbage collectors and
 *       in double-buffered rendering. Name the connection.
 *
 * THE FOLLOW-UP interviewers escalate to: "what if the board is infinite?" The
 *       answer is to store only the live cells as a set of coordinates and
 *       count neighbours by iterating over live cells and their neighbourhoods,
 *       which is O(live cells) rather than O(area).
 */
export function gameOfLife(_board: number[][]): number[][] {
  throw new Error('Not implemented');
}
