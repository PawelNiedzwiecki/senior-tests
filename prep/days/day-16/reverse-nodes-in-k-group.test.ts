import { describe, it, expect } from 'vitest';
import { reverseKGroup } from './reverse-nodes-in-k-group.ts';
import { buildList, listToArray } from '../../patterns/support/list.ts';



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
