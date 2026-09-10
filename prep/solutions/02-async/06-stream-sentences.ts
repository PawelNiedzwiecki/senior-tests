/**
 * SOLUTION 2.6 — Async iterators over a streaming response
 *
 * Talking points:
 *
 * 1. THE BUFFER IS THE ANSWER. Chunk boundaries are meaningless — they are
 *    wherever TCP happened to split. Append to a buffer, drain complete
 *    sentences from the front, keep the remainder. State this before coding;
 *    it reframes the problem from "parse a chunk" to "parse a stream", which
 *    is the whole point of the question.
 *
 * 2. WHY THE LOOKAHEAD. The terminator only ends a sentence when whitespace
 *    follows. Without that, `Hallo Welt` + `.` + ` Noch was.` would emit
 *    `Hallo Welt.` — correct here by luck, but the same logic splits `3.14`
 *    and `z.B.` mid-token. Requiring the following whitespace means a
 *    terminator at the buffer's end waits for more input, which is exactly
 *    right: we do not yet know whether the sentence is finished.
 *
 * 3. FLUSH AT THE END. The final sentence usually has no trailing whitespace,
 *    so it never matches the in-loop rule. Emitting the remainder after the
 *    source is exhausted is what makes the last sentence appear — forget it
 *    and your UI silently drops the ending.
 *
 * 4. GENERATORS ARE LAZY AND THAT IS THE FEATURE. The body does not start
 *    until the first `next()`, so the consumer controls the pace and gets
 *    backpressure for free: a slow renderer simply pulls more slowly, and the
 *    source is not read ahead. Contrast with a callback API, which pushes
 *    regardless of whether anyone can keep up.
 *
 * 5. `finally` RUNS ON `break`. When the consumer breaks out of `for await`,
 *    the runtime calls `.return()` on the generator, which runs the `finally`
 *    block. That is where you would abort the underlying fetch. Mentioning
 *    this unprompted is a strong signal — most people do not know generator
 *    cleanup is even a thing.
 *
 * 6. THE REAL ANSWER FOR PRODUCTION is `Intl.Segmenter` with
 *    `{ granularity: 'sentence' }`, which handles abbreviations, CJK (no
 *    spaces at all) and locale rules that a regex never will. Say that; then
 *    note that it needs the *whole* text, so streaming still needs the buffer
 *    strategy above. Knowing both, and why you would still hand-roll here, is
 *    the complete answer.
 */

// A terminator counts only when whitespace follows it, so a terminator sitting
// at the end of the buffer waits for the next chunk before we commit.
const SENTENCE_END = /[.!?…]\s/;

export async function* streamSentences(
  chunks: AsyncIterable<string>,
): AsyncGenerator<string, void, undefined> {
  let buffer = '';

  try {
    for await (const chunk of chunks) {
      buffer += chunk;

      for (;;) {
        const match = SENTENCE_END.exec(buffer);
        if (!match) break;

        const end = match.index + 1; // include the terminator, drop the space
        const sentence = buffer.slice(0, end).trim();
        buffer = buffer.slice(end);
        if (sentence) yield sentence;
      }
    }

    // The last sentence usually has no trailing whitespace — flush it.
    const tail = buffer.trim();
    if (tail) yield tail;
  } finally {
    // Runs on normal completion, on throw, and when the consumer `break`s.
    // Cancelling the upstream fetch would go here.
    buffer = '';
  }
}
