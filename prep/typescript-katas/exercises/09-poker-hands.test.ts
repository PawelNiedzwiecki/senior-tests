import { describe, it, expect } from 'vitest';
import { rankHand, compareHands, type HandCategory } from '@tskata/09-poker-hands.ts';

describe('kata 09 — rankHand', () => {
  it.each<[string, HandCategory]>([
    ['2H 3D 5S 9C KD', 'highCard'],
    ['2H 2D 5S 9C KD', 'pair'],
    ['2H 2D 5S 5C KD', 'twoPair'],
    ['2H 2D 2S 9C KD', 'threeOfAKind'],
    ['5H 6D 7S 8C 9D', 'straight'],
    ['TH JD QS KC AD', 'straight'],
    ['AH 2D 3S 4C 5D', 'straight'],
    ['2H 7H 9H JH KH', 'flush'],
    ['2H 2D 2S KC KD', 'fullHouse'],
    ['2H 2D 2S 2C KD', 'fourOfAKind'],
    ['5S 6S 7S 8S 9S', 'straightFlush'],
    ['AS 2S 3S 4S 5S', 'straightFlush'],
  ])('%s → %s', (hand, category) => {
    expect(rankHand(hand)).toBe(category);
  });

  it('does not wrap straights around the ace', () => {
    expect(rankHand('QH KD AS 2C 3D')).toBe('highCard');
  });

  it('rejects invalid hands', () => {
    expect(() => rankHand('2H 3D 5S 9C')).toThrow();
    expect(() => rankHand('2H 3D 5S 9C KD QS')).toThrow();
    expect(() => rankHand('1H 3D 5S 9C KD')).toThrow();
    expect(() => rankHand('2X 3D 5S 9C KD')).toThrow();
    expect(() => rankHand('2H 2H 5S 9C KD')).toThrow();
  });
});

describe('kata 09 — compareHands', () => {
  it('higher category wins', () => {
    expect(compareHands('2H 2D 5S 9C KD', '2C 3H 4S 8C AH')).toBe('first');
    expect(compareHands('2H 3H 4H 5H 7H', '2C 3D 4S 5C 6H')).toBe('first');
    expect(compareHands('2C 3D 4S 5C 6H', '2H 2D 2S KC KD')).toBe('second');
  });

  it('breaks high-card ties card by card', () => {
    expect(compareHands('2H 3D 5S 9C KD', '2C 3H 4S 8C KH')).toBe('first');
    expect(compareHands('2H 3D 5S 9C KD', '2D 3H 5C 9S KH')).toBe('tie');
  });

  it('compares the pair before the kickers', () => {
    expect(compareHands('2H 2D 9S KC AD', '3H 3D 4S 5C 6D')).toBe('second');
    expect(compareHands('5H 5D 9S KC AD', '5C 5S 9H KD QD')).toBe('first');
  });

  it('compares two pair: high pair, low pair, kicker', () => {
    expect(compareHands('KH KD 2S 2C 3D', 'QH QD JS JC AD')).toBe('first');
    expect(compareHands('KH KD 3S 3C 2D', 'KS KC 2H 2C AD')).toBe('first');
    expect(compareHands('KH KD 3S 3C 4D', 'KS KC 3H 3D 2D')).toBe('first');
  });

  it('compares a full house by the three first', () => {
    expect(compareHands('KH KD KS 2C 2D', 'QH QD QS AC AD')).toBe('first');
  });

  it('treats the wheel as the lowest straight', () => {
    expect(compareHands('AH 2D 3S 4C 5D', '2H 3D 4S 5C 6D')).toBe('second');
    expect(compareHands('TH JD QS KC AD', '9H TD JS QC KD')).toBe('first');
    expect(compareHands('AS 2S 3S 4S 5S', '2D 3D 4D 5D 6D')).toBe('second');
  });

  it('never uses suits to break ties', () => {
    expect(compareHands('2H 4H 6H 8H TH', '2S 4S 6S 8S TS')).toBe('tie');
  });
});
