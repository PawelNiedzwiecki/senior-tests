/**
 * DRILL 2.7 — Timeouts and signal composition
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * A request should be abandoned when ANY of these happen: the user navigates
 * away, the component unmounts, the user retypes, or 5 seconds pass. That is
 * four abort sources and one request. Compose them.
 *
 * REQUIREMENTS
 *   1. `withTimeout(promise, ms)` rejects with a `TimeoutError` — and clears
 *      its timer when the promise settles first (no dangling handles).
 *   2. `anySignal(signals)` returns a signal that aborts as soon as any input
 *      aborts, propagating the original `reason`.
 *   3. `anySignal` handles an ALREADY-aborted input: the result is aborted
 *      immediately, not on the next tick.
 *   4. `anySignal` returns a `cleanup()` that removes every listener it added.
 *   5. `undefined` entries are ignored, so callers can pass optional signals.
 *
 * WHY IT'S ASKED
 * Everyone has used `AbortController`. Far fewer can say what a signal
 * actually does to an in-flight promise (nothing — `fetch` cooperates, a plain
 * promise does not), or notice that a long-lived signal accumulates listeners.
 * That gap is the whole point of the question.
 *
 * HINTS
 *   1. `AbortSignal.any()` and `AbortSignal.timeout()` are native now. Build
 *      them by hand here, then say you would use the built-ins — knowing both
 *      is the answer.
 *   2. Abort errors are `DOMException` with `name: 'AbortError'`; timeouts use
 *      `name: 'TimeoutError'`. Callers branch on `error.name`.
 *   3. Race the promise against a rejecting timer, and clear the timer in a
 *      `finally` so a fast success does not leave it pending.
 *   4. `{ once: true }` on each listener, plus an explicit `cleanup`.
 *
 * STRETCH
 *   a. `withTimeout` cannot stop the underlying work. Show the version that
 *      takes `(signal) => Promise<T>` so the work is genuinely cancellable.
 *   b. Why is `Promise.race` a memory hazard with a never-settling promise?
 *   c. How does React 18 StrictMode's double-mount interact with this?
 */

export function withTimeout<T>(_promise: Promise<T>, _ms: number): Promise<T> {
  throw new Error('Not implemented'); // TODO
}

export interface CombinedSignal {
  signal: AbortSignal;
  cleanup: () => void;
}

export function anySignal(_signals: readonly (AbortSignal | undefined)[]): CombinedSignal {
  throw new Error('Not implemented'); // TODO
}
