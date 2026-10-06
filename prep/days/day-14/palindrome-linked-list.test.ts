import { describe, it, expect } from 'vitest';
import { isPalindromeList } from './palindrome-linked-list.ts';
import { buildList } from '../../patterns/support/list.ts';



describe('isPalindromeList', () => {
  it('handles the prompt examples', () => {
    expect(isPalindromeList(buildList([1, 2, 2, 1]))).toBe(true);
    expect(isPalindromeList(buildList([1, 2]))).toBe(false);
    expect(isPalindromeList(buildList([1]))).toBe(true);
  });

  it('handles null and two equal nodes', () => {
    expect(isPalindromeList(null)).toBe(true);
    expect(isPalindromeList(buildList([9, 9]))).toBe(true);
  });

  it('handles odd-length palindromes (the middle node has no partner)', () => {
    expect(isPalindromeList(buildList([1, 2, 3, 2, 1]))).toBe(true);
    expect(isPalindromeList(buildList([1, 2, 3, 4, 1]))).toBe(false);
  });

  it('rejects a near-palindrome differing in the middle', () => {
    expect(isPalindromeList(buildList([1, 2, 3, 3, 9, 1]))).toBe(false);
  });

  it('handles a long palindrome', () => {
    const half = Array.from({ length: 5000 }, (_, i) => i % 97);
    expect(isPalindromeList(buildList([...half, ...[...half].reverse()]))).toBe(true);
  });

  it('handles a long non-palindrome', () => {
    const values = Array.from({ length: 10_000 }, (_, i) => i);
    expect(isPalindromeList(buildList(values))).toBe(false);
  });
});
