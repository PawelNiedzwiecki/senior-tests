/**
 * PATTERN 02 — Two pointers                              [LeetCode 15, 680]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 2
 *
 * THE PATTERN
 * Two indices walk the input instead of one, and every step throws away a
 * region of the search space that provably cannot contain the answer. That
 * "provably" is the whole pattern — if you cannot say why one side is safe to
 * discard, you do not have a two-pointer solution, you have a guess.
 *
 * THE TELL
 *   the input is SORTED (or you are allowed to sort it)
 *   the problem is symmetric from both ends ("palindrome", "container")
 *   "in place" / "O(1) extra space"
 *
 * THE THREE SHAPES
 *   CONVERGING  lo = 0, hi = n - 1, move the side that cannot improve
 *   FAST/SLOW   a read index and a write index, for in-place compaction
 *   PARALLEL    one index into each of two sorted inputs, for merging
 *
 * TEMPLATE (converging)
 *   let lo = 0, hi = n - 1;
 *   while (lo < hi) {
 *     const value = f(nums[lo], nums[hi]);
 *     if (value === target) return …;
 *     if (value < target) lo += 1; else hi -= 1;
 *   }
 *
 * COST — O(n) after an O(n log n) sort if one is needed, O(1) extra space.
 *
 * THE SENTENCE TO SAY OUT LOUD
 *   "Because the array is sorted, comparing the ends tells me which end cannot
 *    be part of any better answer, so I can discard it. That is what turns the
 *    quadratic pair search into a linear scan."
 */

/**
 * PROBLEM 2 — Valid palindrome with one deletion                [LeetCode 680]
 * ────────────────────────────────────────────────────────────────────────────
 * Return true if `s` can be made a palindrome by deleting AT MOST one
 * character.
 *
 *   validPalindromeII('aba')    → true     (already a palindrome)
 *   validPalindromeII('abca')   → true     (delete 'b' or 'c')
 *   validPalindromeII('abc')    → false
 *   validPalindromeII('')       → true
 *
 * TARGET: O(n) time, O(1) space.
 *
 * THE INSIGHT: converge from both ends as normal. At the FIRST mismatch you
 *       have exactly two candidate repairs — drop the left character or drop
 *       the right one — so check whether either remaining substring is a plain
 *       palindrome. There is no third case and no recursion needed.
 *
 * WHY THAT IS NOT GREEDY-AND-WRONG: you are not choosing one repair, you are
 *       testing both. The reason only the first mismatch matters is that any
 *       deletion elsewhere leaves this mismatch unfixed.
 *
 * DO NOT build substrings with slice() inside the check — that turns O(n) into
 *       O(n²) on memory traffic. Write a helper that takes (lo, hi) bounds.
 */
export function validPalindromeII(_s: string): boolean {
  throw new Error('Not implemented');
}
