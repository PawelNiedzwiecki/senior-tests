import { describe, it, expect } from 'vitest';
import {
  numIslands,
  numberOfProvinces,
  shortestPathBinaryMatrix,
  pacificAtlantic,
  openLock,
} from '@tier1/07-bfs-dfs.ts';

const grid = (rows: string[]) => rows.map((row) => [...row]);

describe('exam 1 — numIslands', () => {
  it('counts separate land masses', () => {
    expect(numIslands(grid(['110', '100', '001']))).toBe(2);
    expect(numIslands(grid(['11110', '11010', '11000', '00000']))).toBe(1);
    expect(numIslands(grid(['11000', '11000', '00100', '00011']))).toBe(3);
  });

  it('does not connect diagonally', () => {
    expect(numIslands(grid(['10', '01']))).toBe(2);
  });

  it('handles all water, all land and a single cell', () => {
    expect(numIslands(grid(['000', '000']))).toBe(0);
    expect(numIslands(grid(['111', '111']))).toBe(1);
    expect(numIslands(grid(['1']))).toBe(1);
    expect(numIslands([])).toBe(0);
  });

  it('handles a long snake that needs a full traversal', () => {
    expect(numIslands(grid(['11111', '00001', '11111', '10000', '11111']))).toBe(1);
  });
});

describe('exam 2 — numberOfProvinces', () => {
  it('handles the prompt examples', () => {
    expect(
      numberOfProvinces([
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1],
      ]),
    ).toBe(2);
    expect(
      numberOfProvinces([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
    ).toBe(3);
  });

  it('handles one fully connected province', () => {
    expect(
      numberOfProvinces([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]),
    ).toBe(1);
  });

  it('follows transitive connections', () => {
    expect(
      numberOfProvinces([
        [1, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 1],
      ]),
    ).toBe(2);
  });

  it('handles a single city', () => {
    expect(numberOfProvinces([[1]])).toBe(1);
  });
});

describe('exam 3 — shortestPathBinaryMatrix', () => {
  it('handles the prompt examples', () => {
    expect(
      shortestPathBinaryMatrix([
        [0, 1],
        [1, 0],
      ]),
    ).toBe(2);
    expect(
      shortestPathBinaryMatrix([
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]),
    ).toBe(4);
    expect(
      shortestPathBinaryMatrix([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ]),
    ).toBe(-1);
  });

  it('returns 1 for a 1x1 open grid and -1 when it is blocked', () => {
    expect(shortestPathBinaryMatrix([[0]])).toBe(1);
    expect(shortestPathBinaryMatrix([[1]])).toBe(-1);
  });

  it('checks the destination as well as the start', () => {
    expect(
      shortestPathBinaryMatrix([
        [0, 0],
        [0, 1],
      ]),
    ).toBe(-1);
  });

  it('takes the diagonal shortcut across an open grid', () => {
    const open = Array.from({ length: 5 }, () => new Array<number>(5).fill(0));
    expect(shortestPathBinaryMatrix(open)).toBe(5);
  });

  it('routes around two walls, each with a single gap', () => {
    expect(
      shortestPathBinaryMatrix([
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
      ]),
    ).toBe(13);
  });
});

describe('exam 4 — pacificAtlantic', () => {
  const key = (cells: Array<[number, number]>) =>
    cells.map(([r, c]) => `${r},${c}`).sort();

  it('handles the prompt example', () => {
    expect(
      key(
        pacificAtlantic([
          [1, 2, 2, 3, 5],
          [3, 2, 3, 4, 4],
          [2, 4, 5, 3, 1],
          [6, 7, 1, 4, 5],
          [5, 1, 1, 2, 4],
        ]),
      ),
    ).toEqual(key([
      [0, 4],
      [1, 3],
      [1, 4],
      [2, 2],
      [3, 0],
      [3, 1],
      [4, 0],
    ]));
  });

  it('returns every cell of a flat grid', () => {
    expect(
      key(
        pacificAtlantic([
          [1, 1],
          [1, 1],
        ]),
      ),
    ).toEqual(key([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]));
  });

  it('handles a single cell and a single row', () => {
    expect(pacificAtlantic([[42]])).toEqual([[0, 0]]);
    expect(key(pacificAtlantic([[1, 2, 3]]))).toEqual(key([
      [0, 0],
      [0, 1],
      [0, 2],
    ]));
  });

  it('handles an empty grid', () => {
    expect(pacificAtlantic([])).toEqual([]);
  });
});

describe('exam 5 — openLock', () => {
  it('handles the prompt examples', () => {
    expect(openLock(['0201', '0101', '0102', '1212', '2002'], '0202')).toBe(6);
    expect(openLock(['8888'], '0009')).toBe(1);
    expect(openLock(['0000'], '8888')).toBe(-1);
  });

  it('returns 0 when the lock already shows the target', () => {
    expect(openLock([], '0000')).toBe(0);
  });

  it('counts wrap-around as one move', () => {
    expect(openLock([], '9000')).toBe(1);
    expect(openLock([], '9999')).toBe(4);
  });

  it('returns -1 when the target is walled off', () => {
    expect(
      openLock(
        ['8887', '8889', '8878', '8898', '8788', '8988', '7888', '9888'],
        '8888',
      ),
    ).toBe(-1);
  });

  it('takes the shortest of several routes', () => {
    expect(openLock([], '0202')).toBe(4);
  });
});
