/**
 * MODULE 10 — Heaps and top-K
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 55 min      DIFFICULTY: ●●●●○
 *
 * THE FACT THAT MATTERS MOST HERE
 * JavaScript has NO built-in heap or priority queue. Python has `heapq`, Java
 * has `PriorityQueue`, C++ has `priority_queue`. You have an array.
 *
 * So when a problem wants a heap you have three options, and naming all three
 * is itself the signal:
 *   1. Write one. ~30 lines. Do it if the problem genuinely needs O(log n)
 *      inserts against a changing set.
 *   2. Sort instead. O(n log n) rather than O(n log k) — usually irrelevant at
 *      interview scale, and far less code to get wrong.
 *   3. Sidestep it. Counting/bucket sort gives O(n) for top-K frequency, which
 *      actually BEATS the heap.
 * Say: "JS has no built-in priority queue, so I'll either write a small binary
 * heap or avoid needing one. For this input size, here's what I'd pick and why."
 *
 * THE BINARY HEAP, in one paragraph: a complete binary tree stored in an array.
 * For index i, children are 2i+1 and 2i+2, parent is (i-1)>>1. Push appends and
 * sifts UP; pop takes index 0, moves the last element to the root, and sifts
 * DOWN. Both are O(log n) because the tree height is log n. Peek is O(1).
 *
 * TOP-K COMPLEXITY, and why it is a MIN-heap for the K LARGEST:
 *   Keep a min-heap of size k. The smallest of your current best k sits at the
 *   root, so it is O(1) to test whether a new element beats it. Total
 *   O(n log k) — better than sorting's O(n log n) when k is small.
 *   Using a max-heap of size k for the k largest is the classic mix-up.
 *
 * RECOGNITION CUES: "k largest / smallest / most frequent", "median of a
 * stream", "merge k sorted lists", "scheduling by priority".
 */

/**
 * PROBLEM 1 — Implement a MinHeap
 * Standard binary min-heap over numbers.
 *
 *   const h = new MinHeap();
 *   h.push(5); h.push(1); h.push(3);
 *   h.peek();  // 1
 *   h.pop();   // 1
 *   h.pop();   // 3
 *
 * TARGET: push and pop O(log n), peek and size O(1).
 * HINT: parent of i is `(i - 1) >> 1`; children are `2i + 1` and `2i + 2`.
 *       siftUp: while the node is smaller than its parent, swap upward.
 *       siftDown: while a child is smaller than the node, swap with the
 *       SMALLER child. Swapping with the wrong child breaks the invariant in a
 *       way that only shows up on larger inputs — which is why the tests below
 *       include a randomised comparison against a sort.
 */
export class MinHeap {
  push(_value: number): void {
    throw new Error('Not implemented');
  }

  pop(): number | undefined {
    throw new Error('Not implemented');
  }

  peek(): number | undefined {
    throw new Error('Not implemented');
  }

  get size(): number {
    throw new Error('Not implemented');
  }
}

/**
 * PROBLEM 2 — Top K Frequent Elements
 * The k most frequent values, in any order.
 *
 *   topKFrequent([1, 1, 1, 2, 2, 3], 2) → [1, 2]
 *   topKFrequent([1], 1)                → [1]
 *
 * TARGET: O(n) time with bucket sort — better than the O(n log k) heap answer.
 * HINT: count with a Map. Then note the constraint that unlocks it: a value's
 *       frequency is at most n, so you can index BUCKETS BY FREQUENCY —
 *       `buckets[f]` holds every value seen f times. Walk the buckets from the
 *       top and take k.
 * SAY THIS: "A heap gives O(n log k). But frequencies are bounded by n, so I
 *       can bucket by frequency and get O(n). That's the better answer, and it
 *       avoids writing a heap at all."
 */
export function topKFrequent(_nums: number[], _k: number): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Kth Largest Element
 * The kth largest value (k = 1 is the maximum). Duplicates count separately, so
 * in [3, 3, 1] the 2nd largest is 3.
 *
 *   findKthLargest([3, 2, 1, 5, 6, 4], 2) → 5
 *   findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) → 4
 *
 * TARGET: O(n log k) with a size-k min-heap, using the class above.
 * HINT: push everything; whenever the heap exceeds k, pop. The root is then the
 *       kth largest, because exactly the k biggest values remain.
 * FOLLOW-UP THEY ASK: "can you do better?" — Quickselect averages O(n) but
 *       degrades to O(n²) on adversarial input unless you randomise the pivot.
 *       Know the name, the average case, and the caveat.
 */
export function findKthLargest(_nums: number[], _k: number): number | undefined {
  throw new Error('Not implemented');
}
