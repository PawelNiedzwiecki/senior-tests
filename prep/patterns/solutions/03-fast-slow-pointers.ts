/**
 * SOLUTIONS — Fast & slow pointers
 */

import type { ListNode } from '../support/list.ts';

/**
 * PROBLEM 1 — Cycle detection and entry point
 *
 * NARRATION:
 *   "The O(n)-space answer is a Set of visited nodes. To get O(1) I'll use two
 *    pointers at different speeds: fast gains one position per step on slow, so
 *    inside a cycle the gap shrinks by exactly one each iteration and must
 *    reach zero. If fast falls off the end instead, there is no cycle."
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * PHASE TWO — why resetting to the head works: let the distance from head to
 * the entry be a, and from the entry to the meeting point be b. When they meet,
 * slow has walked a + b and fast has walked twice that, so the extra distance
 * fast covered is exactly one or more loops. The algebra collapses to: the
 * distance from the HEAD to the entry equals the distance from the MEETING
 * POINT to the entry. So advancing both one step at a time lands them together
 * at the entry. Memorise the result; derive it only if asked.
 *
 * THE LOOP GUARD `fast !== null && fast.next !== null` covers both the
 * odd- and even-length cases of running off the end. Checking only `fast`
 * crashes on `fast.next.next`.
 */
export function detectCycleStart(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  // Phase 1: find a meeting point inside the cycle, if there is one.
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  // Fell off the end ⇒ acyclic.
  if (fast === null || fast.next === null) return null;

  // Phase 2: head and meeting point are equidistant from the entry.
  let walker = head;
  while (walker !== slow) {
    walker = walker!.next;
    slow = slow!.next;
  }

  return walker;
}

/**
 * PROBLEM 2 — Middle node
 *
 * COMPLEXITY: O(n) time, O(1) space, one pass.
 *
 * THE LOOP CONDITION PICKS THE MIDDLE for even lengths, and this is the only
 * decision in the problem:
 *   `while (fast && fast.next)`            → the SECOND middle (used here)
 *   `while (fast.next && fast.next.next)`  → the FIRST middle
 * Know which you wrote and say it. For "reverse the second half" problems you
 * usually want the second; for "split into two halves" you often want the first.
 *
 * THE TWO-PASS ALTERNATIVE (count, then walk half) is equally O(n) and easier
 * to read. If asked why you preferred one pass: streaming inputs, and it
 * generalises to the cycle problems above.
 */
export function findMiddle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

/**
 * PROBLEM 3 — Happy number
 *
 * THE INSIGHT TO SAY OUT LOUD:
 *   "There's no linked list here, but there is list structure: the sequence
 *    n → digitSquareSum(n) is a function I iterate, so it either reaches 1 or
 *    revisits a value and loops. That is exactly what Floyd's detects, and it
 *    costs O(1) space instead of a Set."
 *
 * COMPLEXITY: O(log n) per step to split the digits, and the sequence provably
 *             falls below 243 quickly for any input (a 3-digit number maps to
 *             at most 3 × 81 = 243), so the number of steps is bounded by a
 *             constant. Effectively O(log n) time, O(1) space.
 *
 * WHY IT TERMINATES: values are bounded, so the sequence must eventually repeat
 * — it either repeats at 1 or in some other cycle. That bounded-state argument
 * is the reason cycle detection is guaranteed to finish.
 *
 * THE SET VERSION is O(n) space and perfectly acceptable; lead with it, then
 * offer this. Being able to do both is the answer.
 */
function digitSquareSum(n: number): number {
  let total = 0;
  let rest = n;
  while (rest > 0) {
    const digit = rest % 10;
    total += digit * digit;
    rest = Math.floor(rest / 10);
  }
  return total;
}

export function isHappy(n: number): boolean {
  let slow = n;
  let fast = n;

  do {
    slow = digitSquareSum(slow);
    fast = digitSquareSum(digitSquareSum(fast));
  } while (slow !== fast);

  // They always meet — at 1 if happy, otherwise somewhere in the cycle.
  return slow === 1;
}
