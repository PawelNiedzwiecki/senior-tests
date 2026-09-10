/**
 * SOLUTION 2.7 — Timeouts and signal composition
 *
 * Talking points:
 *
 * 1. A SIGNAL DOES NOT CANCEL A PROMISE. This is the sentence to lead with.
 *    Aborting tells a *cooperating* API (`fetch`, and anything you wrote to
 *    watch the signal) to stop and reject. A plain promise has no cancellation
 *    mechanism at all — `withTimeout` below stops you *waiting*, it does not
 *    stop the work. If the interviewer wants real cancellation, the shape has
 *    to change to `(signal) => Promise<T>` so the work can see the signal.
 *    That is stretch (a), and volunteering it is the senior move.
 *
 * 2. CLEAR THE TIMER. `Promise.race` with an un-cleared `setTimeout` keeps a
 *    handle alive for the full duration even after the winner settles. In Node
 *    that holds the event loop open; in a browser it is a small leak repeated
 *    on every request. The `finally` is not decoration.
 *
 * 3. ERROR NAMES ARE THE CONTRACT. `AbortError` vs `TimeoutError`, both as
 *    `DOMException`. Callers branch on `error.name` — a timeout usually means
 *    "retry", a user abort means "say nothing and move on". Collapsing them
 *    into one `Error('timeout')` throws that distinction away.
 *
 * 4. ALREADY-ABORTED IS THE CASE PEOPLE MISS. Signals do not re-fire; if you
 *    only ever `addEventListener`, an input that aborted before composition
 *    is silently ignored, and you fire off a request nobody wants. Check
 *    `aborted` first, every time.
 *
 * 5. CLEANUP IS NOT OPTIONAL. Composing against a long-lived signal (a page
 *    lifetime controller, say) on every keystroke adds a listener per
 *    keystroke and never removes one. That is a genuine, measurable leak in a
 *    translate-as-you-type box. `{ once: true }` covers the fired case;
 *    explicit `cleanup()` covers the far more common un-fired case.
 *
 * 6. USE THE BUILT-INS IN PRODUCTION: `AbortSignal.any([a, b])` and
 *    `AbortSignal.timeout(5000)` are native in every current browser and in
 *    Node 20+. The right answer in the interview is "I'd use these, and here
 *    is what they do" — showing you can build it is what earns the point,
 *    reaching for it in real code is not.
 */

function timeoutError(): DOMException {
  return new DOMException('The operation timed out.', 'TimeoutError');
}

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(timeoutError()), ms);
  });

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer);
  });
}

export interface CombinedSignal {
  signal: AbortSignal;
  cleanup: () => void;
}

export function anySignal(signals: readonly (AbortSignal | undefined)[]): CombinedSignal {
  const controller = new AbortController();
  const present = signals.filter((s): s is AbortSignal => s !== undefined);

  const listeners: Array<() => void> = [];

  const cleanup = () => {
    for (const remove of listeners) remove();
    listeners.length = 0;
  };

  for (const source of present) {
    // Signals do not re-fire, so an already-aborted source must be handled now.
    if (source.aborted) {
      cleanup();
      controller.abort(source.reason);
      return { signal: controller.signal, cleanup };
    }

    const onAbort = () => {
      cleanup();
      controller.abort(source.reason);
    };

    source.addEventListener('abort', onAbort, { once: true });
    listeners.push(() => source.removeEventListener('abort', onAbort));
  }

  return { signal: controller.signal, cleanup };
}
