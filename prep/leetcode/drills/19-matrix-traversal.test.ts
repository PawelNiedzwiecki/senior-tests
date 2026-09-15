import { describe, it, expect } from 'vitest';
import { searchMatrix, gameOfLife } from '@leetcode/19-matrix-traversal.ts';

describe('searchMatrix', () => {
  const matrix = [
    [1, 4, 7, 11, 15],
    [2, 5, 8, 12, 19],
    [3, 6, 9, 16, 22],
    [10, 13, 14, 17, 24],
    [18, 21, 23, 26, 30],
  ];

  it('handles the prompt examples', () => {
    expect(searchMatrix(matrix, 5)).toBe(true);
    expect(searchMatrix(matrix, 20)).toBe(false);
  });

  it('finds every value that is present', () => {
    for (const row of matrix) {
      for (const value of row) expect(searchMatrix(matrix, value)).toBe(true);
    }
  });

  it('rejects values outside the range', () => {
    expect(searchMatrix(matrix, 0)).toBe(false);
    expect(searchMatrix(matrix, 31)).toBe(false);
  });

  it('handles the corners', () => {
    expect(searchMatrix(matrix, 1)).toBe(true);
    expect(searchMatrix(matrix, 15)).toBe(true);
    expect(searchMatrix(matrix, 18)).toBe(true);
    expect(searchMatrix(matrix, 30)).toBe(true);
  });

  it('handles empty, single-cell, single-row and single-column matrices', () => {
    expect(searchMatrix([], 1)).toBe(false);
    expect(searchMatrix([[]], 1)).toBe(false);
    expect(searchMatrix([[5]], 5)).toBe(true);
    expect(searchMatrix([[5]], 4)).toBe(false);
    expect(searchMatrix([[1, 2, 3]], 3)).toBe(true);
    expect(searchMatrix([[1], [2], [3]], 2)).toBe(true);
    expect(searchMatrix([[1], [2], [3]], 4)).toBe(false);
  });

  it('handles negatives and duplicates', () => {
    const m = [
      [-5, -4, -4],
      [-4, -3, 0],
      [-1, 0, 2],
    ];
    expect(searchMatrix(m, -4)).toBe(true);
    expect(searchMatrix(m, -2)).toBe(false);
    expect(searchMatrix(m, 2)).toBe(true);
  });
});

describe('gameOfLife', () => {
  it('handles the prompt examples', () => {
    expect(
      gameOfLife([
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 0],
      [1, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ]);

    expect(
      gameOfLife([
        [1, 1],
        [1, 0],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('mutates the board in place and returns it', () => {
    const board = [
      [1, 1],
      [1, 0],
    ];
    const returned = gameOfLife(board);
    expect(returned).toBe(board);
    expect(board).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('kills a lone live cell (underpopulation)', () => {
    expect(
      gameOfLife([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('keeps a still life stable (the block)', () => {
    const block = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    expect(gameOfLife(block.map((row) => [...row]))).toEqual(block);
  });

  it('oscillates the blinker', () => {
    const vertical = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    const horizontal = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
    expect(gameOfLife(vertical.map((row) => [...row]))).toEqual(horizontal);
    expect(gameOfLife(horizontal.map((row) => [...row]))).toEqual(vertical);
  });

  it('updates simultaneously, not sequentially', () => {
    // Sequential updates get this wrong: the cell at (0,1) must see the
    // ORIGINAL value of (0,0), not its already-computed new one.
    const board = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(gameOfLife(board)).toEqual([
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  });

  it('handles an all-dead and an all-live board', () => {
    expect(
      gameOfLife([
        [0, 0],
        [0, 0],
      ]),
    ).toEqual([
      [0, 0],
      [0, 0],
    ]);

    // Every cell in a full 3x3 has 3, 5 or 8 live neighbours.
    expect(
      gameOfLife([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]),
    ).toEqual([
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ]);
  });
});
