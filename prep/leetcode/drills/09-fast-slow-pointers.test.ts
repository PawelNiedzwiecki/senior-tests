import { describe, it, expect } from 'vitest';
import { findDuplicate, isPalindromeList } from '@leetcode/09-fast-slow-pointers.ts';
import { buildList } from '../../patterns/support/list.ts';

describe('findDuplicate', () => {
  it('handles the prompt examples', () => {
    expect(findDuplicate([1, 3, 4, 2, 2])).toBe(2);
    expect(findDuplicate([3, 1, 3, 4, 2])).toBe(3);
    expect(findDuplicate([2, 2, 2, 2, 2])).toBe(2);
  });

  it('handles the smallest possible input', () => {
    expect(findDuplicate([1, 1])).toBe(1);
  });

  it('finds a duplicate at the very end', () => {
    expect(findDuplicate([1, 2, 3, 4, 4])).toBe(4);
  });

  it('finds a duplicate that repeats many times', () => {
    expect(findDuplicate([5, 1, 5, 5, 5, 5])).toBe(5);
  });

  it('does not modify the input', () => {
    const nums = [1, 3, 4, 2, 2];
    const snapshot = [...nums];
    findDuplicate(nums);
    expect(nums).toEqual(snapshot);
  });

  it('handles a large input in linear time', () => {
    const n = 100_000;
    const nums = Array.from({ length: n }, (_, i) => i + 1);
    nums.push(7777); // the duplicate
    expect(findDuplicate(nums)).toBe(7777);
  });
});

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
