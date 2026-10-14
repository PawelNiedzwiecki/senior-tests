/**
 * KATA 07 — Conway's Game of Life
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min        Guide: ../README.md
 *
 * THE TASK — two representations of the same rules
 *   PART 1  nextGeneration(grid)  — a FINITE boolean grid. Cells beyond the
 *           edge are dead (no wrapping). Return a NEW grid, same size.
 *   PART 2  step(cells)           — an INFINITE plane given as a list of live
 *           [x, y] coordinates (may be negative). Return the live cells of the
 *           next generation, SORTED by x, then y, without duplicates.
 *           The input may list the same cell more than once — treat it as one.
 *
 * THE RULES — each cell has 8 neighbours
 *   - Live cell with 2 or 3 live neighbours survives.
 *   - Dead cell with exactly 3 live neighbours becomes alive.
 *   - Everything else is dead in the next generation.
 *   - All cells update SIMULTANEOUSLY.
 *
 * EXAMPLES
 *   Blinker (period 2):    . . .        . # .
 *                          # # #   →    . # .
 *                          . . .        . # .
 *   Block (still life):    # #   →   # #
 *                          # #       # #
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - Never mutate the input.
 *   - A jagged grid (rows of different length) throws.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Finite with dead edges, wrapping (torus), or infinite?
 *   - How big can it get — is a dense 2-D array affordable?
 *
 * HINT
 *   Part 1: the classic bug is updating the grid IN PLACE, so later cells
 *   see already-updated neighbours. Build a new grid. Count neighbours with
 *   the 8 offsets in a constant array; out-of-range reads are `undefined`
 *   (with `noUncheckedIndexedAccess`, handle them explicitly).
 *   Part 2: you can't iterate an infinite grid — so INVERT it. For every live
 *   cell, add +1 to each of its 8 neighbours in a `Map<"x,y", count>`. Only
 *   cells in that map can be alive next turn.
 *
 * FOLLOW-UPS
 *   - Which representation would you pick for a 10 000 × 10 000 board that is
 *     mostly empty? Mostly full?
 *   - Render it in React at 60 fps — what do you memoise, what goes in a ref?
 */

export type Grid = readonly (readonly boolean[])[];
export type Cell = readonly [x: number, y: number];

export function nextGeneration(_grid: Grid): boolean[][] {
  throw new Error('Not implemented');
}

export function step(_cells: readonly Cell[]): Array<[number, number]> {
  throw new Error('Not implemented');
}
