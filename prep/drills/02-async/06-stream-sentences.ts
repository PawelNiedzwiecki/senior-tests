/**
 * DRILL 2.6 — Async iterators over a streaming response
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 30 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * A streaming translation endpoint sends text in arbitrary chunks — network
 * packets, not sentences. The UI wants to reveal one complete sentence at a
 * time. Turn the chunk stream into a sentence stream.
 *
 *   chunks:    ['Guten ', 'Tag. Wie geht', ' es dir? Gut.']
 *   sentences: ['Guten Tag.', 'Wie geht es dir?', 'Gut.']
 *
 * SPEC (be precise — this is what the tests encode)
 *   - A sentence ends at `.`, `!`, `?` or `…` followed by whitespace or the
 *     end of the stream.
 *   - Yielded sentences are trimmed; the terminator is kept.
 *   - Whitespace-only remainders are never yielded.
 *   - When the stream ends, flush whatever is buffered, terminator or not.
 *   - A terminator split across chunks must still be found.
 *   - The generator must be lazy: nothing is consumed before the first `next()`.
 *
 * WHY IT'S ASKED
 * Streaming UIs are everywhere now, and buffering across chunk boundaries is
 * the bug that ships. It also lets the interviewer probe async generators,
 * backpressure and cleanup — topics most candidates have only read about.
 *
 * HINTS
 *   1. Keep a `buffer` string. Append each chunk, then repeatedly extract
 *      complete sentences from the front until none remain.
 *   2. A regex with the `g` flag and `exec` in a loop works, but watch
 *      `lastIndex` — resetting it per pass is simpler to reason about.
 *   3. `for await (const chunk of source)` handles both async and sync
 *      iterables of promises.
 *   4. `try/finally` around the loop is where cleanup goes — and `finally` in
 *      a generator runs when the consumer calls `.return()`, i.e. on `break`.
 *
 * STRETCH
 *   a. `Dr. Müller ging.` — how would you avoid splitting on the abbreviation?
 *      (Then say why `Intl.Segmenter` is the real answer.)
 *   b. Add a `maxBufferLength` so a stream with no terminators cannot grow
 *      unbounded. What do you emit when you hit it?
 *   c. If the consumer `break`s early, how do you cancel the underlying fetch?
 *   d. Compare with a `TransformStream` — when would you reach for that instead?
 */

export async function* streamSentences(
  _chunks: AsyncIterable<string>,
): AsyncGenerator<string, void, undefined> {
  throw new Error('Not implemented'); // TODO
}
