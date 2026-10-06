/**
 * SOLUTIONS — Fast & slow pointers
 */


/**
 * PROBLEM 1 — Find the duplicate number
 *
 * COMPLEXITY: O(n) time, O(1) space, input unmodified.
 *
 * NARRATION — start from the constraints, not the trick:
 *   "A Set solves it in O(n) space and sorting solves it by mutating, and both
 *    are ruled out. What is left is to notice that i → nums[i] is a function on
 *    indices, so the array IS a linked list. With n + 1 values drawn from
 *    1..n, pigeonhole says two indices share a successor — a cycle — and the
 *    repeated value is the node where the cycle starts. That is Floyd's."
 *
 * PHASE 1 finds a meeting point inside the cycle. PHASE 2 resets one pointer to
 * the start; the distance from head to the entrance equals the distance from
 * the meeting point to the entrance (mod the cycle length), so stepping both by
 * one lands them together exactly at the entrance.
 *
 * THE DO/WHILE MATTERS: slow and fast both start at index 0, so a `while (slow
 * !== fast)` loop exits immediately without moving. Either use do/while or
 * offset the starting positions.
 *
 * WHY INDEX 0 IS SAFE AS A START: every value is >= 1, so nothing ever points
 * back to index 0; it is guaranteed to be on the tail rather than in the cycle,
 * which is what the entrance argument requires.
 *
 * THE FALLBACK WORTH OFFERING: binary search on the VALUE range, counting how
 * many entries are <= mid — O(n log n) time, O(1) space, no cleverness needed.
 * If Floyd's does not surface under pressure, this one will.
 */
export function findDuplicate(nums: number[]): number {
  // Phase 1 — find a meeting point inside the cycle.
  let slow = nums[0]!;
  let fast = nums[0]!;
  do {
    slow = nums[slow]!;
    fast = nums[nums[fast]!]!;
  } while (slow !== fast);

  // Phase 2 — walk from the start and from the meeting point, one step each.
  slow = nums[0]!;
  while (slow !== fast) {
    slow = nums[slow]!;
    fast = nums[fast]!;
  }

  return slow; // the cycle entrance — i.e. the duplicated value
}

