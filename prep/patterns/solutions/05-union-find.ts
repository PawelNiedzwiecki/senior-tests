/**
 * SOLUTIONS — Union-Find
 */

/**
 * THE STRUCTURE
 *
 * COMPLEXITY: with path compression AND union by rank, every operation is
 * O(α(n)) — inverse Ackermann, below 5 for any input that fits in the
 * observable universe. Say "effectively constant, α(n)". Without both
 * optimisations it degrades to O(log n), and with neither, to O(n).
 *
 * PATH COMPRESSION — the recursive one-liner in `find` repoints every node on
 * the path directly at the root, so the tree flattens as a side effect of
 * querying it. On very deep trees the recursion could in principle overflow;
 * the iterative two-pass or path-halving variants avoid that. Worth a sentence
 * if asked, not worth pre-empting.
 *
 * UNION BY RANK — attaching the shorter tree under the taller one keeps depth
 * logarithmic even before compression kicks in. `rank` is an upper bound on
 * height, not the exact height (compression invalidates the exact value), which
 * is why it only increments when two equal-rank trees merge.
 *
 * `count` — maintained incrementally, so "how many components" is O(1) rather
 * than a traversal. That is usually the actual question being asked.
 */
export class UnionFind {
  private readonly parent: number[];
  private readonly rank: number[];
  count: number;

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i); // everyone their own root
    this.rank = new Array<number>(size).fill(0);
    this.count = size;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]!); // path compression
    }
    return this.parent[x]!;
  }

  union(a: number, b: number): boolean {
    const rootA = this.find(a);
    const rootB = this.find(b);

    // Already together — this edge closes a cycle.
    if (rootA === rootB) return false;

    // Union by rank: shorter tree hangs off the taller one.
    if (this.rank[rootA]! < this.rank[rootB]!) {
      this.parent[rootA] = rootB;
    } else {
      this.parent[rootB] = rootA;
      if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]! += 1;
    }

    this.count -= 1;
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}

/**
 * PROBLEM 2 — Number of connected components
 *
 * NARRATION:
 *   "I could DFS from every unvisited node — that's O(V + E) and perfectly
 *    fine here. I'll use Union-Find because it maintains the count
 *    incrementally, so it also answers the follow-up where edges arrive over
 *    time without re-traversing anything."
 *
 * COMPLEXITY: O(E · α(n)) time, O(n) space.
 *
 * THE COUNT FALLS OUT: start at n sets, decrement on each successful union.
 * A union that returns false was a redundant edge and correctly changes nothing.
 */
export function countComponents(n: number, edges: Array<[number, number]>): number {
  const uf = new UnionFind(n);
  for (const [a, b] of edges) uf.union(a, b);
  return uf.count;
}

/**
 * PROBLEM 3 — Redundant connection
 *
 * THE ONE-LINE INSIGHT:
 *   "Process the edges in order. The first edge whose endpoints are already
 *    connected is the one that closes the cycle — and since I'm going in input
 *    order, it is automatically the last such edge, which is what the prompt
 *    asks for."
 *
 * COMPLEXITY: O(n · α(n)) time, O(n) space.
 *
 * `union` RETURNING false IS THE ENTIRE CYCLE DETECTOR. No separate traversal,
 * no colouring, no visited set. This is the cleanest demonstration of why the
 * structure is worth knowing.
 *
 * 1-INDEXED NODES: the prompt labels nodes 1..n, so allocate n + 1 slots and
 * leave index 0 unused. Sizing it at n is the standard off-by-one here — and
 * `edges.length` equals n for a tree-plus-one-edge, which is why sizing from
 * the edge count works.
 *
 * DFS ALTERNATIVE: for each edge, check whether a path already exists between
 * its endpoints — O(n²). Union-Find is the reason this is linear.
 */
export function findRedundantConnection(
  edges: Array<[number, number]>,
): [number, number] | null {
  // Nodes are 1..n; +1 so we can index by label directly.
  const uf = new UnionFind(edges.length + 1);

  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return [a, b]; // already connected ⇒ closes the cycle
  }

  return null;
}
