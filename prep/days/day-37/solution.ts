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

