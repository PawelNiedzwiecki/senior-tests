/**
 * PATTERN 10 — Monotonic stack / deque
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: CATALOGUE.md § 10
 *
 * `prep/algo/drills/05-stack-queue.ts` covers the monotonic STACK (next greater
 * element). This module covers the two harder relatives: the monotonic DEQUE,
 * and the stack applied to a circular array and to a histogram.
 *
 * THE INVARIANT, in one line: the structure holds items still waiting for their
 * answer, kept in sorted order. Whatever breaks the order resolves them.
 *
 * THE COMPLEXITY ARGUMENT you must be able to make: the nested `while` looks
 * quadratic, but each index is pushed exactly once and popped at most once, so
 * total work is bounded by 2n. Amortised O(n).
 */

/**
 * PROBLEM 1 — Sliding window maximum
 * Return the maximum of every contiguous window of size k.
 *
 *   maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3) → [3, 3, 5, 5, 6, 7]
 *
 * TARGET: O(n) time, O(k) space.
 * WHY NOT A HEAP: a max-heap gives O(n log k) but cannot cheaply REMOVE the
 *       element leaving the window — you would need a lazy-deletion scheme.
 *       The deque handles expiry in O(1) because it stores indices.
 * HINT: keep a deque of INDICES with their values decreasing.
 *       Each step: (1) drop the front if it has expired (index <= i - k);
 *       (2) pop from the back while the back's value <= the incoming value —
 *       those can never be the max again, because the newcomer is bigger AND
 *       outlives them; (3) push i; (4) once i >= k - 1, the front is the answer.
 */
export function maxSlidingWindow(_nums: number[], _k: number): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Next greater element in a CIRCULAR array
 * For each element, the next greater one searching forwards and wrapping
 * around. -1 if none exists.
 *
 *   nextGreaterCircular([1, 2, 1])    → [2, -1, 2]
 *   nextGreaterCircular([5, 4, 3, 2, 1]) → [-1, 5, 5, 5, 5]
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: the circular part is one line — iterate `i` from 0 to 2n-1 and use
 *       `i % n` for indexing. Two passes over the array let every element see
 *       everything after it, including the wrap. Only record an answer during
 *       the first pass conceptually; in practice, only push indices while
 *       `i < n`.
 */
export function nextGreaterCircular(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Largest rectangle in a histogram  ★ the hard one ★
 * Bars of width 1 and the given heights. Find the largest rectangular area.
 *
 *   largestRectangleArea([2, 1, 5, 6, 2, 3]) → 10   (heights 5 and 6, width 2)
 *   largestRectangleArea([2, 4])             → 4
 *
 * TARGET: O(n) time, O(n) space. Brute force is O(n²).
 * THE INSIGHT: every rectangle is limited by its SHORTEST bar. So for each bar,
 *       ask "how far left and right can I extend while staying at least this
 *       tall?" A monotonic increasing stack answers both at once: when a bar is
 *       popped, the incoming bar is its right boundary and the new stack top is
 *       its left boundary.
 * HINT: push a sentinel height of 0 at the end so the stack is guaranteed to
 *       drain. Width when popping index j with stack top t is `i - t - 1`, and
 *       `i` when the stack empties.
 */
export function largestRectangleArea(_heights: number[]): number {
  throw new Error('Not implemented');
}
