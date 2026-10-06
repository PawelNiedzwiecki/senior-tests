import { describe, it, expect } from 'vitest';
import { eraseOverlapIntervals, type Interval } from './non-overlapping-intervals.ts';

describe('eraseOverlapIntervals', () => {
  it('handles the prompt examples', () => {
    expect(
      eraseOverlapIntervals([
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 3],
      ]),
    ).toBe(1);
    expect(
      eraseOverlapIntervals([
        [1, 2],
        [1, 2],
        [1, 2],
      ]),
    ).toBe(2);
    expect(
      eraseOverlapIntervals([
        [1, 2],
        [2, 3],
      ]),
    ).toBe(0);
  });

  it('handles empty and single inputs', () => {
    expect(eraseOverlapIntervals([])).toBe(0);
    expect(eraseOverlapIntervals([[1, 10]])).toBe(0);
  });

  it('prefers the earliest-ending interval over the earliest-starting one', () => {
    // Sorting by start keeps [1,100] and removes two; the right answer is one.
    expect(
      eraseOverlapIntervals([
        [1, 100],
        [2, 3],
        [4, 5],
      ]),
    ).toBe(1);
  });

  it('handles fully nested intervals', () => {
    expect(
      eraseOverlapIntervals([
        [1, 10],
        [2, 9],
        [3, 8],
      ]),
    ).toBe(2);
  });

  it('handles an already disjoint set', () => {
    expect(
      eraseOverlapIntervals([
        [1, 2],
        [3, 4],
        [5, 6],
      ]),
    ).toBe(0);
  });

  it('does not mutate the caller array', () => {
    const intervals: Interval[] = [
      [5, 6],
      [1, 2],
      [3, 4],
    ];
    const snapshot = JSON.stringify(intervals);
    eraseOverlapIntervals(intervals);
    expect(JSON.stringify(intervals)).toBe(snapshot);
  });
});