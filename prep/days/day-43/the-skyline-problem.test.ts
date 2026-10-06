import { describe, it, expect } from 'vitest';
import { getSkyline } from './the-skyline-problem.ts';



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
