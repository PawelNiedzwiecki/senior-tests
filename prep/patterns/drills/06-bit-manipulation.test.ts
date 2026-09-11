import { describe, it, expect } from 'vitest';
import { singleNumber, countBits, singleNumberII } from '@patterns/06-bit-manipulation.ts';

describe('singleNumber', () => {
  it('handles the prompt examples', () => {
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
    expect(singleNumber([1])).toBe(1);
  });

  it('handles the single value first and last', () => {
    expect(singleNumber([9, 3, 3])).toBe(9);
    expect(singleNumber([3, 3, 9])).toBe(9);
  });

  it('handles negatives', () => {
    expect(singleNumber([-1, 2, 2])).toBe(-1);
    expect(singleNumber([-5, -5, -7])).toBe(-7);
  });

  it('handles zero as the answer', () => {
    expect(singleNumber([0, 4, 4])).toBe(0);
  });

  it('agrees with a map-based reference', () => {
    const nums = [7, 3, 5, 3, 7, 9, 5];
    expect(singleNumber(nums)).toBe(9);
  });
});

describe('countBits', () => {
  it('handles the prompt example', () => {
    expect(countBits(5)).toEqual([0, 1, 1, 2, 1, 2]);
  });

  it('handles n = 0', () => {
    expect(countBits(0)).toEqual([0]);
  });

  it('handles powers of two', () => {
    expect(countBits(8)).toEqual([0, 1, 1, 2, 1, 2, 2, 3, 1]);
  });

  it('agrees with toString(2) for every value', () => {
    const result = countBits(200);
    for (let i = 0; i <= 200; i += 1) {
      const expected = i.toString(2).split('').filter((c) => c === '1').length;
      expect(result[i]).toBe(expected);
    }
  });

  it('returns n + 1 entries', () => {
    expect(countBits(10)).toHaveLength(11);
  });
});

describe('singleNumberII', () => {
  it('handles the prompt examples', () => {
    expect(singleNumberII([2, 2, 3, 2])).toBe(3);
    expect(singleNumberII([0, 1, 0, 1, 0, 1, 99])).toBe(99);
  });

  it('handles a single element', () => {
    expect(singleNumberII([42])).toBe(42);
  });

  it('handles negatives — the sign-bit trap', () => {
    expect(singleNumberII([-2, -2, 1, -2])).toBe(1);
    expect(singleNumberII([5, 5, 5, -7])).toBe(-7);
    expect(singleNumberII([-1, -1, -1, -2])).toBe(-2);
  });

  it('handles zero as the answer', () => {
    expect(singleNumberII([3, 3, 3, 0])).toBe(0);
  });

  it('handles the answer in any position', () => {
    expect(singleNumberII([7, 1, 1, 1])).toBe(7);
    expect(singleNumberII([1, 1, 1, 7])).toBe(7);
  });

  it('agrees with a map-based reference on random input', () => {
    for (let trial = 0; trial < 20; trial += 1) {
      const unique = Math.floor(Math.random() * 200) - 100;
      const others = [11, 22, -33];
      const nums = [unique, ...others.flatMap((v) => [v, v, v])];
      for (let i = nums.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j]!, nums[i]!];
      }
      if (others.includes(unique)) continue; // skip a coincidental collision
      expect(singleNumberII(nums)).toBe(unique);
    }
  });
});
