/**
 * SOLUTIONS — Prefix sum / running aggregate
 */

/**
 * PROBLEM 1 — Contiguous array
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * NARRATION — lead with the reframe:
 *   "Counting equal 0s and 1s is awkward; mapping 0 to -1 turns it into
 *    'longest subarray summing to zero', and a subarray sums to zero exactly
 *    when its two endpoint prefixes are equal. So I keep a running balance and
 *    remember the first index at which each balance occurred."
 *
 * FIRST OCCURRENCE ONLY. This is a LONGEST problem, so the earliest index that
 * produced a balance gives the widest span. Overwriting the stored index on a
 * repeat is the classic bug — it quietly returns a shorter answer and passes
 * the small examples.
 *
 * THE `{0: -1}` SEED means "balance was zero before index 0". With it, a
 * balance of zero at index j yields length `j - (-1) = j + 1`, which is the
 * whole prefix — correct. Without it, `[0, 1]` returns 0.
 *
 * THE VARIANT TO NAME: replace "first index" with "count of occurrences" and
 * the same loop counts subarrays summing to K instead of finding the longest
 * one. Same identity, different bookkeeping.
 */
export function findMaxLength(nums: number[]): number {
  const firstIndex = new Map<number, number>([[0, -1]]); // balance → first index
  let balance = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i += 1) {
    balance += nums[i] === 1 ? 1 : -1;

    const seen = firstIndex.get(balance);
    if (seen === undefined) {
      firstIndex.set(balance, i); // first time only — never overwrite
    } else {
      best = Math.max(best, i - seen);
    }
  }

  return best;
}

