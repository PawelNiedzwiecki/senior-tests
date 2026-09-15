/**
 * Shared graph scaffolding for the LeetCode drills. Not a drill — in a real
 * interview this node shape is given to you in the problem statement.
 */

export class GraphNode {
  val: number;
  neighbours: GraphNode[];

  constructor(val: number, neighbours: GraphNode[] = []) {
    this.val = val;
    this.neighbours = neighbours;
  }
}

/**
 * Builds an undirected graph from an adjacency list. `adjacency[i]` lists the
 * 1-indexed labels adjacent to node `i + 1`, matching LeetCode's format.
 *
 *   buildGraph([[2, 4], [1, 3], [2, 4], [1, 3]])  // the 4-cycle 1-2-3-4-1
 */
export function buildGraph(adjacency: number[][]): GraphNode | null {
  if (adjacency.length === 0) return null;

  const nodes = adjacency.map((_, i) => new GraphNode(i + 1));
  adjacency.forEach((neighbours, i) => {
    nodes[i]!.neighbours = neighbours.map((label) => nodes[label - 1]!);
  });

  return nodes[0]!;
}

/** Reads a graph back into the adjacency-list format `buildGraph` accepts. */
export function graphToAdjacency(start: GraphNode | null): number[][] {
  if (start === null) return [];

  const seen = new Map<number, GraphNode>();
  const stack = [start];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (seen.has(node.val)) continue;
    seen.set(node.val, node);
    for (const neighbour of node.neighbours) stack.push(neighbour);
  }

  return [...seen.keys()]
    .sort((a, b) => a - b)
    .map((label) => seen.get(label)!.neighbours.map((n) => n.val).sort((a, b) => a - b));
}
