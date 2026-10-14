/**
 * KATA 02 — Roman numerals (both directions)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 30 min        Guide: ../README.md
 *
 * THE TASK
 *   toRoman(n)    — integer 1..3999 → canonical Roman numeral.
 *   fromRoman(s)  — canonical Roman numeral → integer, REJECTING bad input.
 *
 * THE RULES
 *   I=1  V=5  X=10  L=50  C=100  D=500  M=1000
 *   Subtractive pairs only: IV=4 IX=9 XL=40 XC=90 CD=400 CM=900.
 *   Canonical form: the shortest standard spelling. 4 is "IV", never "IIII".
 *
 * EXAMPLES
 *   toRoman(3)    → "III"        fromRoman("MCMXCIV") → 1994
 *   toRoman(58)   → "LVIII"      fromRoman("XLII")    → 42
 *   toRoman(1994) → "MCMXCIV"
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - toRoman throws a RangeError outside 1..3999 or for non-integers.
 *   - fromRoman throws for anything non-canonical: "", "IIII", "VV", "IC",
 *     "IL", "XM", "VX", lower case, unknown letters.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Do we accept lenient input like "IIII" (clock faces) or only canonical?
 *   - Upper bound — 3999, or do we need vinculum notation?
 *
 * HINT
 *   toRoman: a table of 13 value→symbol pairs (including the six subtractive
 *   pairs), largest first, greedy subtract. No special cases at all.
 *   fromRoman: summing is easy (subtract a symbol when a bigger one follows).
 *   VALIDATING is the hard part — and there is a one-line trick once you
 *   have toRoman. Think before you write a list of illegal patterns.
 *
 * FOLLOW-UPS
 *   - Make the symbol table a typed `as const` tuple so the compiler checks it.
 *   - Property-test it: fromRoman(toRoman(n)) === n for all n in 1..3999.
 */

export function toRoman(_n: number): string {
  throw new Error('Not implemented');
}

export function fromRoman(_s: string): number {
  throw new Error('Not implemented');
}
