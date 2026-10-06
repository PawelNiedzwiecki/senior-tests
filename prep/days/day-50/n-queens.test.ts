import { describe, it, expect } from 'vitest';
import { solveNQueens } from './n-queens.ts';



describe('solveNQueens', () => {
  const isValid = (board: string[]) => {
    const n = board.length;
    const queens: Array<[number, number]> = [];
    board.forEach((row, r) => {
      expect(row.length).toBe(n);
      expect(row.split('').filter((ch) => ch === 'Q').length).toBe(1);
      queens.push([r, row.indexOf('Q')]);
    });

    for (let i = 0; i < queens.length; i += 1) {
      for (let j = i + 1; j < queens.length; j += 1) {
        const [r1, c1] = queens[i]!;
        const [r2, c2] = queens[j]!;
        if (c1 === c2) return false;
        if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) return false;
      }
    }
    return true;
  };

  it('handles the prompt examples', () => {
    expect(solveNQueens(1)).toEqual([['Q']]);
    expect(solveNQueens(2)).toEqual([]);
    expect(solveNQueens(3)).toEqual([]);
    expect(solveNQueens(4).length).toBe(2);
  });

  it('produces the known solution counts', () => {
    expect(solveNQueens(5).length).toBe(10);
    expect(solveNQueens(6).length).toBe(4);
    expect(solveNQueens(7).length).toBe(40);
    expect(solveNQueens(8).length).toBe(92);
  });

  it('produces boards that are actually valid', () => {
    for (const n of [4, 5, 6, 8]) {
      for (const board of solveNQueens(n)) {
        expect(isValid(board)).toBe(true);
      }
    }
  });

  it('produces distinct solutions', () => {
    const solutions = solveNQueens(6).map((board) => board.join('|'));
    expect(new Set(solutions).size).toBe(solutions.length);
  });

  it('handles n = 0 as one empty arrangement', () => {
    expect(solveNQueens(0)).toEqual([[]]);
  });
});
