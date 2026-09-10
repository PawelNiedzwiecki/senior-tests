import { describe, it, expect } from 'vitest';
import { MinHeap, topKFrequent, findKthLargest } from '@algo/10-heaps-topk.ts';

describe('MinHeap', () => {
  it('peeks and pops the smallest', () => {
    const h = new MinHeap();
    [5, 1, 3].forEach((n) => h.push(n));
    expect(h.peek()).toBe(1);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(3);
    expect(h.pop()).toBe(5);
  });

  it('returns undefined when empty', () => {
    const h = new MinHeap();
    expect(h.peek()).toBeUndefined();
    expect(h.pop()).toBeUndefined();
    expect(h.size).toBe(0);
  });

  it('tracks size', () => {
    const h = new MinHeap();
    h.push(1);
    h.push(2);
    expect(h.size).toBe(2);
    h.pop();
    expect(h.size).toBe(1);
  });

  it('handles duplicates', () => {
    const h = new MinHeap();
    [2, 2, 1, 1].forEach((n) => h.push(n));
    expect([h.pop(), h.pop(), h.pop(), h.pop()]).toEqual([1, 1, 2, 2]);
  });

  it('handles negatives', () => {
    const h = new MinHeap();
    [3, -5, 0, -1].forEach((n) => h.push(n));
    expect([h.pop(), h.pop(), h.pop(), h.pop()]).toEqual([-5, -1, 0, 3]);
  });

  it('handles already-sorted and reverse-sorted input', () => {
    for (const input of [
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ]) {
      const h = new MinHeap();
      input.forEach((n) => h.push(n));
      const out: number[] = [];
      while (h.size > 0) out.push(h.pop()!);
      expect(out).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it('matches a sort on randomised input', () => {
    // Catches siftDown swapping with the wrong child — a bug that only shows
    // up once the tree is more than two levels deep.
    for (let trial = 0; trial < 20; trial += 1) {
      const input = Array.from({ length: 60 }, () => Math.floor(Math.random() * 100) - 50);
      const h = new MinHeap();
      input.forEach((n) => h.push(n));

      const drained: number[] = [];
      while (h.size > 0) drained.push(h.pop()!);

      expect(drained).toEqual([...input].sort((a, b) => a - b));
    }
  });

  it('supports interleaved pushes and pops', () => {
    const h = new MinHeap();
    h.push(5);
    h.push(3);
    expect(h.pop()).toBe(3);
    h.push(4);
    h.push(1);
    expect(h.pop()).toBe(1);
    expect(h.pop()).toBe(4);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBeUndefined();
  });
});

describe('topKFrequent', () => {
  it('handles the prompt examples', () => {
    expect(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort((a, b) => a - b)).toEqual([1, 2]);
    expect(topKFrequent([1], 1)).toEqual([1]);
  });

  it('handles k equal to the number of distinct values', () => {
    expect(topKFrequent([1, 2, 3], 3).sort((a, b) => a - b)).toEqual([1, 2, 3]);
  });

  it('handles all values identical', () => {
    expect(topKFrequent([7, 7, 7], 1)).toEqual([7]);
  });

  it('handles negatives and zero', () => {
    expect(topKFrequent([-1, -1, 0, 0, 0, 5], 2).sort((a, b) => a - b)).toEqual([-1, 0]);
  });

  it('handles k = 0 and empty input', () => {
    expect(topKFrequent([1, 2], 0)).toEqual([]);
    expect(topKFrequent([], 3)).toEqual([]);
  });

  it('returns exactly k elements', () => {
    const nums = [1, 1, 2, 2, 3, 3, 4];
    expect(topKFrequent(nums, 2)).toHaveLength(2);
  });
});

describe('findKthLargest', () => {
  it('handles the prompt examples', () => {
    expect(findKthLargest([3, 2, 1, 5, 6, 4], 2)).toBe(5);
    expect(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toBe(4);
  });

  it('counts duplicates separately', () => {
    expect(findKthLargest([3, 3, 1], 2)).toBe(3);
    expect(findKthLargest([2, 2, 2], 3)).toBe(2);
  });

  it('handles k = 1 (the maximum)', () => {
    expect(findKthLargest([1, 9, 5], 1)).toBe(9);
  });

  it('handles k equal to the length (the minimum)', () => {
    expect(findKthLargest([1, 9, 5], 3)).toBe(1);
  });

  it('returns undefined for out-of-range k', () => {
    expect(findKthLargest([1, 2], 5)).toBeUndefined();
    expect(findKthLargest([1, 2], 0)).toBeUndefined();
    expect(findKthLargest([], 1)).toBeUndefined();
  });

  it('agrees with a sort on randomised input', () => {
    for (let trial = 0; trial < 20; trial += 1) {
      const nums = Array.from({ length: 40 }, () => Math.floor(Math.random() * 100));
      const k = 1 + Math.floor(Math.random() * nums.length);
      const expected = [...nums].sort((a, b) => b - a)[k - 1];
      expect(findKthLargest(nums, k)).toBe(expected);
    }
  });
});
