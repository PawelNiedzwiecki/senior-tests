/**
 * PATTERN 15 — Union-Find (disjoint set union)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: CATALOGUE.md § 15
 *
 * THE TELL: "are these connected", "how many groups", edges arriving over time,
 * many merge-and-query operations.
 *
 * WHEN IT BEATS DFS: DFS answers connectivity ONCE, in O(V + E). Union-Find
 * answers it repeatedly as the graph CHANGES, at effectively O(1) per
 * operation. If the problem streams edges and asks after each one, DFS means
 * re-traversing the whole graph every time. That contrast is the answer to
 * "why not just DFS?".
 *
 * THE TWO OPTIMISATIONS, and why you need both:
 *   PATH COMPRESSION — during `find`, repoint every node you pass directly at
 *     the root. Flattens the tree so later finds are O(1).
 *   UNION BY RANK    — always attach the shorter tree under the taller one, so
 *     the tree never degenerates into a chain.
 * With both, each operation is O(α(n)) — inverse Ackermann, under 5 for any
 * conceivable input. Say "effectively constant".
 *
 * THE FACT THAT SOLVES HALF THE PROBLEMS: if `union(a, b)` finds a and b
 * ALREADY share a root, this edge closes a cycle.
 */

export class UnionFind {
  /** Number of disjoint sets remaining. */
  count = 0;

  constructor(_size: number) {
    throw new Error('Not implemented');
  }

  /** Root of x's set, with path compression. */
  find(_x: number): number {
    throw new Error('Not implemented');
  }

  /** Merge the two sets. Returns false if they were already merged. */
  union(_a: number, _b: number): boolean {
    throw new Error('Not implemented');
  }

  connected(_a: number, _b: number): boolean {
    throw new Error('Not implemented');
  }
}

/**
 * PROBLEM 2 — Number of connected components
 * `n` nodes labelled 0..n-1 and a list of undirected edges. How many components?
 *
 *   countComponents(5, [[0,1], [1,2], [3,4]]) → 2
 *   countComponents(5, [])                    → 5
 *
 * TARGET: O(E · α(n)) time, O(n) space.
 * HINT: start with n sets and decrement on every successful union. The count
 *       falls out — no traversal needed.
 */
export function countComponents(_n: number, _edges: Array<[number, number]>): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Redundant connection
 * A tree with n nodes (labelled 1..n) had ONE extra edge added, creating exactly
 * one cycle. Return the edge to remove. If several would work, return the one
 * appearing LAST in the input.
 *
 *   findRedundantConnection([[1,2], [1,3], [2,3]]) → [2, 3]
 *   findRedundantConnection([[1,2], [2,3], [3,4], [1,4], [1,5]]) → [1, 4]
 *
 * TARGET: O(n · α(n)) time.
 * HINT: process edges in order. The first edge whose endpoints are ALREADY
 *       connected is the one that closes the cycle — and because you go in
 *       order, it is automatically the last such edge in the input.
 * NOTE THE 1-INDEXING: nodes are 1..n, so size the structure n + 1 and ignore
 *       slot 0. Getting this wrong is the usual off-by-one here.
 */
export function findRedundantConnection(
  _edges: Array<[number, number]>,
): [number, number] | null {
  throw new Error('Not implemented');
}
