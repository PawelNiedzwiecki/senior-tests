/**
 * SOLUTIONS — Monotonic deque and stack
 */

/**
 * PROBLEM 1 — Sliding window maximum
 *
 * NARRATION:
 *   "Recomputing the max per window is O(n·k). A heap gets it to O(n log k) but
 *    can't cheaply evict the element leaving the window. A deque of indices, kept
 *    in decreasing value order, handles both: the front is always the current
 *    max, expiry is an index comparison, and a new element that's bigger than
 *    the back makes those entries permanently irrelevant — they're smaller AND
 *    they expire sooner."
 *
 * COMPLEXITY: O(n) time — each index enters and leaves the deque once.
 *             O(k) space.
 *
 * WHY `<=` AND NOT `<` when popping the back: with equal values, keeping the
 * older one buys nothing — it expires first and is no larger. Popping it keeps
 * the deque smaller and the answer is unchanged.
 *
 * INDICES, NOT VALUES, on the deque, because expiry is a question about
 * position. This is the same reason the monotonic stack stores indices.
 *
 * `shift()` IS O(n) IN JAVASCRIPT. At k ≤ a few thousand it is irrelevant, but
 * say so and offer the head-index alternative — used here to keep it honest.
 */
export function maxSlidingWindow(nums: number[], k: number): number[] {
  if (k <= 0 || k > nums.length) return [];

  const out: number[] = [];
  const deque: number[] = []; // indices; values strictly decreasing
  let head = 0; // index-based front, avoids O(n) shift()

  for (let i = 0; i < nums.length; i += 1) {
    // 1. Drop the front if it has slid out of the window.
    if (head < deque.length && deque[head]! <= i - k) head += 1;

    // 2. Anything smaller than the newcomer can never be the max again.
    while (deque.length > head && nums[deque[deque.length - 1]!]! <= nums[i]!) deque.pop();

    deque.push(i);

    // 3. Once the first full window exists, the front is its maximum.
    if (i >= k - 1) out.push(nums[deque[head]!]!);
  }

  return out;
}

/**
 * PROBLEM 2 — Next greater element, circular
 *
 * THE CIRCULAR TRICK: iterate `i` from 0 to 2n-1 and index with `i % n`. Two
 * laps guarantee every element sees the whole array ahead of it, including the
 * wrap. Only push indices during the first lap — on the second you are
 * resolving leftovers, not adding new questions.
 *
 * COMPLEXITY: O(n) time (2n iterations), O(n) space.
 *
 * `>` NOT `>=`: "greater" is strict, so an array of equal values answers -1
 * everywhere. That is the `[2,2,2]` test.
 */
export function nextGreaterCircular(nums: number[]): number[] {
  const n = nums.length;
  const answer = new Array<number>(n).fill(-1);
  const waiting: number[] = []; // indices with decreasing values

  for (let i = 0; i < 2 * n; i += 1) {
    const value = nums[i % n]!;

    while (waiting.length > 0 && nums[waiting[waiting.length - 1]!]! < value) {
      answer[waiting.pop()!] = value;
    }

    // Only the first lap asks questions; the second only answers them.
    if (i < n) waiting.push(i);
  }

  return answer;
}

/**
 * PROBLEM 3 — Largest rectangle in a histogram
 *
 * THE INSIGHT, said first:
 *   "Every rectangle is capped by its shortest bar. So for each bar I want the
 *    widest span where it IS the shortest — that is, how far left and right I
 *    can go before hitting something shorter. An increasing monotonic stack
 *    gives me both boundaries at the moment I pop: the incoming bar is the
 *    right boundary, and whatever is now on top is the left."
 *
 * COMPLEXITY: O(n) time (each index pushed and popped once), O(n) space.
 *
 * THE SENTINEL — appending a height of 0 forces every remaining bar to be
 * popped, so the drain loop is not duplicated after the main loop. Cheap, and
 * it removes a whole block of near-identical code.
 *
 * THE WIDTH FORMULA is where this problem is won or lost:
 *   width = stack.length === 0 ? i : i - stack[top] - 1
 * When the stack empties, the popped bar extended all the way back to index 0,
 * so the width is `i`. Otherwise it is bounded by the bar now on top, exclusive
 * on both ends — hence the `- 1`. Trace `[2, 1]` by hand once and it sticks.
 */
export function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // indices, heights increasing
  let best = 0;

  // The 0 sentinel guarantees the stack drains inside the loop.
  for (let i = 0; i <= heights.length; i += 1) {
    const current = i === heights.length ? 0 : heights[i]!;

    while (stack.length > 0 && heights[stack[stack.length - 1]!]! >= current) {
      const height = heights[stack.pop()!]!;
      const width = stack.length === 0 ? i : i - stack[stack.length - 1]! - 1;
      best = Math.max(best, height * width);
    }

    stack.push(i);
  }

  return best;
}
