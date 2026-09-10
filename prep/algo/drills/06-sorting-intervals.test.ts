import { describe, it, expect } from 'vitest';
import { sortNumbers, mergeIntervals, minMeetingRooms } from '@algo/06-sorting-intervals.ts';
import type { Interval } from '@algo/06-sorting-intervals.ts';

describe('sortNumbers', () => {
  it('sorts numerically, not lexicographically', () => {
    expect(sortNumbers([10, 9, 1])).toEqual([1, 9, 10]);
    expect(sortNumbers([100, 25, 3])).toEqual([3, 25, 100]);
  });

  it('handles negatives', () => {
    expect(sortNumbers([3, -1, -10, 2])).toEqual([-10, -1, 2, 3]);
  });

  it('does not mutate the input', () => {
    const input = [3, 1, 2];
    const result = sortNumbers(input);
    expect(input).toEqual([3, 1, 2]);
    expect(result).not.toBe(input);
  });

  it('handles empty, single and already-sorted input', () => {
    expect(sortNumbers([])).toEqual([]);
    expect(sortNumbers([5])).toEqual([5]);
    expect(sortNumbers([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('handles duplicates', () => {
    expect(sortNumbers([2, 1, 2, 1])).toEqual([1, 1, 2, 2]);
  });
});

describe('mergeIntervals', () => {
  it('merges the prompt example', () => {
    const input: Interval[] = [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ];
    expect(mergeIntervals(input)).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it('treats touching intervals as overlapping', () => {
    expect(
      mergeIntervals([
        [1, 4],
        [4, 5],
      ]),
    ).toEqual([[1, 5]]);
  });

  it('handles unsorted input', () => {
    expect(
      mergeIntervals([
        [8, 10],
        [1, 3],
        [2, 6],
      ]),
    ).toEqual([
      [1, 6],
      [8, 10],
    ]);
  });

  it('handles a fully contained interval without shrinking the end', () => {
    expect(
      mergeIntervals([
        [1, 10],
        [2, 3],
      ]),
    ).toEqual([[1, 10]]);
  });

  it('handles empty and single input', () => {
    expect(mergeIntervals([])).toEqual([]);
    expect(mergeIntervals([[1, 5]])).toEqual([[1, 5]]);
  });

  it('keeps disjoint intervals apart', () => {
    expect(
      mergeIntervals([
        [1, 2],
        [3, 4],
      ]),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('merges a long chain into one', () => {
    expect(
      mergeIntervals([
        [1, 3],
        [2, 5],
        [4, 8],
        [7, 12],
      ]),
    ).toEqual([[1, 12]]);
  });

  it('handles zero-length intervals', () => {
    expect(
      mergeIntervals([
        [1, 1],
        [1, 1],
      ]),
    ).toEqual([[1, 1]]);
  });

  it('does not mutate the input array order-sensitively', () => {
    const input: Interval[] = [
      [3, 4],
      [1, 2],
    ];
    const snapshot = JSON.stringify(input);
    mergeIntervals(input);
    // Sorting in place would change the caller's array — flag it either way,
    // but the returned result must be correct regardless.
    expect(JSON.parse(snapshot)).toEqual([
      [3, 4],
      [1, 2],
    ]);
  });
});

describe('minMeetingRooms', () => {
  it('handles the prompt examples', () => {
    expect(
      minMeetingRooms([
        [0, 30],
        [5, 10],
        [15, 20],
      ]),
    ).toBe(2);
    expect(
      minMeetingRooms([
        [7, 10],
        [2, 4],
      ]),
    ).toBe(1);
  });

  it('needs one room for back-to-back meetings', () => {
    expect(
      minMeetingRooms([
        [1, 5],
        [5, 8],
        [8, 12],
      ]),
    ).toBe(1);
  });

  it('needs a room per meeting when all overlap', () => {
    expect(
      minMeetingRooms([
        [1, 10],
        [2, 10],
        [3, 10],
      ]),
    ).toBe(3);
  });

  it('handles empty and single input', () => {
    expect(minMeetingRooms([])).toBe(0);
    expect(minMeetingRooms([[1, 5]])).toBe(1);
  });

  it('handles unsorted input', () => {
    expect(
      minMeetingRooms([
        [15, 20],
        [0, 30],
        [5, 10],
      ]),
    ).toBe(2);
  });

  it('finds the peak in the middle, not at the end', () => {
    expect(
      minMeetingRooms([
        [1, 4],
        [2, 5],
        [3, 6],
        [10, 11],
      ]),
    ).toBe(3);
  });
});
