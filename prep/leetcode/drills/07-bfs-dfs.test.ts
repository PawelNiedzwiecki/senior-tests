import { describe, it, expect } from 'vitest';
import { orangesRotting, cloneGraph } from '@leetcode/07-bfs-dfs.ts';
import { GraphNode, buildGraph, graphToAdjacency } from '../support/graph.ts';

describe('orangesRotting', () => {
  it('handles the prompt examples', () => {
    expect(
      orangesRotting([
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1],
      ]),
    ).toBe(4);

    expect(
      orangesRotting([
        [2, 1, 1],
        [0, 1, 1],
        [1, 0, 1],
      ]),
    ).toBe(-1);

    expect(orangesRotting([[0, 2]])).toBe(0);
  });

  it('returns 0 when there is nothing fresh', () => {
    expect(orangesRotting([[0, 0, 0]])).toBe(0);
    expect(orangesRotting([[2, 2], [2, 2]])).toBe(0);
    expect(orangesRotting([])).toBe(0);
  });

  it('returns -1 when there is no rotten orange at all', () => {
    expect(orangesRotting([[1]])).toBe(-1);
    expect(orangesRotting([[1, 1], [1, 1]])).toBe(-1);
  });

  it('spreads from several sources at once', () => {
    // With one source this would take 4 minutes; with two it takes 2.
    expect(orangesRotting([[2, 1, 1, 1, 2]])).toBe(2);
  });

  it('handles a single fresh orange next to a rotten one', () => {
    expect(orangesRotting([[2, 1]])).toBe(1);
  });

  it('handles a long corridor without quadratic queue behaviour', () => {
    const corridor = [[2, ...Array.from({ length: 50_000 }, () => 1)]];
    const started = Date.now();
    expect(orangesRotting(corridor)).toBe(50_000);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});

describe('cloneGraph', () => {
  it('clones the shape of a four-node cycle', () => {
    const original = buildGraph([
      [2, 4],
      [1, 3],
      [2, 4],
      [1, 3],
    ]);
    const copy = cloneGraph(original);
    expect(graphToAdjacency(copy)).toEqual([
      [2, 4],
      [1, 3],
      [2, 4],
      [1, 3],
    ]);
  });

  it('returns genuinely new objects, all the way down', () => {
    const original = buildGraph([
      [2, 4],
      [1, 3],
      [2, 4],
      [1, 3],
    ])!;
    const copy = cloneGraph(original)!;

    expect(copy).not.toBe(original);
    expect(copy.val).toBe(original.val);
    for (let i = 0; i < original.neighbours.length; i += 1) {
      expect(copy.neighbours[i]).not.toBe(original.neighbours[i]);
      expect(copy.neighbours[i]!.val).toBe(original.neighbours[i]!.val);
    }
  });

  it('preserves shared identity inside the copy (no duplicated nodes)', () => {
    const original = buildGraph([
      [2, 4],
      [1, 3],
      [2, 4],
      [1, 3],
    ])!;
    const copy = cloneGraph(original)!;

    // Node 1's neighbour 2, and node 2's neighbour 1, must be the same objects.
    const copyOfTwo = copy.neighbours[0]!;
    expect(copyOfTwo.neighbours).toContain(copy);
  });

  it('does not mutate the original', () => {
    const original = buildGraph([
      [2],
      [1],
    ])!;
    cloneGraph(original);
    expect(graphToAdjacency(original)).toEqual([[2], [1]]);
  });

  it('handles null and a single isolated node', () => {
    expect(cloneGraph(null)).toBeNull();

    const lone = new GraphNode(1);
    const copy = cloneGraph(lone)!;
    expect(copy).not.toBe(lone);
    expect(copy.val).toBe(1);
    expect(copy.neighbours).toEqual([]);
  });

  it('handles a self-loop', () => {
    const node = new GraphNode(1);
    node.neighbours = [node];
    const copy = cloneGraph(node)!;
    expect(copy).not.toBe(node);
    expect(copy.neighbours[0]).toBe(copy); // the loop points at the COPY
  });
});
