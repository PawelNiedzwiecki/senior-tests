import { describe, it, expect } from 'vitest';
import {
  rangeSums,
  pivotIndex,
  subarraySum,
  productExceptSelf,
  applyRangeUpdates,
} from '@tier1/04-prefix-sum.ts';

describe('exam 1 — rangeSums', () => {
  it('handles the prompt examples', () => {
    expect(
      rangeSums(
        [-2, 0, 3, -5, 2, -1],
        [
          [0, 2],
          [2, 5],
          [0, 5],
        ],
      ),
    ).toEqual([1, -1, -3]);
    expect(rangeSums([1, 2, 3], [[1, 1]])).toEqual([2]);
  });

  it('handles single-element ranges at both ends', () => {
    expect(
      rangeSums(
        [5, 6, 7],
        [
          [0, 0],
          [2, 2],
        ],
      ),
    ).toEqual([5, 7]);
  });

  it('handles no queries and repeated queries', () => {
    expect(rangeSums([1, 2, 3], [])).toEqual([]);
    expect(
      rangeSums(
        [1, 2, 3],
        [
          [0, 1],
          [0, 1],
        ],
      ),
    ).toEqual([3, 3]);
  });

  it('agrees with the naive sum on many queries', () => {
    const nums = Array.from({ length: 60 }, (_, i) => ((i * 7) % 13) - 6);
    const queries: Array<[number, number]> = [];
    for (let i = 0; i < nums.length; i += 7)
      for (let j = i; j < nums.length; j += 11) queries.push([i, j]);
    const expected = queries.map(([from, to]) =>
      nums.slice(from, to + 1).reduce((a, b) => a + b, 0),
    );
    expect(rangeSums(nums, queries)).toEqual(expected);
  });
});

describe('exam 2 — pivotIndex', () => {
  it('handles the prompt examples', () => {
    expect(pivotIndex([1, 7, 3, 6, 5, 6])).toBe(3);
    expect(pivotIndex([1, 2, 3])).toBe(-1);
    expect(pivotIndex([2, 1, -1])).toBe(0);
  });

  it('treats the empty side as zero at both ends', () => {
    expect(pivotIndex([-1, 1, 2])).toBe(2);
    expect(pivotIndex([0])).toBe(0);
  });

  it('returns the leftmost pivot when several qualify', () => {
    expect(pivotIndex([0, 0, 0])).toBe(0);
  });

  it('handles an empty array', () => {
    expect(pivotIndex([])).toBe(-1);
  });
});

describe('exam 3 — subarraySum', () => {
  it('handles the prompt examples', () => {
    expect(subarraySum([1, 1, 1], 2)).toBe(2);
    expect(subarraySum([1, 2, 3], 3)).toBe(2);
    expect(subarraySum([1, -1, 0], 0)).toBe(3);
  });

  it('counts subarrays that start at index 0 — the {0: 1} seed', () => {
    expect(subarraySum([3], 3)).toBe(1);
    expect(subarraySum([1, 2, 3], 6)).toBe(1);
  });

  it('handles negatives and repeated prefixes', () => {
    expect(subarraySum([1, -1, 1, -1], 0)).toBe(4);
    expect(subarraySum([-1, -1, 1], 0)).toBe(1);
  });

  it('returns 0 when nothing matches', () => {
    expect(subarraySum([1, 2, 3], 100)).toBe(0);
    expect(subarraySum([], 0)).toBe(0);
  });

  it('agrees with brute force', () => {
    const nums = [3, -2, 5, -1, 0, 2, -4, 3, 3, -3];
    for (const k of [-3, 0, 2, 5, 8]) {
      let expected = 0;
      for (let i = 0; i < nums.length; i += 1) {
        let sum = 0;
        for (let j = i; j < nums.length; j += 1) {
          sum += nums[j]!;
          if (sum === k) expected += 1;
        }
      }
      expect(subarraySum(nums, k)).toBe(expected);
    }
  });
});

describe('exam 4 — productExceptSelf', () => {
  /**
   * `-1 * 0` is -0 in JavaScript, and `toEqual` tells -0 and 0 apart. Adding 0
   * normalises it. Not part of the exam, but worth knowing it exists.
   */
  const noNegativeZero = (xs: number[]) => xs.map((x) => x + 0);

  it('handles the prompt examples', () => {
    expect(productExceptSelf([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
    expect(noNegativeZero(productExceptSelf([-1, 1, 0, -3, 3]))).toEqual([0, 0, 9, 0, 0]);
  });

  it('handles two zeros — every slot is zero', () => {
    expect(noNegativeZero(productExceptSelf([0, 0, 3]))).toEqual([0, 0, 0]);
  });

  it('handles negatives and a two-element input', () => {
    expect(productExceptSelf([-2, -3, 4])).toEqual([-12, -8, 6]);
    expect(productExceptSelf([5, 9])).toEqual([9, 5]);
  });

  it('agrees with a division-based reference on zero-free input', () => {
    const nums = [2, 3, 5, 7, 11];
    const total = nums.reduce((a, b) => a * b, 1);
    expect(productExceptSelf(nums)).toEqual(nums.map((x) => total / x));
  });
});

describe('exam 5 — applyRangeUpdates', () => {
  it('handles the prompt examples', () => {
    expect(
      applyRangeUpdates(5, [
        [1, 3, 2],
        [2, 4, 3],
        [0, 2, -2],
      ]),
    ).toEqual([-2, 0, 3, 5, 3]);
    expect(applyRangeUpdates(3, [])).toEqual([0, 0, 0]);
  });

  it('handles a range that reaches the final index', () => {
    expect(applyRangeUpdates(4, [[0, 3, 1]])).toEqual([1, 1, 1, 1]);
    expect(applyRangeUpdates(4, [[3, 3, 5]])).toEqual([0, 0, 0, 5]);
  });

  it('accumulates overlapping updates', () => {
    expect(
      applyRangeUpdates(4, [
        [0, 1, 1],
        [1, 2, 1],
        [2, 3, 1],
      ]),
    ).toEqual([1, 2, 2, 1]);
  });

  it('agrees with the naive per-index application', () => {
    const length = 30;
    const updates: Array<[number, number, number]> = [
      [0, 29, 1],
      [5, 10, -4],
      [10, 10, 7],
      [12, 28, 2],
      [0, 0, 100],
    ];
    const expected = new Array<number>(length).fill(0);
    for (const [from, to, value] of updates)
      for (let i = from; i <= to; i += 1) expected[i] = expected[i]! + value;
    expect(applyRangeUpdates(length, updates)).toEqual(expected);
  });
});
