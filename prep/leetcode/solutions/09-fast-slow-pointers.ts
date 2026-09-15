/**
 * SOLUTIONS — Fast & slow pointers
 */

import type { ListNode } from '../../patterns/support/list.ts';

/**
 * PROBLEM 1 — Find the duplicate number
 *
 * COMPLEXITY: O(n) time, O(1) space, input unmodified.
 *
 * NARRATION — start from the constraints, not the trick:
 *   "A Set solves it in O(n) space and sorting solves it by mutating, and both
 *    are ruled out. What is left is to notice that i → nums[i] is a function on
 *    indices, so the array IS a linked list. With n + 1 values drawn from
 *    1..n, pigeonhole says two indices share a successor — a cycle — and the
 *    repeated value is the node where the cycle starts. That is Floyd's."
 *
 * PHASE 1 finds a meeting point inside the cycle. PHASE 2 resets one pointer to
 * the start; the distance from head to the entrance equals the distance from
 * the meeting point to the entrance (mod the cycle length), so stepping both by
 * one lands them together exactly at the entrance.
 *
 * THE DO/WHILE MATTERS: slow and fast both start at index 0, so a `while (slow
 * !== fast)` loop exits immediately without moving. Either use do/while or
 * offset the starting positions.
 *
 * WHY INDEX 0 IS SAFE AS A START: every value is >= 1, so nothing ever points
 * back to index 0; it is guaranteed to be on the tail rather than in the cycle,
 * which is what the entrance argument requires.
 *
 * THE FALLBACK WORTH OFFERING: binary search on the VALUE range, counting how
 * many entries are <= mid — O(n log n) time, O(1) space, no cleverness needed.
 * If Floyd's does not surface under pressure, this one will.
 */
export function findDuplicate(nums: number[]): number {
  // Phase 1 — find a meeting point inside the cycle.
  let slow = nums[0]!;
  let fast = nums[0]!;
  do {
    slow = nums[slow]!;
    fast = nums[nums[fast]!]!;
  } while (slow !== fast);

  // Phase 2 — walk from the start and from the meeting point, one step each.
  slow = nums[0]!;
  while (slow !== fast) {
    slow = nums[slow]!;
    fast = nums[fast]!;
  }

  return slow; // the cycle entrance — i.e. the duplicated value
}

/**
 * PROBLEM 2 — Palindrome linked list
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "The O(n)-space answer is to dump the values into an array and converge
 *    from both ends — I'd write that first. For constant space I stack three
 *    patterns: fast/slow to find the middle, in-place reversal of the second
 *    half, then a converging comparison. Reversing is what buys the O(1),
 *    because it lets me walk backwards without storing anything."
 *
 * WHERE `slow` LANDS: with an even count it lands on the first node of the
 * second half; with an odd count it lands on the exact middle, which then
 * belongs to the reversed half and compares against itself harmlessly. Looping
 * `while (second !== null)` rather than on both halves is what makes the odd
 * case need no special handling.
 *
 * THE MUTATION: this leaves the caller's list with its second half reversed.
 * Flag it in the interview. Restoring it is one more call to the same reversal
 * helper, and volunteering that is a cheap way to show you think about side
 * effects.
 *
 * THE HELPER IS WORTH EXTRACTING even though it is four lines: `reverse` is the
 * most reused primitive in linked-list problems (§ 18), and having it as a
 * named function makes the main body readable in one pass.
 */
function reverse(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next: ListNode | null = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }

  return previous;
}

export function isPalindromeList(head: ListNode | null): boolean {
  if (head === null || head.next === null) return true;

  // 1. Fast/slow: `slow` ends up at the start of the second half.
  let slow: ListNode = head;
  let fast: ListNode | null = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }

  // 2. Reverse the second half in place.
  let second = reverse(slow);

  // 3. Converge. The odd middle node compares against itself — harmless.
  let first: ListNode | null = head;
  let isPalindrome = true;
  while (second !== null) {
    if (first!.val !== second.val) {
      isPalindrome = false;
      break;
    }
    first = first!.next;
    second = second.next;
  }

  return isPalindrome;
}
