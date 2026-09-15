import { describe, it, expect } from 'vitest';
import { lengthOfLIS, longestCommonSubsequence } from '@leetcode/13-dynamic-programming.ts';

describe('lengthOfLIS', () => {
  it('handles the prompt examples', () => {
    expect(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
    expect(lengthOfLIS([0, 1, 0, 3, 2, 3])).toBe(4);
    expect(lengthOfLIS([7, 7, 7, 7])).toBe(1);
  });

  it('handles empty and single-element inputs', () => {
    expect(lengthOfLIS([])).toBe(0);
    expect(lengthOfLIS([5])).toBe(1);
  });

  it('handles fully increasing and fully decreasing inputs', () => {
    expect(lengthOfLIS([1, 2, 3, 4, 5])).toBe(5);
    expect(lengthOfLIS([5, 4, 3, 2, 1])).toBe(1);
  });

  it('requires STRICT increase', () => {
    expect(lengthOfLIS([1, 2, 2, 3])).toBe(3);
    expect(lengthOfLIS([2, 2])).toBe(1);
  });

  it('handles negatives', () => {
    expect(lengthOfLIS([-5, -3, -4, -1, 0])).toBe(4);
  });

  it('agrees with the quadratic DP reference', () => {
    const reference = (nums: number[]) => {
      if (nums.length === 0) return 0;
      const dp = new Array<number>(nums.length).fill(1);
      for (let i = 1; i < nums.length; i += 1)
        for (let j = 0; j < i; j += 1)
          if (nums[j]! < nums[i]!) dp[i] = Math.max(dp[i]!, dp[j]! + 1);
      return Math.max(...dp);
    };

    const cases = [
      [10, 9, 2, 5, 3, 7, 101, 18],
      [4, 10, 4, 3, 8, 9],
      [1, 3, 6, 7, 9, 4, 10, 5, 6],
      [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5],
    ];
    for (const nums of cases) expect(lengthOfLIS(nums)).toBe(reference(nums));
  });

  it('stays fast on a large input (catches an O(n^2) solution)', () => {
    const nums = Array.from({ length: 50_000 }, (_, i) => (i * 7919) % 50_021);
    const started = Date.now();
    expect(lengthOfLIS(nums)).toBeGreaterThan(0);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});

describe('longestCommonSubsequence', () => {
  it('handles the prompt examples', () => {
    expect(longestCommonSubsequence('abcde', 'ace')).toBe(3);
    expect(longestCommonSubsequence('abc', 'abc')).toBe(3);
    expect(longestCommonSubsequence('abc', 'def')).toBe(0);
  });

  it('handles empty strings', () => {
    expect(longestCommonSubsequence('', '')).toBe(0);
    expect(longestCommonSubsequence('abc', '')).toBe(0);
    expect(longestCommonSubsequence('', 'abc')).toBe(0);
  });

  it('is symmetric in its arguments', () => {
    expect(longestCommonSubsequence('abcde', 'ace')).toBe(longestCommonSubsequence('ace', 'abcde'));
    expect(longestCommonSubsequence('bsbininm', 'jmjkbkjkv')).toBe(
      longestCommonSubsequence('jmjkbkjkv', 'bsbininm'),
    );
  });

  it('does not reuse a matched character twice', () => {
    expect(longestCommonSubsequence('aa', 'a')).toBe(1);
    expect(longestCommonSubsequence('aaa', 'aa')).toBe(2);
  });

  it('handles repeated characters', () => {
    expect(longestCommonSubsequence('bsbininm', 'jmjkbkjkv')).toBe(1);
    expect(longestCommonSubsequence('oxcpqrsvwf', 'shmtulqrypy')).toBe(2);
  });

  it('agrees with a full-table reference', () => {
    const reference = (a: string, b: string) => {
      const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
      for (let i = 1; i <= a.length; i += 1)
        for (let j = 1; j <= b.length; j += 1)
          dp[i]![j] =
            a[i - 1] === b[j - 1] ? dp[i - 1]![j - 1]! + 1 : Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
      return dp[a.length]![b.length]!;
    };

    const cases: Array<[string, string]> = [
      ['abcde', 'ace'],
      ['abcbdab', 'bdcaba'],
      ['xyzzyx', 'zxyzxy'],
      ['aggtab', 'gxtxayb'],
      ['aaaa', 'aa'],
    ];
    for (const [a, b] of cases) expect(longestCommonSubsequence(a, b)).toBe(reference(a, b));
  });
});
