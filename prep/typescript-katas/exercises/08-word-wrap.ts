/**
 * KATA 08 — Word wrap
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 25 min        Guide: ../README.md
 *
 * THE TASK
 * `wrap(text, width)` returns the text broken into lines no longer than
 * `width`, joined with "\n" — like a text editor's soft wrap.
 *
 * THE RULES
 *   - Break between words whenever possible; put as many words on each line
 *     as fit (greedy).
 *   - Any run of whitespace in the input (spaces, tabs, newlines) is ONE
 *     separator. Lines have no leading or trailing spaces.
 *   - A word longer than `width` starts on a fresh line and is hard-split
 *     into `width`-sized chunks; its last chunk can be followed by more words.
 *
 * EXAMPLES
 *   wrap("the quick brown fox", 10)  → "the quick\nbrown fox"
 *   wrap("word", 4)                  → "word"
 *   wrap("abcdefghij", 4)            → "abcd\nefgh\nij"
 *   wrap("ab abcdefgh x", 4)         → "ab\nabcd\nefgh\nx"
 *   wrap("   ", 5)                   → ""
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - `width` must be an integer ≥ 1, otherwise throw a RangeError.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Preserve existing newlines / paragraphs, or reflow everything?
 *   - Hyphenate long words, hard-split them, or let them overflow?
 *   - Width in characters, or in rendered pixels / grapheme clusters
 *     (emoji, combining accents)?
 *
 * HINT
 *   Tokenise first (`trim().split(/\s+/)`), then build lines with a single
 *   `current` string. The "+1 for the space" in the fit check is where the
 *   off-by-one lives — test a word that fits EXACTLY.
 *
 * FOLLOW-UPS
 *   - Justify the text (pad spaces so every line is exactly `width`).
 *   - Minimise raggedness instead of greedy (that is dynamic programming).
 */

export function wrap(_text: string, _width: number): string {
  throw new Error('Not implemented');
}
