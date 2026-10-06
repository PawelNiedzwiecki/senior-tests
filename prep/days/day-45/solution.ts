/**
 * SOLUTIONS — Trie
 */

/**
 * PROBLEM 2 — Maximum XOR of two numbers
 *
 * COMPLEXITY: O(31n) time and O(31n) space — linear in n, against O(n²) for the
 * brute force over pairs.
 *
 * NARRATION:
 *   "A trie over bits instead of letters. I insert every number most
 *    significant bit first, then for each number I walk the trie greedily
 *    preferring the OPPOSITE bit at every level, because XOR gives a 1 exactly
 *    where the bits differ. A 1 in a high position is worth more than all the
 *    lower bits together, so taking it whenever it is available is optimal —
 *    which makes a single pass enough."
 *
 * MOST SIGNIFICANT FIRST IS LOAD-BEARING. The greedy argument depends entirely
 * on higher bits dominating; insert from the bottom and there is nothing to be
 * greedy about. This is the question behind the question.
 *
 * 31 BITS, NOT 32: the values are non-negative and below 2^31, and JavaScript's
 * bitwise operators work on SIGNED 32-bit integers, so touching bit 31 would
 * invite sign weirdness. Choosing 31 deliberately, and saying why, is better
 * than choosing 32 and hoping.
 *
 * THE SHORTER ALTERNATIVE worth naming: build the answer bit by bit from the
 * top, keeping a Set of the numbers' high-order prefixes and asking whether any
 * pair of them differs in the bit under consideration. Same complexity, no
 * structure to define — often the faster thing to write under time pressure.
 *
 * SINGLE ELEMENT: with one number there is no pair, and the walk simply
 * retraces its own path, yielding 0. Correct without a special case, but say so
 * rather than leaving the interviewer to check.
 */
interface BitNode {
  zero: BitNode | null;
  one: BitNode | null;
}

export function findMaximumXOR(nums: number[]): number {
  if (nums.length < 2) return 0;

  const HIGHEST_BIT = 30; // values are < 2^31 and JS bitwise ops are signed 32-bit
  const root: BitNode = { zero: null, one: null };

  for (const num of nums) {
    let node = root;
    for (let bit = HIGHEST_BIT; bit >= 0; bit -= 1) {
      const digit = (num >> bit) & 1;
      if (digit === 0) node = node.zero ??= { zero: null, one: null };
      else node = node.one ??= { zero: null, one: null };
    }
  }

  let best = 0;

  for (const num of nums) {
    let node = root;
    let current = 0;

    for (let bit = HIGHEST_BIT; bit >= 0; bit -= 1) {
      const digit = (num >> bit) & 1;
      const wanted = digit === 0 ? node.one : node.zero; // prefer the OPPOSITE bit

      if (wanted !== null) {
        current |= 1 << bit; // the bits differ here — that is a 1 in the XOR
        node = wanted;
      } else {
        node = (digit === 0 ? node.zero : node.one)!; // forced to match
      }
    }

    best = Math.max(best, current);
  }

  return best;
}
