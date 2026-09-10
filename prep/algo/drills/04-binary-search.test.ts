import { describe, it, expect } from 'vitest';
import {
  binarySearch,
  searchRange,
  searchRotated,
  minEatingSpeed,
} from '@algo/04-binary-search.ts';

describe('binarySearch', () => {
  const sorted = [-1, 0, 3, 5, 9, 12];

  it('finds an element', () => {
    expect(binarySearch(sorted, 9)).toBe(4);
  });

  it('returns -1 when absent', () => {
    expect(binarySearch(sorted, 2)).toBe(-1);
  });

  it('finds the first and last elements', () => {
    expect(binarySearch(sorted, -1)).toBe(0);
    expect(binarySearch(sorted, 12)).toBe(5);
  });

  it('handles empty and single-element arrays', () => {
    expect(binarySearch([], 1)).toBe(-1);
    expect(binarySearch([1], 1)).toBe(0);
    expect(binarySearch([1], 2)).toBe(-1);
  });

  it('handles targets outside the range', () => {
    expect(binarySearch(sorted, -99)).toBe(-1);
    expect(binarySearch(sorted, 99)).toBe(-1);
  });

  it('agrees with indexOf across a whole array', () => {
    const nums = [1, 3, 5, 7, 9, 11, 13];
    for (let target = 0; target <= 14; target += 1) {
      expect(binarySearch(nums, target)).toBe(nums.indexOf(target));
    }
  });
});

describe('searchRange', () => {
  it('finds a range of duplicates', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4]);
  });

  it('returns [-1,-1] when absent', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toEqual([-1, -1]);
  });

  it('handles a single occurrence', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 5)).toEqual([0, 0]);
    expect(searchRange([5, 7, 7, 8, 8, 10], 10)).toEqual([5, 5]);
  });

  it('handles an array that is entirely the target', () => {
    expect(searchRange([2, 2, 2, 2], 2)).toEqual([0, 3]);
  });

  it('handles empty input', () => {
    expect(searchRange([], 1)).toEqual([-1, -1]);
  });

  it('handles a long run of duplicates', () => {
    const nums = [1, ...Array(1000).fill(5), 9];
    expect(searchRange(nums, 5)).toEqual([1, 1000]);
  });
});

describe('searchRotated', () => {
  it('handles the prompt examples', () => {
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1);
    expect(searchRotated([1], 1)).toBe(0);
  });

  it('handles an unrotated array', () => {
    expect(searchRotated([1, 2, 3, 4, 5], 4)).toBe(3);
  });

  it('handles rotation by one', () => {
    expect(searchRotated([5, 1, 2, 3, 4], 5)).toBe(0);
    expect(searchRotated([2, 3, 4, 5, 1], 1)).toBe(4);
  });

  it('handles two elements', () => {
    expect(searchRotated([3, 1], 1)).toBe(1);
    expect(searchRotated([3, 1], 3)).toBe(0);
    expect(searchRotated([1, 3], 3)).toBe(1);
  });

  it('handles empty input', () => {
    expect(searchRotated([], 1)).toBe(-1);
  });

  it('finds every element at every rotation', () => {
    const base = [0, 1, 2, 3, 4, 5, 6];
    for (let r = 0; r < base.length; r += 1) {
      const rotated = [...base.slice(r), ...base.slice(0, r)];
      for (const target of base) {
        expect(searchRotated(rotated, target)).toBe(rotated.indexOf(target));
      }
      expect(searchRotated(rotated, 99)).toBe(-1);
    }
  });
});

describe('minEatingSpeed', () => {
  it('handles the prompt examples', () => {
    expect(minEatingSpeed([3, 6, 7, 11], 8)).toBe(4);
    expect(minEatingSpeed([30, 11, 23, 4, 20], 5)).toBe(30);
    expect(minEatingSpeed([30, 11, 23, 4, 20], 6)).toBe(23);
  });

  it('returns 1 when there is plenty of time', () => {
    expect(minEatingSpeed([1, 1, 1, 1], 4)).toBe(1);
  });

  it('handles a single pile', () => {
    expect(minEatingSpeed([100], 10)).toBe(10);
    expect(minEatingSpeed([100], 1)).toBe(100);
  });

  it('handles h equal to the pile count (must finish each in one hour)', () => {
    expect(minEatingSpeed([5, 8, 2], 3)).toBe(8);
  });

  it('never exceeds the largest pile', () => {
    const piles = [4, 9, 2];
    expect(minEatingSpeed(piles, 3)).toBe(Math.max(...piles));
  });

  it('agrees with a brute-force scan', () => {
    const piles = [3, 6, 7, 11, 2, 8];
    const hoursAt = (k: number) => piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);

    for (let h = piles.length; h <= 40; h += 1) {
      let brute = 1;
      while (hoursAt(brute) > h) brute += 1;
      expect(minEatingSpeed(piles, h)).toBe(brute);
    }
  });
});
