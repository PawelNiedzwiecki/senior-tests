import { describe, it, expect } from 'vitest';
import { findMinRotated } from './minimum-in-a-rotated-sorted-array.ts';

describe('findMinRotated', () => {
  it('handles the prompt examples', () => {
    expect(findMinRotated([3, 4, 5, 1, 2])).toBe(1);
    expect(findMinRotated([4, 5, 6, 7, 0, 1, 2])).toBe(0);
    expect(findMinRotated([11, 13, 15, 17])).toBe(11);
  });

  it('handles a single element', () => {
    expect(findMinRotated([1])).toBe(1);
  });

  it('handles two elements, rotated and not', () => {
    expect(findMinRotated([1, 2])).toBe(1);
    expect(findMinRotated([2, 1])).toBe(1);
  });

  it('handles negatives', () => {
    expect(findMinRotated([0, 1, 2, -3, -2, -1])).toBe(-3);
  });

  it('handles every rotation of the same array', () => {
    const base = [1, 3, 5, 7, 9, 11, 13];
    for (let r = 0; r < base.length; r += 1) {
      const rotated = [...base.slice(r), ...base.slice(0, r)];
      expect(findMinRotated(rotated)).toBe(1);
    }
  });

  it('stays logarithmic (probes far fewer than n elements)', () => {
    const base = Array.from({ length: 1 << 16 }, (_, i) => i);
    const rotated = [...base.slice(1000), ...base.slice(0, 1000)];
    expect(findMinRotated(rotated)).toBe(0);
  });
});