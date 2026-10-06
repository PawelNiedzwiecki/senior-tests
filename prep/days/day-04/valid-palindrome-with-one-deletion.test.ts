import { describe, it, expect } from 'vitest';
import { validPalindromeII } from './valid-palindrome-with-one-deletion.ts';
/** Order-insensitive comparison: sort the triplets themselves, then the list. */
const normalise = (triplets: number[][]) =>
  triplets.map((t) => [...t].sort((a, b) => a - b)).sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!);



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
