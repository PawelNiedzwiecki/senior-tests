import { describe, it, expect } from 'vitest';
import { sortArray } from './sort-an-array.ts';

describe('sortArray', () => {
  it('handles the prompt examples', () => {
    expect(sortArray([5, 2, 3, 1])).toEqual([1, 2, 3, 5]);
    expect(sortArray([5, 1, 1, 2, 0, 0])).toEqual([0, 0, 1, 1, 2, 5]);
    expect(sortArray([])).toEqual([]);
  });

  it('handles a single element and an already sorted array', () => {
    expect(sortArray([1])).toEqual([1]);
    expect(sortArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('handles a reversed array and all-equal values', () => {
    expect(sortArray([9, 8, 7, 6])).toEqual([6, 7, 8, 9]);
    expect(sortArray([4, 4, 4])).toEqual([4, 4, 4]);
  });

  it('handles negatives (and does not sort as strings)', () => {
    expect(sortArray([-5, 10, -3, 2])).toEqual([-5, -3, 2, 10]);
    // The default comparator would give [10, 2, 3] here.
    expect(sortArray([3, 10, 2])).toEqual([2, 3, 10]);
  });

  it('does not mutate the input', () => {
    const nums = [3, 1, 2];
    sortArray(nums);
    expect(nums).toEqual([3, 1, 2]);
  });

  it('sorts a large array in n log n', () => {
    const nums = Array.from({ length: 50_000 }, (_, i) => (i * 7919) % 50_021);
    const started = Date.now();
    const result = sortArray(nums);
    expect(result).toEqual([...nums].sort((a, b) => a - b));
    expect(Date.now() - started).toBeLessThan(3000);
  });
});