/**
 * PATTERN 11 — Heap / top-K / two heaps                    [LeetCode 295, 23]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 11
 *
 * THE PATTERN
 * A heap keeps the single most extreme element of a changing collection
 * available in O(1), with O(log n) insertion and removal. Reach for it when you
 * need the best element REPEATEDLY while the collection keeps changing — which
 * is precisely when sorting is the wrong tool, because sorting answers the
 * question once and then goes stale.
 *
 * THE TELL
 *   "k largest / smallest / most frequent"      → one heap of size k
 *   "median of a stream"                        → TWO heaps
 *   "merge k sorted things"                     → heap of the k front elements
 *   "schedule / process the next available…"    → heap keyed by availability
 *
 * THE SIZE-K TRICK worth internalising: for "k largest", keep a MIN-heap of
 * size k. The smallest of your current best k sits at the top, so deciding
 * whether a new element belongs is one comparison. O(n log k), and O(k) memory
 * rather than O(n) — which matters when n is a stream and does not fit in
 * memory. The inversion (min-heap for largest) is the part people get backwards.
 *
 * THE TWO-HEAP TRICK: a MAX-heap for the lower half and a MIN-heap for the
 * upper half. The two tops are the middle elements. Keep the sizes within one
 * of each other and the median is either one top or the average of both.
 *
 * COST — build O(n), push/pop O(log n), peek O(1).
 *
 * JAVASCRIPT HAS NO HEAP. You will hand-roll one: an array where node i has
 * children 2i+1 and 2i+2, with sift-up on push and sift-down on pop. Write it
 * once from memory (`prep/algo/drills/10-heaps-topk.ts` is that exercise) so
 * that in an interview it is ten minutes of muscle memory, not invention.
 *
 * ALWAYS OFFER THE ALTERNATIVE: for "top k frequent", bucket sort by frequency
 * is O(n) and beats the heap's O(n log k). For small k, a partial selection
 * sort is fine. The heap is a default, not a law.
 */


/**
 * PROBLEM 1 — Find median from a data stream                    [LeetCode 295]
 * ────────────────────────────────────────────────────────────────────────────
 * Support `addNum` and `findMedian` over an unbounded stream of numbers. With
 * an even count, the median is the average of the two middle values.
 *
 *   const mf = createMedianFinder();
 *   mf.addNum(1); mf.addNum(2);
 *   mf.findMedian()   → 1.5
 *   mf.addNum(3);
 *   mf.findMedian()   → 2
 *
 * TARGET: O(log n) per add, O(1) per median query.
 *
 * WHY NOT A SORTED ARRAY: inserting into it is O(n) because of the shifting.
 *       That is the baseline to state and then beat — and if the interviewer
 *       says adds are rare and queries constant, the sorted array is genuinely
 *       the better engineering answer. Say that too.
 *
 * THE STRUCTURE: a MAX-heap holding the smaller half, a MIN-heap holding the
 *       larger half. Their tops are the two middle elements.
 *
 * THE INVARIANTS, which is what the code is really maintaining:
 *       1. every value in `low` <= every value in `high`
 *       2. sizes differ by at most one
 *
 * THE RELIABLE ADD, which avoids all the case analysis: always push to `low`,
 *       immediately move `low`'s top into `high`, then if `high` has grown
 *       larger than `low`, move its top back. Three lines, no branching on
 *       which heap the value belongs to, and both invariants hold by
 *       construction.
 *
 * THE FOLLOW-UPS interviewers escalate to: "what if all numbers are in
 *       [0, 100]?" — counting array, O(1) add, O(100) median. "What if 99% are
 *       in that range?" — counting array plus overflow heaps at each end.
 */
export interface MedianFinder {
  addNum(num: number): void;
  findMedian(): number;
}

export function createMedianFinder(): MedianFinder {
  throw new Error('Not implemented');
}

