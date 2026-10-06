/**
 * SOLUTIONS — In-place linked list reversal
 */

import { ListNode } from '../../patterns/support/list.ts';

/**
 * PROBLEM 2 — Reverse nodes in k-group
 *
 * COMPLEXITY: O(n) time — each node is visited once to check and once to
 * reverse — and O(1) space.
 *
 * NARRATION:
 *   "For each group I first walk k nodes ahead to confirm the group is full; if
 *    it isn't, I stop and leave the remainder alone. Then I reverse exactly
 *    those k nodes with the standard three-pointer loop, and reattach: the
 *    previous group's tail points at the new head, and the old first node —
 *    now the group's tail — points at whatever came next."
 *
 * CHECK BEFORE REVERSING. Reversing first and then discovering the group was
 * short means undoing the work, which is where this problem's reputation comes
 * from. One cheap look-ahead avoids it entirely.
 *
 * `groupPrevious` IS THE LOAD-BEARING POINTER. It is the tail of the previous
 * group and the only handle that can reattach the group just reversed. After
 * each group it becomes the group's new tail — which is the node the group
 * STARTED with, so save that reference before reversing.
 *
 * THE REVERSAL LOOP is the base pattern with a bounded count instead of a null
 * check, stopping at `groupNext` rather than at the end of the list.
 *
 * THE RECURSIVE ALTERNATIVE — reverse the first k, recurse on the rest, attach
 * — reads better and costs O(n/k) stack. On a list of a million nodes with
 * k = 2 that is half a million frames, which is a real reason to prefer the
 * iterative version; say that rather than just asserting a preference.
 */
export function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  if (head === null || k <= 1) return head;

  const dummy = new ListNode(0, head);
  let groupPrevious = dummy; // tail of the last completed group

  for (;;) {
    // 1. Look ahead: is there a full group of k left?
    let check: ListNode | null = groupPrevious;
    for (let i = 0; i < k && check !== null; i += 1) check = check.next;
    if (check === null) break; // short group — leave it as is

    const groupStart = groupPrevious.next!; // becomes the group's TAIL
    const groupNext = check.next; // first node after the group

    // 2. Reverse exactly k nodes, stopping at groupNext.
    let previous: ListNode | null = groupNext;
    let current: ListNode | null = groupStart;
    for (let i = 0; i < k; i += 1) {
      const next: ListNode | null = current!.next;
      current!.next = previous;
      previous = current;
      current = next;
    }

    // 3. Reattach and advance.
    groupPrevious.next = previous; // `previous` is now the group's head
    groupPrevious = groupStart; // the old first node is the new tail
  }

  return dummy.next;
}
