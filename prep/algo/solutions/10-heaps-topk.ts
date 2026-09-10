/**
 * SOLUTIONS 10 — Heaps and top-K
 */

/**
 * PROBLEM 1 — MinHeap
 *
 * COMPLEXITY: push O(log n), pop O(log n), peek O(1), size O(1).
 *             O(n) space.
 *
 * THE ARRAY LAYOUT: a complete binary tree flattened. For index i,
 *   parent   = (i - 1) >> 1
 *   children = 2i + 1, 2i + 2
 * `>> 1` is integer division by two — say "shift, which floors for
 * non-negative values" rather than leaving it as a magic trick.
 *
 * SIFT DOWN MUST PICK THE SMALLER CHILD. Swapping with the left child
 * unconditionally leaves the heap invariant broken in a way that small examples
 * do not reveal — you need three levels before it shows. That is exactly what
 * the randomised test in this module is for, and it is a good habit to
 * volunteer: "small examples won't catch a sift bug, so I'd fuzz it against a
 * sort."
 *
 * POP: take the root, move the LAST element to index 0, shrink, then sift down.
 * Moving the last element (rather than promoting a child) is what keeps the
 * tree complete, which is what makes the array layout valid.
 */
export class MinHeap {
  private readonly heap: number[] = [];

  get size(): number {
    return this.heap.length;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  push(value: number): void {
    this.heap.push(value);
    this.siftUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;

    const root = this.heap[0]!;
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last; // keep the tree complete
      this.siftDown(0);
    }

    return root;
  }

  private siftUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent]! <= this.heap[i]!) break;
      this.swap(parent, i);
      i = parent;
    }
  }

  private siftDown(index: number): void {
    let i = index;
    const n = this.heap.length;

    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      // Compare against BOTH children and take the smaller one.
      if (left < n && this.heap[left]! < this.heap[smallest]!) smallest = left;
      if (right < n && this.heap[right]! < this.heap[smallest]!) smallest = right;

      if (smallest === i) break;
      this.swap(i, smallest);
      i = smallest;
    }
  }

  private swap(a: number, b: number): void {
    const temp = this.heap[a]!;
    this.heap[a] = this.heap[b]!;
    this.heap[b] = temp;
  }
}

/**
 * PROBLEM 2 — Top K Frequent Elements
 *
 * NARRATION — the good answer beats the expected one:
 *   "The textbook answer is a size-k min-heap: O(n log k). But there's a
 *    constraint I can exploit — a frequency can never exceed n, so I can index
 *    an array BY frequency. Bucket sort gives me O(n), and I don't have to
 *    write a heap at all."
 *
 * COMPLEXITY: O(n) time — one pass to count, one to bucket, one to collect.
 *             O(n) space.
 *
 * `buckets[f]` holds every value that appeared exactly f times. Walking from
 * the highest frequency downwards and taking until you have k gives the answer.
 * The array has n+1 slots because a frequency of n is possible (all identical).
 *
 * TIE-BREAKING is unspecified here — any k of the tied values is acceptable. If
 * the interviewer wants determinism (say, smallest value first), ask; it is a
 * one-line sort inside each bucket.
 */
export function topKFrequent(nums: number[], k: number): number[] {
  if (k <= 0 || nums.length === 0) return [];

  const counts = new Map<number, number>();
  for (const num of nums) counts.set(num, (counts.get(num) ?? 0) + 1);

  // A frequency is at most nums.length, so bucket by it.
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) buckets[count]!.push(value);

  const result: number[] = [];
  for (let frequency = buckets.length - 1; frequency >= 1 && result.length < k; frequency -= 1) {
    for (const value of buckets[frequency]!) {
      result.push(value);
      if (result.length === k) break;
    }
  }

  return result;
}

/**
 * PROBLEM 3 — Kth Largest Element
 *
 * WHY A MIN-HEAP FOR THE K LARGEST — the bit people get backwards:
 *   "I keep a min-heap of size k holding the best k seen so far. Its ROOT is
 *    the smallest of those, so testing whether a new value belongs is O(1), and
 *    evicting is O(log k). When the pass ends, the heap holds exactly the k
 *    largest values and its root is the kth largest."
 *
 * COMPLEXITY: O(n log k) time, O(k) space. Better than sorting's O(n log n)
 *             when k is much smaller than n; identical when k ≈ n.
 *
 * THE FOLLOW-UP: Quickselect — partition around a pivot and recurse into only
 * the side that contains the answer. O(n) average, O(1) extra space, but O(n²)
 * worst case unless the pivot is randomised. Introselect (used by many standard
 * libraries) falls back to a guaranteed O(n log n). Naming the worst case and
 * the mitigation is what earns the point; you rarely need to implement it.
 *
 * SIMPLEST DEFENSIBLE ANSWER, worth saying: "for n in the thousands I'd just
 * sort and index — O(n log n), one line, no bugs. The heap matters when n is
 * huge and k is small, or when the data arrives as a stream."
 */
export function findKthLargest(nums: number[], k: number): number | undefined {
  if (k <= 0 || k > nums.length) return undefined;

  const heap = new MinHeap();

  for (const num of nums) {
    heap.push(num);
    // Keep only the k largest; the root is the smallest of those.
    if (heap.size > k) heap.pop();
  }

  return heap.peek();
}
