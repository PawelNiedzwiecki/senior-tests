/**
 * PATTERN 09 — Fast & slow pointers (Floyd's)            [LeetCode 287, 234]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: ../patterns/CATALOGUE.md § 9
 *
 * THE PATTERN
 * Two pointers move through a sequence at different speeds. Because they
 * advance at different rates, their MEETING carries information: that a cycle
 * exists, or that one pointer has reached the exact middle.
 *
 * THE TELL
 *   linked list + "cycle" / "middle" / "nth from the end" / "reorder"
 *   any sequence defined by "repeatedly apply f", where a repeat must occur
 *   "O(1) extra space" attached to a problem a hash set would solve instantly
 *
 * THE TWO USES
 *   CYCLE DETECTION   fast moves 2, slow moves 1; if they ever meet, there is a
 *                     cycle. Then reset one pointer to the start and advance
 *                     both by 1 — they meet AT THE CYCLE'S ENTRANCE.
 *   MIDPOINT          fast moves 2, slow moves 1; when fast falls off the end,
 *                     slow is at the middle.
 *
 * WHY THE RESET FINDS THE ENTRANCE — the proof, compressed to what you would
 * actually say:
 *   "Let the tail before the cycle be length a and the cycle length c. When they
 *    meet, slow has walked a + b and fast 2(a + b), and the difference is a
 *    whole number of laps, so a + b ≡ 0 (mod c). That makes the distance from
 *    the meeting point back round to the entrance exactly a — the same as from
 *    the head. So two pointers stepping one at a time from the head and from the
 *    meeting point meet at the entrance."
 * You do not need the algebra perfect. You do need to convey that it is proved,
 * not remembered.
 *
 * COST — O(n) time, O(1) space. The O(1) is the entire point: a Set solves every
 * problem in this family in O(n) space, so the pattern is only interesting when
 * the space constraint is real.
 */

import type { ListNode } from '../../patterns/support/list.ts';

/**
 * PROBLEM 2 — Palindrome linked list                            [LeetCode 234]
 * ────────────────────────────────────────────────────────────────────────────
 * Return true if a singly-linked list reads the same forwards and backwards.
 *
 *   isPalindromeList(buildList([1, 2, 2, 1]))  → true
 *   isPalindromeList(buildList([1, 2]))        → false
 *   isPalindromeList(buildList([1]))           → true
 *   isPalindromeList(null)                     → true
 *
 * TARGET: O(n) time, O(1) space.
 *
 * THE EASY ANSWER, which you should say first: copy the values into an array
 *       and two-pointer it. O(n) time, O(n) space, three lines, and completely
 *       acceptable unless the interviewer asks for constant space — which, for
 *       this problem, they will.
 *
 * THE O(1) VERSION IS THREE PATTERNS STACKED, and naming the stack is the
 *       answer:
 *         1. fast/slow to find the middle
 *         2. in-place reversal of the second half  (§ 18)
 *         3. converging comparison of the two halves  (§ 2)
 *
 * ODD LENGTHS: with an odd count the middle node belongs to neither half.
 *       Comparing until the reversed half runs out handles it without a special
 *       case — which is why the loop condition should be on the SECOND half,
 *       not on both.
 *
 * THE DETAIL THAT SEPARATES CANDIDATES: you have destroyed the caller's list.
 *       Say so, and offer to reverse the second half back before returning.
 *       Interviewers rarely require it; they always notice whether you spotted
 *       it.
 */
export function isPalindromeList(_head: ListNode | null): boolean {
  throw new Error('Not implemented');
}
