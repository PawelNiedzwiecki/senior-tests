/**
 * SOLUTIONS — In-place linked list reversal
 */

import { ListNode } from '../../patterns/support/list.ts';

/**
 * PROBLEM 1 — Reverse a sublist
 *
 * COMPLEXITY: O(n) time, O(1) space, one pass.
 *
 * NARRATION:
 *   "I use a dummy head so that reversing from position 1 isn't a special case,
 *    walk to the node just before the section, and then repeatedly take the node
 *    after the section's first node and splice it to the FRONT of the section.
 *    After right - left of those moves the section is reversed, and because
 *    every step is a complete splice the list is never in a broken state."
 *
 * HEAD INSERTION vs REVERSE-THEN-RECONNECT: both are O(n) and one pass. Head
 * insertion keeps only three live pointers (`beforeSection`, `sectionTail`,
 * `moving`) instead of four, and the reconnection is implicit. Fewer things in
 * flight is worth a lot when you are writing on a whiteboard.
 *
 * WHY `sectionTail` STAYS PUT: the first node of the section ends up last, so
 * it is the anchor the other nodes are moved out from in front of. Its `next`
 * pointer is updated each time to skip the node that just moved.
 *
 * THE LOOP COUNT is `right - left`, not `right - left + 1`: with k nodes in the
 * section, k - 1 moves suffice because the first node never moves.
 *
 * DEGENERATE CASES fall out: left === right runs the loop zero times; a
 * single-element list is untouched; and the dummy makes left === 1 ordinary.
 */
export function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number,
): ListNode | null {
  if (head === null || left >= right) return head;

  const dummy = new ListNode(0, head);

  // Walk to the node immediately before the section.
  let beforeSection = dummy;
  for (let i = 1; i < left; i += 1) beforeSection = beforeSection.next!;

  // The section's first node becomes its tail and never moves again.
  const sectionTail = beforeSection.next!;

  for (let i = 0; i < right - left; i += 1) {
    const moving = sectionTail.next!; // the node to pull to the front
    sectionTail.next = moving.next; // close the gap it leaves
    moving.next = beforeSection.next; // splice it in at the front…
    beforeSection.next = moving; // …of the section
  }

  return dummy.next;
}

