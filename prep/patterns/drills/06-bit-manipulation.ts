/**
 * PATTERN 16 — Bit manipulation
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: CATALOGUE.md § 16
 *
 * THE TELL: "appears twice except one", "O(1) space", "count the set bits",
 * "without extra memory".
 *
 * THE XOR ALGEBRA that does all the work:
 *   x ^ x = 0        a value cancels itself
 *   x ^ 0 = x        zero is the identity
 *   commutative and associative — so order does not matter
 * Therefore XOR-ing a whole array collapses every matched pair to nothing.
 *
 * THE OPERATIONS WORTH MEMORISING:
 *   x & 1              is x odd
 *   x >> 1             halve (non-negative)
 *   x & (x - 1)        clear the lowest set bit   ← Brian Kernighan popcount
 *   x & -x             isolate the lowest set bit
 *   1 << i             a mask for bit i
 *   (x >> i) & 1       read bit i
 *
 * THE JAVASCRIPT CAVEAT you should volunteer: bitwise operators coerce to
 * 32-BIT SIGNED integers. `1 << 31` is negative, and anything past 2³¹ breaks
 * silently. `>>>` is the unsigned right shift; `BigInt` is the escape hatch.
 * Numbers stay exact only to 2⁵³ regardless.
 */

/**
 * PROBLEM 1 — Single number
 * Every element appears exactly twice except one. Find it.
 *
 *   singleNumber([4, 1, 2, 1, 2]) → 4
 *   singleNumber([1])             → 1
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: one line. XOR everything together; the pairs annihilate.
 */
export function singleNumber(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Counting bits
 * For every i from 0 to n, return how many 1 bits its binary form has.
 *
 *   countBits(5) → [0, 1, 1, 2, 1, 2]
 *
 * TARGET: O(n) total — one operation per number, not one per bit.
 * HINT: two good answers, both worth knowing.
 *   (a) DP on the lowest bit:   bits[i] = bits[i >> 1] + (i & 1)
 *       "i without its last bit, plus that bit."
 *   (b) DP on Kernighan:        bits[i] = bits[i & (i - 1)] + 1
 *       "i with its lowest set bit cleared, plus one."
 * Both reuse an already-computed smaller answer, which is what makes it O(n)
 * rather than O(n log n).
 */
export function countBits(_n: number): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Single number II  ★ the harder variation ★
 * Every element appears exactly THREE times except one, which appears once.
 * Find it.
 *
 *   singleNumberII([2, 2, 3, 2])          → 3
 *   singleNumberII([0, 1, 0, 1, 0, 1, 99]) → 99
 *
 * TARGET: O(n) time, O(1) space.
 * WHY PLAIN XOR FAILS: XOR cancels in PAIRS. Three copies leave one behind, so
 *       the trick does not apply. Say this out loud — recognising why the
 *       familiar tool breaks is the point of the problem.
 * HINT: count each bit position independently. If a bit appears a number of
 *       times that is NOT a multiple of 3, that bit belongs to the answer.
 *       Sum bit i across all numbers, take it mod 3, and rebuild.
 * THE SIGN TRAP: bit 31 is the sign bit under 32-bit coercion, so naively
 *       setting it produces a large positive number instead of a negative one.
 *       `result | 0` (or `>> 0`) coerces back to a signed 32-bit integer.
 */
export function singleNumberII(_nums: number[]): number {
  throw new Error('Not implemented');
}
