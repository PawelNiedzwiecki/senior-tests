import { describe, it, expect } from 'vitest';
import { longestConsecutive, createLRUCache } from '@leetcode/01-hash-map.ts';

describe('longestConsecutive', () => {
  it('handles the prompt examples', () => {
    expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
    expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
  });

  it('handles an empty array', () => {
    expect(longestConsecutive([])).toBe(0);
  });

  it('handles a single element', () => {
    expect(longestConsecutive([5])).toBe(1);
  });

  it('collapses duplicates', () => {
    expect(longestConsecutive([1, 1, 1, 1])).toBe(1);
    expect(longestConsecutive([1, 2, 2, 3])).toBe(3);
  });

  it('handles negatives and a run crossing zero', () => {
    expect(longestConsecutive([-3, -2, -1, 0, 1])).toBe(5);
  });

  it('picks the longest of several runs', () => {
    expect(longestConsecutive([10, 11, 1, 2, 3, 50])).toBe(3);
  });

  it('stays fast on a fully consecutive input (catches the O(n^2) version)', () => {
    const nums = Array.from({ length: 20_000 }, (_, i) => i);
    const started = Date.now();
    expect(longestConsecutive(nums)).toBe(20_000);
    expect(Date.now() - started).toBeLessThan(1000);
  });
});

describe('createLRUCache', () => {
  it('gets what it put', () => {
    const cache = createLRUCache(2);
    cache.put(1, 100);
    expect(cache.get(1)).toBe(100);
  });

  it('returns undefined for a missing key', () => {
    expect(createLRUCache(2).get(42)).toBeUndefined();
  });

  it('evicts the least recently used key', () => {
    const cache = createLRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(3, 3); // evicts 1
    expect(cache.get(1)).toBeUndefined();
    expect(cache.get(2)).toBe(2);
    expect(cache.get(3)).toBe(3);
  });

  it('counts a get as a use', () => {
    const cache = createLRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.get(1); // 2 is now the least recent
    cache.put(3, 3);
    expect(cache.get(2)).toBeUndefined();
    expect(cache.get(1)).toBe(1);
  });

  it('counts overwriting a key as a use and does not evict for it', () => {
    const cache = createLRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(1, 99); // update, not insert — nothing should be evicted
    expect(cache.size).toBe(2);
    cache.put(3, 3); // now 2 is the least recent
    expect(cache.get(2)).toBeUndefined();
    expect(cache.get(1)).toBe(99);
  });

  it('never exceeds capacity', () => {
    const cache = createLRUCache(3);
    for (let i = 0; i < 50; i += 1) {
      cache.put(i, i);
      expect(cache.size).toBeLessThanOrEqual(3);
    }
    expect(cache.get(49)).toBe(49);
    expect(cache.get(0)).toBeUndefined();
  });

  it('handles a capacity of one', () => {
    const cache = createLRUCache(1);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBeUndefined();
    expect(cache.get(2)).toBe(2);
  });
});
