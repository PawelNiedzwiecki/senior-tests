/**
 * SOLUTIONS — Fast & slow pointers
 */

import type { ListNode } from '../../patterns/support/list.ts';

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
