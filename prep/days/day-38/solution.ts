/**
 * SOLUTIONS — Bit manipulation
 */

/**
 * PROBLEM 2 — Bitwise AND of a number range
 *
 * COMPLEXITY: O(log right) time, O(1) space. Iterating the range would be
 * O(right - left), which for the stated constraints is two billion steps.
 *
 * NARRATION:
 *   "The answer is the common binary prefix of the two endpoints. Any bit where
 *    they differ must have been 0 somewhere inside the range — that's what it
 *    means for the bit to have flipped between them — and a single zero clears
 *    it in an AND. So I strip bits off `right` until it no longer exceeds
 *    `left`, and what survives is exactly that shared prefix."
 *
 * `right &= right - 1` clears the lowest set bit (Kernighan's idiom), so the
 * loop runs once per set bit rather than once per bit position. The
 * shift-until-equal formulation is equally valid and perhaps clearer to
 * explain; both are O(log n).
 *
 * WHY THE LOOP TERMINATES AT THE RIGHT PLACE: once `right <= left`, no bits
 * below the common prefix remain set in `right`, and since `right` started at
 * or above `left` and only lost bits, what remains is the prefix they share.
 *
 * THE DEGENERATE CASES fall out without special handling: `left === right`
 * exits the loop immediately and returns it unchanged; `left === 0` strips
 * `right` down to 0.
 *
 * THE JAVASCRIPT CAVEAT worth voicing: these operators work on signed 32-bit
 * integers, so this is correct up to 2^31 - 1 — which happens to be exactly the
 * problem's stated upper bound. Beyond it you would need BigInt.
 */
export function rangeBitwiseAnd(left: number, right: number): number {
  let result = right;
  while (result > left) {
    result &= result - 1; // clear the lowest set bit
  }
  return result;
}
