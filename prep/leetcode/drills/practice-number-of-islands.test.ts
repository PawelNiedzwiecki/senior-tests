import { describe, it, expect } from 'vitest';
import { numIslands } from '@leetcode/practice-number-of-islands.ts';

describe('numIslands', () => {
  it('counts the example grid', () => {
    expect(
      numIslands([
        ['1', '1', '0', '0'],
        ['1', '1', '0', '0'],
        ['0', '0', '1', '0'],
        ['0', '0', '0', '1'],
      ]),
    ).toBe(3);
  });

  it('handles all water', () => {
    expect(
      numIslands([
        ['0', '0'],
        ['0', '0'],
      ]),
    ).toBe(0);
  });

  it('handles all land as one island', () => {
    expect(
      numIslands([
        ['1', '1'],
        ['1', '1'],
      ]),
    ).toBe(1);
  });

  it('does not connect diagonally', () => {
    expect(
      numIslands([
        ['1', '0'],
        ['0', '1'],
      ]),
    ).toBe(2);
  });

  it('handles an empty grid', () => {
    expect(numIslands([])).toBe(0);
  });
});
