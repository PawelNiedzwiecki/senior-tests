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

