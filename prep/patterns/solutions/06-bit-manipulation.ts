/**
 * SOLUTIONS — Bit manipulation
 */

/**
 * PROBLEM 1 — Single number
 *
 * NARRATION:
 *   "XOR is its own inverse and it's commutative, so XOR-ing the whole array
 *    cancels every pair regardless of order and leaves the lone value. One
 *    pass, one variable — O(n) time, O(1) space."
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * THE ALTERNATIVES, worth naming so it does not look like you only know the
 * trick: a hash map of counts is O(n) space; sorting then scanning pairs is
 * O(n log n). XOR wins on both axes, which is why the problem exists.
 *
 * NEGATIVES ARE FINE — XOR operates on the two's-complement bit patterns, and
 * a value still cancels itself whatever its sign.
 */
export function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) result ^= num;
  return result;
}

/**
 * PROBLEM 2 — Counting bits
 *
 * NARRATION:
 *   "Counting each number's bits independently is O(n log n). But every number
 *    contains a smaller number I've already solved: i without its last bit is
 *    i >> 1, which I computed earlier. So bits[i] = bits[i >> 1] + (i & 1) —
 *    one operation per number, O(n)."
 *
 * COMPLEXITY: O(n) time, O(n) space for the output.
 *
 * THIS IS DP, NOT BIT TRICKERY. The state is "bits in i", the recurrence reuses
 * a strictly smaller index, and the order is ascending. Framing it as DP is a
 * better answer than framing it as a bit hack.
 *
 * THE OTHER RECURRENCE, `bits[i] = bits[i & (i - 1)] + 1`, uses Brian
 * Kernighan's observation: `i & (i - 1)` clears the lowest set bit, so i has
 * exactly one more set bit than that smaller number. Equally valid; mention
 * that you know both and that `i >> 1` is the more obvious one to read.
 */
export function countBits(n: number): number[] {
  const bits = new Array<number>(n + 1).fill(0);

  for (let i = 1; i <= n; i += 1) {
    // i >> 1 is i without its lowest bit; (i & 1) adds that bit back.
    bits[i] = bits[i >> 1]! + (i & 1);
  }

  return bits;
}

/**
 * PROBLEM 3 — Single number II (every value appears three times)
 *
 * LEAD WITH WHY THE OBVIOUS TOOL FAILS:
 *   "XOR cancels in pairs, so with three copies one survives and the trick
 *    doesn't apply. But the underlying idea still does: I'll count each bit
 *    position independently. For every bit, the three-times values contribute a
 *    multiple of three, so whatever is left over mod 3 belongs to the answer."
 *
 * COMPLEXITY: O(32n) = O(n) time, O(1) space. The 32 is a constant — say so
 *             explicitly rather than letting it look like a hidden factor.
 *
 * THE SIGN-BIT TRAP, which is the real content of this problem in JavaScript:
 * bit 31 is the sign bit under 32-bit coercion. Setting it with
 * `result |= 1 << 31` inside a plain number produces 2147483648 — a large
 * POSITIVE value — because `result` is a double. `result | 0` coerces back to a
 * signed 32-bit integer, turning it into the intended negative. The `[5,5,5,-7]`
 * test exists to catch exactly this, and it is the sort of language-specific
 * detail an interviewer enjoys.
 *
 * THE ELEGANT ALTERNATIVE is a two-variable state machine (`ones` and `twos`)
 * that tracks each bit's count mod 3 in parallel. It is three lines and almost
 * impossible to derive under pressure; know it exists, but the bit-counting
 * version is the one to write live because you can explain every line of it.
 */
export function singleNumberII(nums: number[]): number {
  let result = 0;

  for (let bit = 0; bit < 32; bit += 1) {
    let sum = 0;
    for (const num of nums) sum += (num >> bit) & 1;

    // Whatever survives mod 3 belongs to the lone value.
    if (sum % 3 !== 0) result |= 1 << bit;
  }

  // Coerce to signed 32-bit: without this, bit 31 reads as +2147483648.
  return result | 0;
}
