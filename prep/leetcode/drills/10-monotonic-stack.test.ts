import { describe, it, expect } from 'vitest';
import { trap, sumSubarrayMins } from '@leetcode/10-monotonic-stack.ts';

describe('trap', () => {
  it('handles the prompt examples', () => {
    expect(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])).toBe(6);
    expect(trap([4, 2, 0, 3, 2, 5])).toBe(9);
  });

  it('traps nothing without a containing wall', () => {
    expect(trap([3, 2, 1])).toBe(0);
    expect(trap([1, 2, 3])).toBe(0);
    expect(trap([5, 5, 5])).toBe(0);
  });

  it('handles empty and tiny inputs', () => {
    expect(trap([])).toBe(0);
    expect(trap([7])).toBe(0);
    expect(trap([7, 0])).toBe(0);
  });

  it('handles a simple basin', () => {
    expect(trap([2, 0, 2])).toBe(2);
    expect(trap([3, 0, 0, 3])).toBe(6);
  });

  it('handles flat zeroes', () => {
    expect(trap([0, 0, 0])).toBe(0);
  });

  it('agrees with the precomputed-maxima reference', () => {
    const reference = (heights: number[]) => {
      const n = heights.length;
      if (n === 0) return 0;
      const leftMax = new Array<number>(n).fill(0);
      const rightMax = new Array<number>(n).fill(0);
      leftMax[0] = heights[0]!;
      for (let i = 1; i < n; i += 1) leftMax[i] = Math.max(leftMax[i - 1]!, heights[i]!);
      rightMax[n - 1] = heights[n - 1]!;
      for (let i = n - 2; i >= 0; i -= 1) rightMax[i] = Math.max(rightMax[i + 1]!, heights[i]!);
      let total = 0;
      for (let i = 0; i < n; i += 1) total += Math.min(leftMax[i]!, rightMax[i]!) - heights[i]!;
      return total;
    };

    const cases = [
      [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
      [4, 2, 0, 3, 2, 5],
      [5, 4, 1, 2],
      [1, 0, 1, 0, 1, 0, 1],
      [9, 6, 8, 8, 5, 6, 3],
    ];
    for (const heights of cases) expect(trap(heights)).toBe(reference(heights));
  });
});

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
