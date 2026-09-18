import { describe, it, expect } from 'vitest';
import {
  searchRange,
  searchRotated,
  findPeakElement,
  minEatingSpeed,
  splitArrayLargestSum,
} from '@tier1/05-binary-search.ts';

describe('exam 1 — searchRange', () => {
  it('handles the prompt examples', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4]);
    expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toEqual([-1, -1]);
    expect(searchRange([], 0)).toEqual([-1, -1]);
  });

  it('handles a single occurrence and a single-element array', () => {
    expect(searchRange([5, 7, 7, 8, 8, 10], 10)).toEqual([5, 5]);
    expect(searchRange([1], 1)).toEqual([0, 0]);
    expect(searchRange([1], 2)).toEqual([-1, -1]);
  });

  it('handles the target filling the whole array', () => {
    expect(searchRange([2, 2, 2, 2], 2)).toEqual([0, 3]);
  });

  it('handles targets outside the range', () => {
    expect(searchRange([2, 4, 6], 1)).toEqual([-1, -1]);
    expect(searchRange([2, 4, 6], 9)).toEqual([-1, -1]);
  });

  it('agrees with indexOf/lastIndexOf across a duplicated array', () => {
    const nums = [1, 1, 2, 3, 3, 3, 5, 8, 8, 9];
    for (const target of [0, 1, 2, 3, 4, 5, 8, 9, 10]) {
      expect(searchRange(nums, target)).toEqual([
        nums.indexOf(target),
        nums.lastIndexOf(target),
      ]);
    }
  });
});

describe('exam 2 — searchRotated', () => {
  it('handles the prompt examples', () => {
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1);
    expect(searchRotated([1], 1)).toBe(0);
  });

  it('handles a zero rotation and an empty array', () => {
    expect(searchRotated([1, 2, 3, 4, 5], 4)).toBe(3);
    expect(searchRotated([], 1)).toBe(-1);
  });

  it('finds the pivot value and the two ends', () => {
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 4)).toBe(0);
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 2)).toBe(6);
    expect(searchRotated([4, 5, 6, 7, 0, 1, 2], 7)).toBe(3);
  });

  it('works for every rotation of every target', () => {
    const base = [0, 1, 2, 3, 4, 5, 6];
    for (let r = 0; r < base.length; r += 1) {
      const rotated = [...base.slice(r), ...base.slice(0, r)];
      for (const target of [...base, 7, -1]) {
        expect(searchRotated(rotated, target)).toBe(rotated.indexOf(target));
      }
    }
  });
});

describe('exam 3 — findPeakElement', () => {
  const isPeak = (nums: number[], i: number) => {
    const left = i > 0 ? nums[i - 1]! : -Infinity;
    const right = i < nums.length - 1 ? nums[i + 1]! : -Infinity;
    return nums[i]! > left && nums[i]! > right;
  };

  it('finds a peak in the prompt examples', () => {
    expect(findPeakElement([1, 2, 3, 1])).toBe(2);
    expect([1, 5]).toContain(findPeakElement([1, 2, 1, 3, 5, 6, 4]));
    expect(findPeakElement([1])).toBe(0);
  });

  it('handles monotone input, where the peak is at an end', () => {
    expect(findPeakElement([1, 2, 3, 4])).toBe(3);
    expect(findPeakElement([4, 3, 2, 1])).toBe(0);
  });

  it('returns a genuine peak for a range of shapes', () => {
    const cases = [
      [1, 2],
      [2, 1],
      [1, 3, 2, 4, 1],
      [5, 4, 3, 2, 6],
      [1, 2, 3, 4, 5, 4, 3, 2, 1],
      [-5, -4, -3, -6],
    ];
    for (const nums of cases) {
      const i = findPeakElement(nums);
      expect(isPeak(nums, i), `index ${i} of ${JSON.stringify(nums)}`).toBe(true);
    }
  });
});

describe('exam 4 — minEatingSpeed', () => {
  it('handles the prompt examples', () => {
    expect(minEatingSpeed([3, 6, 7, 11], 8)).toBe(4);
    expect(minEatingSpeed([30, 11, 23, 4, 20], 5)).toBe(30);
    expect(minEatingSpeed([30, 11, 23, 4, 20], 6)).toBe(23);
  });

  it('handles one pile and generous time', () => {
    expect(minEatingSpeed([312_884_470], 968_709_470)).toBe(1);
    expect(minEatingSpeed([1, 1, 1, 1], 4)).toBe(1);
  });

  it('is forced to the largest pile when hours equals the pile count', () => {
    expect(minEatingSpeed([1, 2, 3, 100], 4)).toBe(100);
  });

  it('agrees with a linear scan over the feasible speeds', () => {
    const piles = [12, 5, 7, 31, 9, 2];
    const hoursNeeded = (k: number) =>
      piles.reduce((total, p) => total + Math.ceil(p / k), 0);
    for (const hours of [6, 8, 12, 20, 40, 66]) {
      let expected = 1;
      while (hoursNeeded(expected) > hours) expected += 1;
      expect(minEatingSpeed(piles, hours)).toBe(expected);
    }
  });
});

describe('exam 5 — splitArrayLargestSum', () => {
  it('handles the prompt examples', () => {
    expect(splitArrayLargestSum([7, 2, 5, 10, 8], 2)).toBe(18);
    expect(splitArrayLargestSum([1, 2, 3, 4, 5], 2)).toBe(9);
    expect(splitArrayLargestSum([1, 4, 4], 3)).toBe(4);
  });

  it('handles k = 1 and k = n', () => {
    expect(splitArrayLargestSum([1, 2, 3, 4, 5], 1)).toBe(15);
    expect(splitArrayLargestSum([1, 2, 3, 4, 5], 5)).toBe(5);
  });

  it('is never below the largest single element', () => {
    expect(splitArrayLargestSum([1, 1, 100, 1], 3)).toBe(100);
    expect(splitArrayLargestSum([0, 0, 0], 2)).toBe(0);
  });

  it('agrees with a dynamic-programming reference', () => {
    const nums = [5, 2, 9, 4, 1, 7, 3, 8];
    /** dp[parts][i] = best largest-sum for splitting the first i values. */
    const reference = (k: number) => {
      const prefix = [0];
      for (const x of nums) prefix.push(prefix[prefix.length - 1]! + x);
      const dp = Array.from({ length: k + 1 }, () =>
        new Array<number>(nums.length + 1).fill(Infinity),
      );
      dp[0]![0] = 0;
      for (let parts = 1; parts <= k; parts += 1)
        for (let i = 1; i <= nums.length; i += 1)
          for (let j = parts - 1; j < i; j += 1)
            dp[parts]![i] = Math.min(
              dp[parts]![i]!,
              Math.max(dp[parts - 1]![j]!, prefix[i]! - prefix[j]!),
            );
      return dp[k]![nums.length]!;
    };

    for (const k of [1, 2, 3, 4, 8]) {
      expect(splitArrayLargestSum(nums, k)).toBe(reference(k));
    }
  });
});
