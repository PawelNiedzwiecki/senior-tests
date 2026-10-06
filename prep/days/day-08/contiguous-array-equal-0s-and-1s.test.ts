import { describe, it, expect } from 'vitest';
import { findMaxLength } from './contiguous-array-equal-0s-and-1s.ts';

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