/**
 * SOLUTION — Roman numerals
 *
 * COMPLEXITY: O(1) — input is bounded by 3999 (at most 15 symbols).
 *
 * NARRATION:
 *   "toRoman is greedy over a 13-entry table that includes the subtractive
 *    pairs, so there are no special cases. For fromRoman, I sum with the
 *    'smaller before bigger means subtract' rule, and then validate by
 *    converting back: the input is canonical iff toRoman(result) equals it."
 *
 * THE ROUND-TRIP TRICK is the senior move. Enumerating illegal patterns
 * ("no IIII", "no VV", "I only before V and X", "no IXI"...) is a long list
 * you will get wrong under pressure. One canonical encoder already knows
 * every rule — reuse it as the validator.
 *
 * DATA, NOT BRANCHES: the 13-entry table replaces a dozen `if`s. Adding a
 * symbol is a data change, not a logic change.
 */

const TABLE = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
] as const;

const SYMBOL_VALUE: Readonly<Record<string, number>> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    throw new RangeError(`Cannot convert ${n}: expected an integer 1..3999`);
  }
  let rest = n;
  let out = '';
  for (const [value, symbol] of TABLE) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}

export function fromRoman(s: string): number {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = SYMBOL_VALUE[s[i] ?? ''];
    if (current === undefined) throw new Error(`Invalid Roman numeral: "${s}"`);
    const next = SYMBOL_VALUE[s[i + 1] ?? ''] ?? 0;
    total += current < next ? -current : current;
  }

  // Round-trip: only the canonical spelling survives. Also rejects "" (0).
  if (total < 1 || total > 3999 || toRoman(total) !== s) {
    throw new Error(`Invalid Roman numeral: "${s}"`);
  }
  return total;
}
