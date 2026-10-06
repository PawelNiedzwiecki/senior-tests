import { describe, it, expect } from 'vitest';
import { findDuplicate } from './find-the-duplicate-number.ts';

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