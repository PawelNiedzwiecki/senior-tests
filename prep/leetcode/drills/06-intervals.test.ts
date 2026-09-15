import { describe, it, expect } from 'vitest';
import {
  eraseOverlapIntervals,
  insertInterval,
  type Interval,
} from '@leetcode/06-intervals.ts';

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

describe('insertInterval', () => {
  it('handles the prompt examples', () => {
    expect(
      insertInterval(
        [
          [1, 3],
          [6, 9],
        ],
        [2, 5],
      ),
    ).toEqual([
      [1, 5],
      [6, 9],
    ]);

    expect(
      insertInterval(
        [
          [1, 2],
          [3, 5],
          [6, 7],
          [8, 10],
          [12, 16],
        ],
        [4, 8],
      ),
    ).toEqual([
      [1, 2],
      [3, 10],
      [12, 16],
    ]);
  });

  it('handles an empty list', () => {
    expect(insertInterval([], [5, 7])).toEqual([[5, 7]]);
  });

  it('inserts before everything and after everything', () => {
    const intervals: Interval[] = [
      [3, 5],
      [8, 10],
    ];
    expect(insertInterval(intervals, [1, 2])).toEqual([
      [1, 2],
      [3, 5],
      [8, 10],
    ]);
    expect(insertInterval(intervals, [12, 14])).toEqual([
      [3, 5],
      [8, 10],
      [12, 14],
    ]);
  });

  it('merges when the intervals merely touch', () => {
    expect(
      insertInterval(
        [
          [1, 3],
          [7, 9],
        ],
        [3, 5],
      ),
    ).toEqual([
      [1, 5],
      [7, 9],
    ]);
  });

  it('swallows everything when the new interval spans the lot', () => {
    expect(
      insertInterval(
        [
          [2, 3],
          [5, 6],
          [8, 9],
        ],
        [1, 10],
      ),
    ).toEqual([[1, 10]]);
  });

  it('keeps a nested new interval invisible', () => {
    expect(insertInterval([[1, 10]], [3, 4])).toEqual([[1, 10]]);
  });

  it('never produces overlapping output', () => {
    const intervals: Interval[] = [
      [1, 2],
      [4, 6],
      [9, 12],
      [15, 20],
    ];
    for (let start = 0; start <= 22; start += 1) {
      for (let end = start; end <= 22; end += 1) {
        const merged = insertInterval(intervals, [start, end]);
        for (let i = 1; i < merged.length; i += 1) {
          expect(merged[i]![0]).toBeGreaterThan(merged[i - 1]![1]);
        }
      }
    }
  });
});
