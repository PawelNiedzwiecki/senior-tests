import { describe, it, expect } from 'vitest';
import { execute, type Grid, type Rover } from '@tskata/06-mars-rover.ts';

const GRID: Grid = { width: 5, height: 5 };
const ORIGIN: Rover = { x: 0, y: 0, direction: 'N' };

describe('kata 06 — Mars rover', () => {
  it('does nothing for an empty command string', () => {
    expect(execute(GRID, ORIGIN, '')).toEqual({ status: 'ok', rover: ORIGIN });
  });

  it('turns in place', () => {
    expect(execute(GRID, ORIGIN, 'R').rover.direction).toBe('E');
    expect(execute(GRID, ORIGIN, 'RR').rover.direction).toBe('S');
    expect(execute(GRID, ORIGIN, 'L').rover.direction).toBe('W');
    expect(execute(GRID, ORIGIN, 'LLLL').rover.direction).toBe('N');
  });

  it('moves forward and backward', () => {
    expect(execute(GRID, ORIGIN, 'FF').rover).toEqual({ x: 0, y: 2, direction: 'N' });
    expect(execute(GRID, ORIGIN, 'FFRFF').rover).toEqual({ x: 2, y: 2, direction: 'E' });
    expect(execute(GRID, { x: 2, y: 2, direction: 'S' }, 'B').rover).toEqual({
      x: 2,
      y: 3,
      direction: 'S',
    });
  });

  it('wraps around every edge', () => {
    expect(execute(GRID, ORIGIN, 'B').rover).toEqual({ x: 0, y: 4, direction: 'N' });
    expect(execute(GRID, ORIGIN, 'LF').rover).toEqual({ x: 4, y: 0, direction: 'W' });
    expect(execute(GRID, { x: 4, y: 4, direction: 'N' }, 'F').rover).toEqual({
      x: 4,
      y: 0,
      direction: 'N',
    });
    expect(execute(GRID, { x: 4, y: 4, direction: 'E' }, 'F').rover).toEqual({
      x: 0,
      y: 4,
      direction: 'E',
    });
  });

  it('stops before an obstacle and reports it', () => {
    const grid: Grid = { ...GRID, obstacles: [{ x: 0, y: 2 }] };
    expect(execute(grid, ORIGIN, 'FFFRF')).toEqual({
      status: 'blocked',
      rover: { x: 0, y: 1, direction: 'N' },
      obstacle: { x: 0, y: 2 },
    });
  });

  it('detects obstacles across the wrap', () => {
    const grid: Grid = { ...GRID, obstacles: [{ x: 0, y: 4 }] };
    expect(execute(grid, ORIGIN, 'B')).toEqual({
      status: 'blocked',
      rover: ORIGIN,
      obstacle: { x: 0, y: 4 },
    });
  });

  it('validates commands before moving and never mutates the input', () => {
    const start: Rover = { x: 1, y: 1, direction: 'N' };
    expect(() => execute(GRID, start, 'FFX')).toThrow();
    expect(() => execute(GRID, start, 'f')).toThrow();
    execute(GRID, start, 'FFRF');
    expect(start).toEqual({ x: 1, y: 1, direction: 'N' });
  });

  it('rejects an invalid start position', () => {
    expect(() => execute(GRID, { x: 5, y: 0, direction: 'N' }, '')).toThrow();
    expect(() => execute({ ...GRID, obstacles: [{ x: 0, y: 0 }] }, ORIGIN, '')).toThrow();
  });
});
