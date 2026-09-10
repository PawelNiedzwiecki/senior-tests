import { describe, it, expect } from 'vitest';
import { subsets, permutations, combinationSum } from '@algo/07-recursion-backtracking.ts';

/** Order-insensitive comparison of a list of lists. */
const canon = (groups: number[][]) =>
  groups.map((g) => [...g].sort((a, b) => a - b)).sort((a, b) => String(a).localeCompare(String(b)));

describe('subsets', () => {
  it('produces the power set', () => {
    expect(canon(subsets([1, 2, 3]))).toEqual(
      canon([[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]),
    );
  });

  it('produces 2^n subsets', () => {
    for (const n of [0, 1, 2, 3, 4, 5]) {
      const nums = Array.from({ length: n }, (_, i) => i);
      expect(subsets(nums)).toHaveLength(2 ** n);
    }
  });

  it('includes the empty subset', () => {
    expect(subsets([1])).toContainEqual([]);
    expect(canon(subsets([]))).toEqual([[]]);
  });

  it('returns distinct subsets', () => {
    const result = subsets([1, 2, 3]);
    const seen = new Set(result.map((s) => JSON.stringify([...s].sort())));
    expect(seen.size).toBe(result.length);
  });

  it('does not return aliased arrays', () => {
    // Catches `results.push(path)` instead of `results.push([...path])`.
    const result = subsets([1, 2]);
    const references = new Set(result);
    expect(references.size).toBe(result.length);
  });

  it('handles negatives', () => {
    expect(subsets([-1, 0])).toHaveLength(4);
  });
});

describe('permutations', () => {
  it('produces every ordering', () => {
    expect(canon(permutations([1, 2, 3]))).toEqual(
      canon([
        [1, 2, 3],
        [1, 3, 2],
        [2, 1, 3],
        [2, 3, 1],
        [3, 1, 2],
        [3, 2, 1],
      ]),
    );
  });

  it('produces n! permutations', () => {
    const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
    for (const n of [1, 2, 3, 4, 5]) {
      const nums = Array.from({ length: n }, (_, i) => i);
      expect(permutations(nums)).toHaveLength(factorial(n));
    }
  });

  it('returns distinct orderings', () => {
    const result = permutations([1, 2, 3, 4]);
    expect(new Set(result.map((p) => p.join(','))).size).toBe(result.length);
  });

  it('every permutation uses every element exactly once', () => {
    for (const p of permutations([1, 2, 3])) {
      expect([...p].sort()).toEqual([1, 2, 3]);
    }
  });

  it('handles a single element', () => {
    expect(permutations([7])).toEqual([[7]]);
  });

  it('handles the empty array', () => {
    expect(permutations([])).toEqual([[]]);
  });
});

describe('combinationSum', () => {
  it('handles the prompt example', () => {
    expect(canon(combinationSum([2, 3, 6, 7], 7))).toEqual(canon([[2, 2, 3], [7]]));
  });

  it('returns an empty list when unreachable', () => {
    expect(combinationSum([2], 1)).toEqual([]);
    expect(combinationSum([3, 5], 1)).toEqual([]);
  });

  it('reuses a candidate many times', () => {
    expect(canon(combinationSum([2], 6))).toEqual(canon([[2, 2, 2]]));
  });

  it('finds several combinations', () => {
    expect(canon(combinationSum([2, 3, 5], 8))).toEqual(
      canon([
        [2, 2, 2, 2],
        [2, 3, 3],
        [3, 5],
      ]),
    );
  });

  it('does not return permutations of the same combination', () => {
    const result = combinationSum([2, 3], 5);
    // [2,3] and [3,2] are the same combination — exactly one must appear.
    expect(result).toHaveLength(1);
  });

  it('handles a target of 0 as one empty combination', () => {
    expect(combinationSum([2, 3], 0)).toEqual([[]]);
  });

  it('handles an empty candidate list', () => {
    expect(combinationSum([], 5)).toEqual([]);
  });
});
