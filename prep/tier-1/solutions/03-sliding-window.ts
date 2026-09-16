/**
 * SOLUTIONS — Sliding window
 */

/**
 * EXAM 1 — Longest substring without repeating characters
 *
 * COMPLEXITY: O(n) time, O(min(n, alphabet)) space.
 *
 * NARRATION:
 *   "Longest-window variant, so I grow right and only move left far enough to
 *    make the window legal again. Instead of stepping left one at a time I
 *    keep the last index of each character and jump straight past the previous
 *    occurrence."
 *
 * THE GUARD IS THE WHOLE EXAM: `Math.max(left, seen + 1)`. The map keeps
 * entries for characters that have already fallen out of the window, so a
 * repeat can report an index BEHIND left. Without the max, 'abba' reports 3 —
 * left jumps back to 1 when the final 'a' is seen, and the window silently
 * contains a duplicate 'b'.
 *
 * The one-at-a-time variant (delete from a Set while the new character is
 * present) is equally correct and slightly easier to defend; the jump version
 * is what people write, so know why it needs the guard.
 */
export function lengthOfLongestSubstring(s: string): number {
  const lastIndex = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const c = s[right]!;
    const seen = lastIndex.get(c);
    if (seen !== undefined) left = Math.max(left, seen + 1); // never backwards
    lastIndex.set(c, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}

/**
 * EXAM 2 — Maximum average subarray of size k
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "Fixed width, so the window never shrinks conditionally — each step adds
 *    the entering value and subtracts the leaving one. That also means
 *    negatives are harmless here: I'm not relying on any monotonicity, only on
 *    the sum being updatable in O(1)."
 *
 * COMPARE SUMS, DIVIDE ONCE. Dividing inside the loop does n extra divisions
 * and introduces rounding differences between candidates that should compare
 * exactly. Mentioning it reads as someone who has been bitten by float
 * comparisons.
 *
 * SEED WITH THE FIRST k rather than special-casing inside the loop; the two
 * phases are clearer than one loop with a conditional.
 */
export function findMaxAverage(nums: number[], k: number): number {
  let sum = 0;
  for (let i = 0; i < k; i += 1) sum += nums[i]!;

  let best = sum;
  for (let right = k; right < nums.length; right += 1) {
    sum += nums[right]! - nums[right - k]!;
    if (sum > best) best = sum;
  }

  return best / k;
}

/**
 * EXAM 3 — Longest substring with at most k distinct characters
 *
 * COMPLEXITY: O(n) time, O(k) space — the map holds at most k + 1 keys.
 *
 * NARRATION:
 *   "Longest variant with a count map as the window state. Distinctness is
 *    `map.size`, so the window is illegal while size exceeds k, and I shrink
 *    from the left until it isn't. Each index enters and leaves once: O(n)."
 *
 * DELETE AT ZERO. If you leave a zero-count entry in the map, `size` counts a
 * character the window no longer contains, the shrink loop runs too long and
 * every answer comes back short. This is the single bug in this problem.
 *
 * k = 0 falls out for free: the first character makes size 1 > 0, the window
 * shrinks to empty, and the best stays 0 — no special case needed.
 *
 * FOLLOW-UP: "exactly k distinct" = atMost(k) - atMost(k - 1). Volunteer it.
 */
export function longestKDistinct(s: string, k: number): number {
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const c = s[right]!;
    counts.set(c, (counts.get(c) ?? 0) + 1);

    while (counts.size > k) {
      const out = s[left]!;
      const remaining = counts.get(out)! - 1;
      if (remaining === 0) counts.delete(out);
      else counts.set(out, remaining);
      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}

/**
 * EXAM 4 — Minimum size subarray sum
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "Shortest variant, so the loop inverts: grow right, and WHILE the window
 *    is valid, record it and then shrink. Recording before the shrink is what
 *    makes the result minimal — shrinking first would step past the best
 *    window."
 *
 * "ALL POSITIVE" IS THE LICENCE. Adding an element can only increase the sum
 * and removing one can only decrease it, which is what makes "shrink while
 * still ≥ target" safe. Say this unprompted: with negatives the window
 * argument dies and you would reach for prefix sums plus a monotonic deque.
 *
 * Infinity as the sentinel, converted to 0 at the end, avoids a "found
 * anything yet" flag.
 */
export function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right]!;

    while (sum >= target) {
      best = Math.min(best, right - left + 1); // record BEFORE shrinking
      sum -= nums[left]!;
      left += 1;
    }
  }

  return best === Infinity ? 0 : best;
}

/**
 * EXAM 5 — Find all anagrams in a string
 *
 * COMPLEXITY: O(|s|) time, O(1) space for a fixed alphabet.
 *
 * NARRATION:
 *   "A fixed window of width |p|. Comparing two frequency maps every step
 *    would be O(26) per index; instead I keep one integer — how many distinct
 *    characters currently have EXACTLY the required count — and update it only
 *    for the two characters that change."
 *
 * THE TWO UPDATES, slowly, because this is where it goes wrong:
 *   · entering c: increment its count; if it now equals the need, `matched`
 *     goes up; if it just PASSED the need (was equal, now one more), matched
 *     goes down.
 *   · leaving c: decrement; if it WAS equal, matched goes down; if it now
 *     equals the need (we were over and came back), matched goes up.
 *
 * A window is an anagram exactly when `matched === need.size`. Characters not
 * in p have a need of 0 and never contribute to `matched` — their mere
 * presence pushes some other count off, which is what excludes the window.
 */
export function findAnagrams(s: string, p: string): number[] {
  const out: number[] = [];
  if (p.length === 0 || s.length < p.length) return out;

  const need = new Map<string, number>();
  for (const c of p) need.set(c, (need.get(c) ?? 0) + 1);

  const window = new Map<string, number>();
  let matched = 0;

  for (let right = 0; right < s.length; right += 1) {
    const entering = s[right]!;
    if (need.has(entering)) {
      const count = (window.get(entering) ?? 0) + 1;
      window.set(entering, count);
      if (count === need.get(entering)!) matched += 1;
      else if (count === need.get(entering)! + 1) matched -= 1;
    }

    const leftEdge = right - p.length;
    if (leftEdge >= 0) {
      const leaving = s[leftEdge]!;
      if (need.has(leaving)) {
        const count = window.get(leaving)! - 1;
        window.set(leaving, count);
        if (count === need.get(leaving)!) matched += 1;
        else if (count === need.get(leaving)! - 1) matched -= 1;
      }
    }

    if (right >= p.length - 1 && matched === need.size) out.push(right - p.length + 1);
  }

  return out;
}
