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
 * PROBLEM 1 — Find the duplicate number                         [LeetCode 287]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` has n + 1 entries, each in [1, n]. Exactly one value is repeated (it
 * may repeat several times). Return it WITHOUT modifying the array and using
 * O(1) extra space.
 *
 *   findDuplicate([1, 3, 4, 2, 2])     → 2
 *   findDuplicate([3, 1, 3, 4, 2])     → 3
 *   findDuplicate([2, 2, 2, 2, 2])     → 2
 *
 * TARGET: O(n) time, O(1) space, input untouched.
 *
 * THE CONSTRAINTS ARE THE PROBLEM. A Set is O(n) space; sorting or cyclic sort
 *       modifies the array. Both are banned, and both are worth saying out loud
 *       before you produce the trick — it shows you read the constraints rather
 *       than pattern-matched the title.
 *
 * THE REFRAME: treat the array as a FUNCTION i → nums[i], i.e. a linked list
 *       where "next" is `nums[current]`. Start at index 0. Because values are in
 *       [1, n] and there are n + 1 of them, the pigeonhole principle guarantees
 *       two indices point to the same place — a cycle — and the duplicated VALUE
 *       is the cycle's ENTRANCE. Now it is exactly Floyd's algorithm.
 *
 * WHY START AT INDEX 0: no value equals 0 (values are >= 1), so index 0 can
 *       never be re-entered, which guarantees it lies outside the cycle. If 0
 *       were inside the cycle the entrance argument would not hold.
 *
 * MENTION THE BINARY-SEARCH ALTERNATIVE: count how many values are <= mid; if
 *       that count exceeds mid, the duplicate is in the lower half. O(n log n),
 *       also O(1) space, and far easier to derive under pressure.
 */
export function findDuplicate(_nums: number[]): number {
  throw new Error('Not implemented');
}

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
