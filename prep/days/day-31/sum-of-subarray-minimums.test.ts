import { describe, it, expect } from 'vitest';
import { sumSubarrayMins } from './sum-of-subarray-minimums.ts';



describe('sumSubarrayMins', () => {
  it('handles the prompt examples', () => {
    expect(sumSubarrayMins([3, 1, 2, 4])).toBe(17);
    expect(sumSubarrayMins([11, 81, 94, 43, 3])).toBe(444);
  });

  it('handles empty and single-element inputs', () => {
    expect(sumSubarrayMins([])).toBe(0);
    expect(sumSubarrayMins([5])).toBe(5);
  });

  it('does not double-count equal values', () => {
    // [2],[2],[2,2] → 2 + 2 + 2 = 6, not 8.
    expect(sumSubarrayMins([2, 2])).toBe(6);
    expect(sumSubarrayMins([1, 1, 1])).toBe(6);
  });

  it('handles a strictly increasing and a strictly decreasing array', () => {
    expect(sumSubarrayMins([1, 2, 3])).toBe(10);
    expect(sumSubarrayMins([3, 2, 1])).toBe(10);
  });

  it('agrees with a brute-force sum', () => {
    const brute = (nums: number[]) => {
      let total = 0;
      for (let i = 0; i < nums.length; i += 1) {
        let min = Infinity;
        for (let j = i; j < nums.length; j += 1) {
          min = Math.min(min, nums[j]!);
          total += min;
        }
      }
      return total % 1_000_000_007;
    };

    const cases = [
      [3, 1, 2, 4],
      [11, 81, 94, 43, 3],
      [2, 2, 2, 2],
      [5, 3, 5, 3, 5],
      [1, 7, 7, 2, 9, 2, 4, 4],
    ];
    for (const nums of cases) expect(sumSubarrayMins(nums)).toBe(brute(nums));
  });
});
