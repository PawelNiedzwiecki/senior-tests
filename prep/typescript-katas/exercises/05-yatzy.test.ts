import { describe, it, expect } from 'vitest';
import { score, type Category, type Dice } from '@tskata/05-yatzy.ts';

const d = (...dice: number[]) => dice as unknown as Dice;

const cases: Array<[Category, Dice, number]> = [
  ['ones', d(1, 1, 2, 4, 4), 2],
  ['ones', d(2, 3, 4, 5, 6), 0],
  ['threes', d(3, 3, 3, 4, 5), 9],
  ['sixes', d(6, 6, 6, 6, 1), 24],
  ['chance', d(1, 1, 3, 3, 6), 14],
  ['yatzy', d(4, 4, 4, 4, 4), 50],
  ['yatzy', d(4, 4, 4, 4, 5), 0],
  ['pair', d(3, 3, 3, 4, 4), 8],
  ['pair', d(1, 1, 6, 2, 6), 12],
  ['pair', d(1, 2, 3, 4, 5), 0],
  ['pair', d(4, 4, 4, 4, 4), 8],
  ['twoPairs', d(1, 1, 2, 3, 3), 8],
  ['twoPairs', d(1, 1, 2, 3, 4), 0],
  ['twoPairs', d(1, 1, 2, 2, 2), 6],
  ['twoPairs', d(3, 3, 3, 3, 1), 0],
  ['twoPairs', d(5, 5, 5, 5, 5), 0],
  ['threeOfAKind', d(3, 3, 3, 4, 5), 9],
  ['threeOfAKind', d(3, 3, 4, 5, 6), 0],
  ['threeOfAKind', d(3, 3, 3, 3, 1), 9],
  ['fourOfAKind', d(2, 2, 2, 2, 5), 8],
  ['fourOfAKind', d(2, 2, 2, 5, 5), 0],
  ['fourOfAKind', d(6, 6, 6, 6, 6), 24],
  ['smallStraight', d(1, 2, 3, 4, 5), 15],
  ['smallStraight', d(2, 3, 4, 5, 1), 15],
  ['smallStraight', d(1, 2, 2, 4, 5), 0],
  ['largeStraight', d(6, 2, 3, 4, 5), 20],
  ['largeStraight', d(1, 2, 3, 4, 5), 0],
  ['fullHouse', d(1, 1, 2, 2, 2), 8],
  ['fullHouse', d(6, 6, 6, 5, 5), 28],
  ['fullHouse', d(2, 2, 3, 3, 4), 0],
  ['fullHouse', d(4, 4, 4, 4, 4), 0],
];

describe('kata 05 — Yatzy', () => {
  it.each(cases)('%s of %j → %i', (category, dice, expected) => {
    expect(score(dice, category)).toBe(expected);
  });

  it('rejects invalid dice', () => {
    expect(() => score(d(0, 1, 2, 3, 4), 'chance')).toThrow(RangeError);
    expect(() => score(d(1, 2, 3, 4, 7), 'chance')).toThrow(RangeError);
    expect(() => score(d(1, 2, 3, 4), 'chance')).toThrow(RangeError);
    expect(() => score(d(1, 2, 3, 4, 2.5), 'chance')).toThrow(RangeError);
  });
});
