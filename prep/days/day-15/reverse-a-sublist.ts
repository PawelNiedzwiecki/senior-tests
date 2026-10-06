/**
 * PATTERN 18 — In-place linked list reversal               [LeetCode 92, 25]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 18
 *
 * THE PATTERN
 * Walk the list rewiring each `next` pointer to face backwards, carrying three
 * references: what came before, where you are, and what comes next. You need
 * `next` saved BEFORE you overwrite the current pointer, or you lose the rest
 * of the list — that is the entire difficulty, and it is a pointer-discipline
 * problem rather than an algorithmic one.
 *
 * THE TELL
 *   "reverse the list in place"  ·  "reorder the nodes"  ·  "O(1) extra space"
 *   "reverse every k nodes"  ·  "swap pairs"  ·  palindrome checks on a list
 *
 * THE CORE LOOP — know this cold, it is the base of everything below:
 *   let previous = null, current = head;
 *   while (current !== null) {
 *     const next = current.next;    // SAVE first
 *     current.next = previous;      // rewire
 *     previous = current;           // shuffle both pointers forward
 *     current = next;
 *   }
 *   return previous;                // the new head
 *
 * THE DUMMY HEAD is the other essential idiom. When the operation might change
 * the first node, allocate `dummy = { next: head }` and work from there. Every
 * "what if it's the head?" special case disappears, and you return `dummy.next`.
 *
 * DRAW THE POINTERS. Four boxes and four arrows on paper, and redraw them after
 * each statement. Every experienced engineer does this for list problems and no
 * interviewer will think less of you for it — the opposite, in fact.
 *
 * THE INVARIANT to state out loud: after each iteration, everything from the
 * original head up to `previous` is reversed, and `current` is the head of the
 * untouched remainder.
 *
 * COST — O(n) time, O(1) space. A recursive version is O(n) stack, which is a
 * real difference on a list of a million nodes; mention it.
 */

import type { ListNode } from '../../patterns/support/list.ts';

/**
 * PROBLEM 1 — Reverse a sublist                                  [LeetCode 92]
 * ────────────────────────────────────────────────────────────────────────────
 * Reverse the nodes from position `left` to position `right` INCLUSIVE
 * (1-indexed) and return the head. Do it in one pass.
 *
 *   reverseBetween(buildList([1, 2, 3, 4, 5]), 2, 4)  → 1 → 4 → 3 → 2 → 5
 *   reverseBetween(buildList([5]), 1, 1)              → 5
 *   reverseBetween(buildList([1, 2, 3]), 1, 3)        → 3 → 2 → 1
 *
 * TARGET: O(n) time, O(1) space, ONE pass.
 *
 * THE FOUR NODES THAT MATTER — name them before writing anything:
 *       · the node BEFORE the reversed section (may be the dummy)
 *       · the first node OF the section (which becomes its tail)
 *       · the last node of the section (which becomes its head)
 *       · the node AFTER the section
 *       Reversing is easy; RECONNECTING those four is where the bugs are.
 *
 * THE DUMMY HEAD IS NOT OPTIONAL HERE: with left = 1 the head itself moves, and
 *       without a dummy that becomes a special case threaded through the whole
 *       function.
 *
 * THE ONE-PASS TECHNIQUE (head insertion): rather than reversing the section
 *       and then reattaching it, repeatedly take the node after the section's
 *       first node and splice it to the FRONT of the section. After
 *       `right - left` such moves the section is reversed and the connections
 *       never broke. Fewer variables in flight, and it generalises to day-16's problem (reverse nodes in k-group).
 *
 * SANITY CHECK: left === right must leave the list untouched.
 */
export function reverseBetween(
  _head: ListNode | null,
  _left: number,
  _right: number,
): ListNode | null {
  throw new Error('Not implemented');
}

