/**
 * SOLUTIONS — BFS / DFS
 */

import { GraphNode } from '../../leetcode/support/graph.ts';

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
