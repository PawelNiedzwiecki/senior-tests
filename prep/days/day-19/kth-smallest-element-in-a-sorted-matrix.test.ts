import { describe, it, expect } from 'vitest';
import { kthSmallestInMatrix } from './kth-smallest-element-in-a-sorted-matrix.ts';



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
