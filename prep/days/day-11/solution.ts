/**
 * SOLUTIONS — Cyclic sort
 */

/**
 * PROBLEM 2 — Find all duplicates
 *
 * COMPLEXITY: O(n) time, O(1) extra space.
 *
 * NARRATION — lead with the relationship to day-10's problem:
 *   "Same setup, read the other way. Here I'll use sign marking: for each value
 *    v I flip the sign of the slot at index |v| - 1 to record that I have seen
 *    v. If that slot is already negative, this is the second time I have seen
 *    v, so v is a duplicate. One pass, no extra space."
 *
 * `Math.abs` ON EVERY READ is not optional — by the time you reach index i, its
 * own value may already have been negated by an earlier marking, so the raw
 * value is meaningless. Forgetting this reads negative indices and silently
 * returns nonsense.
 *
 * RESTORING THE INPUT: a second pass taking `Math.abs` of everything puts the
 * array back if the caller cares. Offer it — "I'm mutating your input, here is
 * how I'd undo it" is exactly the kind of remark that reads as senior.
 *
 * THE CONSTRAINT THAT MAKES IT WORK is that values are POSITIVE and bounded by
 * n. With zeroes or negatives in the input, the sign channel is unavailable and
 * you are back to cyclic sort or a hash set.
 */
export function findAllDuplicates(nums: number[]): number[] {
  const duplicates: number[] = [];

  for (const value of nums) {
    const index = Math.abs(value) - 1; // abs: this slot may already be marked
    if (nums[index]! < 0) duplicates.push(Math.abs(value)); // seen before
    else nums[index] = -nums[index]!;
  }

  for (let i = 0; i < nums.length; i += 1) nums[i] = Math.abs(nums[i]!); // restore

  return duplicates;
}
