/**
 * SOLUTION 2.1 — Bounded concurrency
 *
 * Talking points:
 *
 * 1. ROLLING POOL, NOT CHUNKS. The naive answer slices the input into groups
 *    of N and awaits `Promise.all` per group. That caps concurrency, but every
 *    group idles waiting for its slowest member — with one 2-second segment in
 *    a group of four, three workers sit doing nothing. The pool below keeps
 *    all N busy until the queue drains. Say this before writing code; it is
 *    the insight the question is testing.
 *
 * 2. THE WORKERS *ARE* THE LIMIT. Spawn exactly N loops sharing one cursor.
 *    There is no semaphore, no counter to leak, no bookkeeping to get wrong.
 *    `cursor++` is atomic here because JavaScript is single-threaded and there
 *    is no `await` between the read and the increment — worth stating, since
 *    it is the one place a reviewer might suspect a race.
 *
 * 3. ORDER BY INDEX, NOT BY COMPLETION. Pre-size the results array and write
 *    at `index`. Pushing gives you completion order, which is the bug this
 *    test suite catches first.
 *
 * 4. FAIL FAST WITHOUT ORPHANS. Setting `failure` makes every worker loop exit
 *    at its next iteration, so no new work starts. Work already awaiting still
 *    settles — you cannot un-send an HTTP request. If the interviewer wants
 *    those cancelled, that is what the AbortSignal is for, and you should say
 *    so rather than pretending you can kill a running promise.
 *
 * 5. ABORT HYGIENE. Check `signal.aborted` up front (an already-aborted signal
 *    must do no work at all), listen with `{ once: true }`, and remove the
 *    listener in a `finally`. Leaked listeners on a long-lived signal are a
 *    real memory leak, and noticing that is a senior signal.
 *
 * 6. IN PRODUCTION, use `p-limit` or `p-map`. Say that too. Knowing when not
 *    to hand-roll is part of the answer; being unable to hand-roll is not.
 */

export interface PoolOptions {
  concurrency: number;
  signal?: AbortSignal;
}

function abortError(): Error {
  return new DOMException('The operation was aborted.', 'AbortError');
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  worker: (item: T, index: number) => Promise<R>,
  options: PoolOptions,
): Promise<R[]> {
  const { concurrency, signal } = options;
  if (concurrency < 1) throw new RangeError('concurrency must be >= 1');
  if (signal?.aborted) throw abortError();
  if (items.length === 0) return [];

  const results = new Array<R>(items.length);
  let cursor = 0;
  let failure: unknown;
  let failed = false;

  const fail = (reason: unknown) => {
    if (!failed) {
      failed = true;
      failure = reason;
    }
  };

  const onAbort = () => fail(abortError());
  signal?.addEventListener('abort', onAbort, { once: true });

  async function runWorker(): Promise<void> {
    while (!failed) {
      const index = cursor++;
      if (index >= items.length) return;
      try {
        results[index] = await worker(items[index]!, index);
      } catch (error) {
        fail(error);
        return;
      }
    }
  }

  try {
    const size = Math.min(concurrency, items.length);
    await Promise.all(Array.from({ length: size }, runWorker));
    if (failed) throw failure;
    return results;
  } finally {
    signal?.removeEventListener('abort', onAbort);
  }
}
