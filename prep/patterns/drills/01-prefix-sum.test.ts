import { describe, it, expect } from 'vitest';
import {
  createRangeSum,
  subarraySum,
  productExceptSelf,
} from '@patterns/01-prefix-sum.ts';

describe('createRangeSum', () => {
  it('answers inclusive range queries', () => {
    const rs = createRangeSum([1, 2, 3, 4]);
    expect(rs.query(0, 2)).toBe(6);
    expect(rs.query(2, 3)).toBe(7);
    expect(rs.query(1, 1)).toBe(2);
  });

  it('covers the whole array', () => {
    expect(createRangeSum([1, 2, 3]).query(0, 2)).toBe(6);
  });

  it('handles negatives', () => {
    const rs = createRangeSum([-2, 5, -1]);
    expect(rs.query(0, 2)).toBe(2);
    expect(rs.query(0, 0)).toBe(-2);
  });

  it('handles a single element', () => {
    expect(createRangeSum([7]).query(0, 0)).toBe(7);
  });

  it('handles many queries on the same array', () => {
    const nums = Array.from({ length: 100 }, (_, i) => i + 1);
    const rs = createRangeSum(nums);
    for (let i = 0; i < 100; i += 10) {
      const expected = nums.slice(i, i + 10).reduce((a, b) => a + b, 0);
      expect(rs.query(i, i + 9)).toBe(expected);
    }
  });
});

describe('subarraySum', () => {
  it('handles the prompt examples', () => {
    expect(subarraySum([1, 1, 1], 2)).toBe(2);
    expect(subarraySum([1, 2, 3], 3)).toBe(2);
  });

  it('counts subarrays starting at index 0', () => {
    // Catches a missing `{0: 1}` seed: [3] itself must be counted.
    expect(subarraySum([3], 3)).toBe(1);
    expect(subarraySum([3, 1], 3)).toBe(1);
  });

  it('handles negatives — where a sliding window would fail', () => {
    expect(subarraySum([1, -1, 0], 0)).toBe(3);
    expect(subarraySum([-1, -1, 1], 0)).toBe(1);
  });

  it('counts overlapping subarrays separately', () => {
    expect(subarraySum([1, 1, 1, 1], 2)).toBe(3);
  });

  it('handles k = 0 with zeroes present', () => {
    expect(subarraySum([0, 0, 0], 0)).toBe(6); // every non-empty subarray
  });

  it('returns 0 when nothing matches', () => {
    expect(subarraySum([1, 2, 3], 100)).toBe(0);
    expect(subarraySum([], 0)).toBe(0);
  });

  it('agrees with a brute-force count', () => {
    const nums = [3, -1, 2, 0, -2, 4, 1, -3];
    const brute = (k: number) => {
      let count = 0;
      for (let i = 0; i < nums.length; i += 1) {
        let sum = 0;
        for (let j = i; j < nums.length; j += 1) {
          sum += nums[j]!;
          if (sum === k) count += 1;
        }
      }
      return count;
    };
    for (let k = -5; k <= 8; k += 1) expect(subarraySum(nums, k)).toBe(brute(k));
  });
});

/**
 * Multiplying a negative by zero yields -0, and `toEqual` uses Object.is
 * semantics, under which Object.is(-0, 0) is FALSE — even though -0 === 0 is
 * true. That is a real JavaScript gotcha, not a bug in the solution, so these
 * tests normalise it. Worth knowing: JSON.stringify(-0) is "0", so a harness
 * built on JSON comparison (like prep/algo/hackerrank/harness.ts) would never
 * surface this at all.
 */
const noNegativeZero = (xs: number[]) => xs.map((x) => (x === 0 ? 0 : x));

describe('productExceptSelf', () => {
  it('handles the prompt examples', () => {
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
    expect(noNegativeZero(productExceptSelf([-1, 1, 0, -3, 3]))).toEqual([0, 0, 9, 0, 0]);
  });

  it('handles a single zero', () => {
    expect(productExceptSelf([1, 2, 0, 4])).toEqual([0, 0, 8, 0]);
  });

  it('handles two zeroes — everything becomes zero', () => {
    expect(noNegativeZero(productExceptSelf([0, 0, 3]))).toEqual([0, 0, 0]);
  });

  it('handles negatives', () => {
    expect(productExceptSelf([-1, -2, -3])).toEqual([6, 3, 2]);
  });

  it('handles two elements', () => {
    expect(productExceptSelf([2, 3])).toEqual([3, 2]);
  });

  it('does not use division (works with a zero present)', () => {
    // A division-based solution divides by zero here.
    const result = noNegativeZero(productExceptSelf([0, 4]));
    expect(result).toEqual([4, 0]);
    expect(result.every(Number.isFinite)).toBe(true);
  });
});
