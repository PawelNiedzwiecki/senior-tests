import { describe, it, expect } from 'vitest';
import {
  lengthOfLongestSubstring,
  findMaxAverage,
  longestKDistinct,
  minSubArrayLen,
  findAnagrams,
} from '@tier1/03-sliding-window.ts';

describe('exam 1 — lengthOfLongestSubstring', () => {
  it('handles the prompt examples', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
    expect(lengthOfLongestSubstring('')).toBe(0);
  });

  it('never drags the left edge backwards on a stale repeat', () => {
    expect(lengthOfLongestSubstring('abba')).toBe(2);
    expect(lengthOfLongestSubstring('tmmzuxt')).toBe(5);
  });

  it('handles an all-distinct string and non-letters', () => {
    expect(lengthOfLongestSubstring('abcdef')).toBe(6);
    expect(lengthOfLongestSubstring('a b c a')).toBe(3);
  });

  it('agrees with brute force', () => {
    const s = 'dvdfabcabbxyzzyx';
    let best = 0;
    for (let i = 0; i < s.length; i += 1)
      for (let j = i; j < s.length; j += 1) {
        const window = s.slice(i, j + 1);
        if (new Set(window).size === window.length) best = Math.max(best, window.length);
      }
    expect(lengthOfLongestSubstring(s)).toBe(best);
  });
});

describe('exam 2 — findMaxAverage', () => {
  it('handles the prompt examples', () => {
    expect(findMaxAverage([1, 12, -5, -6, 50, 3], 4)).toBeCloseTo(12.75, 10);
    expect(findMaxAverage([5], 1)).toBeCloseTo(5, 10);
  });

  it('handles k equal to the whole array', () => {
    expect(findMaxAverage([1, 2, 3, 4], 4)).toBeCloseTo(2.5, 10);
  });

  it('handles all-negative input', () => {
    expect(findMaxAverage([-1, -12, -5, -6, -50, -3], 2)).toBeCloseTo(-5.5, 10);
  });

  it('finds a window at the very start and at the very end', () => {
    expect(findMaxAverage([9, 9, 1, 1], 2)).toBeCloseTo(9, 10);
    expect(findMaxAverage([1, 1, 9, 9], 2)).toBeCloseTo(9, 10);
  });
});

describe('exam 3 — longestKDistinct', () => {
  it('handles the prompt examples', () => {
    expect(longestKDistinct('eceba', 2)).toBe(3);
    expect(longestKDistinct('aa', 1)).toBe(2);
    expect(longestKDistinct('abc', 0)).toBe(0);
  });

  it('returns the whole string when k is generous', () => {
    expect(longestKDistinct('abaccc', 3)).toBe(6);
    expect(longestKDistinct('abc', 10)).toBe(3);
  });

  it('handles empty input', () => {
    expect(longestKDistinct('', 2)).toBe(0);
  });

  it('agrees with brute force', () => {
    const s = 'abcbbbbcccbdddadacb';
    for (const k of [1, 2, 3, 4]) {
      let best = 0;
      for (let i = 0; i < s.length; i += 1)
        for (let j = i; j < s.length; j += 1) {
          const window = s.slice(i, j + 1);
          if (new Set(window).size <= k) best = Math.max(best, window.length);
        }
      expect(longestKDistinct(s, k)).toBe(best);
    }
  });
});

describe('exam 4 — minSubArrayLen', () => {
  it('handles the prompt examples', () => {
    expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2);
    expect(minSubArrayLen(4, [1, 4, 4])).toBe(1);
    expect(minSubArrayLen(11, [1, 1, 1, 1, 1])).toBe(0);
  });

  it('returns 1 when a single element already reaches the target', () => {
    expect(minSubArrayLen(3, [1, 1, 1, 1, 7])).toBe(1);
  });

  it('returns the whole array when only the total reaches the target', () => {
    expect(minSubArrayLen(15, [1, 2, 3, 4, 5])).toBe(5);
  });

  it('handles empty input', () => {
    expect(minSubArrayLen(1, [])).toBe(0);
  });

  it('agrees with brute force', () => {
    const nums = [5, 1, 3, 5, 10, 7, 4, 9, 2, 8];
    for (const target of [1, 9, 15, 30, 60]) {
      let best = Infinity;
      for (let i = 0; i < nums.length; i += 1) {
        let sum = 0;
        for (let j = i; j < nums.length; j += 1) {
          sum += nums[j]!;
          if (sum >= target) {
            best = Math.min(best, j - i + 1);
            break;
          }
        }
      }
      expect(minSubArrayLen(target, nums)).toBe(best === Infinity ? 0 : best);
    }
  });
});

describe('exam 5 — findAnagrams', () => {
  it('handles the prompt examples', () => {
    expect(findAnagrams('cbaebabacd', 'abc')).toEqual([0, 6]);
    expect(findAnagrams('abab', 'ab')).toEqual([0, 1, 2]);
    expect(findAnagrams('a', 'aa')).toEqual([]);
  });

  it('respects duplicate counts rather than just the character set', () => {
    expect(findAnagrams('aabab', 'aab')).toEqual([0, 1]);
    expect(findAnagrams('abcab', 'aab')).toEqual([]);
  });

  it('handles p equal to s, and empty inputs', () => {
    expect(findAnagrams('abc', 'cba')).toEqual([0]);
    expect(findAnagrams('', 'a')).toEqual([]);
    expect(findAnagrams('abc', '')).toEqual([]);
  });

  it('agrees with brute force on overlapping matches', () => {
    const s = 'baaabbabababbaab';
    const p = 'aab';
    const sortedKey = (x: string) => [...x].sort().join('');
    const expected: number[] = [];
    for (let i = 0; i + p.length <= s.length; i += 1)
      if (sortedKey(s.slice(i, i + p.length)) === sortedKey(p)) expected.push(i);
    expect(findAnagrams(s, p)).toEqual(expected);
  });
});
