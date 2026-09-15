import { describe, it, expect } from 'vitest';
import { reverseBetween, reverseKGroup } from '@leetcode/18-linked-list-reversal.ts';
import { buildList, listToArray } from '../../patterns/support/list.ts';

describe('reverseBetween', () => {
  it('handles the prompt examples', () => {
    expect(listToArray(reverseBetween(buildList([1, 2, 3, 4, 5]), 2, 4))).toEqual([1, 4, 3, 2, 5]);
    expect(listToArray(reverseBetween(buildList([5]), 1, 1))).toEqual([5]);
    expect(listToArray(reverseBetween(buildList([1, 2, 3]), 1, 3))).toEqual([3, 2, 1]);
  });

  it('handles null and single-element lists', () => {
    expect(reverseBetween(null, 1, 1)).toBeNull();
    expect(listToArray(reverseBetween(buildList([7]), 1, 1))).toEqual([7]);
  });

  it('leaves the list alone when left === right', () => {
    expect(listToArray(reverseBetween(buildList([1, 2, 3, 4]), 3, 3))).toEqual([1, 2, 3, 4]);
  });

  it('reverses a section touching the head', () => {
    expect(listToArray(reverseBetween(buildList([1, 2, 3, 4, 5]), 1, 3))).toEqual([3, 2, 1, 4, 5]);
  });

  it('reverses a section touching the tail', () => {
    expect(listToArray(reverseBetween(buildList([1, 2, 3, 4, 5]), 3, 5))).toEqual([1, 2, 5, 4, 3]);
  });

  it('reverses a two-node section', () => {
    expect(listToArray(reverseBetween(buildList([1, 2, 3, 4]), 2, 3))).toEqual([1, 3, 2, 4]);
  });

  it('handles a long list in one pass', () => {
    const values = Array.from({ length: 10_000 }, (_, i) => i);
    const result = listToArray(reverseBetween(buildList(values), 100, 9000));
    const expected = [
      ...values.slice(0, 99),
      ...values.slice(99, 9000).reverse(),
      ...values.slice(9000),
    ];
    expect(result).toEqual(expected);
  });
});

describe('reverseKGroup', () => {
  it('handles the prompt examples', () => {
    expect(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 2))).toEqual([2, 1, 4, 3, 5]);
    expect(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5]), 3))).toEqual([3, 2, 1, 4, 5]);
    expect(listToArray(reverseKGroup(buildList([1, 2, 3]), 1))).toEqual([1, 2, 3]);
    expect(listToArray(reverseKGroup(buildList([1, 2, 3]), 5))).toEqual([1, 2, 3]);
  });

  it('handles null and empty groups', () => {
    expect(reverseKGroup(null, 3)).toBeNull();
    expect(listToArray(reverseKGroup(buildList([1]), 1))).toEqual([1]);
  });

  it('reverses the whole list when k equals its length', () => {
    expect(listToArray(reverseKGroup(buildList([1, 2, 3, 4]), 4))).toEqual([4, 3, 2, 1]);
  });

  it('leaves a short trailing group untouched', () => {
    expect(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5, 6, 7]), 3))).toEqual([
      3, 2, 1, 6, 5, 4, 7,
    ]);
  });

  it('handles an exact multiple of k', () => {
    expect(listToArray(reverseKGroup(buildList([1, 2, 3, 4, 5, 6]), 2))).toEqual([
      2, 1, 4, 3, 6, 5,
    ]);
  });

  it('agrees with a chunk-and-reverse reference', () => {
    const reference = (values: number[], k: number) => {
      const out: number[] = [];
      for (let i = 0; i < values.length; i += k) {
        const chunk = values.slice(i, i + k);
        out.push(...(chunk.length === k ? chunk.reverse() : chunk));
      }
      return out;
    };

    for (let k = 1; k <= 6; k += 1) {
      for (let n = 0; n <= 12; n += 1) {
        const values = Array.from({ length: n }, (_, i) => i + 1);
        expect(listToArray(reverseKGroup(buildList(values), k))).toEqual(reference(values, k));
      }
    }
  });

  it('handles a long list without blowing the stack', () => {
    const values = Array.from({ length: 100_000 }, (_, i) => i);
    const result = listToArray(reverseKGroup(buildList(values), 2));
    expect(result.length).toBe(100_000);
    expect(result.slice(0, 4)).toEqual([1, 0, 3, 2]);
  });
});
