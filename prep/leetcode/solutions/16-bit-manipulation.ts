/**
 * SOLUTIONS — Bit manipulation
 */

/**
 * PROBLEM 1 — Single number III
 *
 * COMPLEXITY: O(n) time, O(1) space, two passes.
 *
 * NARRATION:
 *   "XOR-ing everything cancels the pairs and leaves a ^ b. That's not enough on
 *    its own, so I use the fact that any set bit of a ^ b is a position where
 *    the two singletons differ. I isolate the lowest such bit with `diff &
 *    -diff`, split the array on it, and XOR each half separately — each half
 *    contains exactly one singleton, because both copies of any pair always
 *    land on the same side."
 *
 * `diff & -diff` isolates the lowest set bit: -diff is ~diff + 1 in two's
 * complement, which inverts everything above the lowest set bit while leaving
 * that bit and the zeroes beneath it unchanged, so the AND keeps exactly one
 * bit. Derive it rather than reciting it — it is the same identity behind
 * Fenwick tree indexing.
 *
 * WHY THE PARTITION IS SOUND: duplicates have identical bit patterns, so both
 * copies always fall on the same side and cancel there. The two singletons
 * differ at the chosen bit by construction, so they are separated. Each side
 * therefore XORs down to exactly one value.
 *
 * NEGATIVES: the whole argument is about bit patterns, so two's-complement
 * negatives need no special handling. Worth stating, since it is the first
 * thing an interviewer will poke at.
 *
 * THE BASELINE TO OFFER FIRST: a Map of counts, O(n) time and O(n) space. The
 * bit trick is only interesting because it removes the space.
 */
export function singleNumberIII(nums: number[]): [number, number] {
  let xorAll = 0;
  for (const num of nums) xorAll ^= num; // pairs cancel: leaves a ^ b

  const lowestDifferingBit = xorAll & -xorAll; // isolate one bit where a and b differ

  let first = 0;
  let second = 0;
  for (const num of nums) {
    if ((num & lowestDifferingBit) !== 0) first ^= num;
    else second ^= num;
  }

  return [first, second];
}

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
