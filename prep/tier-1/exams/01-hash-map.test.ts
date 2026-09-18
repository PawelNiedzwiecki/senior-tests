import { describe, it, expect } from 'vitest';
import {
  twoSum,
  groupAnagrams,
  isIsomorphic,
  topKFrequent,
  isValidSudoku,
} from '@tier1/01-hash-map.ts';

describe('exam 1 — twoSum', () => {
  it('finds the pair in the prompt examples', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  it('pairs two equal values without reusing one index', () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
    expect(twoSum([0, 4, 3, 0], 0)).toEqual([0, 3]);
  });

  it('never pairs an element with itself', () => {
    expect(twoSum([5, 1, 2], 10)).toBeNull();
  });

  it('handles negatives and returns null when no pair exists', () => {
    expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2]);
    expect(twoSum([1, 2], 7)).toBeNull();
    expect(twoSum([], 0)).toBeNull();
  });
});

describe('exam 2 — groupAnagrams', () => {
  /** Order is unspecified in both dimensions, so compare canonical shapes. */
  const normalise = (groups: string[][]) =>
    groups.map((g) => [...g].sort()).sort((a, b) => (a[0] ?? '').localeCompare(b[0] ?? ''));

  it('groups the prompt example', () => {
    expect(normalise(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))).toEqual([
      ['ate', 'eat', 'tea'],
      ['bat'],
      ['nat', 'tan'],
    ]);
  });

  it('handles the empty string and single words', () => {
    expect(groupAnagrams([''])).toEqual([['']]);
    expect(groupAnagrams(['a'])).toEqual([['a']]);
    expect(groupAnagrams([])).toEqual([]);
  });

  it('keeps duplicates together rather than deduplicating', () => {
    expect(normalise(groupAnagrams(['ab', 'ba', 'ab']))).toEqual([['ab', 'ab', 'ba']]);
  });

  it('does not group words of different lengths', () => {
    expect(normalise(groupAnagrams(['a', 'aa', 'aaa']))).toEqual([['a'], ['aa'], ['aaa']]);
  });
});

describe('exam 3 — isIsomorphic', () => {
  it('accepts a consistent mapping', () => {
    expect(isIsomorphic('egg', 'add')).toBe(true);
    expect(isIsomorphic('paper', 'title')).toBe(true);
    expect(isIsomorphic('', '')).toBe(true);
  });

  it('rejects one character mapping to two', () => {
    expect(isIsomorphic('foo', 'bar')).toBe(false);
  });

  it('rejects two characters mapping to one — the single-map trap', () => {
    expect(isIsomorphic('badc', 'baba')).toBe(false);
    expect(isIsomorphic('ab', 'aa')).toBe(false);
  });

  it('rejects differing lengths', () => {
    expect(isIsomorphic('ab', 'abc')).toBe(false);
  });

  it('handles a self-mapping and non-letter characters', () => {
    expect(isIsomorphic('abc', 'abc')).toBe(true);
    expect(isIsomorphic('13:45', '24:56')).toBe(true);
  });
});

describe('exam 4 — topKFrequent', () => {
  const sorted = (xs: number[]) => [...xs].sort((a, b) => a - b);

  it('returns the k most frequent values', () => {
    expect(sorted(topKFrequent([1, 1, 1, 2, 2, 3], 2))).toEqual([1, 2]);
    expect(topKFrequent([1], 1)).toEqual([1]);
    expect(sorted(topKFrequent([4, 4, 5, 5, 6], 2))).toEqual([4, 5]);
  });

  it('returns exactly k values, without duplicates', () => {
    const out = topKFrequent([1, 1, 2, 2, 3, 3, 4], 3);
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
    expect(out).not.toContain(4);
  });

  it('handles k equal to the number of distinct values', () => {
    expect(sorted(topKFrequent([5, 6, 7], 3))).toEqual([5, 6, 7]);
  });

  it('handles negatives and a single dominant value', () => {
    expect(topKFrequent([-1, -1, -1, 2, 3], 1)).toEqual([-1]);
  });
});

describe('exam 5 — isValidSudoku', () => {
  const rows = (board: string[]) => board.map((row) => [...row]);

  const valid = rows([
    '53..7....',
    '6..195...',
    '.98....6.',
    '8...6...3',
    '4..8.3..1',
    '7...2...6',
    '.6....28.',
    '...419..5',
    '....8..79',
  ]);

  it('accepts a consistent board', () => {
    expect(isValidSudoku(valid)).toBe(true);
  });

  it('accepts a completely empty board', () => {
    expect(isValidSudoku(rows(Array.from({ length: 9 }, () => '.........')))).toBe(true);
  });

  it('rejects a repeat within a row', () => {
    const board = rows(valid.map((r) => r.join('')));
    board[0]![8] = '5';
    expect(isValidSudoku(board)).toBe(false);
  });

  it('rejects a repeat within a column', () => {
    const board = rows(valid.map((r) => r.join('')));
    board[8]![0] = '5';
    expect(isValidSudoku(board)).toBe(false);
  });

  it('rejects a repeat within a 3x3 box only — the case a row/column check misses', () => {
    const board = rows([
      '8........',
      '..36.....',
      '.7..9.2..',
      '.5...7...',
      '....457..',
      '...1...3.',
      '..1....68',
      '..85...1.',
      '.9....4..',
    ]);
    board[2]![1] = '8'; // same top-left box as the 8 at (0, 0); different row and column
    expect(isValidSudoku(board)).toBe(false);
  });
});
