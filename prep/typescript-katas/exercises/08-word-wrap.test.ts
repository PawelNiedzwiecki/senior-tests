import { describe, it, expect } from 'vitest';
import { wrap } from '@tskata/08-word-wrap.ts';

describe('kata 08 — word wrap', () => {
  it('returns empty for empty or whitespace-only text', () => {
    expect(wrap('', 5)).toBe('');
    expect(wrap('   \n\t ', 5)).toBe('');
  });

  it('leaves short text alone', () => {
    expect(wrap('word', 10)).toBe('word');
    expect(wrap('word', 4)).toBe('word');
  });

  it('breaks between words greedily', () => {
    expect(wrap('the quick brown fox', 10)).toBe('the quick\nbrown fox');
    expect(wrap('a b c d e', 3)).toBe('a b\nc d\ne');
  });

  it('fits a word that lands exactly on the width', () => {
    expect(wrap('abc def', 7)).toBe('abc def');
    expect(wrap('abc def', 6)).toBe('abc\ndef');
  });

  it('collapses whitespace runs', () => {
    expect(wrap('  the   quick\n\nbrown\tfox  ', 10)).toBe('the quick\nbrown fox');
  });

  it('hard-splits words longer than the width', () => {
    expect(wrap('abcdefghij', 4)).toBe('abcd\nefgh\nij');
    expect(wrap('ab abcdefgh x', 4)).toBe('ab\nabcd\nefgh\nx');
    expect(wrap('abcdef g', 4)).toBe('abcd\nef g');
  });

  it('never produces a line longer than the width', () => {
    const text = 'Lorem ipsum dolor sit amet consectetur adipiscing elit supercalifragilistic';
    for (let width = 1; width <= 20; width++) {
      for (const line of wrap(text, width).split('\n')) {
        expect(line.length).toBeLessThanOrEqual(width);
      }
    }
  });

  it('rejects invalid widths', () => {
    expect(() => wrap('abc', 0)).toThrow(RangeError);
    expect(() => wrap('abc', 2.5)).toThrow(RangeError);
  });
});
