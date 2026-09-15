import { describe, it, expect } from 'vitest';
import { threeSum, validPalindromeII } from '@leetcode/02-two-pointers.ts';

/** Order-insensitive comparison: sort the triplets themselves, then the list. */
const normalise = (triplets: number[][]) =>
  triplets.map((t) => [...t].sort((a, b) => a - b)).sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);

describe('threeSum', () => {
  it('handles the prompt example', () => {
    expect(normalise(threeSum([-1, 0, 1, 2, -1, -4]))).toEqual([
      [-1, -1, 2],
      [-1, 0, 1],
    ]);
  });

  it('returns an empty list when no triplet sums to zero', () => {
    expect(threeSum([0, 1, 1])).toEqual([]);
    expect(threeSum([1, 2, 3])).toEqual([]);
  });

  it('handles all zeroes without repeating the triplet', () => {
    expect(threeSum([0, 0, 0])).toEqual([[0, 0, 0]]);
    expect(threeSum([0, 0, 0, 0])).toEqual([[0, 0, 0]]);
  });

  it('handles fewer than three elements', () => {
    expect(threeSum([])).toEqual([]);
    expect(threeSum([0])).toEqual([]);
    expect(threeSum([0, 0])).toEqual([]);
  });

  it('deduplicates when the duplicates sit at the pointers', () => {
    expect(normalise(threeSum([-2, 0, 0, 2, 2]))).toEqual([[-2, 0, 2]]);
  });

  it('agrees with a brute-force search on a random-ish input', () => {
    const nums = [-4, -2, -2, -1, 0, 0, 1, 2, 3, 3, -5, 5];
    const brute = new Set<string>();
    for (let i = 0; i < nums.length; i += 1)
      for (let j = i + 1; j < nums.length; j += 1)
        for (let k = j + 1; k < nums.length; k += 1)
          if (nums[i]! + nums[j]! + nums[k]! === 0)
            brute.add([nums[i]!, nums[j]!, nums[k]!].sort((a, b) => a - b).join(','));

    const actual = threeSum(nums);
    expect(actual.length).toBe(brute.size); // i.e. no duplicates in the output
    expect(new Set(actual.map((t) => [...t].sort((a, b) => a - b).join(',')))).toEqual(brute);
  });
});

describe('validPalindromeII', () => {
  it('handles the prompt examples', () => {
    expect(validPalindromeII('aba')).toBe(true);
    expect(validPalindromeII('abca')).toBe(true);
    expect(validPalindromeII('abc')).toBe(false);
  });

  it('accepts an empty string and a single character', () => {
    expect(validPalindromeII('')).toBe(true);
    expect(validPalindromeII('a')).toBe(true);
  });

  it('accepts a two-character string (one deletion always suffices)', () => {
    expect(validPalindromeII('ab')).toBe(true);
    expect(validPalindromeII('aa')).toBe(true);
  });

  it('needs the deletion on the right-hand side', () => {
    expect(validPalindromeII('abac')).toBe(true);
    expect(validPalindromeII('cbbcc')).toBe(true);
  });

  it('rejects strings needing two deletions', () => {
    expect(validPalindromeII('abcdef')).toBe(false);
    expect(validPalindromeII('abcdea')).toBe(false);
  });

  it('handles a long palindrome with one flaw in the middle', () => {
    const half = 'abcde'.repeat(200);
    const s = `${half}x${[...half].reverse().join('')}`;
    expect(validPalindromeII(s)).toBe(true);
  });
});
