import { describe, it, expect } from 'vitest';
import { searchMatrix } from './search-a-2d-matrix-ii.ts';

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