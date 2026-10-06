/**
 * SOLUTIONS — Sliding window
 */

/**
 * PROBLEM 2 — Longest repeating character replacement
 *
 * COMPLEXITY: O(n) time, O(1) space — the frequency table is 26 entries.
 *
 * NARRATION:
 *   "The cost of a window is its length minus the count of its most frequent
 *    character: those are the characters I would have to change. So the window
 *    is legal while that cost is at most k. Longest-window variant, so I shrink
 *    only while illegal and record after."
 *
 * WHY `maxCount` IS NEVER RECOMPUTED: it can become stale (larger than the true
 * maximum in the current window) after a shrink. That is safe. A stale maximum
 * only makes the legality test more permissive, which keeps the window from
 * shrinking — but the recorded best is `right - left + 1`, and the window only
 * ever grew past a length that was genuinely achievable at the moment
 * `maxCount` was last set truthfully. So the answer can never be inflated, and
 * the loop stays O(n) instead of O(26n). Be ready to say this; it is the reason
 * the problem is asked.
 *
 * THE SHRINK IS AN `if`, NOT A `while`, in this formulation: the window grows
 * by one per iteration, so at most one shrink is ever needed to restore
 * legality. A `while` is equally correct and costs nothing.
 */
export function characterReplacement(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let maxCount = 0; // deliberately not recomputed on shrink
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const c = s[right]!;
    const next = (counts.get(c) ?? 0) + 1;
    counts.set(c, next);
    maxCount = Math.max(maxCount, next);

    // Illegal: more than k characters in the window are not the majority one.
    while (right - left + 1 - maxCount > k) {
      const out = s[left]!;
      counts.set(out, counts.get(out)! - 1);
      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
