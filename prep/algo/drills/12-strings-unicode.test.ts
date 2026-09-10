import { describe, it, expect } from 'vitest';
import {
  reverseString,
  wordFrequencies,
  longestCommonPrefix,
} from '@algo/12-strings-unicode.ts';

describe('reverseString', () => {
  it('reverses plain ASCII', () => {
    expect(reverseString('hello')).toBe('olleh');
  });

  it('handles empty and single-character input', () => {
    expect(reverseString('')).toBe('');
    expect(reverseString('a')).toBe('a');
  });

  it('does not break surrogate pairs', () => {
    // `.split('').reverse().join('')` produces mojibake here.
    expect(reverseString('a👍b')).toBe('b👍a');
  });

  it('keeps a multi-codepoint emoji intact', () => {
    // A ZWJ family sequence is 5 code points but one grapheme.
    expect(reverseString('x👨‍👩‍👧y')).toBe('y👨‍👩‍👧x');
  });

  it('keeps combining marks attached to their base character', () => {
    const decomposed = 'café'; // 'café' with a combining acute
    const reversed = reverseString(decomposed);
    // The accent must still follow its 'e', not float onto the 'f'.
    expect(reversed.normalize('NFC')).toBe('éfac'.normalize('NFC'));
  });

  it('handles non-Latin scripts', () => {
    expect(reverseString('日本語')).toBe('語本日');
  });
});

describe('wordFrequencies', () => {
  it('counts case-insensitively', () => {
    expect(wordFrequencies('the cat the dog THE bird', 2)).toEqual([
      ['the', 3],
      ['bird', 1],
    ]);
  });

  it('breaks ties alphabetically', () => {
    expect(wordFrequencies('b a c', 3)).toEqual([
      ['a', 1],
      ['b', 1],
      ['c', 1],
    ]);
  });

  it('ignores punctuation but keeps apostrophes', () => {
    expect(wordFrequencies("don't, don't! stop.", 2)).toEqual([
      ["don't", 2],
      ['stop', 1],
    ]);
  });

  it('handles accented and non-Latin words', () => {
    expect(wordFrequencies('café Café straße', 2)).toEqual([
      ['café', 2],
      ['straße', 1],
    ]);
  });

  it('handles empty input and no matches', () => {
    expect(wordFrequencies('', 5)).toEqual([]);
    expect(wordFrequencies('!!! ... ???', 5)).toEqual([]);
  });

  it('respects the limit', () => {
    expect(wordFrequencies('a a b b c', 1)).toEqual([['a', 2]]);
    expect(wordFrequencies('a b c', 0)).toEqual([]);
  });

  it('returns everything when the limit exceeds the vocabulary', () => {
    expect(wordFrequencies('a b', 10)).toHaveLength(2);
  });

  it('counts digits as word characters', () => {
    expect(wordFrequencies('room 101 room', 1)).toEqual([['room', 2]]);
  });
});

describe('longestCommonPrefix', () => {
  it('handles the prompt examples', () => {
    expect(longestCommonPrefix(['flower', 'flow', 'flight'])).toBe('fl');
    expect(longestCommonPrefix(['dog', 'racecar'])).toBe('');
    expect(longestCommonPrefix(['single'])).toBe('single');
  });

  it('handles an empty list', () => {
    expect(longestCommonPrefix([])).toBe('');
  });

  it('handles an empty string among the words', () => {
    expect(longestCommonPrefix(['abc', ''])).toBe('');
  });

  it('handles identical words', () => {
    expect(longestCommonPrefix(['same', 'same'])).toBe('same');
  });

  it('stops at the shortest word', () => {
    expect(longestCommonPrefix(['abcdef', 'abc'])).toBe('abc');
  });

  it('is case-sensitive', () => {
    expect(longestCommonPrefix(['Abc', 'abc'])).toBe('');
  });
});
