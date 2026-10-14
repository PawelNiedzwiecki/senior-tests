/**
 * KATA 06 — Mars rover
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min        Guide: ../README.md
 *
 * THE TASK
 * A rover sits on a wrapping grid. Execute a command string and report where
 * it ended up — or where it got stuck.
 *
 * THE RULES
 *   - Grid is `width × height`, cells (0,0)..(width-1, height-1).
 *   - Directions N E S W. NORTH IS y + 1, EAST IS x + 1.
 *   - Commands (upper case only):
 *       F  move forward one cell          B  move backward one cell
 *       L  turn left 90° in place         R  turn right 90° in place
 *   - The grid WRAPS: moving north from y = height-1 lands on y = 0, moving
 *     west from x = 0 lands on x = width-1 (a planet is a sphere-ish).
 *   - OBSTACLES: if the next move would land on an obstacle, the rover does
 *     NOT move, stops executing the remaining commands, and reports it.
 *
 * RETURN — a discriminated union
 *   { status: 'ok',      rover }
 *   { status: 'blocked', rover, obstacle: { x, y } }   rover = last safe pose
 *
 * EXAMPLES (5 × 5 grid, no obstacles, start 0,0 N)
 *   "FFRFF"  → ok,  { x: 2, y: 2, direction: 'E' }
 *   "B"      → ok,  { x: 0, y: 4, direction: 'N' }   wrapped
 *   "LF"     → ok,  { x: 4, y: 0, direction: 'W' }   wrapped
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - An unknown command character throws an Error BEFORE any command runs.
 *   - A start position outside the grid, or on an obstacle, throws.
 *   - The input `start` object is never mutated.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Does north increase or decrease y?
 *   - Wrap, or stop at the edge?
 *   - On an obstacle: skip that command, or abort the rest?
 *
 * HINT
 *   Don't write four `if (direction === 'N')` blocks per command. Put the
 *   directions in an ARRAY in clockwise order; turning is ±1 on the index
 *   (mod 4). Put the movement deltas in a lookup table. Wrapping is one
 *   helper: `((v % size) + size) % size` — `%` in JS keeps the sign.
 *   Store obstacles as a `Set` of "x,y" strings for O(1) lookup.
 *
 * FOLLOW-UPS
 *   - Several rovers on the same grid that block each other.
 *   - Return the full path for a UI to animate.
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

export function execute(_grid: Grid, _start: Rover, _commands: string): RoverResult {
  throw new Error('Not implemented');
}
