/**
 * SOLUTIONS — Two pointers
 */

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
