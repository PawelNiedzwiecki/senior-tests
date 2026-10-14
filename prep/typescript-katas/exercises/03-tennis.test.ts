import { describe, it, expect } from 'vitest';
import { TennisGame } from '@tskata/03-tennis.ts';

/** Play a sequence like "AABAB" where A = alice, B = bob. */
function play(sequence: string): TennisGame {
  const game = new TennisGame('alice', 'bob');
  for (const c of sequence) game.wonPoint(c === 'A' ? 'alice' : 'bob');
  return game;
}

describe('kata 03 — TennisGame', () => {
  it.each([
    ['', 'Love-All'],
    ['A', 'Fifteen-Love'],
    ['B', 'Love-Fifteen'],
    ['AB', 'Fifteen-All'],
    ['AABB', 'Thirty-All'],
    ['AAA', 'Forty-Love'],
    ['ABBB', 'Fifteen-Forty'],
    ['AABBB', 'Thirty-Forty'],
  ])('plain scores: "%s" → %s', (seq, expected) => {
    expect(play(seq).getScore()).toBe(expected);
  });

  it('calls 3–3 Deuce, not Forty-All', () => {
    expect(play('AAABBB').getScore()).toBe('Deuce');
  });

  it('handles advantage and back to deuce', () => {
    expect(play('AAABBBA').getScore()).toBe('Advantage alice');
    expect(play('AAABBBB').getScore()).toBe('Advantage bob');
    expect(play('AAABBBAB').getScore()).toBe('Deuce');
    expect(play('AAABBBABABAB').getScore()).toBe('Deuce');
  });

  it('declares a win from 40 or from advantage', () => {
    expect(play('AAAA').getScore()).toBe('Win for alice');
    expect(play('BBBAB').getScore()).toBe('Win for bob');
    expect(play('AAABBBAA').getScore()).toBe('Win for alice');
    expect(play('AAABBBABBB').getScore()).toBe('Win for bob');
  });

  it('rejects points after the game is won', () => {
    const game = play('AAAA');
    expect(() => game.wonPoint('bob')).toThrow();
  });

  it('rejects unknown players and duplicate names', () => {
    expect(() => play('').wonPoint('carol')).toThrow();
    expect(() => new TennisGame('alice', 'alice')).toThrow();
  });
});
