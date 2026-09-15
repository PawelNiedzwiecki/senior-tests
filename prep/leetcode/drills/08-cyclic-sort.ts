/**
 * PATTERN 08 — Cyclic sort                               [LeetCode 448, 442]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 30 min      Catalogue: ../patterns/CATALOGUE.md § 8
 *
 * THE PATTERN
 * When an array of length n holds values drawn from 1..n (or 0..n-1), THE
 * VALUES ARE INDICES IN DISGUISE. Value v belongs at index v - 1. Put every
 * value where it belongs and the anomalies — missing numbers, duplicates —
 * fall out of the positions that are still wrong.
 *
 * THE TELL
 *   "an array of n integers where each is in the range [1, n]"
 *   "find the missing / duplicated number"  ·  "O(1) extra space" in the same
 *   sentence as a counting problem
 *
 * WHY THE SWAPPING LOOP IS O(n) DESPITE BEING NESTED — this is the thing to say:
 *   "Every swap puts at least one value permanently into its final position, so
 *    there can be at most n swaps across the entire run. The while loop is
 *    amortised O(1) per element."
 *
 * TEMPLATE
 *   let i = 0;
 *   while (i < nums.length) {
 *     const home = nums[i] - 1;                   // where nums[i] belongs
 *     if (nums[i] !== nums[home]) swap(i, home);  // compare VALUES, not indices
 *     else i += 1;
 *   }
 *
 * COMPARE VALUES, NOT INDICES, in the guard. `nums[i] !== nums[home]` terminates
 * on duplicates; `i !== home` spins forever the moment two equal values want
 * the same slot.
 *
 * THE SIGN-MARKING VARIANT — often simpler, and worth knowing as an alternative:
 * instead of sorting, negate `nums[|v| - 1]` to record "I have seen v". A slot
 * that is still positive at the end was never seen. It destroys the input's
 * signs (restorable by a final pass) and only works when the values are
 * positive, but it is fewer lines and no swaps.
 *
 * COST — O(n) time, O(1) extra space. The O(1) is the whole reason this pattern
 * exists; a hash set solves all of these problems trivially in O(n) space, so
 * if the interviewer has not asked for O(1) space, ask whether they want it.
 */

/**
 * PROBLEM 1 — Find all numbers disappeared in an array          [LeetCode 448]
 * ────────────────────────────────────────────────────────────────────────────
 * `nums` has length n and every value is in [1, n]. Some values appear twice
 * and some are missing. Return all the missing values, ascending.
 *
 *   findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])  → [5, 6]
 *   findDisappearedNumbers([1, 1])                    → [2]
 *   findDisappearedNumbers([1, 2, 3])                 → []
 *
 * TARGET: O(n) time, O(1) extra space (the output does not count).
 *
 * TWO WAYS, both worth being able to write:
 *   · CYCLIC SORT — place every value at index value - 1; any index i where
 *     nums[i] !== i + 1 means i + 1 is missing.
 *   · SIGN MARKING — for each value v, negate nums[|v| - 1]. Every index that
 *     is still positive at the end is a missing value. Shorter, no swaps.
 *
 * SAY THE OBVIOUS SOLUTION FIRST anyway: a Set of the values, then check 1..n.
 *       O(n) time but O(n) space. Then say "the constraint that values are
 *       1..n lets me use the array itself as the set" and improve it. Showing
 *       the ladder is worth more than jumping to the clever answer.
 *
 * ASCENDING OUTPUT falls out for free from either approach — you scan left to
 *       right — so do not sort at the end.
 */
export function findDisappearedNumbers(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Find all duplicates in an array                   [LeetCode 442]
 * ────────────────────────────────────────────────────────────────────────────
 * Same setup: length n, values in [1, n], each value appears ONCE OR TWICE.
 * Return every value that appears twice. Any order is fine.
 *
 *   findAllDuplicates([4, 3, 2, 7, 8, 2, 3, 1])  → [2, 3]
 *   findAllDuplicates([1, 1, 2])                 → [1]
 *   findAllDuplicates([1, 2, 3])                 → []
 *
 * TARGET: O(n) time, O(1) extra space.
 *
 * THE MIRROR IMAGE of problem 1 — and noticing that they are the same algorithm
 *       read two ways is the actual insight. After a cyclic sort, an index i
 *       where `nums[i] !== i + 1` means i + 1 is missing AND the value sitting
 *       there is a duplicate.
 *
 * WITH SIGN MARKING it is even more direct: when you go to negate
 *       `nums[|v| - 1]` and it is ALREADY negative, you have seen v before —
 *       so v is a duplicate. That check is the entire solution.
 *
 * THE FOLLOW-UP TO PRE-EMPT: "what if a value can appear three times?" Sign
 *       marking would report it twice; cyclic sort still works but you must
 *       deduplicate. Knowing which of your two tools survives the relaxed
 *       constraint is exactly the senior-level distinction.
 */
export function findAllDuplicates(_nums: number[]): number[] {
  throw new Error('Not implemented');
}
