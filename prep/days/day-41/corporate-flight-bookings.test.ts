import { describe, it, expect } from 'vitest';
import { corpFlightBookings } from './corporate-flight-bookings.ts';

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