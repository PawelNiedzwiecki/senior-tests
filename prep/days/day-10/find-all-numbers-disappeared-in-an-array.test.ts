import { describe, it, expect } from 'vitest';
import { findDisappearedNumbers } from './find-all-numbers-disappeared-in-an-array.ts';

describe('findDisappearedNumbers', () => {
  it('handles the prompt examples', () => {
    expect(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])).toEqual([5, 6]);
    expect(findDisappearedNumbers([1, 1])).toEqual([2]);
    expect(findDisappearedNumbers([1, 2, 3])).toEqual([]);
  });

  it('handles a single element', () => {
    expect(findDisappearedNumbers([1])).toEqual([]);
  });

  it('handles every value being the same (terminates on duplicates)', () => {
    expect(findDisappearedNumbers([2, 2, 2, 2])).toEqual([1, 3, 4]);
  });

  it('handles an already sorted array', () => {
    expect(findDisappearedNumbers([1, 2, 3, 4, 5])).toEqual([]);
  });

  it('returns the missing values ascending', () => {
    expect(findDisappearedNumbers([3, 3, 3, 3, 3])).toEqual([1, 2, 4, 5]);
  });

  it('agrees with a set-based reference on a larger input', () => {
    const n = 1000;
    const nums = Array.from({ length: n }, (_, i) => (i % 3 === 0 ? 1 : i + 1));
    const present = new Set(nums);
    const expected = Array.from({ length: n }, (_, i) => i + 1).filter((v) => !present.has(v));
    expect(findDisappearedNumbers(nums)).toEqual(expected);
  });
});