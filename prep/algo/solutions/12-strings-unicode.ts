/**
 * SOLUTIONS 12 — Strings and Unicode
 */

/**
 * PROBLEM 1 — Reverse a string
 *
 * NARRATION — say all three levels, then choose:
 *   "`s.split('').reverse().join('')` is the one-liner everyone knows, and it's
 *    wrong for anything outside the BMP: it splits on UTF-16 code units, so a
 *    surrogate pair gets cut in half and you get mojibake. Spreading the string
 *    iterates code points, which fixes emoji — but not combining marks, so
 *    'café' with a decomposed accent still breaks. The correct unit is the
 *    grapheme cluster, which is what Intl.Segmenter gives me."
 *
 * COMPLEXITY: O(n) time and space. Segmentation is linear.
 *
 * WHEN NOT TO BOTHER: if the input is guaranteed ASCII, the one-liner is fine
 * and cheaper. The senior move is not always reaching for Segmenter — it is
 * knowing the failure mode and asking whether the input can contain real user
 * text. At a translation company, assume it can.
 *
 * LOCALE ARGUMENT: grapheme segmentation is essentially locale-independent, so
 * 'en' is a safe default here. Word and sentence segmentation are NOT — pass
 * the real locale for those.
 */
export function reverseString(s: string): string {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const graphemes = [...segmenter.segment(s)].map((entry) => entry.segment);
  return graphemes.reverse().join('');
}

/**
 * PROBLEM 2 — Word Frequencies
 *
 * COMPLEXITY: O(n) to tokenise and count, O(m log m) to sort the m distinct
 *             words. O(m) space. Note it is NOT O(n log n) — you sort the
 *             vocabulary, not the text, and m is usually far smaller.
 *
 * THE REGEX IS THE INTERESTING PART. `/[a-z]+/gi` silently drops 'café' and
 * every non-Latin word — it would score zero on German or Japanese text.
 * `\p{Letter}` with the `u` flag is Unicode-aware and matches letters in any
 * script. Saying "I'm using a Unicode property escape so this works beyond
 * ASCII" is a cheap, real signal here.
 *
 * THE HONEST LIMITATION, worth volunteering: this still tokenises on
 * "runs of letters", which assumes words are space-separated. Chinese, Japanese
 * and Thai are not. The correct tool is
 * `new Intl.Segmenter(locale, { granularity: 'word' })`. I'd use the regex for
 * a quick European-language count and Segmenter for anything user-facing.
 *
 * TIE-BREAKING: count descending, then word ascending. `||` chains the
 * comparators — the second only runs when the first returns 0. Explicit
 * tie-breaking also makes the function deterministic, which matters for tests.
 *
 * `toLowerCase()` CAVEAT: locale-sensitive (Turkish 'I' → 'ı'). For strict
 * case-insensitive comparison, `toLocaleLowerCase(locale)` is the correct call.
 */
export function wordFrequencies(text: string, limit: number): Array<[string, number]> {
  if (limit <= 0) return [];

  // `u` flag + Unicode property escapes: works for any script, not just ASCII.
  const words = text.toLowerCase().match(/[\p{Letter}\p{Number}']+/gu);
  if (words === null) return [];

  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

/**
 * PROBLEM 3 — Longest Common Prefix
 *
 * NARRATION:
 *   "Vertical scan: compare position 0 across every word, then position 1, and
 *    stop at the first mismatch or the first word that ends. The answer can't
 *    be longer than the shortest word, so that bounds the outer loop."
 *
 * COMPLEXITY: O(S) where S is the total number of characters — worst case when
 *             every word is identical. O(1) extra space. Best case is far
 *             better: a mismatch at position 0 exits after `words.length`
 *             comparisons.
 *
 * WHY VERTICAL BEATS HORIZONTAL: the horizontal approach (fold the prefix
 * across words, shrinking it) is also O(S) but does more string slicing and
 * allocates on every step. Vertical short-circuits on the first mismatch with
 * no allocation at all.
 *
 * UNICODE NOTE: this compares by UTF-16 code unit, so a prefix could in
 * principle be cut mid-surrogate-pair. It cannot actually happen here, because
 * a mismatch in the high surrogate stops the scan before the low one — but
 * spotting that the question exists is the kind of thing worth saying at a
 * company that deals in text.
 *
 * FOLLOW-UP: many prefix queries over a fixed word list → build a trie once,
 * then each query is O(length of query).
 */
export function longestCommonPrefix(words: string[]): string {
  if (words.length === 0) return '';

  const first = words[0]!;

  for (let i = 0; i < first.length; i += 1) {
    const char = first[i];

    for (const word of words) {
      // Ends here if a word runs out, or a character differs.
      if (i >= word.length || word[i] !== char) return first.slice(0, i);
    }
  }

  return first;
}
