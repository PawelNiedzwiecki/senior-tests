import { describe, it, expect } from 'vitest';
import { detectCycleStart, findMiddle, isHappy } from '@patterns/03-fast-slow-pointers.ts';
import { buildList, buildCyclicList, ListNode } from '../support/list.ts';

describe('detectCycleStart', () => {
  it('returns null for an acyclic list', () => {
    expect(detectCycleStart(buildList([1, 2, 3, 4]))).toBeNull();
  });

  it('finds the entry of a cycle', () => {
    const head = buildCyclicList([1, 2, 3, 4], 2); // tail → node holding 3
    expect(detectCycleStart(head)?.val).toBe(3);
  });

  it('finds a cycle that starts at the head', () => {
    const head = buildCyclicList([1, 2, 3], 0);
    expect(detectCycleStart(head)?.val).toBe(1);
  });

  it('handles a single node pointing at itself', () => {
    const head = buildCyclicList([7], 0);
    expect(detectCycleStart(head)?.val).toBe(7);
  });

  it('handles a single node with no cycle', () => {
    expect(detectCycleStart(buildList([7]))).toBeNull();
  });

  it('handles an empty list', () => {
    expect(detectCycleStart(null)).toBeNull();
  });

  it('finds a cycle whose entry is the last node', () => {
    const head = buildCyclicList([1, 2, 3], 2);
    expect(detectCycleStart(head)?.val).toBe(3);
  });

  it('returns the actual node, not a copy', () => {
    const head = buildCyclicList([1, 2, 3, 4], 1);
    const entry = detectCycleStart(head);
    let expected: ListNode = head!;
    expected = expected.next!;
    expect(entry).toBe(expected);
  });
});

describe('findMiddle', () => {
  it('returns the middle of an odd-length list', () => {
    expect(findMiddle(buildList([1, 2, 3, 4, 5]))?.val).toBe(3);
  });

  it('returns the SECOND middle of an even-length list', () => {
    expect(findMiddle(buildList([1, 2, 3, 4, 5, 6]))?.val).toBe(4);
    expect(findMiddle(buildList([1, 2]))?.val).toBe(2);
  });

  it('handles a single node', () => {
    expect(findMiddle(buildList([1]))?.val).toBe(1);
  });

  it('handles an empty list', () => {
    expect(findMiddle(null)).toBeNull();
  });

  it('handles three nodes', () => {
    expect(findMiddle(buildList([1, 2, 3]))?.val).toBe(2);
  });
});

describe('isHappy', () => {
  it('handles the prompt examples', () => {
    expect(isHappy(19)).toBe(true);
    expect(isHappy(2)).toBe(false);
  });

  it('treats 1 as happy', () => {
    expect(isHappy(1)).toBe(true);
  });

  it('handles known happy numbers', () => {
    for (const n of [7, 10, 13, 23, 28, 100]) expect(isHappy(n)).toBe(true);
  });

  it('handles known unhappy numbers', () => {
    for (const n of [3, 4, 5, 6, 8, 9, 11]) expect(isHappy(n)).toBe(false);
  });

  it('handles a large input', () => {
    expect(isHappy(1_000_000)).toBe(true); // 1 + 0... = 1
  });
});
