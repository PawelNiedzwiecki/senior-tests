import { describe, it, expect } from 'vitest';
import { spiralOrder, rotateInPlace, setZeroes } from '@patterns/07-matrix-traversal.ts';

describe('spiralOrder', () => {
  it('handles a square matrix', () => {
    expect(
      spiralOrder([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
    ).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
  });

  it('handles a wide matrix', () => {
    expect(
      spiralOrder([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]),
    ).toEqual([1, 2, 3, 4, 8, 7, 6, 5]);
  });

  it('handles a tall matrix', () => {
    expect(
      spiralOrder([
        [1, 2],
        [3, 4],
        [5, 6],
      ]),
    ).toEqual([1, 2, 4, 6, 5, 3]);
  });

  it('handles a single row and a single column', () => {
    expect(spiralOrder([[1, 2, 3]])).toEqual([1, 2, 3]);
    expect(spiralOrder([[1], [2], [3]])).toEqual([1, 2, 3]);
  });

  it('handles a single cell', () => {
    expect(spiralOrder([[7]])).toEqual([7]);
  });

  it('handles empty input', () => {
    expect(spiralOrder([])).toEqual([]);
    expect(spiralOrder([[]])).toEqual([]);
  });

  it('emits every element exactly once', () => {
    const m = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
    ];
    const result = spiralOrder(m);
    expect(result).toHaveLength(12);
    expect([...result].sort((a, b) => a - b)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  });
});

describe('rotateInPlace', () => {
  it('rotates a 2x2', () => {
    expect(
      rotateInPlace([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it('rotates a 3x3', () => {
    expect(
      rotateInPlace([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]),
    ).toEqual([
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ]);
  });

  it('mutates in place and returns the same reference', () => {
    const m = [
      [1, 2],
      [3, 4],
    ];
    expect(rotateInPlace(m)).toBe(m);
    expect(m).toEqual([
      [3, 1],
      [4, 2],
    ]);
  });

  it('handles a 1x1', () => {
    expect(rotateInPlace([[5]])).toEqual([[5]]);
  });

  it('returns to the original after four rotations', () => {
    const m = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const original = JSON.stringify(m);
    for (let i = 0; i < 4; i += 1) rotateInPlace(m);
    expect(JSON.stringify(m)).toBe(original);
  });

  it('handles a 4x4', () => {
    expect(
      rotateInPlace([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ]),
    ).toEqual([
      [13, 9, 5, 1],
      [14, 10, 6, 2],
      [15, 11, 7, 3],
      [16, 12, 8, 4],
    ]);
  });
});

describe('setZeroes', () => {
  it('handles the prompt example', () => {
    expect(
      setZeroes([
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ]),
    ).toEqual([
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ]);
  });

  it('handles a zero in the first row', () => {
    expect(
      setZeroes([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 0],
      [0, 1],
    ]);
  });

  it('handles a zero in the first column only', () => {
    expect(
      setZeroes([
        [1, 1],
        [0, 1],
      ]),
    ).toEqual([
      [0, 1],
      [0, 0],
    ]);
  });

  it('handles several zeroes', () => {
    expect(
      setZeroes([
        [0, 1, 2, 0],
        [3, 4, 5, 2],
        [1, 3, 1, 5],
      ]),
    ).toEqual([
      [0, 0, 0, 0],
      [0, 4, 5, 0],
      [0, 3, 1, 0],
    ]);
  });

  it('leaves a zero-free matrix untouched', () => {
    expect(
      setZeroes([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('handles an all-zero matrix', () => {
    expect(
      setZeroes([
        [0, 0],
        [0, 0],
      ]),
    ).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it('mutates in place', () => {
    const m = [
      [1, 0],
      [1, 1],
    ];
    expect(setZeroes(m)).toBe(m);
  });

  it('handles a single row and single column', () => {
    expect(setZeroes([[1, 0, 3]])).toEqual([[0, 0, 0]]);
    expect(setZeroes([[1], [0], [3]])).toEqual([[0], [0], [0]]);
  });
});
