/**
 * PATTERN 09 — Fast & slow pointers (Floyd's)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: CATALOGUE.md § 9
 *
 * THE TELL: a structure you can only walk forwards, plus "cycle", "middle",
 * "nth from the end", or "does this sequence terminate" — with O(1) space.
 *
 * WHY THEY MEET: inside a cycle, the fast pointer gains exactly one position on
 * the slow one per step. The gap is an integer that decreases by one each
 * iteration, so it must hit zero — fast cannot jump over slow.
 *
 * THE PATTERN IS NOT ABOUT LINKED LISTS. It is about any function you can
 * iterate: `next = f(current)`. Problem 3 applies it to digits, and quiz
 * question 26 applies it to an array where `i → nums[i]`.
 */

import type { ListNode } from '../support/list.ts';

/**
 * PROBLEM 1 — Cycle detection, and where it starts
 * Return the node where the cycle begins, or null if the list is acyclic.
 *
 *   1 → 2 → 3 → 4 ┐
 *           ↑─────┘        → the node holding 3
 *
 * TARGET: O(n) time, O(1) space. (A Set of visited nodes is O(n) space — say
 * that it works and that the point of the problem is avoiding it.)
 * HINT: phase one, advance slow by 1 and fast by 2 until they meet (or fast
 *       falls off the end — no cycle). Phase two, reset ONE pointer to the head
 *       and advance both one step at a time; they meet at the entry.
 * WHY PHASE TWO WORKS: worth memorising the fact even if the algebra isn't at
 *       your fingertips — the distance from the head to the entry equals the
 *       distance from the meeting point to the entry, going forwards.
 */
export function detectCycleStart(_head: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Middle of the list
 * Return the middle node. For an even length, return the SECOND middle.
 *
 *   [1,2,3,4,5]   → node 3
 *   [1,2,3,4,5,6] → node 4
 *
 * TARGET: O(n) time, O(1) space, single pass.
 * HINT: when fast reaches the end, slow is halfway. The loop condition decides
 *       which middle you get for even lengths — `fast && fast.next` gives the
 *       second, `fast.next && fast.next.next` gives the first. Know which you
 *       wrote and why.
 */
export function findMiddle(_head: ListNode | null): ListNode | null {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Happy number
 * Repeatedly replace n with the sum of the squares of its digits. n is "happy"
 * if this reaches 1; otherwise it loops forever.
 *
 *   isHappy(19) → true    (19 → 82 → 68 → 100 → 1)
 *   isHappy(2)  → false
 *
 * TARGET: O(log n) space-free — O(1) extra space.
 * THE POINT: there is no linked list here at all. The sequence
 *       `n → digitSquareSum(n)` is a function you iterate, so it either reaches
 *       1 or enters a cycle — exactly the structure Floyd's detects. Spotting
 *       that a non-list problem has list structure is the transferable skill.
 * HINT: slow takes one step, fast takes two, until they meet. If they meet at
 *       1, it is happy.
 */
export function isHappy(_n: number): boolean {
  throw new Error('Not implemented');
}
