/**
 * SOLUTIONS — Cyclic sort
 */

/**
 * PROBLEM 1 — Find all numbers disappeared
 *
 * COMPLEXITY: O(n) time, O(1) extra space.
 *
 * NARRATION:
 *   "The values are 1..n in an array of length n, so a value is really an index
 *    in disguise: v belongs at index v - 1. I put each value home with swaps —
 *    at most n of them, because every swap finalises a position — and then any
 *    index still holding the wrong value tells me which number is missing."
 *
 * THE GUARD IS `nums[i] !== nums[home]`, comparing VALUES. Writing `i !== home`
 * instead loops forever on duplicates: two copies of 3 both want index 2, and
 * swapping them exchanges identical values without making progress. This is
 * the single bug this problem exists to catch.
 *
 * WHY THE WHILE LOOP IS AMORTISED O(1): each swap places at least one value
 * permanently, so the total number of swaps across the whole run is bounded by
 * n. The nested loop is not quadratic and you should say why unprompted.
 *
 * THE ALTERNATIVE (sign marking) is shorter — negate nums[|v| - 1] for every v,
 * then every index still positive is missing — and it is what most people write
 * under time pressure. Mention it; it also destroys the input's signs, which
 * matters if the caller reuses the array.
 */
export function findDisappearedNumbers(nums: number[]): number[] {
  let i = 0;
  while (i < nums.length) {
    const home = nums[i]! - 1;
    if (nums[i] !== nums[home]) {
      [nums[i], nums[home]] = [nums[home]!, nums[i]!]; // one value lands home
    } else {
      i += 1;
    }
  }

  const missing: number[] = [];
  for (let j = 0; j < nums.length; j += 1) {
    if (nums[j] !== j + 1) missing.push(j + 1); // ascending for free
  }
  return missing;
}

/**
 * PROBLEM 2 — Find all duplicates
 *
 * COMPLEXITY: O(n) time, O(1) extra space.
 *
 * NARRATION — lead with the relationship to problem 1:
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
