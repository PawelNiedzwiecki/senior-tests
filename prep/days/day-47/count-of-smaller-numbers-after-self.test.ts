import { describe, it, expect } from 'vitest';
import { countSmaller } from './count-of-smaller-numbers-after-self.ts';



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
