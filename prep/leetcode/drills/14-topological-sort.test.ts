import { describe, it, expect } from 'vitest';
import { findOrder, alienOrder } from '@leetcode/14-topological-sort.ts';

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

/** Any order consistent with the word list is acceptable. */
const isConsistent = (order: string, words: string[]) => {
  const position = new Map([...order].map((letter, i) => [letter, i]));

  const letters = new Set(words.flatMap((word) => [...word]));
  if (position.size !== letters.size) return false;
  for (const letter of letters) if (!position.has(letter)) return false;

  for (let i = 0; i + 1 < words.length; i += 1) {
    const a = words[i]!;
    const b = words[i + 1]!;
    const shared = Math.min(a.length, b.length);
    let differed = false;
    for (let j = 0; j < shared; j += 1) {
      if (a[j] === b[j]) continue;
      if (position.get(a[j]!)! >= position.get(b[j]!)!) return false;
      differed = true;
      break;
    }
    if (!differed && a.length > b.length) return false;
  }
  return true;
};

describe('alienOrder', () => {
  it('handles the prompt examples', () => {
    const words = ['wrt', 'wrf', 'er', 'ett', 'rftt'];
    expect(isConsistent(alienOrder(words), words)).toBe(true);
    expect(alienOrder(['z', 'x'])).toBe('zx');
  });

  it('returns an empty string on a contradiction', () => {
    expect(alienOrder(['z', 'x', 'z'])).toBe('');
  });

  it('rejects a word that is a prefix of the one before it', () => {
    expect(alienOrder(['abc', 'ab'])).toBe('');
    expect(alienOrder(['wrtkj', 'wrt'])).toBe('');
  });

  it('accepts a prefix in the correct order', () => {
    expect(isConsistent(alienOrder(['ab', 'abc']), ['ab', 'abc'])).toBe(true);
  });

  it('includes unconstrained letters', () => {
    const order = alienOrder(['ab']);
    expect([...order].sort().join('')).toBe('ab');
  });

  it('handles a single word and an empty list', () => {
    expect([...alienOrder(['zyx'])].sort().join('')).toBe('xyz');
    expect(alienOrder([])).toBe('');
  });

  it('survives a repeated constraint (deduplicated edges)', () => {
    const words = ['ca', 'cb', 'da', 'db'];
    const order = alienOrder(words);
    expect(isConsistent(order, words)).toBe(true);
    expect(order.indexOf('a')).toBeLessThan(order.indexOf('b'));
  });

  it('handles identical adjacent words', () => {
    const words = ['abc', 'abc', 'abd'];
    expect(isConsistent(alienOrder(words), words)).toBe(true);
  });
});
