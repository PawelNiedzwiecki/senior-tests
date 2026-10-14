/**
 * SOLUTION — Conway's Game of Life
 *
 * COMPLEXITY
 *   nextGeneration: O(rows · cols) time and space.
 *   step:           O(n) time and space for n live cells (plus the sort).
 *
 * NARRATION:
 *   "The rule is one pure function — `fate(alive, neighbours)` — shared by
 *    both representations. The dense version reads from the old grid and
 *    writes a new one, so updates are simultaneous. The sparse version can't
 *    loop over an infinite plane, so it inverts the question: each live cell
 *    broadcasts +1 to its neighbours, and only cells that received a count
 *    can be alive next turn."
 *
 * ONE RULE, TWO STORAGES. Separating `fate` from storage is the design point.
 * When the interviewer says "now make it infinite", only the storage changes.
 *
 * SPARSE vs DENSE: a mostly-empty huge board wants the Set/Map version (cost
 * scales with live cells); a small or dense board wants the 2-D array (no
 * string keys, cache-friendly).
 */

export type Grid = readonly (readonly boolean[])[];
export type Cell = readonly [x: number, y: number];

const OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

const fate = (alive: boolean, neighbours: number): boolean =>
  neighbours === 3 || (alive && neighbours === 2);

export function nextGeneration(grid: Grid): boolean[][] {
  const width = grid[0]?.length ?? 0;
  if (grid.some((row) => row.length !== width)) throw new Error('Grid rows must be equal length');

  const isAlive = (x: number, y: number): boolean => grid[y]?.[x] === true;

  return grid.map((row, y) =>
    row.map((alive, x) => {
      const neighbours = OFFSETS.filter(([dx, dy]) => isAlive(x + dx, y + dy)).length;
      return fate(alive, neighbours);
    }),
  );
}

const key = (x: number, y: number): string => `${x},${y}`;

export function step(cells: readonly Cell[]): Array<[number, number]> {
  const live = new Set(cells.map(([x, y]) => key(x, y)));
  const counts = new Map<string, { x: number; y: number; n: number }>();

  for (const k of live) {
    const [x, y] = k.split(',').map(Number) as [number, number];
    for (const [dx, dy] of OFFSETS) {
      const nk = key(x + dx, y + dy);
      const entry = counts.get(nk);
      if (entry) entry.n++;
      else counts.set(nk, { x: x + dx, y: y + dy, n: 1 });
    }
  }

  const next: Array<[number, number]> = [];
  for (const [k, { x, y, n }] of counts) {
    if (fate(live.has(k), n)) next.push([x, y]);
  }
  return next.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
