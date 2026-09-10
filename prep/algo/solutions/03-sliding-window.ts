/**
 * SOLUTIONS 03 — Sliding window
 */

/**
 * PROBLEM 1 — Longest Substring Without Repeating Characters
 *
 * NARRATION:
 *   "Brute force checks every substring for uniqueness: O(n³), or O(n²) with a
 *    set per start. But if a window is valid, every prefix of it is valid too,
 *    so I never need to restart from scratch — I grow on the right and, when a
 *    duplicate arrives, shrink from the left just far enough. O(n)."
 *
 * COMPLEXITY: O(n) time — `left` and `right` each advance at most n times, so
 *             the inner `while` is amortised O(1). O(min(n, |alphabet|)) space.
 *
 * THE BUG: using `if` instead of `while` for the shrink. With 'abba', when the
 * second 'a' arrives you must shrink past 'b','b','a' — a single step leaves a
 * duplicate in the window.
 *
 * THE FASTER VARIANT is below. Note the `Math.max` on `left`: without it, a
 * duplicate that sits BEHIND the window drags `left` backwards and the window
 * grows to include repeats. 'abba' is exactly that case, which is why the test
 * for it exists.
 */
export function lengthOfLongestSubstring(s: string): number {
  const inWindow = new Set<string>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right]!;

    // `while`, not `if` — shrink until the duplicate is actually gone.
    while (inWindow.has(char)) {
      inWindow.delete(s[left]!);
      left += 1;
    }

    inWindow.add(char);
    best = Math.max(best, right - left + 1);
  }

  return best;
}

/** Jump-the-pointer variant: same O(n), fewer operations. */
export function lengthOfLongestSubstringFast(s: string): number {
  const lastIndex = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const previous = lastIndex.get(s[right]!);
    // Math.max stops a stale duplicate behind the window pulling `left` back.
    if (previous !== undefined) left = Math.max(left, previous + 1);

    lastIndex.set(s[right]!, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}

/**
 * PROBLEM 2 — Maximum Sum of a Fixed Window
 *
 * NARRATION:
 *   "Naively I'd sum each window: O(n·k). But consecutive windows overlap in
 *    k-1 elements, so I only need to add the entering element and subtract the
 *    leaving one. That's O(1) per step, O(n) overall."
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * GUARD THE INVALID k FIRST. `k > nums.length` and `k <= 0` both produce
 * nonsense otherwise — and note that returning 0 is a *decision*: for an
 * all-negative array a valid answer is negative, so 0 as "no answer" is only
 * unambiguous because we also return it for invalid input. In a real interview,
 * ask what should happen, or say you are returning 0 by convention.
 *
 * NEGATIVES ARE THE TRAP: initialise `best` from the first window, never from
 * 0 — otherwise `[-1,-2,-3]` returns 0, which is not a real window sum.
 */
export function maxSubarraySum(nums: number[], k: number): number {
  if (k <= 0 || k > nums.length) return 0;

  let windowSum = 0;
  for (let i = 0; i < k; i += 1) windowSum += nums[i]!;

  // Seed from the real first window, not 0 — negatives depend on it.
  let best = windowSum;

  for (let right = k; right < nums.length; right += 1) {
    windowSum += nums[right]! - nums[right - k]!;
    best = Math.max(best, windowSum);
  }

  return best;
}

/**
 * PROBLEM 3 — Minimum Size Subarray Sum
 *
 * NARRATION:
 *   "Grow the window until the sum reaches the target, then shrink from the
 *    left while it still qualifies — every shrink that stays valid gives a
 *    shorter answer. Because all values are positive, the sum is monotonic in
 *    the window size, which is exactly what makes the shrink safe."
 *
 * COMPLEXITY: O(n) time (amortised — each pointer advances ≤ n times).
 *             O(1) space.
 *
 * THE CONSTRAINT IS LOAD-BEARING. With negative values, removing an element can
 * INCREASE the sum, so "shrink while still valid" is no longer sound and the
 * whole pattern collapses. The correct tool then is prefix sums plus a
 * monotonic deque. Saying this unprompted is a strong "handles constraints"
 * signal — one of the four things DeepL named.
 *
 * SENTINEL: `Infinity` as the initial best, converted to 0 at the end, avoids
 * a separate "found anything?" flag.
 *
 * THE DEGENERATE CASE worth catching in framing: if `target <= 0`, the EMPTY
 * window already satisfies `sum >= target`, so an unguarded shrink loop reports
 * length 0 — which then collides with 0 meaning "no such subarray". Two
 * defensible readings, and this is exactly the kind of thing to raise as a
 * clarifying question:
 *   - "a subarray must be non-empty"  → answer is 1 (any single positive value)
 *   - "the empty subarray counts"     → answer is 0, and the sentinel needs to
 *                                       change to -1 to stay unambiguous
 * The `left <= right` guard below implements the first reading. Noticing the
 * collision at all is the point; picking either reading is fine if you say so.
 */
export function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let sum = 0;
  let best = Number.POSITIVE_INFINITY;

  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right]!;

    // Shrink while it STILL qualifies — that is where the minimum is found.
    // `left <= right` keeps the window non-empty; see the note above.
    while (sum >= target && left <= right) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left]!;
      left += 1;
    }
  }

  return best === Number.POSITIVE_INFINITY ? 0 : best;
}
