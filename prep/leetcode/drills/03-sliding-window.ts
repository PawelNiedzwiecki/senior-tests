/**
 * PATTERN 03 — Sliding window                            [LeetCode 76, 424]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 3
 *
 * THE PATTERN
 * A window [left, right] over a contiguous run. `right` always advances; `left`
 * advances only to restore validity. Each index enters once and leaves once, so
 * two nested-looking loops still cost O(n) total. That amortised argument is
 * the thing to say out loud — the code looks quadratic and is not.
 *
 * THE TELL
 *   "contiguous subarray" / "substring"  +  longest / shortest / at most K
 *
 * WHEN IT IS VALID — and this is the trap
 * Growing the window must move the quantity you care about MONOTONICALLY in
 * one direction, and shrinking must move it back. With positive numbers, a
 * longer window means a larger sum, so "shrink while invalid" is sound. Allow
 * negatives and that collapses — then you want prefix sums (§ 4), not a window.
 *
 * THE TWO VARIANTS
 *   SHRINK-TO-VALID (shortest)  grow; while valid, record and shrink
 *   SHRINK-TO-LEGAL (longest)   grow; while ILLEGAL, shrink; then record
 * Mixing them up is the single most common bug in this pattern.
 *
 * TEMPLATE (longest)
 *   let left = 0;
 *   for (let right = 0; right < n; right += 1) {
 *     add(nums[right]);
 *     while (!legal()) { remove(nums[left]); left += 1; }
 *     best = Math.max(best, right - left + 1);
 *   }
 *
 * COST — O(n) time; space is whatever the window state needs (often O(k)).
 */

/**
 * PROBLEM 1 — Minimum window substring                           [LeetCode 76]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the SHORTEST substring of `s` containing every character of `t`,
 * INCLUDING duplicates. Return '' if there is none. If several are tied, any
 * one of them is acceptable — the tests accept any valid answer of minimum
 * length.
 *
 *   minWindow('ADOBECODEBANC', 'ABC')  → 'BANC'
 *   minWindow('a', 'a')                → 'a'
 *   minWindow('a', 'aa')               → ''      (only one 'a' available)
 *
 * TARGET: O(|s| + |t|) time, O(|s| + |t|) space.
 *
 * THIS IS THE HARDEST WINDOW PROBLEM ASKED AT SCALE, and it is asked because
 *       the bookkeeping separates people. Get the state right before you write
 *       the loop.
 *
 * THE STATE: a `need` map of char → required count, and a single integer
 *       `missing` — how many characters (counting duplicates) the window still
 *       lacks. Decrement `missing` only when the added character was actually
 *       still needed, i.e. when its remaining requirement was positive.
 *
 * THE LOOP: this is the SHRINK-TO-VALID variant. Grow right; while the window
 *       is valid (`missing === 0`), record it if it is the best so far and then
 *       shrink from the left. Recording BEFORE shrinking is what makes it
 *       minimal.
 *
 * WATCH: the counter for a character can go negative — that is not a bug, it
 *       records surplus, and a shrink only turns the window invalid again when
 *       the count crosses back above zero.
 */
export function minWindow(_s: string, _t: string): string {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Longest repeating character replacement            [LeetCode 424]
 * ────────────────────────────────────────────────────────────────────────────
 * You may change at most `k` characters of `s` to any other uppercase letter.
 * Return the length of the longest substring of a single repeated character
 * you can produce.
 *
 *   characterReplacement('ABAB', 2)    → 4    (two changes → 'AAAA')
 *   characterReplacement('AABABBA', 1) → 4    ('AABA' → 'AAAA')
 *   characterReplacement('AAAA', 0)    → 4
 *
 * TARGET: O(n) time, O(1) space (26 letters).
 *
 * THE REFRAME that makes it easy: a window is legal when
 *       `windowLength - countOfMostFrequentCharacter <= k`
 *       — the characters that are not the majority one are exactly the ones
 *       you would have to pay to change.
 *
 * THE SUBTLETY interviewers love: you do NOT need to recompute the max
 *       frequency when the window shrinks. Keeping a stale (too large) maximum
 *       only means the window refuses to shrink for a while; it can never
 *       report an answer longer than a genuinely achievable one, because the
 *       recorded best is only ever updated when a real max frequency supported
 *       it. Recomputing is also fine and costs a 26-way scan — but be ready to
 *       explain why the lazy version is correct.
 *
 * HINT: this is the SHRINK-TO-LEGAL variant — shrink only while illegal, then
 *       record.
 */
export function characterReplacement(_s: string, _k: number): number {
  throw new Error('Not implemented');
}
