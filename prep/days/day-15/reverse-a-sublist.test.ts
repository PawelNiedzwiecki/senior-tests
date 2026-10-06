import { describe, it, expect } from 'vitest';
import { reverseBetween } from './reverse-a-sublist.ts';
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