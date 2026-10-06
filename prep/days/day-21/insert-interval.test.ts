import { describe, it, expect } from 'vitest';
import { insertInterval, type Interval } from './insert-interval.ts';



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
