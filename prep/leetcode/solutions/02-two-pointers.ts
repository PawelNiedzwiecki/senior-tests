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

/**
 * PROBLEM 2 — Valid palindrome with one deletion
 *
 * COMPLEXITY: O(n) time, O(1) space. The helper runs at most twice and each
 * run is bounded by the remaining span, so it stays linear overall.
 *
 * NARRATION:
 *   "Converge from both ends. The first mismatch is the only place a deletion
 *    can help, because any deletion elsewhere leaves this pair unequal. So I
 *    branch once: is the string a palindrome without the left character, or
 *    without the right one? Both checks are plain palindrome checks on a range."
 *
 * INDEX BOUNDS, NOT SUBSTRINGS: `isPalindromeRange(s, lo, hi)` avoids the
 * allocation that `s.slice()` would do on every call — the difference between
 * O(n) and O(n²) memory traffic, and the kind of detail a senior interview is
 * actually probing for.
 *
 * THE FOLLOW-UP: "at most k deletions" is no longer a two-pointer problem — it
 * becomes an edit-distance DP against the reversed string, O(n²). Recognising
 * where the pattern stops working is worth as much as applying it.
 */
function isPalindromeRange(s: string, lo: number, hi: number): boolean {
  while (lo < hi) {
    if (s[lo] !== s[hi]) return false;
    lo += 1;
    hi -= 1;
  }
  return true;
}

export function validPalindromeII(s: string): boolean {
  let lo = 0;
  let hi = s.length - 1;

  while (lo < hi) {
    if (s[lo] !== s[hi]) {
      // The only two repairs that can possibly fix THIS pair.
      return isPalindromeRange(s, lo + 1, hi) || isPalindromeRange(s, lo, hi - 1);
    }
    lo += 1;
    hi -= 1;
  }

  return true; // already a palindrome — the deletion is optional
}
