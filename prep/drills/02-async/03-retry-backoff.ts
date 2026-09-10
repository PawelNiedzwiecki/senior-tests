/**
 * DRILL 2.3 — Retry with exponential backoff
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * A retry wrapper you would put in front of a flaky translation endpoint.
 * The naive `for` loop with a fixed delay is not the answer — under load it
 * turns every client into a synchronised herd hammering a recovering server.
 *
 * REQUIREMENTS
 *   1. `retries: 3` means up to 4 total attempts.
 *   2. Delay grows: base, base*factor, base*factor², … capped at `maxDelayMs`.
 *   3. `jitter: 'full'` randomises each delay into `[0, delay]`.
 *   4. `shouldRetry(error, attempt)` decides — a 400 must not be retried.
 *   5. `AbortSignal` cuts it short, including *during* a backoff wait.
 *   6. When retries run out, reject with the LAST error, not a wrapper.
 *
 * WHY IT'S ASKED
 * Retry logic is where "senior" shows up as judgement rather than syntax:
 * which errors are retryable, why jitter exists, why you cap the delay, and
 * why a retry budget beats an infinite loop. Expect the interviewer to push
 * on the *why* far more than the code.
 *
 * HINTS
 *   1. Loop `attempt` from 0..retries; the check `attempt === retries` decides
 *      whether to rethrow or wait.
 *   2. `Math.min(maxDelayMs, base * factor ** attempt)` — compute, then jitter.
 *   3. Make the sleep abortable: a promise that both `setTimeout` and the
 *      abort listener can settle. Clear the timer in the abort path.
 *   4. Inject `random` so jitter is testable. Tests that stub `Math.random`
 *      globally are the thing you are avoiding.
 *
 * STRETCH
 *   a. Which HTTP statuses are retryable, and which are retryable only for
 *      idempotent methods? Why is POST the awkward one?
 *   b. `Retry-After` headers — how would they slot in?
 *   c. Circuit breaker: after N consecutive failures, stop trying entirely.
 *      When is that better than backoff?
 *   d. Compare "full" jitter with "decorrelated" jitter. Which do you pick,
 *      and what are you optimising for?
 */

export interface RetryOptions {
  /** Retries AFTER the first attempt. `retries: 3` → up to 4 attempts. */
  retries: number;
  /** Delay before the first retry. Default 100. */
  baseDelayMs?: number;
  /** Growth factor. Default 2. */
  factor?: number;
  /** Upper bound for any single delay. Default Infinity. */
  maxDelayMs?: number;
  /** 'full' picks uniformly from [0, delay]. Default 'none'. */
  jitter?: 'none' | 'full';
  signal?: AbortSignal;
  /** Return false to give up immediately. Default: always retry. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  onRetry?: (info: { error: unknown; attempt: number; delayMs: number }) => void;
  /** Injected for deterministic tests. Default `Math.random`. */
  random?: () => number;
}

export async function retry<T>(
  _fn: (attempt: number) => Promise<T>,
  _options: RetryOptions,
): Promise<T> {
  throw new Error('Not implemented'); // TODO
}
