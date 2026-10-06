import { describe, it, expect } from 'vitest';
import { cloneGraph } from './clone-graph.ts';
import { GraphNode, buildGraph, graphToAdjacency } from '../../leetcode/support/graph.ts';



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
