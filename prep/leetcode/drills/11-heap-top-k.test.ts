import { describe, it, expect } from 'vitest';
import { createMedianFinder, mergeKLists } from '@leetcode/11-heap-top-k.ts';
import { buildList, listToArray } from '../../patterns/support/list.ts';

describe('createMedianFinder', () => {
  it('handles the prompt example', () => {
    const mf = createMedianFinder();
    mf.addNum(1);
    mf.addNum(2);
    expect(mf.findMedian()).toBe(1.5);
    mf.addNum(3);
    expect(mf.findMedian()).toBe(2);
  });

  it('handles a single element', () => {
    const mf = createMedianFinder();
    mf.addNum(42);
    expect(mf.findMedian()).toBe(42);
  });

  it('handles values arriving in descending order', () => {
    const mf = createMedianFinder();
    for (const n of [5, 4, 3, 2, 1]) mf.addNum(n);
    expect(mf.findMedian()).toBe(3);
  });

  it('handles duplicates and negatives', () => {
    const mf = createMedianFinder();
    for (const n of [-1, -1, -1, -1]) mf.addNum(n);
    expect(mf.findMedian()).toBe(-1);

    const mf2 = createMedianFinder();
    for (const n of [-5, 0, 5]) mf2.addNum(n);
    expect(mf2.findMedian()).toBe(0);
  });

  it('tracks the median after every insertion', () => {
    const values = [12, 3, 7, 1, 9, 4, 15, 8, 2, 11];
    const mf = createMedianFinder();
    const seen: number[] = [];

    for (const value of values) {
      mf.addNum(value);
      seen.push(value);
      const sorted = [...seen].sort((a, b) => a - b);
      const mid = sorted.length >> 1;
      const expected =
        sorted.length % 2 === 1 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
      expect(mf.findMedian()).toBe(expected);
    }
  });

  it('stays fast over many insertions', () => {
    const mf = createMedianFinder();
    const started = Date.now();
    for (let i = 0; i < 20_000; i += 1) mf.addNum((i * 7919) % 10_007);
    expect(Number.isFinite(mf.findMedian())).toBe(true);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});

describe('mergeKLists', () => {
  it('handles the prompt example', () => {
    const merged = mergeKLists([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])]);
    expect(listToArray(merged)).toEqual([1, 1, 2, 3, 4, 4, 5, 6]);
  });

  it('handles an empty input and empty lists', () => {
    expect(mergeKLists([])).toBeNull();
    expect(mergeKLists([null])).toBeNull();
    expect(mergeKLists([null, null])).toBeNull();
  });

  it('handles a single list', () => {
    expect(listToArray(mergeKLists([buildList([1, 2, 3])]))).toEqual([1, 2, 3]);
  });

  it('skips empty lists mixed in with real ones', () => {
    const merged = mergeKLists([null, buildList([2, 5]), null, buildList([1, 6])]);
    expect(listToArray(merged)).toEqual([1, 2, 5, 6]);
  });

  it('handles negatives and duplicates', () => {
    const merged = mergeKLists([buildList([-3, -1, 0]), buildList([-2, -2, 4])]);
    expect(listToArray(merged)).toEqual([-3, -2, -2, -1, 0, 4]);
  });

  it('handles lists of very different lengths', () => {
    const long = Array.from({ length: 1000 }, (_, i) => i * 2);
    const merged = mergeKLists([buildList(long), buildList([1]), buildList([1999])]);
    const expected = [...long, 1, 1999].sort((a, b) => a - b);
    expect(listToArray(merged)).toEqual(expected);
  });

  it('merges many lists efficiently', () => {
    const k = 200;
    const lists = Array.from({ length: k }, (_, i) =>
      buildList(Array.from({ length: 50 }, (_, j) => i + j * k)),
    );
    const merged = listToArray(mergeKLists(lists));
    expect(merged.length).toBe(k * 50);
    for (let i = 1; i < merged.length; i += 1) {
      expect(merged[i]!).toBeGreaterThanOrEqual(merged[i - 1]!);
    }
  });
});
