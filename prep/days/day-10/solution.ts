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

