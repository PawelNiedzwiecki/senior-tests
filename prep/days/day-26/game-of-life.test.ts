import { describe, it, expect } from 'vitest';
import { gameOfLife } from './game-of-life.ts';



describe('gameOfLife', () => {
  it('handles the prompt examples', () => {
    expect(
      gameOfLife([
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 0],
      [1, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ]);

    expect(
      gameOfLife([
        [1, 1],
        [1, 0],
      ]),
    ).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('mutates the board in place and returns it', () => {
    const board = [
      [1, 1],
      [1, 0],
    ];
    const returned = gameOfLife(board);
    expect(returned).toBe(board);
    expect(board).toEqual([
      [1, 1],
      [1, 1],
    ]);
  });

  it('kills a lone live cell (underpopulation)', () => {
    expect(
      gameOfLife([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ]),
    ).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('keeps a still life stable (the block)', () => {
    const block = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    expect(gameOfLife(block.map((row) => [...row]))).toEqual(block);
  });

  it('oscillates the blinker', () => {
    const vertical = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    const horizontal = [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ];
    expect(gameOfLife(vertical.map((row) => [...row]))).toEqual(horizontal);
    expect(gameOfLife(horizontal.map((row) => [...row]))).toEqual(vertical);
  });

  it('updates simultaneously, not sequentially', () => {
    // Sequential updates get this wrong: the cell at (0,1) must see the
    // ORIGINAL value of (0,0), not its already-computed new one.
    const board = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(gameOfLife(board)).toEqual([
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0],
    ]);
  });

  it('handles an all-dead and an all-live board', () => {
    expect(
      gameOfLife([
        [0, 0],
        [0, 0],
      ]),
    ).toEqual([
      [0, 0],
      [0, 0],
    ]);

    // Every cell in a full 3x3 has 3, 5 or 8 live neighbours.
    expect(
      gameOfLife([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]),
    ).toEqual([
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ]);
  });
});
