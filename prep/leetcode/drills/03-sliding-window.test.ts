import { describe, it, expect } from 'vitest';
import { minWindow, characterReplacement } from '@leetcode/03-sliding-window.ts';

/** Any window of minimum length is acceptable, so verify the property instead. */
const containsAll = (window: string, t: string) => {
  const counts = new Map<string, number>();
  for (const c of window) counts.set(c, (counts.get(c) ?? 0) + 1);
  for (const c of t) {
    const left = counts.get(c) ?? 0;
    if (left === 0) return false;
    counts.set(c, left - 1);
  }
  return true;
};

const bruteMinWindowLength = (s: string, t: string) => {
  let best = Infinity;
  for (let i = 0; i < s.length; i += 1)
    for (let j = i; j < s.length; j += 1)
      if (containsAll(s.slice(i, j + 1), t)) {
        best = Math.min(best, j - i + 1);
        break;
      }
  return best;
};

describe('minWindow', () => {
  it('handles the prompt examples', () => {
    expect(minWindow('ADOBECODEBANC', 'ABC')).toBe('BANC');
    expect(minWindow('a', 'a')).toBe('a');
  });

  it('returns empty when t cannot be covered', () => {
    expect(minWindow('a', 'aa')).toBe('');
    expect(minWindow('abc', 'd')).toBe('');
    expect(minWindow('', 'a')).toBe('');
  });

  it('returns empty for an empty t', () => {
    expect(minWindow('abc', '')).toBe('');
  });

  it('respects duplicate requirements', () => {
    expect(minWindow('aabbc', 'aab')).toBe('aab');
    expect(minWindow('bba', 'ab')).toBe('ba');
  });

  it('handles the whole string being the answer', () => {
    expect(minWindow('abc', 'cba')).toBe('abc');
  });

  it('agrees with brute force on minimum length, for any valid window', () => {
    const cases: Array<[string, string]> = [
      ['ADOBECODEBANC', 'ABC'],
      ['cabwefgewcwaefgcf', 'cae'],
      ['aaaaaaaaab', 'ab'],
      ['abcdefghij', 'jih'],
    ];
    for (const [s, t] of cases) {
      const window = minWindow(s, t);
      expect(containsAll(window, t)).toBe(true);
      expect(window.length).toBe(bruteMinWindowLength(s, t));
      expect(s.includes(window)).toBe(true);
    }
  });
});

describe('characterReplacement', () => {
  it('handles the prompt examples', () => {
    expect(characterReplacement('ABAB', 2)).toBe(4);
    expect(characterReplacement('AABABBA', 1)).toBe(4);
  });

  it('handles k = 0 (longest existing run)', () => {
    expect(characterReplacement('AAAA', 0)).toBe(4);
    expect(characterReplacement('ABAB', 0)).toBe(1);
    expect(characterReplacement('AABBBCC', 0)).toBe(3);
  });

  it('handles an empty string', () => {
    expect(characterReplacement('', 3)).toBe(0);
  });

  it('caps at the string length when k is large', () => {
    expect(characterReplacement('ABCDE', 100)).toBe(5);
  });

  it('agrees with a brute-force check', () => {
    const brute = (s: string, k: number) => {
      let best = 0;
      for (let i = 0; i < s.length; i += 1) {
        for (let j = i; j < s.length; j += 1) {
          const window = s.slice(i, j + 1);
          const counts = new Map<string, number>();
          for (const c of window) counts.set(c, (counts.get(c) ?? 0) + 1);
          const max = Math.max(...counts.values());
          if (window.length - max <= k) best = Math.max(best, window.length);
        }
      }
      return best;
    };

    for (const s of ['AABABBA', 'ABBBCCCCDD', 'XYZZYX', 'AAABBBCCC']) {
      for (let k = 0; k <= 4; k += 1) {
        expect(characterReplacement(s, k)).toBe(brute(s, k));
      }
    }
  });
});
