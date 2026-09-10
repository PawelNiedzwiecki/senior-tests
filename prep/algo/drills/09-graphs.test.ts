import { describe, it, expect } from 'vitest';
import { numIslands, canFinish, shortestPath } from '@algo/09-graphs.ts';

describe('numIslands', () => {
  it('counts separate islands', () => {
    expect(
      numIslands([
        ['1', '1', '0'],
        ['1', '0', '0'],
        ['0', '0', '1'],
      ]),
    ).toBe(2);
  });

  it('counts one big island', () => {
    expect(
      numIslands([
        ['1', '1', '1'],
        ['1', '1', '1'],
      ]),
    ).toBe(1);
  });

  it('returns 0 for all water', () => {
    expect(
      numIslands([
        ['0', '0'],
        ['0', '0'],
      ]),
    ).toBe(0);
  });

  it('does not connect diagonally', () => {
    expect(
      numIslands([
        ['1', '0'],
        ['0', '1'],
      ]),
    ).toBe(2);
  });

  it('handles an empty grid', () => {
    expect(numIslands([])).toBe(0);
    expect(numIslands([[]])).toBe(0);
  });

  it('handles a single cell', () => {
    expect(numIslands([['1']])).toBe(1);
    expect(numIslands([['0']])).toBe(0);
  });

  it('does not mutate the input grid', () => {
    const grid = [
      ['1', '1'],
      ['0', '1'],
    ];
    const snapshot = JSON.stringify(grid);
    numIslands(grid);
    expect(JSON.stringify(grid)).toBe(snapshot);
  });

  it('handles a snake-shaped island', () => {
    expect(
      numIslands([
        ['1', '1', '1', '1'],
        ['0', '0', '0', '1'],
        ['1', '1', '1', '1'],
      ]),
    ).toBe(1);
  });
});

describe('canFinish', () => {
  it('accepts a simple dependency', () => {
    expect(canFinish(2, [[1, 0]])).toBe(true);
  });

  it('rejects a two-node cycle', () => {
    expect(
      canFinish(2, [
        [1, 0],
        [0, 1],
      ]),
    ).toBe(false);
  });

  it('accepts no prerequisites at all', () => {
    expect(canFinish(3, [])).toBe(true);
  });

  it('accepts a long chain', () => {
    expect(
      canFinish(4, [
        [1, 0],
        [2, 1],
        [3, 2],
      ]),
    ).toBe(true);
  });

  it('rejects a longer cycle', () => {
    expect(
      canFinish(4, [
        [1, 0],
        [2, 1],
        [3, 2],
        [0, 3],
      ]),
    ).toBe(false);
  });

  it('accepts a diamond (shared prerequisite, no cycle)', () => {
    expect(
      canFinish(4, [
        [1, 0],
        [2, 0],
        [3, 1],
        [3, 2],
      ]),
    ).toBe(true);
  });

  it('detects a cycle in one component while another is fine', () => {
    expect(
      canFinish(5, [
        [1, 0],
        [3, 4],
        [4, 3],
      ]),
    ).toBe(false);
  });

  it('handles a self-loop', () => {
    expect(canFinish(1, [[0, 0]])).toBe(false);
  });
});

describe('shortestPath', () => {
  it('handles the prompt example', () => {
    expect(
      shortestPath([
        [0, 0, 0],
        [1, 1, 0],
        [0, 0, 0],
      ]),
    ).toBe(5);
  });

  it('returns 1 for a single open cell', () => {
    expect(shortestPath([[0]])).toBe(1);
  });

  it('returns -1 when the start is blocked', () => {
    expect(shortestPath([[1]])).toBe(-1);
    expect(
      shortestPath([
        [1, 0],
        [0, 0],
      ]),
    ).toBe(-1);
  });

  it('returns -1 when the end is blocked', () => {
    expect(
      shortestPath([
        [0, 0],
        [0, 1],
      ]),
    ).toBe(-1);
  });

  it('returns -1 when there is no route', () => {
    expect(
      shortestPath([
        [0, 1],
        [1, 0],
      ]),
    ).toBe(-1);
  });

  it('walks a straight corridor', () => {
    expect(shortestPath([[0, 0, 0, 0]])).toBe(4);
  });

  it('finds the shorter of two routes', () => {
    expect(
      shortestPath([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]),
    ).toBe(5);
  });

  it('handles an empty grid', () => {
    expect(shortestPath([])).toBe(-1);
  });
});
