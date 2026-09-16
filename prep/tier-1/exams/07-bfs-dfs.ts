/**
 * TIER 1 · PATTERN 07 — BFS and DFS (graphs and grids)
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 90 min total    Catalogue: ../../patterns/CATALOGUE.md § 7
 *
 * THE PATTERN
 * One traversal, two containers. Push the start, then repeatedly take a node,
 * mark it, and push its unvisited neighbours. A QUEUE makes it breadth-first
 * and gives shortest paths in an unweighted graph; a STACK (or recursion)
 * makes it depth-first and answers reachability. Everything else — grids,
 * islands, provinces, word ladders — is this loop with a different definition
 * of "neighbour".
 *
 * THE TELL
 *   "shortest path" / "fewest steps", unweighted → BFS
 *   "is there a path" / "connected components" / "flood fill" → DFS (or BFS)
 *   "spreads each minute / in all directions at once" → MULTI-SOURCE BFS
 *
 * A GRID IS A GRAPH. Each cell has up to four neighbours (eight if diagonals
 * count — read the prompt). Saying that sentence collapses half of these
 * problems into the other half.
 *
 * MARK ON ENQUEUE, NOT ON DEQUEUE. This is the bug that separates working BFS
 * from quadratic BFS: if you mark when popping, a node reachable from several
 * frontier nodes is queued many times, and the queue can blow up
 * exponentially on dense graphs.
 *
 * TEMPLATE (BFS with levels — use when the ANSWER is a distance)
 *   const queue = [start];
 *   seen.add(start);
 *   let steps = 0;
 *   while (queue.length > 0) {
 *     const width = queue.length;              // freeze the level
 *     for (let i = 0; i < width; i += 1) {
 *       const node = queue.shift()!;           // a real queue in production
 *       if (isGoal(node)) return steps;
 *       for (const next of neighbours(node))
 *         if (!seen.has(next)) { seen.add(next); queue.push(next); }
 *     }
 *     steps += 1;
 *   }
 *
 * COST — O(V + E) time, O(V) space for both. On a grid that is O(rows · cols).
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * Multi-source BFS (seed the queue with every source), BFS on an IMPLICIT
 * graph where neighbours are generated rather than stored (exam 5), and
 * weighted edges, where the honest answer is Dijkstra, not BFS.
 *
 * THE SENTENCE WORTH SAYING
 *   "Unweighted shortest path, so BFS — the first time I reach a node is along
 *    a minimum-length path. O(V + E), and I mark nodes as I enqueue them."
 */

/**
 * EXAM 1 — Number of islands                                   [LeetCode 200]
 * ────────────────────────────────────────────────────────────────────────────
 * The grid holds '1' (land) and '0' (water). An island is land connected
 * horizontally or vertically. Return how many there are. You may mutate the
 * grid.
 *
 *   [['1','1','0'],
 *    ['1','0','0'],     → 2
 *    ['0','0','1']]
 *
 * TARGET: O(rows · cols) time.
 *
 * HINT: scan every cell; when you find unvisited land, that is a NEW island —
 *       increment, then flood-fill everything reachable from it so it is never
 *       counted again. The traversal itself is not the answer; the count of
 *       times you START one is.
 *
 *       Sinking visited land to '0' costs no extra space and is fine when the
 *       prompt allows mutation — say that you are doing it, and what you would
 *       do instead if the caller needed the grid intact.
 */
export function numIslands(_grid: string[][]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Number of provinces                                 [LeetCode 547]
 * ────────────────────────────────────────────────────────────────────────────
 * `isConnected[i][j] === 1` means cities i and j are directly connected. The
 * matrix is symmetric with 1s on the diagonal. Return the number of connected
 * components.
 *
 *   [[1,1,0],[1,1,0],[0,0,1]]  → 2
 *   [[1,0,0],[0,1,0],[0,0,1]]  → 3
 *
 * TARGET: O(n²) time — you must read the adjacency matrix — and O(n) space.
 *
 * HINT: the same "count how many traversals it takes" shape as exam 1, with
 *       the grid replaced by an ADJACENCY MATRIX: the neighbours of i are the
 *       j where `isConnected[i][j] === 1`. Recognising that two problems with
 *       completely different prompts are one problem is what this exam is for.
 *
 *       Union-Find is the other classic answer here (CATALOGUE § 15) — name it
 *       as the alternative, and say when it wins: when edges ARRIVE OVER TIME
 *       rather than being given up front.
 */
export function numberOfProvinces(_isConnected: number[][]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Shortest path in a binary matrix                   [LeetCode 1091]
 * ────────────────────────────────────────────────────────────────────────────
 * In an n×n grid of 0s (open) and 1s (blocked), return the length of the
 * shortest clear path from the top-left to the bottom-right, counting CELLS
 * VISITED, moving in any of the 8 directions. Return -1 if there is none.
 *
 *   [[0,1],[1,0]]            → 2
 *   [[0,0,0],[1,1,0],[1,1,0]] → 4
 *   [[1,0,0],[1,1,0],[1,1,0]] → -1
 *
 * TARGET: O(n²) time and space.
 *
 * HINT: unweighted shortest path → BFS, and the eight directions are the only
 *       twist. Two things to get right:
 *
 *       · check the START cell for being blocked before you enqueue anything;
 *       · the answer counts CELLS, not moves, so the start is already 1.
 *
 *       Track distance per node (or use the level-sweep template) — and mark
 *       cells as seen when you ENQUEUE them, or the same cell enters the queue
 *       from several neighbours.
 */
export function shortestPathBinaryMatrix(_grid: number[][]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Pacific Atlantic water flow                         [LeetCode 417]
 * ────────────────────────────────────────────────────────────────────────────
 * `heights[r][c]` is a cell's height. Water flows from a cell to a neighbour
 * of EQUAL OR LOWER height. The Pacific touches the top and left edges, the
 * Atlantic the bottom and right. Return every cell from which water can reach
 * BOTH oceans, as [row, col] pairs in any order.
 *
 *   [[1,2,2,3,5],
 *    [3,2,3,4,4],
 *    [2,4,5,3,1],     → [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
 *    [6,7,1,4,5],
 *    [5,1,1,2,4]]
 *
 * TARGET: O(rows · cols) time.
 *
 * HINT: running a search from every cell is O((rc)²). INVERT IT — start at the
 *       ocean edges and walk UPHILL (to neighbours of equal or greater
 *       height), which marks every cell that can drain into that ocean. Two
 *       multi-source traversals, one per ocean, then intersect the two sets.
 *
 *       Reversing the direction of the relation is the senior move here, and
 *       it generalises: when "which sources reach this target" is expensive,
 *       ask "which targets does this source reach" from the other end.
 */
export function pacificAtlantic(_heights: number[][]): Array<[number, number]> {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Open the lock                                       [LeetCode 752]
 * ────────────────────────────────────────────────────────────────────────────
 * A lock has four wheels showing '0'–'9', starting at '0000'. One move turns
 * one wheel one step, wrapping between '0' and '9'. The lock jams if it ever
 * shows one of the `deadends`. Return the fewest moves to reach `target`, or
 * -1 if impossible.
 *
 *   openLock(['0201', '0101', '0102', '1212', '2002'], '0202')  → 6
 *   openLock(['8888'], '0009')                                  → 1
 *   openLock(['0000'], '8888')                                  → -1
 *
 * TARGET: O(10⁴ · 8) states and transitions.
 *
 * HINT: an IMPLICIT GRAPH — nobody hands you the edges. A state is the
 *       four-character string; its neighbours are the 8 strings one wheel-turn
 *       away. Once you see that, it is the level-sweep BFS template verbatim.
 *
 *       Check the deadends BEFORE enqueuing, including the start '0000'
 *       itself, and keep the deadends in a Set rather than scanning the array.
 *       The wrap is `(digit + 1) % 10` and `(digit + 9) % 10` — the second one
 *       avoids a negative-modulo branch.
 */
export function openLock(_deadends: string[], _target: string): number {
  throw new Error('Not implemented');
}
