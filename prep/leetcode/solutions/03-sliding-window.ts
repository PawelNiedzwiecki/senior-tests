/**
 * SOLUTIONS — Sliding window
 */

/**
 * PROBLEM 1 — Minimum window substring
 *
 * COMPLEXITY: O(|s| + |t|) time — each index is added once and removed once —
 * and O(|s| + |t|) space for the two maps.
 *
 * NARRATION:
 *   "A shortest-window problem, so: grow right until the window is valid, then
 *    record and shrink from the left while it stays valid. The state I need is
 *    a required-count map plus a single integer for how many characters are
 *    still missing, so validity is an O(1) check rather than a map scan."
 *
 * `missing` IS THE TRICK. Comparing two maps on every step would be O(26) or
 * worse per index; one counter makes validity a single comparison. It counts
 * characters including duplicates, so 'aa' needs two.
 *
 * THE `> 0` GUARDS are the whole correctness argument:
 *   · on add, `need.get(c)! > 0` means this character was still wanted, so the
 *     deficit shrinks. A surplus copy pushes the count negative instead.
 *   · on remove, the count going back above 0 is what re-creates a deficit.
 *
 * RECORD BEFORE SHRINKING, inside the while loop — that is what makes the
 * answer minimal rather than merely valid.
 */
export function minWindow(s: string, t: string): string {
  if (t.length === 0 || s.length < t.length) return '';

  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

  let missing = t.length; // characters still owed, duplicates counted
  let left = 0;
  let bestStart = 0;
  let bestLength = Infinity;

  for (let right = 0; right < s.length; right += 1) {
    const c = s[right]!;
    const owed = need.get(c);
    if (owed !== undefined) {
      if (owed > 0) missing -= 1; // it was genuinely wanted
      need.set(c, owed - 1); // may go negative: that is surplus
    }

    while (missing === 0) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }

      const out = s[left]!;
      const outOwed = need.get(out);
      if (outOwed !== undefined) {
        need.set(out, outOwed + 1);
        if (outOwed + 1 > 0) missing += 1; // crossed back into deficit
      }
      left += 1;
    }
  }

  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}

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
