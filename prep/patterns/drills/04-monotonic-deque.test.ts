import { describe, it, expect } from 'vitest';
import {
  maxSlidingWindow,
  nextGreaterCircular,
  largestRectangleArea,
} from '@patterns/04-monotonic-deque.ts';

describe('maxSlidingWindow', () => {
  it('handles the prompt example', () => {
    expect(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([3, 3, 5, 5, 6, 7]);
  });

  it('handles k = 1', () => {
    expect(maxSlidingWindow([4, 2, 7], 1)).toEqual([4, 2, 7]);
  });

  it('handles k equal to the array length', () => {
    expect(maxSlidingWindow([4, 2, 7], 3)).toEqual([7]);
  });

  it('handles a decreasing array', () => {
    expect(maxSlidingWindow([5, 4, 3, 2], 2)).toEqual([5, 4, 3]);
  });

  it('handles an increasing array', () => {
    expect(maxSlidingWindow([1, 2, 3, 4], 2)).toEqual([2, 3, 4]);
  });

  it('handles duplicates', () => {
    expect(maxSlidingWindow([2, 2, 2], 2)).toEqual([2, 2]);
  });

  it('handles negatives', () => {
    expect(maxSlidingWindow([-5, -2, -8], 2)).toEqual([-2, -2]);
  });

  it('handles invalid or empty input', () => {
    expect(maxSlidingWindow([], 3)).toEqual([]);
    expect(maxSlidingWindow([1, 2], 0)).toEqual([]);
    expect(maxSlidingWindow([1, 2], 5)).toEqual([]);
  });

  it('agrees with brute force', () => {
    const nums = [8, 3, -1, 7, 7, 0, 4, -2, 9, 1, 1, 6];
    for (let k = 1; k <= nums.length; k += 1) {
      const brute: number[] = [];
      for (let i = 0; i + k <= nums.length; i += 1) brute.push(Math.max(...nums.slice(i, i + k)));
      expect(maxSlidingWindow(nums, k)).toEqual(brute);
    }
  });
});

describe('nextGreaterCircular', () => {
  it('handles the prompt examples', () => {
    expect(nextGreaterCircular([1, 2, 1])).toEqual([2, -1, 2]);
    expect(nextGreaterCircular([5, 4, 3, 2, 1])).toEqual([-1, 5, 5, 5, 5]);
  });

  it('handles an increasing array', () => {
    expect(nextGreaterCircular([1, 2, 3])).toEqual([2, 3, -1]);
  });

  it('handles all equal values (equal is not greater)', () => {
    expect(nextGreaterCircular([2, 2, 2])).toEqual([-1, -1, -1]);
  });

  it('handles a single element', () => {
    expect(nextGreaterCircular([7])).toEqual([-1]);
  });

  it('handles an empty array', () => {
    expect(nextGreaterCircular([])).toEqual([]);
  });

  it('wraps around correctly', () => {
    expect(nextGreaterCircular([3, 1, 2])).toEqual([-1, 2, 3]);
  });
});

describe('largestRectangleArea', () => {
  it('handles the prompt examples', () => {
    expect(largestRectangleArea([2, 1, 5, 6, 2, 3])).toBe(10);
    expect(largestRectangleArea([2, 4])).toBe(4);
  });

  it('handles a single bar', () => {
    expect(largestRectangleArea([5])).toBe(5);
  });

  it('handles an empty histogram', () => {
    expect(largestRectangleArea([])).toBe(0);
  });

  it('handles a flat histogram', () => {
    expect(largestRectangleArea([3, 3, 3])).toBe(9);
  });

  it('handles increasing and decreasing runs', () => {
    expect(largestRectangleArea([1, 2, 3, 4, 5])).toBe(9); // heights 3,4,5 → 3*3
    expect(largestRectangleArea([5, 4, 3, 2, 1])).toBe(9);
  });

  it('handles zero-height bars', () => {
    expect(largestRectangleArea([0, 0])).toBe(0);
    expect(largestRectangleArea([2, 0, 2])).toBe(2);
  });

  it('agrees with brute force', () => {
    const heights = [4, 2, 0, 3, 2, 5, 1, 6, 2];
    let brute = 0;
    for (let i = 0; i < heights.length; i += 1) {
      let minHeight = heights[i]!;
      for (let j = i; j < heights.length; j += 1) {
        minHeight = Math.min(minHeight, heights[j]!);
        brute = Math.max(brute, minHeight * (j - i + 1));
      }
    }
    expect(largestRectangleArea(heights)).toBe(brute);
  });
});
