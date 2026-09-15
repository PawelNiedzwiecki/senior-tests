import { GraphNode } from '../support/graph.ts';

/**
 * PATTERN 07 — BFS / DFS (graphs and grids)              [LeetCode 994, 133]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 7
 *
 * THE PATTERN
 * The same traversal, two containers, and the container is the entire
 * difference:
 *
 *     QUEUE (shift from the front) → BFS → shortest path in an UNWEIGHTED graph
 *     STACK (or recursion)         → DFS → reachability, components, flood fill
 *
 * THE TELL
 *   "shortest path" / "fewest steps" / "minimum minutes", all edges cost 1 → BFS
 *   "is there a path" / "connected components" / "flood fill" / "clone"   → DFS
 *
 * WHY BFS FINDS SHORTEST PATHS — say this, it is the one-line justification:
 *   "Every edge costs the same, so BFS reaches each node for the first time
 *    along a path of minimum length. DFS would find *a* path, not the shortest."
 *
 * MARK ON ENQUEUE, NOT ON DEQUEUE. This is the bug that costs people the
 * question: if you only mark a node visited when you pop it, the same node can
 * be pushed many times before it is ever popped, and the queue blows up to
 * exponential size on dense graphs.
 *
 * LEVEL-BY-LEVEL BFS — when you need the distance, not just the order, capture
 * the queue length before draining it:
 *
 *   while (queue.length > 0) {
 *     const levelSize = queue.length;              // freeze it first
 *     for (let i = 0; i < levelSize; i += 1) { …push neighbours… }
 *     depth += 1;
 *   }
 *
 * COST — O(V + E), or O(rows × cols) on a grid, where each cell has 4 edges.
 *
 * ONE MORE THING: `queue.shift()` is O(n) in JavaScript, so a BFS written with
 * it is quietly O(n²). Use a head index into an array instead. Interviewers at
 * senior level notice.
 */

/**
 * PROBLEM 1 — Rotting oranges                                   [LeetCode 994]
 * ────────────────────────────────────────────────────────────────────────────
 * A grid holds 0 (empty), 1 (fresh orange) or 2 (rotten orange). Every minute,
 * a rotten orange rots each fresh orange ORTHOGONALLY adjacent to it. Return
 * the number of minutes until no fresh orange remains, or -1 if some fresh
 * orange can never rot.
 *
 *   orangesRotting([[2,1,1], [1,1,0], [0,1,1]])  → 4
 *   orangesRotting([[2,1,1], [0,1,1], [1,0,1]])  → -1   (bottom-left is cut off)
 *   orangesRotting([[0,2]])                      → 0    (nothing fresh)
 *
 * TARGET: O(rows × cols) time and space.
 *
 * THE KEY WORD IS "EVERY MINUTE", plural sources: this is MULTI-SOURCE BFS.
 *       Seed the queue with EVERY rotten orange before you start, then run one
 *       level per minute. Running a separate BFS from each rotten orange and
 *       taking the minimum is both slower and wrong in the general case.
 *
 * HINT: count the fresh oranges up front. At the end, if any are left, some
 *       were unreachable — return -1. That count is also how you avoid a
 *       separate "did anything change" check.
 *
 * THE OFF-BY-ONE: the answer is the number of LEVELS AFTER the seed level, so
 *       an already-fully-rotten grid must return 0, not 1. Increment the
 *       minute counter only when a level actually rots something.
 */
export function orangesRotting(_grid: number[][]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Clone graph                                       [LeetCode 133]
 * ────────────────────────────────────────────────────────────────────────────
 * Given a reference to a node in a CONNECTED, UNDIRECTED graph, return a deep
 * copy: new node objects throughout, with the same values and the same shape.
 *
 *   const original = buildGraph([[2, 4], [1, 3], [2, 4], [1, 3]]);
 *   const copy = cloneGraph(original);
 *   graphToAdjacency(copy)  → [[2, 4], [1, 3], [2, 4], [1, 3]]
 *   copy !== original                      // different objects…
 *   copy!.neighbours[0] !== original!.neighbours[0]   // …all the way down
 *
 * TARGET: O(V + E) time and space.
 *
 * THE REAL PROBLEM IS THE CYCLES, not the traversal. A naive recursive copy
 *       revisits nodes forever. The fix is a map from ORIGINAL NODE → ITS COPY
 *       that doubles as the visited set.
 *
 * THE ORDER THAT MAKES IT WORK: create the copy and PUT IT IN THE MAP BEFORE
 *       recursing into the neighbours. If you recurse first, a cycle comes back
 *       to a node whose copy does not exist yet and you recurse forever. This
 *       one line is the whole problem.
 *
 * HINT: `new Map<GraphNode, GraphNode>()` — keying by object identity is
 *       exactly right here, and is why `Map` rather than a plain object.
 *
 * EDGE CASE: a null input returns null. An empty graph is not the same thing as
 *       a single node with no neighbours; handle both.
 */
export function cloneGraph(_node: GraphNode | null): GraphNode | null {
  throw new Error('Not implemented');
}
