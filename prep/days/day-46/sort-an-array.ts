/**
 * PATTERN 21 — Divide and conquer                        [LeetCode 912, 315]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      Catalogue: ../patterns/CATALOGUE.md § 21
 *
 * THE PATTERN
 * Split the input into independent halves, solve each recursively, then COMBINE
 * the results. The combine step is where the real work — and the interesting
 * problems — live. Binary search is the degenerate case where one half is
 * thrown away and there is nothing to combine.
 *
 * THE TELL
 *   "sort it yourself"  ·  "count the pairs / inversions"  ·  "closest pair"
 *   a problem where the answer for the whole is cheap to assemble from the
 *   answers for the halves plus something about how they INTERACT
 *
 * THE COST MODEL — the master theorem, in the only three forms you need:
 *     T(n) = 2T(n/2) + O(n)      →  O(n log n)   (merge sort)
 *     T(n) = 2T(n/2) + O(1)      →  O(n)         (a simple tree walk)
 *     T(n) = T(n/2)  + O(1)      →  O(log n)     (binary search)
 * Being able to write the recurrence for your own solution and read off its
 * complexity is worth more than memorising the theorem's general form.
 *
 * WHAT MAKES A PROBLEM A GOOD FIT: the two halves must be solvable
 * INDEPENDENTLY. If solving the right half needs the answer from the left, that
 * is dynamic programming, not divide and conquer. Saying which one you are in,
 * and why, is a distinction interviewers listen for.
 *
 * THE TECHNIQUE WORTH STEALING — counting during the merge. While merging two
 * sorted halves, the moment you take an element from the RIGHT half you know it
 * is smaller than everything remaining in the LEFT half. That fact, free at
 * merge time, counts inversions, smaller-elements-to-the-right, and reverse
 * pairs. Counting smaller elements after self (day-47) is this idea, and it generalises further than most
 * candidates realise.
 *
 * STABILITY, AND WHY IT MATTERS IN JAVASCRIPT: merge sort is stable; quicksort
 * is not. `Array.prototype.sort` has been required to be stable since ES2019 —
 * V8 uses TimSort, which is merge sort with run detection. Knowing that is a
 * good answer to "why would you ever write your own sort?"
 *
 * AND — ALWAYS SAY THIS FIRST — `[3, 10, 2].sort()` gives [10, 2, 3], because
 * the default comparator converts to strings. `sort((a, b) => a - b)` is not
 * optional for numbers. Nothing signals inattention faster than forgetting it.
 */

/**
 * PROBLEM 1 — Sort an array                                     [LeetCode 912]
 * ────────────────────────────────────────────────────────────────────────────
 * Sort ascending WITHOUT using the built-in sort, in O(n log n) time. Return a
 * new array; leave the input alone.
 *
 *   sortArray([5, 2, 3, 1])       → [1, 2, 3, 5]
 *   sortArray([5, 1, 1, 2, 0, 0]) → [0, 0, 1, 1, 2, 5]
 *   sortArray([])                 → []
 *
 * TARGET: O(n log n) time, O(n) space. Merge sort is the answer to write:
 *       quicksort's O(n²) worst case makes it the riskier thing to defend, and
 *       heapsort's constant factors are poor.
 *
 * THE THREE STEPS: split at the midpoint, sort each half recursively, merge the
 *       two sorted halves with two pointers. The merge is the only part with
 *       any content.
 *
 * THE MERGE, and the detail that matters: take from the left half when
 *       `left[i] <= right[j]`. Using `<` instead breaks STABILITY — equal
 *       elements would swap order — which is invisible for plain numbers and
 *       very visible when sorting objects by one key. Mention it even here.
 *
 * BASE CASE: a run of length 0 or 1 is already sorted. Getting the base case
 *       wrong is the standard infinite recursion in this problem.
 *
 * WHAT TO SAY ABOUT SPACE: merge sort needs O(n) auxiliary space, and in-place
 *       merging is possible but has terrible constants. Quicksort is O(log n)
 *       stack and no auxiliary array, which is why library sorts for primitives
 *       often prefer it. The trade-off is the interesting part of the answer.
 */
export function sortArray(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

