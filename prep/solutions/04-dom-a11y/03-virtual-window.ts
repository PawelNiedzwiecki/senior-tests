/**
 * SOLUTION 4.3 — Windowing maths for a virtual list
 *
 * Talking points:
 *
 * 1. THE WHOLE TECHNIQUE IN ONE SENTENCE: render a small slab of rows,
 *    translate it to where those rows would be, and give the scroll container
 *    a spacer of the full height so the scrollbar tells the truth. Say that
 *    before writing anything — it frames every number that follows.
 *
 * 2. THE TWO FORMULAS, AND WHY THEY DIFFER.
 *      first = floor(scrollTop / h)                       — the row the top edge is inside
 *      last  = ceil((scrollTop + viewportHeight) / h) - 1  — the row the bottom edge is inside
 *    `floor` for the top and `ceil - 1` for the bottom is what includes the
 *    partially visible rows at both edges. Using `floor` for both drops the
 *    bottom row and you get a one-row gap while scrolling.
 *
 * 3. CLAMP AFTER OVERSCAN. Overscan first, clamp second. Clamping first lets
 *    the overscan push the index negative again, which reads as `undefined`
 *    from your items array and renders blank rows.
 *
 * 4. `offsetY` FOLLOWS THE OVERSCANNED START. If you translate by the *visible*
 *    start while rendering from the overscanned start, every row is drawn
 *    `overscan * itemHeight` too low. It looks like jitter and it is one of
 *    the two bugs everybody ships in a hand-rolled virtual list.
 *
 * 5. WHY BINARY SEARCH. Scroll events fire at up to one per frame; a linear
 *    scan is O(n) per event, so at 50k items you have spent the frame budget
 *    finding the first row. `findIndexAtOffset` is O(log n) — about 16 steps
 *    for 50k. State the invariant out loud while writing it ("`lo` is always a
 *    valid answer, `hi` is always past it"), because boundary-condition
 *    reasoning is exactly what the interviewer is watching for.
 *
 * 6. THE PART THIS DOES NOT SOLVE: heights you cannot know before render. The
 *    real answer is estimate, measure after paint, patch the offsets, and
 *    adjust `scrollTop` by the delta if the correction was above the viewport —
 *    otherwise the content jumps under the user's cursor. Mentioning the
 *    scroll-anchoring correction is what shows you have actually shipped one.
 *
 * 7. IN PRODUCTION use TanStack Virtual or react-virtuoso. And check first
 *    whether `content-visibility: auto` with `contain-intrinsic-size` is
 *    enough — it is browser-native, keeps Ctrl+F working, and is often all a
 *    long document needs.
 */

export interface WindowRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
}

const EMPTY: WindowRange = { startIndex: 0, endIndex: -1, offsetY: 0, totalHeight: 0 };

export interface FixedWindowOptions {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function computeFixedWindow(options: FixedWindowOptions): WindowRange {
  const { itemCount, itemHeight, viewportHeight, overscan = 0 } = options;
  if (itemCount === 0) return EMPTY;

  // Elastic overscroll can hand you a negative scrollTop.
  const scrollTop = Math.max(0, options.scrollTop);

  const firstVisible = Math.floor(scrollTop / itemHeight);
  const lastVisible = Math.ceil((scrollTop + viewportHeight) / itemHeight) - 1;

  // Overscan first, clamp second.
  const startIndex = Math.max(0, firstVisible - overscan);
  const endIndex = Math.min(itemCount - 1, lastVisible + overscan);

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    totalHeight: itemCount * itemHeight,
  };
}

export function buildOffsets(heights: readonly number[]): number[] {
  const offsets = new Array<number>(heights.length + 1);
  offsets[0] = 0;
  for (let i = 0; i < heights.length; i += 1) {
    offsets[i + 1] = offsets[i]! + heights[i]!;
  }
  return offsets;
}

export function findIndexAtOffset(offsets: readonly number[], scrollTop: number): number {
  const itemCount = offsets.length - 1;
  if (itemCount <= 0) return 0;

  const target = Math.max(0, scrollTop);

  // Invariant: `lo` is always a valid answer; `hi` is always one past it.
  let lo = 0;
  let hi = itemCount - 1;

  while (lo < hi) {
    // Bias up, so `lo = mid` cannot loop forever when hi === lo + 1.
    const mid = Math.ceil((lo + hi) / 2);
    if (offsets[mid]! <= target) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }

  return lo;
}

export interface VariableWindowOptions {
  offsets: readonly number[];
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function computeVariableWindow(options: VariableWindowOptions): WindowRange {
  const { offsets, viewportHeight, overscan = 0 } = options;
  const itemCount = offsets.length - 1;
  if (itemCount <= 0) return EMPTY;

  const scrollTop = Math.max(0, options.scrollTop);

  const firstVisible = findIndexAtOffset(offsets, scrollTop);
  const lastVisible = findIndexAtOffset(offsets, scrollTop + viewportHeight - 1);

  const startIndex = Math.max(0, firstVisible - overscan);
  const endIndex = Math.min(itemCount - 1, lastVisible + overscan);

  return {
    startIndex,
    endIndex,
    offsetY: offsets[startIndex]!,
    totalHeight: offsets[itemCount]!,
  };
}
