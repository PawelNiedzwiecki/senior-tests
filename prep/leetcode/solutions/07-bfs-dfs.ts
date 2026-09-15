/**
 * SOLUTIONS — BFS / DFS
 */

import { GraphNode } from '../support/graph.ts';

/**
 * PROBLEM 1 — Rotting oranges
 *
 * COMPLEXITY: O(rows × cols) time and space — every cell is enqueued at most
 * once.
 *
 * NARRATION:
 *   "Rot spreads from all rotten oranges simultaneously, so this is
 *    multi-source BFS: I seed the queue with every rotten cell, then process
 *    one level per minute. I also count the fresh oranges, so at the end an
 *    unreachable one shows up as a non-zero remainder and I return -1."
 *
 * MULTI-SOURCE is the insight. Because every source starts at distance 0, the
 * first time BFS reaches a fresh orange is via the nearest rotten one — which
 * is exactly the minute it actually rots.
 *
 * THE HEAD POINTER instead of `queue.shift()`: shift is O(n) on a JavaScript
 * array, so shifting inside the loop makes the traversal quadratic. Walking a
 * read index over the array keeps it linear. This is a small thing that senior
 * interviews specifically look for.
 *
 * MARK ON ENQUEUE — the grid is mutated to 2 the moment a cell is queued, so no
 * cell is ever queued twice and no separate visited set is needed. (Mutating
 * the input is worth flagging aloud; copy the grid first if the caller cares.)
 *
 * THE MINUTE COUNT increments only when a level actually rots something, which
 * is what makes an already-rotten grid return 0 rather than 1.
 */
export function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = rows === 0 ? 0 : grid[0]!.length;

  const queue: Array<[number, number]> = [];
  let fresh = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r]![c] === 2) queue.push([r, c]);
      else if (grid[r]![c] === 1) fresh += 1;
    }
  }

  if (fresh === 0) return 0; // nothing to rot — before any BFS runs

  const directions: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let head = 0; // read index — never `queue.shift()`, which is O(n)
  let minutes = 0;

  while (head < queue.length) {
    const levelSize = queue.length - head; // freeze the level before draining
    let rottedThisMinute = false;

    for (let i = 0; i < levelSize; i += 1) {
      const [r, c] = queue[head]!;
      head += 1;

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr]![nc] !== 1) continue;

        grid[nr]![nc] = 2; // mark on ENQUEUE, not on dequeue
        fresh -= 1;
        rottedThisMinute = true;
        queue.push([nr, nc]);
      }
    }

    if (rottedThisMinute) minutes += 1;
  }

  return fresh === 0 ? minutes : -1; // leftovers were unreachable
}

/**
 * PROBLEM 2 — Clone graph
 *
 * COMPLEXITY: O(V + E) time and space.
 *
 * NARRATION:
 *   "The traversal is ordinary DFS; the only real problem is that the graph has
 *    cycles, so I keep a map from original node to its copy. That map is both
 *    my memo and my visited set. The critical ordering is that I register the
 *    copy in the map BEFORE recursing into neighbours — otherwise a cycle comes
 *    back to a node whose copy does not exist yet and recurses forever."
 *
 * KEYING BY OBJECT IDENTITY: `Map<GraphNode, GraphNode>` works because node
 * references are stable. Keying by `val` also works when values are unique, but
 * the problem does not promise that in general — say which assumption you are
 * relying on.
 *
 * ITERATIVE ALTERNATIVE: the same algorithm with an explicit stack avoids stack
 * overflow on a graph tens of thousands of nodes deep. Worth mentioning if the
 * interviewer pushes on scale; the recursive version is clearer to write first.
 *
 * THE GENERAL LESSON: this is structural sharing done right. The identical
 * map-as-you-go technique is what a correct `deepClone` for objects with cycles
 * does, which is a nice bridge if the interview is a frontend one.
 */
export function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (node === null) return null;

  const copies = new Map<GraphNode, GraphNode>();

  const clone = (original: GraphNode): GraphNode => {
    const existing = copies.get(original);
    if (existing !== undefined) return existing;

    const copy = new GraphNode(original.val);
    copies.set(original, copy); // register BEFORE recursing — this is the fix
    copy.neighbours = original.neighbours.map(clone);
    return copy;
  };

  return clone(node);
}
