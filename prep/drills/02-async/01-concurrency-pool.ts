/**
 * DRILL 2.1 — Bounded concurrency
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * `Promise.all` fires everything at once. Translating 500 segments that way
 * gets you rate-limited, or melts the browser's connection pool. Build the
 * version that keeps at most N requests in flight.
 *
 *   const results = await mapWithConcurrency(segments, translate, { concurrency: 4 });
 *
 * REQUIREMENTS
 *   1. Never more than `concurrency` workers running at once.
 *   2. Results come back in INPUT order, whatever order they finish in.
 *   3. On the first rejection, reject — and start no further work.
 *   4. An `AbortSignal` stops scheduling new work and rejects.
 *   5. `concurrency` larger than the input is fine; empty input resolves `[]`.
 *
 * WHY IT'S ASKED
 * It is the most common "real" async question at product companies, because
 * it has an obvious naive answer (chunking) that is measurably worse than the
 * right answer (a rolling pool). The interviewer wants to see you notice the
 * difference and say why: with chunks of 4, a batch waits for its slowest
 * member before ANY of the next four start.
 *
 * HINTS
 *   1. Shared cursor + N workers pulling from it. Each worker loops: take the
 *      next index, await it, write into `results[index]`, repeat.
 *   2. `await Promise.all(workers)` at the end — the workers ARE the limit.
 *   3. Write results into a pre-sized array by index; never `push`.
 *   4. Don't forget to remove the abort listener when you finish.
 *
 * STRETCH
 *   a. Add `settled: true` so one failure doesn't sink the batch.
 *   b. Add an `onProgress(done, total)` callback. Where must you call it so
 *      the count is never wrong?
 *   c. What changes if `items` is an async iterable of unknown length?
 *   d. Why not `p-limit`? (Correct senior answer: usually just use it. Then
 *      explain what it does — that is what is actually being tested.)
 */

export interface PoolOptions {
  concurrency: number;
  signal?: AbortSignal;
}

export async function mapWithConcurrency<T, R>(
  _items: readonly T[],
  _worker: (item: T, index: number) => Promise<R>,
  _options: PoolOptions,
): Promise<R[]> {
  throw new Error('Not implemented'); // TODO
}
