/**
 * SOLUTION — String calculator
 *
 * COMPLEXITY: O(n · d) where d is the number of delimiters — each one is a
 * single `replaceAll` pass.
 *
 * NARRATION:
 *   "Two steps with a seam: parse the header into a list of delimiters and a
 *    body, then turn the body into numbers and sum them. Each new rule only
 *    touches one of the two steps — that's how I know the seam is right."
 *
 * NO REGEX FOR USER DELIMITERS. Building `new RegExp(delim)` from user input
 * is the classic bug here: "." matches everything and "|" splits on the empty
 * string. Normalising every delimiter to "," with `replaceAll` (literal
 * string match) sidesteps escaping entirely. If you DO build a regex, say
 * "I escape it first" out loud — that's the senior signal.
 *
 * LONGEST DELIMITER FIRST. With delimiters "*" and "**", replacing "*" first
 * leaves empty segments. Sorting by length descending avoids it.
 *
 * COLLECT ALL NEGATIVES, then throw once. Throwing on the first one is the
 * shortcut the rule exists to catch.
 */

const MAX = 1000;
const DEFAULT_DELIMITERS = [',', '\n'];

function parse(input: string): { delimiters: string[]; body: string } {
  if (!input.startsWith('//')) return { delimiters: DEFAULT_DELIMITERS, body: input };

  const newline = input.indexOf('\n');
  if (newline === -1) throw new Error('Delimiter header must end with a newline');

  const header = input.slice(2, newline);
  const body = input.slice(newline + 1);
  const bracketed = [...header.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1] ?? '');
  const custom = bracketed.length > 0 ? bracketed : [header];

  return { delimiters: [...custom, ...DEFAULT_DELIMITERS], body };
}

function toNumbers(body: string, delimiters: string[]): number[] {
  const longestFirst = [...delimiters].sort((a, b) => b.length - a.length);
  const normalised = longestFirst.reduce((text, d) => text.replaceAll(d, ','), body);

  return normalised.split(',').map((token) => {
    if (!/^-?\d+$/.test(token)) throw new Error(`Invalid number: "${token}"`);
    return Number(token);
  });
}

export function add(input: string): number {
  if (input === '') return 0;

  const { delimiters, body } = parse(input);
  const numbers = toNumbers(body, delimiters);

  const negatives = numbers.filter((n) => n < 0);
  if (negatives.length > 0) {
    throw new Error(`negatives not allowed: ${negatives.join(', ')}`);
  }

  return numbers.filter((n) => n <= MAX).reduce((sum, n) => sum + n, 0);
}
