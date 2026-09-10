import { describe, it, expect } from 'vitest';
import { twoSum, groupAnagrams, firstUniqueChar } from '@algo/01-hash-maps.ts';

describe('twoSum', () => {
  it('finds the pair from the prompt', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });

  it('works when the answer is not at index 0', () => {
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  it('handles duplicate values', () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  it('does not reuse the same element', () => {
    expect(twoSum([3, 1], 6)).toBeNull();
  });

  it('handles negatives', () => {
    expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2]);
  });

  it('returns null when there is no solution', () => {
    expect(twoSum([1, 2, 3], 99)).toBeNull();
  });

  it('handles empty and single-element input', () => {
    expect(twoSum([], 5)).toBeNull();
    expect(twoSum([5], 5)).toBeNull();
  });

  it('returns whichever pair COMPLETES first, not the leftmost pair', () => {
    // Both 1+4 (indices 0,3) and 2+3 (indices 1,2) sum to 5. The one-pass scan
    // completes 2+3 at index 2, before it ever reaches index 3. Worth knowing:
    // if the prompt demands the lexicographically smallest pair, this is the
    // assumption to check with the interviewer.
    expect(twoSum([1, 2, 3, 4], 5)).toEqual([1, 2]);
  });
});

describe('groupAnagrams', () => {
  const sortGroups = (groups: string[][]) =>
    groups.map((g) => [...g].sort()).sort((a, b) => a[0]!.localeCompare(b[0]!));

  it('groups the prompt example', () => {
    const result = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
    expect(sortGroups(result)).toEqual([['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]);
  });

  it('handles an empty list', () => {
    expect(groupAnagrams([])).toEqual([]);
  });

  it('handles a single word', () => {
    expect(groupAnagrams(['abc'])).toEqual([['abc']]);
  });

  it('treats the empty string as its own group', () => {
    expect(groupAnagrams([''])).toEqual([['']]);
  });

  it('keeps non-anagrams apart', () => {
    const result = groupAnagrams(['abc', 'def', 'ghi']);
    expect(result).toHaveLength(3);
  });

  it('groups identical words together', () => {
    const result = groupAnagrams(['aa', 'aa', 'aa']);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(3);
  });

  it('does not confuse words with the same letters in different counts', () => {
    // 'aab' and 'abb' use the same letter SET but different counts.
    const result = groupAnagrams(['aab', 'abb']);
    expect(result).toHaveLength(2);
  });
});

describe('firstUniqueChar', () => {
  it('finds the first unique character', () => {
    expect(firstUniqueChar('leetcode')).toBe(0);
    expect(firstUniqueChar('loveleetcode')).toBe(2);
  });

  it('returns -1 when every character repeats', () => {
    expect(firstUniqueChar('aabb')).toBe(-1);
  });

  it('handles the empty string', () => {
    expect(firstUniqueChar('')).toBe(-1);
  });

  it('handles a single character', () => {
    expect(firstUniqueChar('z')).toBe(0);
  });

  it('finds a unique character at the end', () => {
    expect(firstUniqueChar('aabbc')).toBe(4);
  });

  it('is not fooled by a character appearing three times', () => {
    expect(firstUniqueChar('aaab')).toBe(3);
  });
});
