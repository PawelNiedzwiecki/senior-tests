/**
 * SOLUTION — Mars rover
 *
 * COMPLEXITY: O(c + o) — c commands, o obstacles (Set build).
 *
 * NARRATION:
 *   "Directions live in a clockwise array, so turning is index ± 1 mod 4.
 *    Movement is a delta table. Each command is a pure step from one Rover
 *    to the next; the loop only decides whether the step is allowed."
 *
 * DATA OVER BRANCHES: `DELTAS` and `CLOCKWISE` replace 16 if-statements.
 *
 * `mod` HELPER: JS `%` keeps the dividend's sign (-1 % 5 === -1), so wrapping
 * left/down needs `((v % n) + n) % n`. Name the helper — that bug is the
 * reason this kata exists.
 *
 * VALIDATE THE WHOLE COMMAND STRING FIRST. Half-executing "FFX" and then
 * throwing leaves the caller unsure where the rover is. All-or-nothing.
 *
 * IMMUTABLE STEPS: `step` returns a new Rover, so "last safe pose" on an
 * obstacle is just the variable we already have — no undo needed.
 */

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Rover {
  x: number;
  y: number;
  direction: Direction;
}

export interface Point {
  x: number;
  y: number;
}

export interface Grid {
  width: number;
  height: number;
  obstacles?: readonly Point[];
}

export type RoverResult =
  | { status: 'ok'; rover: Rover }
  | { status: 'blocked'; rover: Rover; obstacle: Point };

type Command = 'F' | 'B' | 'L' | 'R';

const CLOCKWISE: readonly Direction[] = ['N', 'E', 'S', 'W'];
const DELTAS: Record<Direction, Point> = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

const mod = (v: number, n: number): number => ((v % n) + n) % n;
const key = (p: Point): string => `${p.x},${p.y}`;
const isCommand = (c: string): c is Command => c === 'F' || c === 'B' || c === 'L' || c === 'R';

function turn(direction: Direction, by: 1 | -1): Direction {
  return CLOCKWISE[mod(CLOCKWISE.indexOf(direction) + by, 4)]!;
}

function step(rover: Rover, command: Command, grid: Grid): Rover {
  switch (command) {
    case 'L':
      return { ...rover, direction: turn(rover.direction, -1) };
    case 'R':
      return { ...rover, direction: turn(rover.direction, 1) };
    case 'F':
    case 'B': {
      const sign = command === 'F' ? 1 : -1;
      const d = DELTAS[rover.direction];
      return {
        ...rover,
        x: mod(rover.x + d.x * sign, grid.width),
        y: mod(rover.y + d.y * sign, grid.height),
      };
    }
  }
}

export function execute(grid: Grid, start: Rover, commands: string): RoverResult {
  const parsed = [...commands];
  const bad = parsed.find((c) => !isCommand(c));
  if (bad !== undefined) throw new Error(`Unknown command: "${bad}"`);

  const obstacles = new Set((grid.obstacles ?? []).map(key));
  const inside = start.x >= 0 && start.x < grid.width && start.y >= 0 && start.y < grid.height;
  if (!inside || obstacles.has(key(start))) throw new Error('Invalid start position');

  let rover: Rover = { ...start };
  for (const command of parsed as Command[]) {
    const next = step(rover, command, grid);
    if (obstacles.has(key(next))) {
      return { status: 'blocked', rover, obstacle: { x: next.x, y: next.y } };
    }
    rover = next;
  }
  return { status: 'ok', rover };
}
