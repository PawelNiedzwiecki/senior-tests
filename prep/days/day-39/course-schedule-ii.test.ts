import { describe, it, expect } from 'vitest';
import { findOrder } from './course-schedule-ii.ts';
/** Several orders are usually valid, so check the constraints, not one string. */
const respectsPrerequisites = (
  order: number[],
  numCourses: number,
  prerequisites: Array<[number, number]>,
) => {
  if (order.length !== numCourses) return false;
  if (new Set(order).size !== numCourses) return false;
  const position = new Map(order.map((course, i) => [course, i]));
  return prerequisites.every(([course, requirement]) => 
    position.get(requirement)! < position.get(course)!);
};

describe('findOrder', () => {
  it('handles the prompt examples', () => {
    expect(findOrder(2, [[1, 0]])).toEqual([0, 1]);

    const prerequisites: Array<[number, number]> = [
      [1, 0],
      [2, 0],
      [3, 1],
      [3, 2],
    ];
    expect(respectsPrerequisites(findOrder(4, prerequisites), 4, prerequisites)).toBe(true);
  });

  it('returns an empty array when there is a cycle', () => {
    expect(
      findOrder(2, [
        [1, 0],
        [0, 1],
      ]),
    ).toEqual([]);

    expect(
      findOrder(3, [
        [0, 1],
        [1, 2],
        [2, 0],
      ]),
    ).toEqual([]);
  });

  it('handles courses with no prerequisites at all', () => {
    expect(findOrder(1, [])).toEqual([0]);
    expect(findOrder(3, []).sort((a, b) => a - b)).toEqual([0, 1, 2]);
  });

  it('includes isolated courses alongside constrained ones', () => {
    const prerequisites: Array<[number, number]> = [[1, 0]];
    const order = findOrder(4, prerequisites);
    expect(respectsPrerequisites(order, 4, prerequisites)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
  });

  it('handles a long dependency chain', () => {
    const n = 1000;
    const prerequisites = Array.from(
      { length: n - 1 },
      (_, i) => [i + 1, i] as [number, number],
    );
    expect(findOrder(n, prerequisites)).toEqual(Array.from({ length: n }, (_, i) => i));
  });

  it('detects a cycle that sits behind a valid prefix', () => {
    expect(
      findOrder(4, [
        [1, 0],
        [2, 1],
        [3, 2],
        [1, 3],
      ]),
    ).toEqual([]);
  });
});