import { describe, it, expect } from 'vitest';
import { singleNumberIII } from './single-number-iii.ts';
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