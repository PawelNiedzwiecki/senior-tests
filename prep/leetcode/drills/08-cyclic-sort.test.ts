import { describe, it, expect } from 'vitest';
import { findDisappearedNumbers, findAllDuplicates } from '@leetcode/08-cyclic-sort.ts';

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

describe('findAllDuplicates', () => {
  it('handles the prompt examples', () => {
    expect(findAllDuplicates([4, 3, 2, 7, 8, 2, 3, 1]).sort((a, b) => a - b)).toEqual([2, 3]);
    expect(findAllDuplicates([1, 1, 2])).toEqual([1]);
    expect(findAllDuplicates([1, 2, 3])).toEqual([]);
  });

  it('handles a single element', () => {
    expect(findAllDuplicates([1])).toEqual([]);
  });

  it('reports each duplicate exactly once', () => {
    const result = findAllDuplicates([2, 2, 3, 3, 4, 4, 1, 1]).sort((a, b) => a - b);
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('leaves the input values intact (signs restored)', () => {
    const nums = [4, 3, 2, 7, 8, 2, 3, 1];
    findAllDuplicates(nums);
    expect(nums.every((v) => v > 0)).toBe(true);
    expect([...nums].sort((a, b) => a - b)).toEqual([1, 2, 2, 3, 3, 4, 7, 8]);
  });

  it('agrees with a counting reference on a larger input', () => {
    const n = 500;
    const nums = Array.from({ length: n }, (_, i) => (i % 5 === 0 ? i + 2 : i + 1));
    const counts = new Map<number, number>();
    for (const v of nums) counts.set(v, (counts.get(v) ?? 0) + 1);
    const expected = [...counts.entries()]
      .filter(([, c]) => c === 2)
      .map(([v]) => v)
      .sort((a, b) => a - b);

    expect(findAllDuplicates(nums).sort((a, b) => a - b)).toEqual(expected);
  });
});
