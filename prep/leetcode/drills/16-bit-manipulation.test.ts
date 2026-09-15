import { describe, it, expect } from 'vitest';
import { singleNumberIII, rangeBitwiseAnd } from '@leetcode/16-bit-manipulation.ts';

const sorted = (pair: [number, number]) => [...pair].sort((a, b) => a - b);

describe('singleNumberIII', () => {
  it('handles the prompt examples', () => {
    expect(sorted(singleNumberIII([1, 2, 1, 3, 2, 5]))).toEqual([3, 5]);
    expect(sorted(singleNumberIII([-1, 0]))).toEqual([-1, 0]);
    expect(sorted(singleNumberIII([0, 1]))).toEqual([0, 1]);
  });

  it('handles the two singletons being adjacent values', () => {
    expect(sorted(singleNumberIII([7, 7, 8, 9]))).toEqual([8, 9]);
  });

  it('handles negatives on both sides of zero', () => {
    expect(sorted(singleNumberIII([-3, 4, -3, -7, 5, 5]))).toEqual([-7, 4]);
  });

  it('handles large values', () => {
    expect(sorted(singleNumberIII([1 << 20, 1 << 20, 1 << 25, 1 << 26]))).toEqual([
      1 << 25,
      1 << 26,
    ]);
  });

  it('handles the pairs being scattered', () => {
    const nums = [5, 9, 3, 1, 3, 5, 7, 9, 1, 11];
    expect(sorted(singleNumberIII(nums))).toEqual([7, 11]);
  });

  it('agrees with a counting reference on a larger input', () => {
    const pairs = Array.from({ length: 500 }, (_, i) => i * 2).flatMap((v) => [v, v]);
    // Interleave deterministically rather than shuffling — XOR ignores order,
    // but a reproducible failure is worth more than a random one.
    const nums = [...pairs.filter((_, i) => i % 2 === 0), 1001, ...pairs.filter((_, i) => i % 2 === 1), 2003];
    expect(sorted(singleNumberIII(nums))).toEqual([1001, 2003]);
  });
});

describe('rangeBitwiseAnd', () => {
  it('handles the prompt examples', () => {
    expect(rangeBitwiseAnd(5, 7)).toBe(4);
    expect(rangeBitwiseAnd(0, 0)).toBe(0);
    expect(rangeBitwiseAnd(1, 2147483647)).toBe(0);
    expect(rangeBitwiseAnd(12, 15)).toBe(12);
  });

  it('returns the value itself for a single-element range', () => {
    expect(rangeBitwiseAnd(1, 1)).toBe(1);
    expect(rangeBitwiseAnd(255, 255)).toBe(255);
  });

  it('returns 0 whenever the range crosses a power of two', () => {
    expect(rangeBitwiseAnd(7, 8)).toBe(0);
    expect(rangeBitwiseAnd(15, 16)).toBe(0);
    expect(rangeBitwiseAnd(0, 1)).toBe(0);
  });

  it('handles a huge range without iterating it', () => {
    // Reference: the common binary prefix, found by shifting rather than looping.
    const commonPrefix = (left: number, right: number) => {
      let shifts = 0;
      while (left !== right) {
        left >>= 1;
        right >>= 1;
        shifts += 1;
      }
      return left << shifts;
    };

    const started = Date.now();
    expect(rangeBitwiseAnd(2_000_000_000, 2_147_483_647)).toBe(
      commonPrefix(2_000_000_000, 2_147_483_647),
    );
    expect(rangeBitwiseAnd(1_000_000, 1_048_575)).toBe(commonPrefix(1_000_000, 1_048_575));
    expect(Date.now() - started).toBeLessThan(500);
  });

  it('agrees with a brute-force AND over small ranges', () => {
    for (let left = 0; left <= 40; left += 1) {
      for (let right = left; right <= 40; right += 1) {
        let expected = right;
        for (let n = left; n < right; n += 1) expected &= n;
        expect(rangeBitwiseAnd(left, right)).toBe(expected);
      }
    }
  });
});
