import { describe, it, expect } from 'vitest';
import { findAllDuplicates } from './find-all-duplicates-in-an-array.ts';



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
