/**
 * SOLUTION — Word wrap
 *
 * COMPLEXITY: O(n) in the length of the text.
 *
 * NARRATION:
 *   "Tokenise into words, then greedily fill a `current` line. A word fits
 *    if current + one space + word is within the width. Words longer than
 *    the width are chopped into width-sized chunks first; the final chunk is
 *    treated as an ordinary word so text can follow it on the same line."
 *
 * TOKENISE, THEN LAYOUT. Mixing whitespace handling into the line-building
 * loop is where trailing-space bugs come from. Splitting on /\s+/ after a
 * trim gives clean words and makes the layout loop trivial.
 *
 * THE INVARIANT "no line exceeds width" is tested as a property over many
 * widths, not just a few examples — a cheap way to catch off-by-ones.
 */

export function wrap(text: string, width: number): string {
  if (!Number.isInteger(width) || width < 1) {
    throw new RangeError(`Width must be a positive integer, got ${width}`);
  }

  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const lines: string[] = [];
  let current = '';

  const flush = () => {
    if (current) lines.push(current);
    current = '';
  };

  for (let word of words) {
    if (word.length > width) {
      flush();
      while (word.length > width) {
        lines.push(word.slice(0, width));
        word = word.slice(width);
      }
    }

    if (!current) current = word;
    else if (current.length + 1 + word.length <= width) current += ` ${word}`;
    else {
      flush();
      current = word;
    }
  }
  flush();

  return lines.join('\n');
}
