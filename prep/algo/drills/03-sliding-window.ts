/**
 * MODULE 03 — Sliding window
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      DIFFICULTY: ●●●○○
 *
 * THE PATTERN
 * A contiguous range [left, right] that slides forward. Instead of recomputing
 * a summary for every subarray (O(n²) or worse), you update the summary
 * incrementally as the window moves: O(n).
 *
 * TWO SHAPES — know which one you are in:
 *
 *   FIXED SIZE k    right advances every step; left follows k behind.
 *                   "max sum of k consecutive", "average of every k".
 *
 *   VARIABLE SIZE   right always advances (grow); left advances only while
 *                   some invariant is violated (shrink).
 *                   "longest without repeats", "smallest sum ≥ target".
 *
 * THE VARIABLE-SIZE TEMPLATE — memorise this shape:
 *
 *   let left = 0;
 *   for (let right = 0; right < n; right++) {
 *     add(right);                     // grow
 *     while (invariantViolated()) {   // shrink — `while`, not `if`
 *       remove(left); left++;
 *     }
 *     best = compare(best, right - left + 1);
 *   }
 *
 * RECOGNITION CUES: "contiguous", "subarray", "substring", plus "longest",
 * "shortest", "at most k", "exactly k".
 * If the problem is NOT contiguous, this is the wrong pattern.
 *
 * COMPLEXITY ARGUMENT (say it — it is not obvious): the loop looks nested, but
 * `left` and `right` each advance at most n times over the whole run, so it is
 * O(n) total, not O(n²). This "amortised" argument is what is being tested.
 */

/**
 * PROBLEM 1 — Longest Substring Without Repeating Characters
 *
 *   lengthOfLongestSubstring('abcabcbb') → 3   ('abc')
 *   lengthOfLongestSubstring('bbbbb')    → 1   ('b')
 *   lengthOfLongestSubstring('pwwkew')   → 3   ('wke', not 'pwke' — contiguous)
 *
 * TARGET: O(n) time, O(min(n, alphabet)) space.
 * HINT: keep a Set of what is in the window. On a duplicate, shrink from the
 *       left until the duplicate is gone. `while`, not `if`.
 * FOLLOW-UP: with a Map of char → last index you can jump `left` straight past
 *       the duplicate instead of stepping. Same O(n), fewer operations.
 */
export function lengthOfLongestSubstring(_s: string): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Maximum Sum of a Fixed Window
 * Largest sum of any `k` consecutive elements. Return 0 if k is invalid
 * (k <= 0, or k > nums.length).
 *
 *   maxSubarraySum([2, 1, 5, 1, 3, 2], 3) → 9   (5 + 1 + 3)
 *   maxSubarraySum([1, 2], 5)             → 0
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: build the first window, then for each step add the entering element and
 *       subtract the leaving one. Do NOT re-sum the window each time — that is
 *       the O(n·k) mistake this problem exists to catch.
 */
export function maxSubarraySum(_nums: number[], _k: number): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Minimum Size Subarray Sum
 * Smallest length of a contiguous subarray whose sum is >= target.
 * Return 0 if none exists. All values are positive.
 *
 *   minSubArrayLen(7, [2, 3, 1, 2, 4, 3]) → 2   ([4, 3])
 *   minSubArrayLen(11, [1, 1, 1])         → 0
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: grow until the sum qualifies, then shrink while it STILL qualifies,
 *       recording the length each time. The shrink loop is where the answer
 *       actually gets found.
 * CLARIFYING QUESTION TO ASK: must the subarray be non-empty? If `target <= 0`
 *       the empty window trivially qualifies, and "0" would then be ambiguous
 *       between "length zero" and "no answer". These tests assume non-empty.
 * WHY "all values positive" MATTERS: with negatives, shrinking can increase the
 *       sum, so the window logic breaks and you need prefix sums instead. Say
 *       this out loud — spotting that the constraint is load-bearing is exactly
 *       the "handle constraints" signal they listed.
 */
export function minSubArrayLen(_target: number, _nums: number[]): number {
  throw new Error('Not implemented');
}
