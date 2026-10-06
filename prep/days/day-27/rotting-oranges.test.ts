import { describe, it, expect } from 'vitest';
import { orangesRotting } from './rotting-oranges.ts';

describe('orangesRotting', () => {
  it('handles the prompt examples', () => {
    expect(
      orangesRotting([
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1],
      ]),
    ).toBe(4);

    expect(
      orangesRotting([
        [2, 1, 1],
        [0, 1, 1],
        [1, 0, 1],
      ]),
    ).toBe(-1);

    expect(orangesRotting([[0, 2]])).toBe(0);
  });

  it('returns 0 when there is nothing fresh', () => {
    expect(orangesRotting([[0, 0, 0]])).toBe(0);
    expect(orangesRotting([[2, 2], [2, 2]])).toBe(0);
    expect(orangesRotting([])).toBe(0);
  });

  it('returns -1 when there is no rotten orange at all', () => {
    expect(orangesRotting([[1]])).toBe(-1);
    expect(orangesRotting([[1, 1], [1, 1]])).toBe(-1);
  });

  it('spreads from several sources at once', () => {
    // With one source this would take 4 minutes; with two it takes 2.
    expect(orangesRotting([[2, 1, 1, 1, 2]])).toBe(2);
  });

  it('handles a single fresh orange next to a rotten one', () => {
    expect(orangesRotting([[2, 1]])).toBe(1);
  });

  it('handles a long corridor without quadratic queue behaviour', () => {
    const corridor = [[2, ...Array.from({ length: 50_000 }, () => 1)]];
    const started = Date.now();
    expect(orangesRotting(corridor)).toBe(50_000);
    expect(Date.now() - started).toBeLessThan(2000);
  });
});