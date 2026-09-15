/**
 * SOLUTIONS — Heap / top-K / two heaps
 */

import { ListNode } from '../../patterns/support/list.ts';

/**
 * A minimal binary heap. JavaScript has no built-in, so this is the code you
 * should be able to type from memory: children of i live at 2i+1 and 2i+2,
 * push sifts up, pop swaps the last element to the root and sifts down.
 * Passing a comparator makes the same class serve as a max-heap.
 */
class Heap<T> {
  private readonly items: T[] = [];

  constructor(private readonly compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.items.length;
  }

  peek(): T | undefined {
    return this.items[0];
  }

  push(value: T): void {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.items[i]!, this.items[parent]!) >= 0) break;
      [this.items[i], this.items[parent]] = [this.items[parent]!, this.items[i]!];
      i = parent;
    }
  }

  pop(): T | undefined {
    if (this.items.length === 0) return undefined;
    const top = this.items[0]!;
    const last = this.items.pop()!;

    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;
        if (left < this.items.length && this.compare(this.items[left]!, this.items[smallest]!) < 0)
          smallest = left;
        if (right < this.items.length && this.compare(this.items[right]!, this.items[smallest]!) < 0)
          smallest = right;
        if (smallest === i) break;
        [this.items[i], this.items[smallest]] = [this.items[smallest]!, this.items[i]!];
        i = smallest;
      }
    }

    return top;
  }
}

/**
 * PROBLEM 1 — Find median from a data stream
 *
 * COMPLEXITY: O(log n) per add, O(1) per median.
 *
 * NARRATION:
 *   "A sorted array makes the query O(1) but every insert O(n). I want both
 *    cheap, so I split the data at the median: a max-heap of the lower half and
 *    a min-heap of the upper half. The two tops are the middle elements, so the
 *    median is O(1), and rebalancing after an insert is a couple of heap
 *    operations."
 *
 * THE PUSH-THEN-SHUFFLE ADD avoids all case analysis. Pushing into `low`,
 * immediately moving `low`'s top into `high`, then moving back if `high` is
 * larger, maintains both invariants — ordering and balance — without ever
 * asking which half the new value belongs to. Branching on comparisons is the
 * version people write first and the version where the bugs live.
 *
 * SIZE CONVENTION: `low` is allowed to be one larger. Then an odd count has its
 * median at low's top and an even count averages the two tops. Pick a
 * convention and say it out loud, because the off-by-one in `findMedian` is
 * otherwise a coin flip.
 *
 * THE COMPARATORS are the only difference between the two heaps: (a, b) => a - b
 * is a min-heap, (a, b) => b - a is a max-heap. Same class, twice.
 */
export interface MedianFinder {
  addNum(num: number): void;
  findMedian(): number;
}

export function createMedianFinder(): MedianFinder {
  const low = new Heap<number>((a, b) => b - a); // max-heap: smaller half
  const high = new Heap<number>((a, b) => a - b); // min-heap: larger half

  return {
    addNum(num) {
      low.push(num);
      high.push(low.pop()!); // low's largest belongs to the upper half
      if (high.size > low.size) low.push(high.pop()!); // rebalance
    },

    findMedian() {
      if (low.size === 0) return NaN; // no data — define this deliberately
      if (low.size > high.size) return low.peek()!;
      return (low.peek()! + high.peek()!) / 2;
    },
  };
}

/**
 * PROBLEM 2 — Merge k sorted linked lists
 *
 * COMPLEXITY: O(N log k) time, O(k) space for the heap.
 *
 * NARRATION:
 *   "At every step the next node of the answer is the smallest of the k current
 *    heads, so I keep exactly those k heads in a min-heap. Pop the smallest,
 *    append it, push its successor. Each of the N nodes enters and leaves the
 *    heap once, and the heap never exceeds k entries, so it is N log k rather
 *    than N log N — the heap only ever holds the frontier, not the data."
 *
 * WHY NOT MERGE ONE AT A TIME: folding list by list re-walks the accumulator on
 * every round, giving O(N·k). The heap and the pairwise divide-and-conquer both
 * fix that; mention the pairwise version as the no-heap alternative, since in
 * JavaScript it avoids writing a data structure at all.
 *
 * THE DUMMY HEAD removes the "is this the first node" branch from the append
 * loop. `tail` walks behind, and `dummy.next` is the answer. This is the idiom
 * for every list-building problem and it should be automatic.
 *
 * FILTERING NULLS UP FRONT matters: the input may contain empty lists, and
 * seeding the heap with a null makes the comparator blow up. One `if` at seed
 * time is cheaper than defensive checks inside the loop.
 *
 * THE FINAL `tail.next` IS ALREADY CORRECT: when the last node of a list is
 * appended, its own `next` is null, so the result is terminated without an
 * explicit step. Worth noticing, but also worth a moment's thought about
 * whether the input lists have been left sharing structure with the output —
 * they have, and that is fine here because they are consumed.
 */
export function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const heap = new Heap<ListNode>((a, b) => a.val - b.val);
  for (const list of lists) {
    if (list !== null) heap.push(list); // never seed a null
  }

  const dummy = new ListNode(0);
  let tail = dummy;

  while (heap.size > 0) {
    const node = heap.pop()!;
    tail.next = node;
    tail = node;
    if (node.next !== null) heap.push(node.next);
  }

  return dummy.next;
}
