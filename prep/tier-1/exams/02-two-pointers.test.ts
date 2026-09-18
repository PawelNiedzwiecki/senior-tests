import { describe, it, expect } from 'vitest';
import {
  sortedSquares,
  removeDuplicatesAtMostTwice,
  maxArea,
  threeSumClosest,
  mergeInto,
} from '@tier1/02-two-pointers.ts';

describe('exam 1 — sortedSquares', () => {
  it('handles the prompt examples', () => {
    expect(sortedSquares([-4, -1, 0, 3, 10])).toEqual([0, 1, 9, 16, 100]);
    expect(sortedSquares([-7, -3, 2, 3, 11])).toEqual([4, 9, 9, 49, 121]);
  });

  it('handles all-negative and all-positive inputs', () => {
    expect(sortedSquares([-5, -3, -1])).toEqual([1, 9, 25]);
    expect(sortedSquares([1, 2, 3])).toEqual([1, 4, 9]);
  });

  it('handles duplicates, zeros and short inputs', () => {
    expect(sortedSquares([-2, -2, 2, 2])).toEqual([4, 4, 4, 4]);
    expect(sortedSquares([0])).toEqual([0]);
    expect(sortedSquares([])).toEqual([]);
  });

  it('agrees with sort-then-square on a larger case', () => {
    const nums = Array.from({ length: 200 }, (_, i) => i - 97);
    const expected = nums.map((x) => x * x).sort((p, q) => p - q);
    expect(sortedSquares(nums)).toEqual(expected);
  });
});

describe('exam 2 — removeDuplicatesAtMostTwice', () => {
  it('handles the prompt examples in place', () => {
    const a = [1, 1, 1, 2, 2, 3];
    expect(removeDuplicatesAtMostTwice(a)).toBe(5);
    expect(a.slice(0, 5)).toEqual([1, 1, 2, 2, 3]);

    const b = [0, 0, 1, 1, 1, 1, 2, 3, 3];
    expect(removeDuplicatesAtMostTwice(b)).toBe(7);
    expect(b.slice(0, 7)).toEqual([0, 0, 1, 1, 2, 3, 3]);
  });

  it('leaves an already-compliant array untouched', () => {
    const a = [1, 2, 3];
    expect(removeDuplicatesAtMostTwice(a)).toBe(3);
    expect(a).toEqual([1, 2, 3]);
  });

  it('handles a single repeated value and tiny inputs', () => {
    const a = [7, 7, 7, 7, 7];
    expect(removeDuplicatesAtMostTwice(a)).toBe(2);
    expect(a.slice(0, 2)).toEqual([7, 7]);

    expect(removeDuplicatesAtMostTwice([1])).toBe(1);
    expect(removeDuplicatesAtMostTwice([])).toBe(0);
  });

  it('handles negatives and a run at the very end', () => {
    const a = [-3, -3, -3, -1, 0, 0, 0];
    expect(removeDuplicatesAtMostTwice(a)).toBe(5);
    expect(a.slice(0, 5)).toEqual([-3, -3, -1, 0, 0]);
  });
});

describe('exam 3 — maxArea', () => {
  it('handles the prompt examples', () => {
    expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toBe(49);
    expect(maxArea([1, 1])).toBe(1);
  });

  it('prefers width when the heights are flat', () => {
    expect(maxArea([4, 4, 4, 4])).toBe(12);
  });

  it('handles a single tall pair beating many short ones', () => {
    expect(maxArea([2, 3, 4, 5, 18, 17, 6])).toBe(17);
  });

  it('handles zeros and degenerate inputs', () => {
    expect(maxArea([0, 0])).toBe(0);
    expect(maxArea([5])).toBe(0);
    expect(maxArea([])).toBe(0);
  });

  it('agrees with brute force on a random-ish case', () => {
    const h = [3, 9, 3, 4, 7, 2, 12, 6, 1, 8, 5];
    let best = 0;
    for (let i = 0; i < h.length; i += 1)
      for (let j = i + 1; j < h.length; j += 1)
        best = Math.max(best, Math.min(h[i]!, h[j]!) * (j - i));
    expect(maxArea(h)).toBe(best);
  });
});

describe('exam 4 — threeSumClosest', () => {
  it('handles the prompt examples', () => {
    expect(threeSumClosest([-1, 2, 1, -4], 1)).toBe(2);
    expect(threeSumClosest([0, 0, 0], 1)).toBe(0);
  });

  it('returns an exact hit when one exists', () => {
    expect(threeSumClosest([-1, 0, 1, 2, -1, -4], 0)).toBe(0);
  });

  it('handles all-positive and all-negative inputs', () => {
    expect(threeSumClosest([1, 2, 5, 10, 11], 12)).toBe(13);
    expect(threeSumClosest([-5, -4, -3, -2], -10)).toBe(-10);
  });

  it('agrees with brute force', () => {
    const nums = [4, 0, 5, -5, 3, 3, 0, -4, -5];
    const target = -2;
    let best = Infinity;
    for (let i = 0; i < nums.length; i += 1)
      for (let j = i + 1; j < nums.length; j += 1)
        for (let k = j + 1; k < nums.length; k += 1) {
          const sum = nums[i]! + nums[j]! + nums[k]!;
          if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
        }
    expect(threeSumClosest(nums, target)).toBe(best);
  });
});

describe('exam 5 — mergeInto', () => {
  it('handles the prompt examples', () => {
    const a = [1, 2, 3, 0, 0, 0];
    mergeInto(a, 3, [2, 5, 6], 3);
    expect(a).toEqual([1, 2, 2, 3, 5, 6]);
  });

  it('handles an empty b and an empty a', () => {
    const a = [1];
    mergeInto(a, 1, [], 0);
    expect(a).toEqual([1]);

    const b = [0];
    mergeInto(b, 0, [1], 1);
    expect(b).toEqual([1]);
  });

  it('drains b when every value of b is smaller', () => {
    const a = [4, 5, 6, 0, 0, 0];
    mergeInto(a, 3, [1, 2, 3], 3);
    expect(a).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('keeps a in place when every value of b is larger', () => {
    const a = [1, 2, 3, 0, 0, 0];
    mergeInto(a, 3, [7, 8, 9], 3);
    expect(a).toEqual([1, 2, 3, 7, 8, 9]);
  });

  it('is stable across interleaved duplicates', () => {
    const a = [1, 2, 2, 5, 0, 0, 0, 0];
    mergeInto(a, 4, [2, 3, 5, 6], 4);
    expect(a).toEqual([1, 2, 2, 2, 3, 5, 5, 6]);
  });
});
