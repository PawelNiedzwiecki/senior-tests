import { describe, it, expect } from 'vitest';
import { longestCommonSubsequence } from './longest-common-subsequence.ts';



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
