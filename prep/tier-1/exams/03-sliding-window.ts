/**
 * TIER 1 · PATTERN 03 — Sliding window
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 75 min total    Catalogue: ../../patterns/CATALOGUE.md § 3
 *
 * THE PATTERN
 * A window [left, right] over a CONTIGUOUS run. `right` always advances;
 * `left` advances only to restore validity. Each index enters once and leaves
 * once, so two nested-looking loops still cost O(n) in total. Say that
 * amortised argument out loud — the code looks quadratic and is not.
 *
 * THE TELL
 *   "contiguous subarray" / "substring"  +  longest / shortest / at most K
 *   "of size k" (the fixed-width version, which is the easy one)
 *
 * WHEN IT IS VALID — and this is the trap
 * Growing the window must move the quantity you care about MONOTONICALLY in
 * one direction, and shrinking must move it back. With non-negative numbers a
 * longer window means a larger sum, so "shrink while invalid" is sound. Allow
 * negatives and that collapses — then you want prefix sums (§ 4), not a
 * window. Being able to name that boundary is the senior part of this pattern.
 *
 * THE THREE VARIANTS — mixing them up is the single most common bug here
 *   FIXED WIDTH      add right, remove right - k, record every step
 *   SHRINK-TO-VALID  (shortest) grow; WHILE VALID, record then shrink
 *   SHRINK-TO-LEGAL  (longest)  grow; WHILE ILLEGAL, shrink; then record
 *
 * TEMPLATE (longest)
 *   let left = 0;
 *   for (let right = 0; right < n; right += 1) {
 *     add(nums[right]);
 *     while (!legal()) { remove(nums[left]); left += 1; }
 *     best = Math.max(best, right - left + 1);
 *   }
 *
 * COST — O(n) time; space is whatever the window state needs, often O(k) for a
 * count map or O(1) for a running sum.
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * "at most K distinct" → "exactly K distinct" (run at-most-K twice and
 * subtract), fixed windows over an alphabet (anagram search), and the negative
 * numbers case that breaks the pattern entirely.
 *
 * THE SENTENCE WORTH SAYING
 *   "Contiguous, longest, at most K — sliding window with a map for the window
 *    state. Each index enters and leaves once, so O(n) time, O(k) space."
 */

/**
 * EXAM 1 — Longest substring without repeating characters         [LeetCode 3]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the length of the longest substring of `s` with no repeated
 * character.
 *
 *   lengthOfLongestSubstring('abcabcbb')  → 3    ('abc')
 *   lengthOfLongestSubstring('bbbbb')     → 1
 *   lengthOfLongestSubstring('pwwkew')    → 3    ('wke', not the subsequence 'pwke')
 *   lengthOfLongestSubstring('')          → 0
 *
 * TARGET: O(n) time, O(min(n, alphabet)) space.
 *
 * HINT: SHRINK-TO-LEGAL. Keep a map of character → last index seen. On a
 *       repeat, jump `left` to `lastIndex + 1` — but only FORWARDS: guard with
 *       `Math.max(left, lastIndex + 1)`, or a stale entry from before the
 *       window drags left backwards and you count characters twice. That guard
 *       is the bug this exam is testing for.
 */
export function lengthOfLongestSubstring(_s: string): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Maximum average subarray of size k                   [LeetCode 643]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the maximum average of any contiguous subarray of exactly length `k`.
 * `k` is at least 1 and never exceeds `nums.length`.
 *
 *   findMaxAverage([1, 12, -5, -6, 50, 3], 4)  → 12.75    ((12 - 5 - 6 + 50) / 4)
 *   findMaxAverage([5], 1)                     → 5
 *
 * TARGET: O(n) time, O(1) space.
 *
 * HINT: the FIXED-WIDTH variant, and the one place negatives are harmless —
 *       the window never shrinks conditionally, so no monotonicity is needed.
 *       Build the first k, then for each step add the entering value and
 *       subtract the leaving one. Compare SUMS and divide once at the end;
 *       dividing inside the loop invites floating-point noise for no reason.
 */
export function findMaxAverage(_nums: number[], _k: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Longest substring with at most k distinct characters  [LeetCode 340]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the length of the longest substring containing at most `k` DISTINCT
 * characters. `k` may be 0.
 *
 *   longestKDistinct('eceba', 2)  → 3    ('ece')
 *   longestKDistinct('aa', 1)     → 2
 *   longestKDistinct('abc', 0)    → 0
 *
 * TARGET: O(n) time, O(k) space.
 *
 * HINT: SHRINK-TO-LEGAL again, with a count map as the window state. The
 *       distinct count is `map.size`, so illegal means `map.size > k`. DELETE
 *       the key when its count hits zero — leaving a zero entry behind makes
 *       `size` lie, and that is the failure mode here.
 *
 *       Follow-up to have ready: "exactly k distinct" is
 *       `atMost(k) - atMost(k - 1)`.
 */
export function longestKDistinct(_s: string, _k: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Minimum size subarray sum                            [LeetCode 209]
 * ────────────────────────────────────────────────────────────────────────────
 * All values are POSITIVE. Return the length of the shortest contiguous
 * subarray whose sum is at least `target`, or 0 if none exists.
 *
 *   minSubArrayLen(7, [2, 3, 1, 2, 4, 3])  → 2    ([4, 3])
 *   minSubArrayLen(4, [1, 4, 4])           → 1
 *   minSubArrayLen(11, [1, 1, 1, 1, 1])    → 0
 *
 * TARGET: O(n) time, O(1) space.
 *
 * HINT: SHRINK-TO-VALID — the other direction from exams 1 and 3, and worth
 *       feeling the difference. Grow right; while the sum is at least target,
 *       RECORD FIRST, then shrink. Recording before shrinking is what makes
 *       the answer minimal rather than merely valid.
 *
 *       Say why "all positive" is in the prompt: it is the monotonicity
 *       licence. With negatives allowed the window argument dies and the
 *       problem becomes a prefix-sum-plus-monotonic-deque one.
 */
export function minSubArrayLen(_target: number, _nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Find all anagrams in a string                        [LeetCode 438]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the start indices of every substring of `s` that is an anagram of
 * `p`, in ascending order.
 *
 *   findAnagrams('cbaebabacd', 'abc')  → [0, 6]
 *   findAnagrams('abab', 'ab')         → [0, 1, 2]
 *   findAnagrams('a', 'aa')            → []
 *
 * TARGET: O(|s|) time, O(1) space for a fixed alphabet.
 *
 * HINT: a FIXED window of width |p|, so no conditional shrinking at all —
 *       every step adds one character and drops one. The question is how to
 *       compare cheaply: do NOT rebuild or compare maps each step. Keep a
 *       single integer `matched` (how many distinct characters currently have
 *       exactly the right count) and update it on the two characters that
 *       changed. Comparing counts on entry and exit with `=== need` is fiddly
 *       — write the two updates slowly and say what each one means.
 */
export function findAnagrams(_s: string, _p: string): number[] {
  throw new Error('Not implemented');
}
