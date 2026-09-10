import { describe, it, expect } from 'vitest';
import { isPalindrome, twoSumSorted, maxArea, moveZeroes } from '@algo/02-two-pointers.ts';

describe('isPalindrome', () => {
  it('handles the classic example', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
  });

  it('rejects a non-palindrome', () => {
    expect(isPalindrome('race a car')).toBe(false);
  });

  it('treats the empty string as a palindrome', () => {
    expect(isPalindrome('')).toBe(true);
  });

  it('treats a string of only punctuation as a palindrome', () => {
    expect(isPalindrome('.,!?')).toBe(true);
  });

  it('handles a single character', () => {
    expect(isPalindrome('a')).toBe(true);
  });

  it('ignores case', () => {
    expect(isPalindrome('Aa')).toBe(true);
  });

  it('includes digits', () => {
    expect(isPalindrome('0P')).toBe(false);
    expect(isPalindrome('1a2a1')).toBe(true);
  });

  it('handles even and odd lengths', () => {
    expect(isPalindrome('abba')).toBe(true);
    expect(isPalindrome('aba')).toBe(true);
    expect(isPalindrome('abca')).toBe(false);
  });
});

describe('twoSumSorted', () => {
  it('finds a pair', () => {
    expect(twoSumSorted([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSumSorted([2, 3, 4], 6)).toEqual([0, 2]);
  });

  it('handles negatives', () => {
    expect(twoSumSorted([-3, -1, 0, 2, 5], 1)).toEqual([1, 3]);
  });

  it('handles duplicates', () => {
    expect(twoSumSorted([1, 1, 3], 2)).toEqual([0, 1]);
  });

  it('returns null when there is no pair', () => {
    expect(twoSumSorted([1, 2, 3], 100)).toBeNull();
  });

  it('does not pair an element with itself', () => {
    expect(twoSumSorted([1, 5], 10)).toBeNull();
  });

  it('handles empty and single-element input', () => {
    expect(twoSumSorted([], 0)).toBeNull();
    expect(twoSumSorted([4], 8)).toBeNull();
  });
});

describe('maxArea', () => {
  it('handles the classic example', () => {
    expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
  });

  it('handles the two-line case', () => {
    expect(maxArea([1, 1])).toBe(1);
  });

  it('handles an increasing ramp', () => {
    expect(maxArea([1, 2, 3, 4, 5])).toBe(6); // lines 1 and 4 → 3 * 2
  });

  it('handles a flat profile', () => {
    expect(maxArea([5, 5, 5, 5])).toBe(15); // width 3 * height 5
  });

  it('returns 0 for fewer than two lines', () => {
    expect(maxArea([])).toBe(0);
    expect(maxArea([7])).toBe(0);
  });

  it('handles zero-height lines', () => {
    expect(maxArea([0, 0, 0])).toBe(0);
    expect(maxArea([0, 2, 0, 2])).toBe(4);
  });
});

describe('moveZeroes', () => {
  it('moves zeroes to the end', () => {
    expect(moveZeroes([0, 1, 0, 3, 12])).toEqual([1, 3, 12, 0, 0]);
  });

  it('preserves relative order of non-zeroes', () => {
    expect(moveZeroes([4, 0, 5, 0, 6])).toEqual([4, 5, 6, 0, 0]);
  });

  it('mutates in place and returns the same reference', () => {
    const input = [0, 1];
    const result = moveZeroes(input);
    expect(result).toBe(input);
    expect(input).toEqual([1, 0]);
  });

  it('handles all zeroes', () => {
    expect(moveZeroes([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it('handles no zeroes', () => {
    expect(moveZeroes([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('handles empty and single-element input', () => {
    expect(moveZeroes([])).toEqual([]);
    expect(moveZeroes([0])).toEqual([0]);
    expect(moveZeroes([7])).toEqual([7]);
  });

  it('handles negatives, which are not zero', () => {
    expect(moveZeroes([0, -1, 0, -2])).toEqual([-1, -2, 0, 0]);
  });
});
