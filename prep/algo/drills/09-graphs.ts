/**
 * MODULE 09 — Graphs: grids, BFS, DFS and cycles
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 60 min      DIFFICULTY: ●●●●○
 *
 * THE PATTERN
 * Most "graph" problems in interviews are not given as graphs. They are given
 * as a grid, a list of dependencies, or a set of words — and spotting the graph
 * is half the work. Say it explicitly when you do:
 *   "This is a graph problem: each cell is a node and adjacent cells are edges."
 *
 * BFS OR DFS?
 *   BFS — shortest path in an UNWEIGHTED graph, level-by-level anything.
 *         Queue. O(V + E) time, O(V) space.
 *   DFS — connectivity, "is there a path", flood fill, cycle detection,
 *         topological order. Recursion or an explicit stack. O(V + E) time,
 *         O(V) space (O(depth) for the stack).
 * If the question says SHORTEST and the edges are unweighted, it is BFS. DFS
 * finds *a* path, not the shortest one. Getting that wrong is a big miss.
 *
 * THE THREE THINGS EVERY TRAVERSAL NEEDS
 *   1. A `visited` structure. Without it you loop forever on any cycle — and a
 *      grid is full of cycles, because you can always step back.
 *   2. MARK VISITED WHEN YOU ENQUEUE, not when you dequeue. Marking on dequeue
 *      lets the same node be enqueued many times before it is processed once;
 *      on a big grid that is a real blow-up.
 *   3. Bounds checking before you index.
 *
 * THE DIRECTIONS IDIOM — write it once, reuse it everywhere:
 *   const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];   // up, down, left, right
 *   for (const [dr, dc] of DIRS) { ... }
 * Add the four diagonals if the problem says 8-directional. Ask which it is.
 *
 * COMPLEXITY FOR GRIDS: V = rows × cols, E ≈ 4V, so everything is O(rows × cols).
 * Say it in those terms — it is clearer than V and E for a grid.
 */

/**
 * PROBLEM 1 — Number of Islands
 * A grid of '1' (land) and '0' (water). An island is land connected
 * horizontally or vertically. Count the islands.
 *
 *   [['1','1','0'],
 *    ['1','0','0'],
 *    ['0','0','1']]   → 2
 *
 * TARGET: O(rows × cols) time and space.
 * HINT: scan every cell. On unvisited land, that is a new island — flood fill
 *       it entirely so you never count it again, then keep scanning.
 * DECIDE AND SAY: sinking the island by mutating the grid to '0' is O(1) extra
 *       space but destroys the caller's input. A separate `visited` set is O(V)
 *       but non-destructive. Both are correct — state which you chose and why.
 *       (These tests require the input NOT to be mutated.)
 */
export function numIslands(_grid: string[][]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Course Schedule (cycle detection)
 * `prerequisites[i] = [a, b]` means you must take b before a. Return whether
 * all `numCourses` courses can be finished.
 *
 *   canFinish(2, [[1, 0]])         → true
 *   canFinish(2, [[1, 0], [0, 1]]) → false   (circular)
 *
 * TARGET: O(V + E) time, O(V + E) space.
 * THE INSIGHT: "can I finish everything" is exactly "is this directed graph
 *       acyclic". Say that — the translation is the answer.
 * TWO APPROACHES, know at least one cold:
 *   - KAHN'S ALGORITHM (BFS): repeatedly take a node with in-degree 0 and
 *     remove it. If you cannot place all V nodes, a cycle remains. Also gives
 *     you the topological ORDER for free, which is the usual follow-up.
 *   - DFS with three colours (unvisited / in-progress / done): meeting an
 *     IN-PROGRESS node means a back edge, so a cycle. A two-state visited set
 *     is NOT enough — that is the classic bug here.
 */
export function canFinish(_numCourses: number, _prerequisites: Array<[number, number]>): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Shortest Path in a Binary Grid
 * 0 = open, 1 = blocked. Move up/down/left/right. Return the number of CELLS on
 * the shortest path from top-left to bottom-right, or -1 if unreachable.
 * A 1×1 open grid has a path of length 1.
 *
 *   [[0,0,0],
 *    [1,1,0],
 *    [0,0,0]]   → 5
 *
 * TARGET: O(rows × cols) time and space.
 * HINT: BFS, and BFS only. Because every edge costs the same, the first time
 *       BFS reaches a cell it has reached it by a shortest path — that property
 *       is exactly why BFS answers "shortest" and DFS does not.
 * WATCH: the start cell may itself be blocked. Check before you begin.
 */
export function shortestPath(_grid: number[][]): number {
  throw new Error('Not implemented');
}
