/**
 * Shared singly-linked-list helpers. Scaffolding, not a drill — in a real
 * interview the node shape is usually given to you.
 */

export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function buildList(values: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = values.length - 1; i >= 0; i -= 1) head = new ListNode(values[i]!, head);
  return head;
}

/** Reads a list into an array. Loops forever on a cyclic list — by design. */
export function listToArray(head: ListNode | null): number[] {
  const out: number[] = [];
  let node = head;
  while (node !== null) {
    out.push(node.val);
    node = node.next;
  }
  return out;
}

/** Builds a list whose tail points back at index `cycleAt` (-1 for no cycle). */
export function buildCyclicList(values: number[], cycleAt: number): ListNode | null {
  const head = buildList(values);
  if (head === null || cycleAt < 0) return head;

  let tail = head;
  while (tail.next !== null) tail = tail.next;

  let target = head;
  for (let i = 0; i < cycleAt; i += 1) target = target.next!;

  tail.next = target;
  return head;
}
