import { describe, it, expect } from 'vitest';
import { findMaximumXOR } from './maximum-xor-of-two-numbers-in-an-array.ts';



describe('findMaximumXOR', () => {
  it('handles the prompt examples', () => {
    expect(findMaximumXOR([3, 10, 5, 25, 2, 8])).toBe(28);
    expect(findMaximumXOR([0])).toBe(0);
    expect(findMaximumXOR([2, 4])).toBe(6);
  });

  it('handles an empty array and identical values', () => {
    expect(findMaximumXOR([])).toBe(0);
    expect(findMaximumXOR([7, 7, 7])).toBe(0);
  });

  it('handles zeroes mixed in', () => {
    expect(findMaximumXOR([0, 0, 15])).toBe(15);
  });

  it('handles large values', () => {
    expect(findMaximumXOR([1 << 29, (1 << 29) + 1, 1])).toBe((1 << 29) + 1);
    expect(findMaximumXOR([2147483647 >> 1, 0])).toBe(2147483647 >> 1);
  });

  it('agrees with the brute-force pair scan', () => {
    const brute = (nums: number[]) => {
      let best = 0;
      for (let i = 0; i < nums.length; i += 1)
        for (let j = i + 1; j < nums.length; j += 1) best = Math.max(best, nums[i]! ^ nums[j]!);
      return best;
    };

    const cases = [
      [3, 10, 5, 25, 2, 8],
      [14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70],
      [8, 10, 2],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 1_000_000, 999_999, 12345],
    ];
    for (const nums of cases) expect(findMaximumXOR(nums)).toBe(brute(nums));
  });

  it('stays linear on a large input', () => {
    const nums = Array.from({ length: 20_000 }, (_, i) => (i * 7919) % 1_048_576);
    const started = Date.now();
    expect(findMaximumXOR(nums)).toBeGreaterThan(0);
    expect(Date.now() - started).toBeLessThan(3000);
  });
});
