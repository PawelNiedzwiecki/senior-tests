import { describe, it, expect } from 'vitest';
import {
  lengthOfLongestSubstring,
  maxSubarraySum,
  minSubArrayLen,
} from '@algo/03-sliding-window.ts';

describe('lengthOfLongestSubstring', () => {
  it('handles the prompt examples', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toBe(3);
    expect(lengthOfLongestSubstring('bbbbb')).toBe(1);
    expect(lengthOfLongestSubstring('pwwkew')).toBe(3);
  });

  it('handles the empty string', () => {
    expect(lengthOfLongestSubstring('')).toBe(0);
  });

  it('handles a single character', () => {
    expect(lengthOfLongestSubstring('a')).toBe(1);
  });

  it('handles an all-unique string', () => {
    expect(lengthOfLongestSubstring('abcdef')).toBe(6);
  });

  it('handles spaces and punctuation as ordinary characters', () => {
    expect(lengthOfLongestSubstring('a b!a')).toBe(4); // 'a b!' then repeat 'a'
  });

  it('handles a duplicate far behind the window', () => {
    // The 'a' at index 0 must not drag `left` backwards when 'a' repeats late.
    expect(lengthOfLongestSubstring('abba')).toBe(2);
  });

  it('handles a long tail after a repeat', () => {
    expect(lengthOfLongestSubstring('aab')).toBe(2);
    expect(lengthOfLongestSubstring('dvdf')).toBe(3); // 'vdf'
  });
});

describe('maxSubarraySum', () => {
  it('finds the best fixed window', () => {
    expect(maxSubarraySum([2, 1, 5, 1, 3, 2], 3)).toBe(9);
  });

  it('handles a window equal to the whole array', () => {
    expect(maxSubarraySum([1, 2, 3], 3)).toBe(6);
  });

  it('handles k = 1', () => {
    expect(maxSubarraySum([4, 9, 2], 1)).toBe(9);
  });

  it('handles negatives', () => {
    expect(maxSubarraySum([-1, -2, -3, -4], 2)).toBe(-3);
    expect(maxSubarraySum([-5, 10, -5], 2)).toBe(5);
  });

  it('returns 0 for an invalid k', () => {
    expect(maxSubarraySum([1, 2], 5)).toBe(0);
    expect(maxSubarraySum([1, 2], 0)).toBe(0);
    expect(maxSubarraySum([1, 2], -1)).toBe(0);
    expect(maxSubarraySum([], 1)).toBe(0);
  });

  it('finds a window at the very start or very end', () => {
    expect(maxSubarraySum([9, 9, 1, 1], 2)).toBe(18);
    expect(maxSubarraySum([1, 1, 9, 9], 2)).toBe(18);
  });
});

describe('minSubArrayLen', () => {
  it('handles the prompt examples', () => {
    expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2);
    expect(minSubArrayLen(11, [1, 1, 1])).toBe(0);
  });

  it('returns 1 when a single element already qualifies', () => {
    expect(minSubArrayLen(4, [1, 4, 4])).toBe(1);
  });

  it('returns the whole array when only the total qualifies', () => {
    expect(minSubArrayLen(6, [1, 2, 3])).toBe(3);
  });

  it('handles an exact match on the target', () => {
    expect(minSubArrayLen(3, [1, 1, 1])).toBe(3);
  });

  it('handles empty input', () => {
    expect(minSubArrayLen(5, [])).toBe(0);
  });

  it('handles a target of 0 or below', () => {
    // Any window qualifies immediately, so the smallest is length 1 — but with
    // an empty array there is no window at all.
    expect(minSubArrayLen(0, [1, 2])).toBe(1);
  });

  it('shrinks correctly when a large value appears late', () => {
    expect(minSubArrayLen(8, [1, 1, 1, 1, 9])).toBe(1);
  });
});
