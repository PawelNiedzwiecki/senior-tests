import { describe, it, expect } from 'vitest';
import { sortArray, countSmaller } from '@leetcode/21-divide-and-conquer.ts';

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

describe('countSmaller', () => {
  it('handles the prompt examples', () => {
    expect(countSmaller([5, 2, 6, 1])).toEqual([2, 1, 1, 0]);
    expect(countSmaller([-1])).toEqual([0]);
    expect(countSmaller([-1, -1])).toEqual([0, 0]);
  });

  it('handles an empty array', () => {
    expect(countSmaller([])).toEqual([]);
  });

  it('handles a fully descending array (every pair is an inversion)', () => {
    expect(countSmaller([4, 3, 2, 1])).toEqual([3, 2, 1, 0]);
  });

  it('handles a fully ascending array', () => {
    expect(countSmaller([1, 2, 3, 4])).toEqual([0, 0, 0, 0]);
  });

  it('counts strictly smaller only — equals do not count', () => {
    expect(countSmaller([2, 2, 2])).toEqual([0, 0, 0]);
    expect(countSmaller([2, 1, 2, 1])).toEqual([2, 0, 1, 0]);
  });

  it('agrees with the brute-force count', () => {
    const brute = (nums: number[]) =>
      nums.map((value, i) => nums.slice(i + 1).filter((other) => other < value).length);

    const cases = [
      [5, 2, 6, 1],
      [26, 78, 27, 100, 33, 67, 90, 23, 66, 5, 38, 7, 35, 23, 52, 22, 83, 51, 98, 69],
      [-5, 0, -3, 7, -3, 2],
      [1, 1, 2, 2, 1, 1],
    ];
    for (const nums of cases) expect(countSmaller(nums)).toEqual(brute(nums));
  });

  it('stays n log n on a large input (catches the O(n^2) version)', () => {
    const nums = Array.from({ length: 30_000 }, (_, i) => (i * 7919) % 30_011);
    const started = Date.now();
    const counts = countSmaller(nums);
    expect(counts.length).toBe(30_000);
    expect(counts[counts.length - 1]).toBe(0);
    expect(Date.now() - started).toBeLessThan(3000);
  });
});
