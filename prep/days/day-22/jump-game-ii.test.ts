import { describe, it, expect } from 'vitest';
import { jump } from './jump-game-ii.ts';

describe('jump', () => {
  it('handles the prompt examples', () => {
    expect(jump([2, 3, 1, 1, 4])).toBe(2);
    expect(jump([2, 3, 0, 1, 4])).toBe(2);
    expect(jump([0])).toBe(0);
  });

  it('handles a single jump to the end', () => {
    expect(jump([1, 1])).toBe(1);
    expect(jump([5, 0, 0, 0, 0, 0])).toBe(1);
  });

  it('handles a list of ones (one jump per step)', () => {
    expect(jump([1, 1, 1, 1])).toBe(3);
  });

  it('does not count a jump for standing on the last index', () => {
    // A loop running to n - 1 returns 3 here instead of 2.
    expect(jump([2, 1, 1, 1])).toBe(2);
    expect(jump([3, 1, 1, 1])).toBe(1);
  });

  it('agrees with the quadratic DP reference', () => {
    const reference = (nums: number[]) => {
      const n = nums.length;
      const dp = new Array<number>(n).fill(Infinity);
      dp[0] = 0;
      for (let i = 0; i < n; i += 1)
        for (let step = 1; step <= nums[i]! && i + step < n; step += 1)
          dp[i + step] = Math.min(dp[i + step]!, dp[i]! + 1);
      return dp[n - 1]!;
    };

    const cases = [
      [2, 3, 1, 1, 4],
      [1, 2, 1, 1, 1],
      [4, 1, 1, 3, 1, 1, 1],
      [7, 0, 9, 6, 9, 6, 1, 7, 9, 0, 1, 2, 9, 0, 3],
      [1],
    ];
    for (const nums of cases) expect(jump(nums)).toBe(reference(nums));
  });

  it('stays linear on a large input', () => {
    const nums = Array.from({ length: 100_000 }, () => 2);
    const started = Date.now();
    expect(jump(nums)).toBe(Math.ceil((nums.length - 1) / 2));
    expect(Date.now() - started).toBeLessThan(1000);
  });
});