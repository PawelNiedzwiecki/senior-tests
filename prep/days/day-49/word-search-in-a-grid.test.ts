import { describe, it, expect } from 'vitest';
import { wordExists } from './word-search-in-a-grid.ts';

describe('wordExists', () => {
  const board = () => [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E'],
  ];

  it('handles the prompt examples', () => {
    expect(wordExists(board(), 'ABCCED')).toBe(true);
    expect(wordExists(board(), 'SEE')).toBe(true);
    expect(wordExists(board(), 'ABCB')).toBe(false);
  });

  it('handles single-letter words', () => {
    expect(wordExists(board(), 'A')).toBe(true);
    expect(wordExists(board(), 'Z')).toBe(false);
  });

  it('rejects a word longer than the board', () => {
    expect(wordExists([['A']], 'AA')).toBe(false);
  });

  it('allows a cell reused on a DIFFERENT path (the backtrack must undo)', () => {
    // Both words need the shared 'A' at (0,0); a non-restoring solution fails
    // the second call only if state leaks, so check the board is restored too.
    const grid = board();
    expect(wordExists(grid, 'ABCCED')).toBe(true);
    expect(wordExists(grid, 'ASA')).toBe(true);
  });

  it('leaves the board unmodified', () => {
    const grid = board();
    const snapshot = JSON.stringify(grid);
    wordExists(grid, 'ABCCED');
    wordExists(grid, 'NOPE');
    expect(JSON.stringify(grid)).toBe(snapshot);
  });

  it('handles an empty board', () => {
    expect(wordExists([], 'A')).toBe(false);
    expect(wordExists([[]], 'A')).toBe(false);
  });

  it('finds a snaking path', () => {
    const snake = [
      ['A', 'B', 'C'],
      ['H', 'I', 'D'],
      ['G', 'F', 'E'],
    ];
    expect(wordExists(snake, 'ABCDEFGHI')).toBe(true);
    expect(wordExists(snake, 'ABCDEFGHIJ')).toBe(false);
  });
});