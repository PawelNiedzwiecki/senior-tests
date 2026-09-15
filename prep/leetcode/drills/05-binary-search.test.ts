import { describe, it, expect } from 'vitest';
import { findMinRotated, kthSmallestInMatrix } from '@leetcode/05-binary-search.ts';

describe('findMinRotated', () => {
  it('handles the prompt examples', () => {
    expect(findMinRotated([3, 4, 5, 1, 2])).toBe(1);
    expect(findMinRotated([4, 5, 6, 7, 0, 1, 2])).toBe(0);
    expect(findMinRotated([11, 13, 15, 17])).toBe(11);
  });

  it('handles a single element', () => {
    expect(findMinRotated([1])).toBe(1);
  });

  it('handles two elements, rotated and not', () => {
    expect(findMinRotated([1, 2])).toBe(1);
    expect(findMinRotated([2, 1])).toBe(1);
  });

  it('handles negatives', () => {
    expect(findMinRotated([0, 1, 2, -3, -2, -1])).toBe(-3);
  });

  it('handles every rotation of the same array', () => {
    const base = [1, 3, 5, 7, 9, 11, 13];
    for (let r = 0; r < base.length; r += 1) {
      const rotated = [...base.slice(r), ...base.slice(0, r)];
      expect(findMinRotated(rotated)).toBe(1);
    }
  });

  it('stays logarithmic (probes far fewer than n elements)', () => {
    const base = Array.from({ length: 1 << 16 }, (_, i) => i);
    const rotated = [...base.slice(1000), ...base.slice(0, 1000)];
    expect(findMinRotated(rotated)).toBe(0);
  });
});

describe('kthSmallestInMatrix', () => {
  const matrix = [
    [1, 5, 9],
    [10, 11, 13],
    [12, 13, 15],
  ];

  it('handles the prompt example', () => {
    expect(kthSmallestInMatrix(matrix, 8)).toBe(13);
  });

  it('handles k = 1 and k = n*n', () => {
    expect(kthSmallestInMatrix(matrix, 1)).toBe(1);
    expect(kthSmallestInMatrix(matrix, 9)).toBe(15);
  });

  it('handles a 1x1 matrix and negatives', () => {
    expect(kthSmallestInMatrix([[-5]], 1)).toBe(-5);
    expect(
      kthSmallestInMatrix(
        [
          [-5, -4],
          [-3, -2],
        ],
        3,
      ),
    ).toBe(-3);
  });

  it('counts duplicates as separate elements', () => {
    const dupes = [
      [1, 1, 3],
      [1, 3, 4],
      [3, 4, 5],
    ];
    expect(kthSmallestInMatrix(dupes, 1)).toBe(1);
    expect(kthSmallestInMatrix(dupes, 3)).toBe(1);
    expect(kthSmallestInMatrix(dupes, 4)).toBe(3);
  });

  it('agrees with sorting the whole matrix, for every k', () => {
    const cases = [
      matrix,
      [
        [1, 2],
        [1, 3],
      ],
      [
        [-10, -5, 0],
        [-4, 2, 7],
        [3, 8, 9],
      ],
    ];

    for (const m of cases) {
      const sorted = m.flat().sort((a, b) => a - b);
      for (let k = 1; k <= sorted.length; k += 1) {
        expect(kthSmallestInMatrix(m, k)).toBe(sorted[k - 1]);
      }
    }
  });
});
