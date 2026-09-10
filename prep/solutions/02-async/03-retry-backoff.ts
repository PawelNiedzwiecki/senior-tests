/**
 * SOLUTION 2.3 — Retry with exponential backoff
 *
 * Talking points (this drill is judged on these more than on the code):
 *
 * 1. WHY EXPONENTIAL. A fixed 100 ms retry against a server that is down means
 *    every client retries 10×/second forever — you have built a DDoS of your
 *    own service. Exponential backoff makes the load fall off as the outage
 *    continues, which is what lets the server recover.
 *
 * 2. WHY JITTER. Backoff alone still synchronises: every client that failed at
 *    t=0 retries at t=100, t=300, t=700 together. That is a thundering herd —
 *    the recovering server gets hit by the whole fleet in lockstep and falls
 *    over again. Full jitter spreads retries uniformly over the window and is
 *    the AWS-recommended default. Name it; interviewers listen for it.
 *
 * 3. WHY A CAP. Unbounded doubling reaches delays measured in hours. Cap at
 *    something a user will tolerate, then fail honestly.
 *
 * 4. WHICH ERRORS ARE RETRYABLE. This is the judgement question. Retry 429,
 *    502/503/504 and network-level failures. Never retry 400/401/403/422 —
 *    the request is wrong and will stay wrong; retrying just burns quota and
 *    hides the bug. Non-idempotent POSTs need an idempotency key before retry
 *    is safe at all — that answer alone separates senior from mid.
 *
 * 5. ABORT DURING THE WAIT. Most implementations only check the signal between
 *    attempts, so aborting during a 30-second backoff does nothing for 30
 *    seconds. The sleep below races the timer against the abort listener and
 *    clears the timer on abort, so cancellation is immediate and leaves no
 *    stray timer behind.
 *
 * 6. INJECTED RANDOMNESS. `random` as an option keeps jitter deterministic in
 *    tests without stubbing globals. Small thing; reads as someone who has
 *    had to test this before.
 *
 * 7. THE LAST ERROR IS THE REAL ERROR. Wrapping it in "retries exhausted"
 *    destroys the stack trace and the status code the caller needs. Rethrow
 *    the original; attach context with `cause` if you must.
 */

export interface RetryOptions {
  retries: number;
  baseDelayMs?: number;
  factor?: number;
  maxDelayMs?: number;
  jitter?: 'none' | 'full';
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (info: { error: unknown; attempt: number; delayMs: number }) => void;
  random?: () => number;
}

function abortError(): Error {
  return new DOMException('The operation was aborted.', 'AbortError');
}

/** A sleep that can be cut short by an AbortSignal, leaving no timer behind. */
function abortableSleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    function onAbort() {
      clearTimeout(timer);
      reject(abortError());
    }

    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const {
    retries,
    baseDelayMs = 100,
    factor = 2,
    maxDelayMs = Number.POSITIVE_INFINITY,
    jitter = 'none',
    signal,
    shouldRetry = () => true,
    onRetry,
    random = Math.random,
  } = options;

  if (signal?.aborted) throw abortError();

  let attempt = 0;

  for (;;) {
    try {
      return await fn(attempt);
    } catch (error) {
      const isLastAttempt = attempt >= retries;
      if (isLastAttempt || !shouldRetry(error, attempt)) throw error;

      const uncapped = baseDelayMs * factor ** attempt;
      const capped = Math.min(maxDelayMs, uncapped);
      const delayMs = jitter === 'full' ? Math.floor(capped * random()) : capped;

      onRetry?.({ error, attempt, delayMs });
      await abortableSleep(delayMs, signal);
      attempt += 1;
    }
  }
}
