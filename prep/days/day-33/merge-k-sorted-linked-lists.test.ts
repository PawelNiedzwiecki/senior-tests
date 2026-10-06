import { describe, it, expect } from 'vitest';
import { mergeKLists } from './merge-k-sorted-linked-lists.ts';
import { buildList, listToArray } from '../../patterns/support/list.ts';



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
