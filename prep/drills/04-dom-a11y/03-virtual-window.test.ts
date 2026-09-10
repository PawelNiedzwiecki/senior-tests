import { describe, it, expect } from 'vitest';
import {
  computeFixedWindow,
  buildOffsets,
  findIndexAtOffset,
  computeVariableWindow,
} from '@impl/04-dom-a11y/03-virtual-window.ts';

describe('computeFixedWindow', () => {
  const base = { itemCount: 1000, itemHeight: 40, viewportHeight: 400, scrollTop: 0 };

  it('renders exactly the visible rows at the top', () => {
    const result = computeFixedWindow(base);
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(9); // 400 / 40 = 10 rows, 0..9
    expect(result.offsetY).toBe(0);
  });

  it('reports the total scrollable height', () => {
    expect(computeFixedWindow(base).totalHeight).toBe(40_000);
  });

  it('includes partially visible rows at both edges', () => {
    const result = computeFixedWindow({ ...base, scrollTop: 100 });
    expect(result.startIndex).toBe(2); // floor(100 / 40)
    expect(result.endIndex).toBe(12); // ceil(500 / 40) - 1
  });

  it('offsets the slab by the start index', () => {
    const result = computeFixedWindow({ ...base, scrollTop: 400 });
    expect(result.startIndex).toBe(10);
    expect(result.offsetY).toBe(400);
  });

  it('applies overscan on both sides', () => {
    const result = computeFixedWindow({ ...base, scrollTop: 400, overscan: 3 });
    expect(result.startIndex).toBe(7);
    expect(result.endIndex).toBe(22); // 19 + 3
    // The offset must follow the overscanned start, not the visible start.
    expect(result.offsetY).toBe(280);
  });

  it('clamps overscan at the top', () => {
    const result = computeFixedWindow({ ...base, scrollTop: 0, overscan: 5 });
    expect(result.startIndex).toBe(0);
    expect(result.offsetY).toBe(0);
  });

  it('clamps overscan at the bottom', () => {
    const result = computeFixedWindow({
      ...base,
      itemCount: 12,
      scrollTop: 80,
      overscan: 5,
    });
    expect(result.endIndex).toBe(11);
  });

  it('handles an empty list', () => {
    const result = computeFixedWindow({ ...base, itemCount: 0 });
    expect(result).toEqual({ startIndex: 0, endIndex: -1, offsetY: 0, totalHeight: 0 });
  });

  it('handles a list shorter than the viewport', () => {
    const result = computeFixedWindow({ ...base, itemCount: 3 });
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(2);
    expect(result.totalHeight).toBe(120);
  });

  it('does not run past the end when scrolled to the bottom', () => {
    const result = computeFixedWindow({ ...base, itemCount: 20, scrollTop: 400 });
    expect(result.endIndex).toBe(19);
  });

  it('treats a negative scrollTop as the top (elastic overscroll)', () => {
    const result = computeFixedWindow({ ...base, scrollTop: -50 });
    expect(result.startIndex).toBe(0);
    expect(result.offsetY).toBe(0);
  });
});

describe('buildOffsets', () => {
  it('produces prefix sums with a leading zero', () => {
    expect(buildOffsets([10, 20, 30])).toEqual([0, 10, 30, 60]);
  });

  it('handles an empty list', () => {
    expect(buildOffsets([])).toEqual([0]);
  });

  it('handles a single item', () => {
    expect(buildOffsets([42])).toEqual([0, 42]);
  });
});

describe('findIndexAtOffset', () => {
  // items: 0 → [0,10), 1 → [10,30), 2 → [30,60), 3 → [60,100)
  const offsets = [0, 10, 30, 60, 100];

  it('finds the item at an exact boundary', () => {
    expect(findIndexAtOffset(offsets, 0)).toBe(0);
    expect(findIndexAtOffset(offsets, 10)).toBe(1);
    expect(findIndexAtOffset(offsets, 30)).toBe(2);
    expect(findIndexAtOffset(offsets, 60)).toBe(3);
  });

  it('finds the item mid-range', () => {
    expect(findIndexAtOffset(offsets, 5)).toBe(0);
    expect(findIndexAtOffset(offsets, 29)).toBe(1);
    expect(findIndexAtOffset(offsets, 31)).toBe(2);
    expect(findIndexAtOffset(offsets, 99)).toBe(3);
  });

  it('clamps below zero', () => {
    expect(findIndexAtOffset(offsets, -20)).toBe(0);
  });

  it('clamps past the end', () => {
    expect(findIndexAtOffset(offsets, 1000)).toBe(3);
  });

  it('handles an empty list', () => {
    expect(findIndexAtOffset([0], 0)).toBe(0);
  });

  it('agrees with a linear scan across the whole range', () => {
    const heights = Array.from({ length: 200 }, (_, i) => 10 + (i % 7) * 3);
    const built = buildOffsets(heights);

    const linear = (scrollTop: number) => {
      let index = 0;
      while (index < heights.length - 1 && built[index + 1]! <= scrollTop) index += 1;
      return index;
    };

    for (let scrollTop = 0; scrollTop < built[built.length - 1]!; scrollTop += 7) {
      expect(findIndexAtOffset(built, scrollTop)).toBe(linear(scrollTop));
    }
  });
});

describe('computeVariableWindow', () => {
  const offsets = buildOffsets([50, 100, 25, 200, 75, 150]); // total 600

  it('renders the items overlapping the viewport', () => {
    // tops: [0, 50, 150, 175, 375, 450], total 600. Viewport is [0, 200),
    // so item 3 (starting at 175) is partially visible and must be rendered.
    const result = computeVariableWindow({ offsets, viewportHeight: 200, scrollTop: 0 });
    expect(result.startIndex).toBe(0);
    expect(result.endIndex).toBe(3);
    expect(result.offsetY).toBe(0);
    expect(result.totalHeight).toBe(600);
  });

  it('offsets by the start item’s position', () => {
    const result = computeVariableWindow({ offsets, viewportHeight: 200, scrollTop: 180 });
    expect(result.startIndex).toBe(3); // item 3 spans [175, 375)
    expect(result.offsetY).toBe(175);
  });

  it('applies and clamps overscan', () => {
    const result = computeVariableWindow({
      offsets,
      viewportHeight: 100,
      scrollTop: 180,
      overscan: 2,
    });
    expect(result.startIndex).toBe(1);
    expect(result.offsetY).toBe(50);
    expect(result.endIndex).toBe(5);
  });

  it('handles an empty list', () => {
    const result = computeVariableWindow({
      offsets: [0],
      viewportHeight: 200,
      scrollTop: 0,
    });
    expect(result).toEqual({ startIndex: 0, endIndex: -1, offsetY: 0, totalHeight: 0 });
  });
});
