/**
 * DRILL 4.3 — Windowing maths for a virtual list
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 30 min      DIFFICULTY: ●●●○○ (fixed) / ●●●●○ (variable)
 *
 * WHAT YOU'RE BUILDING
 * A document with 50,000 translated segments cannot put 50,000 nodes in the
 * DOM. Virtualisation renders only what is on screen — and the entire idea
 * reduces to arithmetic you can unit test without a browser.
 *
 * PART 1 — FIXED HEIGHTS
 *   startIndex  first index to render (visible minus overscan, clamped)
 *   endIndex    last index to render, INCLUSIVE
 *   offsetY     translateY for the rendered slab
 *   totalHeight the spacer height that gives the scrollbar its size
 *
 * PART 2 — VARIABLE HEIGHTS
 *   `buildOffsets` turns per-item heights into a prefix-sum array of length
 *   n + 1, where `offsets[i]` is the top of item `i` and `offsets[n]` is the
 *   total. `findIndexAtOffset` then binary-searches it — O(log n), because
 *   doing it linearly on every scroll event is exactly the frame budget you
 *   were trying to save.
 *
 * WHY IT'S ASKED
 * It is the one performance topic that is pure logic rather than profiling
 * anecdotes, so it can be assessed in 30 minutes. The binary search is a
 * legitimate algorithms question hiding inside a UI problem — and getting its
 * boundary conditions right under time pressure is the real test.
 *
 * HINTS
 *   1. First visible index: `floor(scrollTop / itemHeight)`.
 *      Last visible index: `ceil((scrollTop + viewportHeight) / itemHeight) - 1`.
 *      Draw two items and a viewport edge on paper before you trust either.
 *   2. Clamp AFTER applying overscan, never before.
 *   3. `offsetY` must use the overscanned `startIndex`, or the list jitters as
 *      you scroll — a classic off-by-overscan bug.
 *   4. For the binary search: find the largest `i` with `offsets[i] <= scrollTop`.
 *      Write the invariant down before the loop.
 *
 * STRETCH
 *   a. Heights measured after render — how do you correct scroll position when
 *      an estimate was wrong?
 *   b. `content-visibility: auto` and `contain-intrinsic-size` do a lot of this
 *      natively now. When is that enough?
 *   c. Why does a virtual list break Ctrl+F, and what can you do about it?
 *   d. Horizontal virtualisation with RTL — what changes?
 */

export interface WindowRange {
  startIndex: number;
  /** Inclusive. `-1` when there is nothing to render. */
  endIndex: number;
  offsetY: number;
  totalHeight: number;
}

export interface FixedWindowOptions {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  scrollTop: number;
  /** Extra rows rendered above and below. Default 0. */
  overscan?: number;
}

export function computeFixedWindow(_options: FixedWindowOptions): WindowRange {
  throw new Error('Not implemented'); // TODO
}

/** Prefix sums: length `heights.length + 1`, `offsets[0] === 0`. */
export function buildOffsets(_heights: readonly number[]): number[] {
  throw new Error('Not implemented'); // TODO
}

/** Largest `i` where `offsets[i] <= scrollTop`, clamped to a valid item index. */
export function findIndexAtOffset(_offsets: readonly number[], _scrollTop: number): number {
  throw new Error('Not implemented'); // TODO
}

export interface VariableWindowOptions {
  offsets: readonly number[];
  viewportHeight: number;
  scrollTop: number;
  overscan?: number;
}

export function computeVariableWindow(_options: VariableWindowOptions): WindowRange {
  throw new Error('Not implemented'); // TODO
}
