import { describe, it, expect } from 'vitest';
import { bowlingScore } from '@tskata/00-bowling.ts';

const times = (n: number, pins: number): number[] => Array.from({ length: n }, () => pins);

describe('kata 00 — bowlingScore', () => {
  describe('open frames', () => {
    it('scores a gutter game as 0', () => {
      expect(bowlingScore(times(20, 0))).toBe(0);
    });

    it('scores all ones as 20', () => {
      expect(bowlingScore(times(20, 1))).toBe(20);
    });
  });

  describe('bonuses', () => {
    it('adds the next roll to a spare', () => {
      expect(bowlingScore([5, 5, 3, ...times(17, 0)])).toBe(16);
    });

    it('adds the next two rolls to a strike', () => {
      expect(bowlingScore([10, 3, 4, ...times(16, 0)])).toBe(24);
    });

    it('handles consecutive strikes', () => {
      expect(bowlingScore([10, 10, 10, ...times(14, 0)])).toBe(60);
    });

    it('treats 0 then 10 as a spare, not a strike', () => {
      expect(bowlingScore([0, 10, 5, 0, ...times(16, 0)])).toBe(20);
    });
  });

  describe('the 10th frame', () => {
    it('gives one fill ball after a spare', () => {
      expect(bowlingScore([...times(18, 0), 7, 3, 5])).toBe(15);
    });

    it('gives two fill balls after a strike', () => {
      expect(bowlingScore([...times(18, 0), 10, 10, 10])).toBe(30);
      expect(bowlingScore([...times(18, 0), 10, 4, 5])).toBe(19);
    });

    it('does not count fill balls as extra frames', () => {
      expect(bowlingScore([...times(18, 0), 10, 10, 10])).not.toBe(60);
    });
  });

  describe('whole games', () => {
    it('scores a perfect game as 300', () => {
      expect(bowlingScore(times(12, 10))).toBe(300);
    });

    it('scores all spares of 5 as 150', () => {
      expect(bowlingScore(times(21, 5))).toBe(150);
    });

    it('scores a realistic game', () => {
      expect(bowlingScore([10, 7, 3, 9, 0, 10, 0, 8, 8, 2, 0, 6, 10, 10, 10, 8, 1])).toBe(167);
    });
  });

  describe('invalid input', () => {
    it('rejects rolls outside 0–10', () => {
      expect(() => bowlingScore([11, ...times(18, 0)])).toThrow(RangeError);
      expect(() => bowlingScore([-1, ...times(19, 0)])).toThrow(RangeError);
      expect(() => bowlingScore([1.5, ...times(19, 0)])).toThrow(RangeError);
    });

    it('rejects a frame with more than 10 pins', () => {
      expect(() => bowlingScore([6, 6, ...times(18, 0)])).toThrow(RangeError);
    });

    it('rejects an incomplete game', () => {
      expect(() => bowlingScore([])).toThrow(RangeError);
      expect(() => bowlingScore(times(19, 0))).toThrow(RangeError);
      expect(() => bowlingScore([...times(18, 0), 10, 10])).toThrow(RangeError);
    });

    it('rejects rolls after the game is over', () => {
      expect(() => bowlingScore(times(21, 0))).toThrow(RangeError);
      expect(() => bowlingScore(times(13, 10))).toThrow(RangeError);
    });

    it('applies pin rules to the 10th-frame fill balls', () => {
      expect(() => bowlingScore([...times(18, 0), 10, 5, 6])).toThrow(RangeError);
    });
  });
});
