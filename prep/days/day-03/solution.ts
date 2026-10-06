/**
 * SOLUTIONS — Two pointers
 */

/**
 * PROBLEM 1 — 3Sum
 *
 * COMPLEXITY: O(n log n) sort + O(n²) scan = O(n²) time, O(1) extra space.
 *
 * NARRATION:
 *   "Brute force is three nested loops, O(n³). If I sort first, then for each
 *    fixed element the rest is a two-sum on a sorted array, which two pointers
 *    solve in linear time — so O(n²) overall. Sorting also puts duplicates
 *    adjacent, which is how I deduplicate without a hash set."
 *
 * THE THREE DEDUPLICATION POINTS, all of which tests will hit:
 *   1. skip a fixed element identical to the previous one
 *   2. after a hit, advance `lo` past its duplicates
 *   3. after a hit, retreat `hi` past its duplicates
 * Miss any one and [0,0,0,0] or [-2,0,0,2,2] produces repeats.
 *
 * THE EARLY BREAK: with the array sorted, `nums[i] > 0` means every remaining
 * value is positive and no triplet can reach zero.
 *
 * THE GENERALISATION to name if asked: kSum is this recursively — peel off one
 * fixed element per level until you reach the two-pointer base case, giving
 * O(n^(k-1)).
 */
export function threeSum(nums: number[]): number[][] {
  const sorted = [...nums].sort((a, b) => a - b);
  const out: number[][] = [];

  for (let i = 0; i < sorted.length - 2; i += 1) {
    if (sorted[i]! > 0) break; // smallest is positive — nothing left can sum to 0
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // dedupe the fixed element

    let lo = i + 1;
    let hi = sorted.length - 1;

    while (lo < hi) {
      const sum = sorted[i]! + sorted[lo]! + sorted[hi]!;

      if (sum < 0) {
        lo += 1;
      } else if (sum > 0) {
        hi -= 1;
      } else {
        out.push([sorted[i]!, sorted[lo]!, sorted[hi]!]);
        lo += 1;
        hi -= 1;
        while (lo < hi && sorted[lo] === sorted[lo - 1]) lo += 1; // dedupe left
        while (lo < hi && sorted[hi] === sorted[hi + 1]) hi -= 1; // dedupe right
      }
    }
  }

  return out;
}

