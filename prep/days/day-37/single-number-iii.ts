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
 * the single-number-III trick below, and to Fenwick trees.
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
 * PROBLEM 1 — Single number III                                 [LeetCode 260]
 * ────────────────────────────────────────────────────────────────────────────
 * Exactly TWO values appear once; every other value appears twice. Return the
 * two singletons, in any order.
 *
 *   singleNumberIII([1, 2, 1, 3, 2, 5])  → [3, 5]
 *   singleNumberIII([-1, 0])             → [-1, 0]
 *   singleNumberIII([0, 1])              → [0, 1]
 *
 * TARGET: O(n) time, O(1) space. A frequency map solves it instantly in O(n)
 *       space — say that first, then earn the O(1).
 *
 * STEP 1: XOR everything. The pairs cancel, leaving `a ^ b` where a and b are
 *       the two singletons. That alone does not separate them, which is the
 *       whole difficulty.
 *
 * STEP 2 — THE TRICK: any set bit of `a ^ b` is a position where a and b
 *       DIFFER. Isolate one with `diff & -diff`, then partition the entire
 *       array by that bit. Each partition contains exactly one singleton, plus
 *       pairs that stay together because both copies share every bit. XOR each
 *       partition separately and you have both answers.
 *
 * WHY ANY DIFFERING BIT WORKS: a and b are distinct, so `a ^ b` is non-zero and
 *       at least one such bit exists. The lowest is simply the cheapest to
 *       isolate.
 *
 * NEGATIVES ARE FINE: the partition test only needs the two singletons to land
 *       on opposite sides, which holds for the two's-complement bit pattern
 *       regardless of sign.
 */
export function singleNumberIII(_nums: number[]): [number, number] {
  throw new Error('Not implemented');
}

