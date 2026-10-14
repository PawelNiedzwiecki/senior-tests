/**
 * KATA 01 — String calculator
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 30 min        Guide: ../README.md
 *
 * THE TASK
 * `add(input)` takes a string of numbers and returns their sum. The rules
 * arrive one at a time — exactly how an interviewer will feed them to you.
 * Do them IN ORDER and make each pass before reading the next.
 *
 * THE RULES (incremental)
 *   1. ""          → 0.   "1" → 1.   "1,2" → 3.
 *   2. Any amount of numbers: "1,2,3,4" → 10.
 *   3. Newlines are delimiters too: "1\n2,3" → 6.
 *   4. A custom single-char delimiter header: "//;\n1;2" → 3.
 *      The header is `//<delim>\n` and only ever appears at the very start.
 *   5. Negatives throw an Error whose message lists ALL of them, in input
 *      order: "1,-2,3,-4" → Error("negatives not allowed: -2, -4").
 *   6. Numbers greater than 1000 are ignored: "2,1001" → 2. (1000 counts.)
 *   7. Delimiters of any length in brackets: "//[***]\n1***2***3" → 6.
 *   8. Several bracketed delimiters: "//[*][%%]\n1*2%%3" → 6.
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - When a custom header is present, "," and "\n" still work too.
 *   - Delimiters are LITERAL text. "//[.]\n1.2" is 3, not a regex wildcard.
 *   - Anything that is not a number after splitting ("1,,2", "1,a") throws.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Empty segments ("1,,2") — zero, or an error?
 *   - Is 1000 itself included?
 *   - Decimals? (Not here: whole numbers only.)
 *
 * HINT
 *   Split the problem into two steps with a seam between them:
 *   `parse(input) → { delimiters, body }` and then `sum(numbers)`.
 *   For literal delimiters, escape them before building a RegExp — or avoid
 *   regex entirely and normalise each delimiter to "," with `replaceAll`.
 *
 * FOLLOW-UPS
 *   - Return a typed error instead of throwing (Result<number, ParseError>).
 *   - Support other operations (multiply) without duplicating the parser.
 */

export function add(_input: string): number {
  throw new Error('Not implemented');
}
