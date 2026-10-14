import { describe, it, expect } from 'vitest';
import { nextGeneration, step, type Cell } from '@tskata/07-game-of-life.ts';

/** Parse a picture: '#' = alive, '.' = dead, rows separated by spaces. */
const g = (picture: string): boolean[][] =>
  picture.split(' ').map((row) => [...row].map((c) => c === '#'));

describe('kata 07 — nextGeneration (finite grid)', () => {
  it('keeps an empty grid empty', () => {
    expect(nextGeneration(g('... ... ...'))).toEqual(g('... ... ...'));
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lonely cell (underpopulation)', () => {
    expect(nextGeneration(g('... .#. ...'))).toEqual(g('... ... ...'));
  });

  it('keeps a block still', () => {
    expect(nextGeneration(g('.... .##. .##. ....'))).toEqual(g('.... .##. .##. ....'));
  });

  it('oscillates a blinker', () => {
    const horizontal = g('... ### ...');
    const vertical = g('.#. .#. .#.');
    expect(nextGeneration(horizontal)).toEqual(vertical);
    expect(nextGeneration(vertical)).toEqual(horizontal);
  });

  it('kills overcrowded cells', () => {
    expect(nextGeneration(g('### ### ###'))).toEqual(g('#.# ... #.#'));
  });

  it('treats cells beyond the edge as dead (no wrapping)', () => {
    expect(nextGeneration(g('#.# ... #.#'))).toEqual(g('... ... ...'));
  });

  it('does not mutate the input', () => {
    const grid = g('... ### ...');
    const copy = structuredClone(grid);
    nextGeneration(grid);
    expect(grid).toEqual(copy);
  });

  it('rejects a jagged grid', () => {
    expect(() => nextGeneration([[true, false], [true]])).toThrow();
  });
});

describe('kata 07 — step (infinite plane)', () => {
  it('handles no cells', () => {
    expect(step([])).toEqual([]);
  });

  it('oscillates a blinker, including negative coordinates', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expect(step(horizontal)).toEqual([[0, -1], [0, 0], [0, 1]]);
    expect(step(step(horizontal))).toEqual([[-1, 0], [0, 0], [1, 0]]);
  });

  it('moves a glider one cell diagonally every 4 generations', () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    let cells: Cell[] = glider;
    for (let i = 0; i < 4; i++) cells = step(cells);
    expect(cells).toEqual([[1, 3], [2, 1], [2, 3], [3, 2], [3, 3]]);
  });

  it('ignores duplicate input cells and returns sorted output', () => {
    expect(step([[0, 0], [0, 1], [0, 1], [1, 0], [1, 1]])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
});
