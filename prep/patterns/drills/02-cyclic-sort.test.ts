import { describe, it, expect } from 'vitest';
import {
  findMissingNumber,
  findDuplicatesAndMissing,
  firstMissingPositive,
} from '@patterns/02-cyclic-sort.ts';

describe('findMissingNumber', () => {
  it('handles the prompt examples', () => {
    expect(findMissingNumber([3, 0, 1])).toBe(2);
    expect(findMissingNumber([0, 1])).toBe(2);
    expect(findMissingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
  });

  it('handles a missing 0', () => {
    expect(findMissingNumber([1])).toBe(0);
    expect(findMissingNumber([2, 1])).toBe(0);
  });

  it('handles the missing value at the end of the range', () => {
    expect(findMissingNumber([0])).toBe(1);
    expect(findMissingNumber([0, 1, 2])).toBe(3);
  });

  it('handles an empty array', () => {
    expect(findMissingNumber([])).toBe(0);
  });

  it('agrees with a set-based reference on many shuffles', () => {
    for (let trial = 0; trial < 30; trial += 1) {
      const n = 8;
      const missing = Math.floor(Math.random() * (n + 1));
      const nums = Array.from({ length: n + 1 }, (_, i) => i).filter((v) => v !== missing);
      for (let i = nums.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j]!, nums[i]!];
      }
      expect(findMissingNumber(nums)).toBe(missing);
    }
  });
});

describe('findDuplicatesAndMissing', () => {
  it('handles the prompt examples', () => {
    expect(findDuplicatesAndMissing([4, 3, 2, 7, 8, 2, 3, 1])).toEqual({
      duplicates: [2, 3],
      missing: [5, 6],
    });
    expect(findDuplicatesAndMissing([1, 1])).toEqual({ duplicates: [1], missing: [2] });
  });

  it('returns empty lists for a complete set', () => {
    expect(findDuplicatesAndMissing([1, 2, 3])).toEqual({ duplicates: [], missing: [] });
    expect(findDuplicatesAndMissing([3, 1, 2])).toEqual({ duplicates: [], missing: [] });
  });

  it('handles a single element', () => {
    expect(findDuplicatesAndMissing([1])).toEqual({ duplicates: [], missing: [] });
  });

  it('handles an empty array', () => {
    expect(findDuplicatesAndMissing([])).toEqual({ duplicates: [], missing: [] });
  });

  it('handles every value being the same', () => {
    expect(findDuplicatesAndMissing([2, 2, 2])).toEqual({
      duplicates: [2],
      missing: [1, 3],
    });
  });

  it('returns results in ascending order', () => {
    const result = findDuplicatesAndMissing([5, 5, 1, 1, 3]);
    expect(result.duplicates).toEqual([...result.duplicates].sort((a, b) => a - b));
    expect(result.missing).toEqual([...result.missing].sort((a, b) => a - b));
  });
});

describe('firstMissingPositive', () => {
  it('handles the prompt examples', () => {
    expect(firstMissingPositive([1, 2, 0])).toBe(3);
    expect(firstMissingPositive([3, 4, -1, 1])).toBe(2);
    expect(firstMissingPositive([7, 8, 9, 11])).toBe(1);
  });

  it('handles an empty array', () => {
    expect(firstMissingPositive([])).toBe(1);
  });

  it('handles a complete run from 1', () => {
    expect(firstMissingPositive([1, 2, 3])).toBe(4);
  });

  it('ignores negatives and zeroes', () => {
    expect(firstMissingPositive([-5, -3, 0])).toBe(1);
    expect(firstMissingPositive([0, 2, 2, 1, 1])).toBe(3);
  });

  it('handles duplicates', () => {
    expect(firstMissingPositive([1, 1, 1])).toBe(2);
  });

  it('handles values far beyond n', () => {
    expect(firstMissingPositive([1000000, 1])).toBe(2);
  });

  it('agrees with a set-based reference', () => {
    for (let trial = 0; trial < 40; trial += 1) {
      const nums = Array.from({ length: 10 }, () => Math.floor(Math.random() * 14) - 2);
      const set = new Set(nums);
      let expected = 1;
      while (set.has(expected)) expected += 1;
      expect(firstMissingPositive([...nums])).toBe(expected);
    }
  });
});
