import { describe, it, expect } from 'vitest';
import { corpFlightBookings, getSkyline } from '@leetcode/20-line-sweep.ts';

describe('corpFlightBookings', () => {
  it('handles the prompt examples', () => {
    expect(
      corpFlightBookings(
        [
          [1, 2, 10],
          [2, 3, 20],
          [2, 5, 25],
        ],
        5,
      ),
    ).toEqual([10, 55, 45, 25, 25]);

    expect(
      corpFlightBookings(
        [
          [1, 2, 10],
          [2, 2, 15],
        ],
        2,
      ),
    ).toEqual([10, 25]);
  });

  it('handles no bookings', () => {
    expect(corpFlightBookings([], 3)).toEqual([0, 0, 0]);
  });

  it('handles a booking covering every flight', () => {
    expect(corpFlightBookings([[1, 4, 7]], 4)).toEqual([7, 7, 7, 7]);
  });

  it('handles a booking on the last flight only', () => {
    expect(corpFlightBookings([[3, 3, 5]], 3)).toEqual([0, 0, 5]);
  });

  it('handles a single flight', () => {
    expect(corpFlightBookings([[1, 1, 100]], 1)).toEqual([100]);
  });

  it('agrees with the naive range-loop reference', () => {
    const reference = (bookings: Array<[number, number, number]>, n: number) => {
      const out = new Array<number>(n).fill(0);
      for (const [first, last, seats] of bookings)
        for (let f = first; f <= last; f += 1) out[f - 1]! += seats;
      return out;
    };

    const bookings: Array<[number, number, number]> = [
      [1, 10, 3],
      [5, 5, 100],
      [2, 8, 7],
      [9, 20, 1],
      [1, 20, 2],
    ];
    expect(corpFlightBookings(bookings, 20)).toEqual(reference(bookings, 20));
  });

  it('stays linear on many bookings over many flights', () => {
    const n = 20_000;
    const bookings = Array.from(
      { length: 20_000 },
      () => [1, n, 1] as [number, number, number],
    );
    const started = Date.now();
    const result = corpFlightBookings(bookings, n);
    expect(result[0]).toBe(20_000);
    expect(result[n - 1]).toBe(20_000);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});

describe('getSkyline', () => {
  it('handles the prompt examples', () => {
    expect(
      getSkyline([
        [2, 9, 10],
        [3, 7, 15],
        [5, 12, 12],
        [15, 20, 10],
        [19, 24, 8],
      ]),
    ).toEqual([
      [2, 10],
      [3, 15],
      [7, 12],
      [12, 0],
      [15, 10],
      [20, 8],
      [24, 0],
    ]);

    expect(
      getSkyline([
        [0, 2, 3],
        [2, 5, 3],
      ]),
    ).toEqual([
      [0, 3],
      [5, 0],
    ]);
  });

  it('handles no buildings and one building', () => {
    expect(getSkyline([])).toEqual([]);
    expect(getSkyline([[1, 5, 4]])).toEqual([
      [1, 4],
      [5, 0],
    ]);
  });

  it('hides a building completely contained under a taller one', () => {
    expect(
      getSkyline([
        [0, 10, 10],
        [2, 5, 3],
      ]),
    ).toEqual([
      [0, 10],
      [10, 0],
    ]);
  });

  it('handles identical buildings', () => {
    expect(
      getSkyline([
        [1, 4, 5],
        [1, 4, 5],
      ]),
    ).toEqual([
      [1, 5],
      [4, 0],
    ]);
  });

  it('handles disjoint buildings', () => {
    expect(
      getSkyline([
        [1, 2, 3],
        [5, 6, 4],
      ]),
    ).toEqual([
      [1, 3],
      [2, 0],
      [5, 4],
      [6, 0],
    ]);
  });

  it('handles a staircase of nested buildings', () => {
    expect(
      getSkyline([
        [1, 10, 1],
        [2, 9, 2],
        [3, 8, 3],
      ]),
    ).toEqual([
      [1, 1],
      [2, 2],
      [3, 3],
      [8, 2],
      [9, 1],
      [10, 0],
    ]);
  });

  it('never emits two consecutive points with the same height', () => {
    const skyline = getSkyline([
      [1, 5, 4],
      [3, 8, 4],
      [8, 12, 4],
      [13, 14, 2],
    ]);
    for (let i = 1; i < skyline.length; i += 1) {
      expect(skyline[i]![1]).not.toBe(skyline[i - 1]![1]);
    }
    expect(skyline[skyline.length - 1]![1]).toBe(0);
  });

  it('agrees with a brute-force height scan', () => {
    const buildings: Array<[number, number, number]> = [
      [2, 9, 10],
      [3, 7, 15],
      [5, 12, 12],
      [15, 20, 10],
      [19, 24, 8],
      [1, 3, 4],
    ];

    // Reconstruct the height profile from the key points and compare it, at
    // every integer x, with the maximum over the buildings covering that x.
    const skyline = getSkyline(buildings);
    const heightAt = (x: number) => {
      let height = 0;
      for (const [px, ph] of skyline) {
        if (px <= x) height = ph;
        else break;
      }
      return height;
    };

    for (let x = 0; x <= 30; x += 1) {
      const expected = buildings.reduce(
        (best, [l, r, h]) => (x >= l && x < r ? Math.max(best, h) : best),
        0,
      );
      expect(heightAt(x)).toBe(expected);
    }
  });
});
