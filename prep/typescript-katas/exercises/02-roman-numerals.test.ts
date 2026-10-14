import { describe, it, expect } from 'vitest';
import { toRoman, fromRoman } from '@tskata/02-roman-numerals.ts';

const cases: Array<[number, string]> = [
  [1, 'I'],
  [3, 'III'],
  [4, 'IV'],
  [9, 'IX'],
  [14, 'XIV'],
  [40, 'XL'],
  [58, 'LVIII'],
  [90, 'XC'],
  [400, 'CD'],
  [900, 'CM'],
  [1994, 'MCMXCIV'],
  [2024, 'MMXXIV'],
  [3999, 'MMMCMXCIX'],
];

describe('kata 02 — toRoman', () => {
  it.each(cases)('%i → %s', (n, roman) => {
    expect(toRoman(n)).toBe(roman);
  });

  it('rejects numbers outside 1..3999', () => {
    expect(() => toRoman(0)).toThrow(RangeError);
    expect(() => toRoman(4000)).toThrow(RangeError);
    expect(() => toRoman(-5)).toThrow(RangeError);
    expect(() => toRoman(2.5)).toThrow(RangeError);
  });
});

describe('kata 02 — fromRoman', () => {
  it.each(cases)('%i ← %s', (n, roman) => {
    expect(fromRoman(roman)).toBe(n);
  });

  it.each(['', 'IIII', 'VV', 'IC', 'IL', 'XM', 'VX', 'MMMM', 'iv', 'ABC', 'IIV', 'XCX'])(
    'rejects non-canonical "%s"',
    (bad) => {
      expect(() => fromRoman(bad)).toThrow();
    },
  );

  it('round-trips every value', () => {
    for (let n = 1; n <= 3999; n++) {
      expect(fromRoman(toRoman(n))).toBe(n);
    }
  });
});
