/**
 * PATTERN 16 — Bit manipulation                          [LeetCode 260, 201]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 35 min      Catalogue: ../patterns/CATALOGUE.md § 16
 *
 * THE PATTERN
 * Treat an integer as a fixed-width array of bits. XOR is the workhorse,
 * because of three properties that together solve most of these problems:
 *
 *     x ^ x = 0          a value cancels itself
 *     x ^ 0 = x          zero is the identity
 *     XOR is commutative and associative — ORDER DOES NOT MATTER
 *
 * Those three mean "XOR everything together" makes paired values vanish and
 * leaves exactly the unpaired ones behind.
 *
 * THE TELL
 *   "every element appears twice except…"  ·  "without extra memory"
 *   "count the set bits"  ·  "swap / toggle / mask"  ·  subsets via bitmask
 *
 * THE IDIOMS WORTH KNOWING COLD
 *     x & 1                    is x odd?
 *     x >> 1                   halve (careful: >> is arithmetic, >>> logical)
 *     x & (x - 1)              clear the LOWEST set bit  (Brian Kernighan)
 *     x & -x                   ISOLATE the lowest set bit
 *     x | (1 << i)             set bit i
 *     x & ~(1 << i)            clear bit i
 *     x ^ (1 << i)             toggle bit i
 *
 * `x & -x` IS THE ONE TO UNDERSTAND RATHER THAN MEMORISE: -x is two's
 * complement, i.e. ~x + 1, which flips everything above the lowest set bit and
 * leaves that bit alone. AND-ing recovers exactly that bit. It is the key to
 * the single-number-III trick (day-37), and to Fenwick trees.
 *
 * JAVASCRIPT CAVEATS, which interviewers do probe:
 *   · bitwise operators coerce to SIGNED 32-BIT, so anything above 2^31 - 1
 *     wraps. `5 << 30` is fine; `5 << 31` is negative.
 *   · `>>` preserves the sign bit, `>>>` does not. For counting bits of a
 *     possibly negative number, `>>>` is what you want.
 *   · BigInt exists for wider arithmetic but has no unsigned shift.
 *
 * COST — O(1) per operation, O(number of bits) per number: effectively
 * constant, and O(1) space, which is usually the entire point.
 */

/**
 * PROBLEM 2 — Bitwise AND of a number range                     [LeetCode 201]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the bitwise AND of every integer in the INCLUSIVE range [left, right].
 *
 *   rangeBitwiseAnd(5, 7)   → 4        (5 & 6 & 7)
 *   rangeBitwiseAnd(0, 0)   → 0
 *   rangeBitwiseAnd(1, 2147483647) → 0
 *   rangeBitwiseAnd(12, 15) → 12
 *
 * TARGET: O(log n) time, O(1) space. Looping over the range is O(n) and the
 *       range can be two billion wide — so the loop is not merely slow, it is
 *       disqualifying.
 *
 * THE INSIGHT, and it is a genuinely lovely one: the answer is the COMMON
 *       BINARY PREFIX of `left` and `right`. Any bit position where they differ
 *       must, somewhere in the range, be 0 in some number — because to go from
 *       left to right that bit had to flip — and one zero is enough to clear it
 *       in an AND. Every bit below the highest differing bit is likewise
 *       cleared.
 *
 * TWO WAYS TO COMPUTE IT:
 *       · shift both right until they are equal, counting the shifts, then
 *         shift the common value back left
 *       · repeatedly clear the lowest set bit of `right` (`right &= right - 1`)
 *         until `right <= left`, then return right. Fewer iterations, and a
 *         nice use of the Kernighan idiom.
 *
 * SANITY CHECKS: `left === right` returns left; `left === 0` returns 0; and if
 *       left and right have a different bit length the answer is 0.
 */
export function rangeBitwiseAnd(_left: number, _right: number): number {
  throw new Error('Not implemented');
}
