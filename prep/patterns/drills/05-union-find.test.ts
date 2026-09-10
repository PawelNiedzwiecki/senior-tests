import { describe, it, expect } from 'vitest';
import {
  UnionFind,
  countComponents,
  findRedundantConnection,
} from '@patterns/05-union-find.ts';

describe('UnionFind', () => {
  it('starts with every element in its own set', () => {
    const uf = new UnionFind(5);
    expect(uf.count).toBe(5);
    expect(uf.connected(0, 1)).toBe(false);
  });

  it('merges sets', () => {
    const uf = new UnionFind(5);
    expect(uf.union(0, 1)).toBe(true);
    expect(uf.connected(0, 1)).toBe(true);
    expect(uf.count).toBe(4);
  });

  it('returns false when already merged', () => {
    const uf = new UnionFind(3);
    uf.union(0, 1);
    expect(uf.union(0, 1)).toBe(false);
    expect(uf.union(1, 0)).toBe(false);
    expect(uf.count).toBe(2);
  });

  it('is transitive', () => {
    const uf = new UnionFind(4);
    uf.union(0, 1);
    uf.union(1, 2);
    expect(uf.connected(0, 2)).toBe(true);
    expect(uf.connected(0, 3)).toBe(false);
  });

  it('merges whole sets, not just elements', () => {
    const uf = new UnionFind(6);
    uf.union(0, 1);
    uf.union(2, 3);
    uf.union(1, 2); // joins {0,1} with {2,3}
    expect(uf.connected(0, 3)).toBe(true);
    expect(uf.count).toBe(3); // {0,1,2,3}, {4}, {5}
  });

  it('treats an element as connected to itself', () => {
    const uf = new UnionFind(2);
    expect(uf.connected(0, 0)).toBe(true);
    expect(uf.union(0, 0)).toBe(false);
  });

  it('handles a long chain without degenerating', () => {
    const uf = new UnionFind(1000);
    for (let i = 0; i < 999; i += 1) uf.union(i, i + 1);
    expect(uf.count).toBe(1);
    expect(uf.connected(0, 999)).toBe(true);
  });

  it('handles size 0 and 1', () => {
    expect(new UnionFind(0).count).toBe(0);
    expect(new UnionFind(1).count).toBe(1);
  });
});

describe('countComponents', () => {
  it('handles the prompt examples', () => {
    expect(
      countComponents(5, [
        [0, 1],
        [1, 2],
        [3, 4],
      ]),
    ).toBe(2);
    expect(countComponents(5, [])).toBe(5);
  });

  it('handles a fully connected graph', () => {
    expect(
      countComponents(3, [
        [0, 1],
        [1, 2],
      ]),
    ).toBe(1);
  });

  it('ignores redundant edges', () => {
    expect(
      countComponents(3, [
        [0, 1],
        [1, 2],
        [0, 2],
      ]),
    ).toBe(1);
  });

  it('handles zero nodes', () => {
    expect(countComponents(0, [])).toBe(0);
  });

  it('handles self-loops', () => {
    expect(countComponents(3, [[0, 0]])).toBe(3);
  });
});

describe('findRedundantConnection', () => {
  it('handles the prompt examples', () => {
    expect(
      findRedundantConnection([
        [1, 2],
        [1, 3],
        [2, 3],
      ]),
    ).toEqual([2, 3]);
    expect(
      findRedundantConnection([
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 4],
        [1, 5],
      ]),
    ).toEqual([1, 4]);
  });

  it('returns the LAST edge that closes a cycle', () => {
    expect(
      findRedundantConnection([
        [1, 2],
        [2, 3],
        [1, 3],
      ]),
    ).toEqual([1, 3]);
  });

  it('returns null when there is no cycle', () => {
    expect(
      findRedundantConnection([
        [1, 2],
        [2, 3],
      ]),
    ).toBeNull();
  });

  it('handles a two-node cycle', () => {
    expect(
      findRedundantConnection([
        [1, 2],
        [1, 2],
      ]),
    ).toEqual([1, 2]);
  });

  it('handles an empty edge list', () => {
    expect(findRedundantConnection([])).toBeNull();
  });
});
