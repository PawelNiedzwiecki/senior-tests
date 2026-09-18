import { describe, it, expect } from 'vitest';
import {
  mergeIntervals,
  minMeetingRooms,
  findMinArrowShots,
  intervalIntersection,
  carPooling,
  type Interval,
} from '@tier1/06-intervals.ts';

const iv = (...pairs: Array<[number, number]>): Interval[] => pairs;

describe('exam 1 — mergeIntervals', () => {
  it('handles the prompt examples', () => {
    expect(mergeIntervals(iv([1, 3], [2, 6], [8, 10], [15, 18]))).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
    expect(mergeIntervals(iv([1, 4], [4, 5]))).toEqual([[1, 5]]);
  });

  it('sorts unsorted input before merging', () => {
    expect(mergeIntervals(iv([8, 10], [1, 3], [15, 18], [2, 6]))).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  it('absorbs a fully contained interval without shrinking the span', () => {
    expect(mergeIntervals(iv([1, 10], [2, 3], [4, 5]))).toEqual([[1, 10]]);
  });

  it('leaves disjoint intervals alone', () => {
    expect(mergeIntervals(iv([1, 2], [3, 4]))).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('handles empty and single inputs', () => {
    expect(mergeIntervals([])).toEqual([]);
    expect(mergeIntervals(iv([5, 7]))).toEqual([[5, 7]]);
  });

  it('leaves the caller’s array untouched — sort a copy, emit copies', () => {
    const input = iv([3, 5], [1, 2]);
    const out = mergeIntervals(input);
    expect(out).toEqual([
      [1, 2],
      [3, 5],
    ]);
    expect(input).toEqual([
      [3, 5],
      [1, 2],
    ]);
    expect(out[0]).not.toBe(input[1]);
  });
});

describe('exam 2 — minMeetingRooms', () => {
  it('handles the prompt examples', () => {
    expect(minMeetingRooms(iv([0, 30], [5, 10], [15, 20]))).toBe(2);
    expect(minMeetingRooms(iv([7, 10], [2, 4]))).toBe(1);
    expect(minMeetingRooms([])).toBe(0);
  });

  it('lets a meeting start exactly when another ends', () => {
    expect(minMeetingRooms(iv([1, 5], [5, 9], [9, 12]))).toBe(1);
  });

  it('counts a full pile-up', () => {
    expect(minMeetingRooms(iv([1, 10], [2, 9], [3, 8], [4, 7]))).toBe(4);
  });

  it('handles identical meetings and a single meeting', () => {
    expect(minMeetingRooms(iv([2, 4], [2, 4], [2, 4]))).toBe(3);
    expect(minMeetingRooms(iv([0, 1]))).toBe(1);
  });

  it('agrees with a naive per-instant count', () => {
    const meetings = iv([0, 5], [1, 3], [2, 8], [6, 9], [8, 12], [11, 13], [3, 4]);
    let expected = 0;
    for (let t = 0; t <= 13; t += 1) {
      const active = meetings.filter(([s, e]) => s <= t && t < e).length;
      expected = Math.max(expected, active);
    }
    expect(minMeetingRooms(meetings)).toBe(expected);
  });
});

describe('exam 3 — findMinArrowShots', () => {
  it('handles the prompt examples', () => {
    expect(findMinArrowShots(iv([10, 16], [2, 8], [1, 6], [7, 12]))).toBe(2);
    expect(findMinArrowShots(iv([1, 2], [3, 4], [5, 6], [7, 8]))).toBe(4);
    expect(findMinArrowShots(iv([1, 2], [2, 3], [3, 4], [4, 5]))).toBe(2);
  });

  it('bursts nested balloons with one arrow', () => {
    expect(findMinArrowShots(iv([1, 100], [2, 30], [3, 25]))).toBe(1);
  });

  it('still needs two arrows when a wide balloon spans two disjoint ones', () => {
    expect(findMinArrowShots(iv([1, 100], [2, 3], [50, 60]))).toBe(2);
  });

  it('handles empty input and a single balloon', () => {
    expect(findMinArrowShots([])).toBe(0);
    expect(findMinArrowShots(iv([-5, 5]))).toBe(1);
  });

  it('handles negative coordinates and touching endpoints', () => {
    expect(findMinArrowShots(iv([-2, -1], [-1, 0], [0, 1]))).toBe(2);
  });
});

describe('exam 4 — intervalIntersection', () => {
  it('handles the prompt examples', () => {
    expect(intervalIntersection(iv([0, 2], [5, 10]), iv([1, 5], [8, 12]))).toEqual([
      [1, 2],
      [5, 5],
      [8, 10],
    ]);
    expect(intervalIntersection(iv([1, 3]), [])).toEqual([]);
  });

  it('returns single-point intersections where intervals touch', () => {
    expect(intervalIntersection(iv([1, 3]), iv([3, 5]))).toEqual([[3, 3]]);
  });

  it('returns nothing when the lists are disjoint', () => {
    expect(intervalIntersection(iv([1, 2], [5, 6]), iv([3, 4], [7, 8]))).toEqual([]);
  });

  it('handles one interval covering many', () => {
    expect(intervalIntersection(iv([0, 100]), iv([1, 2], [10, 20], [50, 60]))).toEqual([
      [1, 2],
      [10, 20],
      [50, 60],
    ]);
  });

  it('agrees with a quadratic reference', () => {
    const a = iv([1, 5], [8, 12], [15, 24], [25, 26]);
    const b = iv([2, 3], [5, 10], [11, 16], [20, 27]);
    const expected: Interval[] = [];
    for (const [as, ae] of a)
      for (const [bs, be] of b) {
        const start = Math.max(as, bs);
        const end = Math.min(ae, be);
        if (start <= end) expected.push([start, end]);
      }
    expected.sort((p, q) => p[0] - q[0]);
    expect(intervalIntersection(a, b)).toEqual(expected);
  });
});

describe('exam 5 — carPooling', () => {
  const trips = (...xs: Array<[number, number, number]>) => xs;

  it('handles the prompt examples', () => {
    expect(carPooling(trips([2, 1, 5], [3, 3, 7]), 4)).toBe(false);
    expect(carPooling(trips([2, 1, 5], [3, 3, 7]), 5)).toBe(true);
    expect(carPooling(trips([2, 1, 5], [3, 5, 7]), 3)).toBe(true);
  });

  it('drops off before picking up at the same location', () => {
    expect(carPooling(trips([3, 2, 7], [3, 7, 9]), 3)).toBe(true);
  });

  it('rejects a single trip that exceeds capacity', () => {
    expect(carPooling(trips([9, 0, 1]), 8)).toBe(false);
    expect(carPooling(trips([9, 0, 1]), 9)).toBe(true);
  });

  it('handles no trips and unordered input', () => {
    expect(carPooling([], 1)).toBe(true);
    expect(carPooling(trips([4, 5, 6], [2, 1, 3], [1, 2, 4]), 4)).toBe(true);
  });

  it('agrees with a naive per-location count', () => {
    const xs = trips([2, 1, 5], [3, 3, 7], [4, 6, 9], [1, 0, 10], [5, 8, 9]);
    let peak = 0;
    for (let at = 0; at <= 10; at += 1) {
      const aboard = xs
        .filter(([, from, to]) => from <= at && at < to)
        .reduce((sum, [n]) => sum + n, 0);
      peak = Math.max(peak, aboard);
    }
    expect(carPooling(xs, peak)).toBe(true);
    expect(carPooling(xs, peak - 1)).toBe(false);
  });
});
