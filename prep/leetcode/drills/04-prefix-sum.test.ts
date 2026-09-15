import { describe, it, expect } from 'vitest';
import { findMaxLength, createMatrixRangeSum } from '@leetcode/04-prefix-sum.ts';

describe('findMaxLength', () => {
  it('handles the prompt examples', () => {
    expect(findMaxLength([0, 1])).toBe(2);
    expect(findMaxLength([0, 1, 0])).toBe(2);
    expect(findMaxLength([0, 0, 1, 0, 0, 0, 1, 1])).toBe(6);
  });

  it('returns 0 when no balanced subarray exists', () => {
    expect(findMaxLength([0, 0, 0])).toBe(0);
    expect(findMaxLength([1])).toBe(0);
    expect(findMaxLength([])).toBe(0);
  });

  it('finds an answer that starts at index 0 (catches a missing {0: -1} seed)', () => {
    expect(findMaxLength([1, 0, 1, 1, 1])).toBe(2);
    expect(findMaxLength([0, 1, 1, 1, 1])).toBe(2);
  });

  it('keeps the FIRST index of a balance, not the latest', () => {
    // The whole array balances; a solution that overwrites returns 2.
    expect(findMaxLength([0, 1, 0, 1, 0, 1])).toBe(6);
  });

  it('agrees with a brute-force scan', () => {
    const brute = (nums: number[]) => {
      let best = 0;
      for (let i = 0; i < nums.length; i += 1) {
        let ones = 0;
        let zeroes = 0;
        for (let j = i; j < nums.length; j += 1) {
          if (nums[j] === 1) ones += 1;
          else zeroes += 1;
          if (ones === zeroes) best = Math.max(best, j - i + 1);
        }
      }
      return best;
    };

    const cases = [
      [0, 0, 1, 1, 0, 1, 1, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 0, 1, 1, 1, 0],
    ];
    for (const nums of cases) expect(findMaxLength(nums)).toBe(brute(nums));
  });
});

describe('createMatrixRangeSum', () => {
  const matrix = [
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7],
    [1, 0, 3, 0, 5],
  ];

  it('handles the prompt examples', () => {
    const rs = createMatrixRangeSum([
      [3, 0, 1, 4],
      [5, 6, 3, 2],
      [1, 2, 0, 1],
    ]);
    expect(rs.query(0, 0, 1, 1)).toBe(14);
    expect(rs.query(1, 1, 2, 2)).toBe(11);
  });

  it('handles a single cell', () => {
    const rs = createMatrixRangeSum(matrix);
    expect(rs.query(2, 2, 2, 2)).toBe(0);
    expect(rs.query(0, 0, 0, 0)).toBe(3);
  });

  it('handles the full matrix', () => {
    const rs = createMatrixRangeSum(matrix);
    const total = matrix.flat().reduce((a, b) => a + b, 0);
    expect(rs.query(0, 0, 4, 4)).toBe(total);
  });

  it('handles a single row and a single column', () => {
    const rs = createMatrixRangeSum(matrix);
    expect(rs.query(1, 0, 1, 4)).toBe(17);
    expect(rs.query(0, 1, 4, 1)).toBe(9);
  });

  it('handles negatives', () => {
    const rs = createMatrixRangeSum([
      [-1, 2],
      [3, -4],
    ]);
    expect(rs.query(0, 0, 1, 1)).toBe(0);
    expect(rs.query(1, 0, 1, 1)).toBe(-1);
  });

  it('handles a 1x1 matrix', () => {
    expect(createMatrixRangeSum([[7]]).query(0, 0, 0, 0)).toBe(7);
  });

  it('agrees with a brute-force sum for every rectangle', () => {
    const rs = createMatrixRangeSum(matrix);
    for (let r1 = 0; r1 < 5; r1 += 1)
      for (let c1 = 0; c1 < 5; c1 += 1)
        for (let r2 = r1; r2 < 5; r2 += 1)
          for (let c2 = c1; c2 < 5; c2 += 1) {
            let expected = 0;
            for (let r = r1; r <= r2; r += 1)
              for (let c = c1; c <= c2; c += 1) expected += matrix[r]![c]!;
            expect(rs.query(r1, c1, r2, c2)).toBe(expected);
          }
  });
});
