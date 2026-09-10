/**
 * DRILL 2.2 — debounce, with the parts people forget
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * Everyone can write the three-line `setTimeout` version. This is the one you
 * would actually put behind a translate-as-you-type box: leading and trailing
 * edges, `cancel`, `flush`, `pending`, and types that survive `Parameters<F>`.
 *
 * REQUIREMENTS
 *   1. Trailing edge by default: call fires `wait` ms after the LAST call.
 *   2. `leading: true` fires immediately on the first call of a burst.
 *   3. `leading + trailing` fires twice per burst — but only if the burst had
 *      more than one call. (This is the subtle one, and it is deliberate:
 *      a single call should not fire twice.)
 *   4. `cancel()` drops a pending call. `flush()` runs it now.
 *   5. `pending()` reports whether a call is queued.
 *   6. The debounced function keeps `this` and the original parameter types.
 *
 * WHY IT'S ASKED
 * It looks like a warm-up and it is not. The edge cases above are where
 * production bugs live, and `flush`/`cancel` are what a React `useEffect`
 * cleanup needs. Interviewers use it to see whether you write tests in your
 * head before you write code.
 *
 * NOTE: the types below are already written for you — the exercise is the
 * behaviour. `02-debounce.test-d.ts` therefore passes from the start; the
 * runtime tests are the ones to turn green.
 *
 * HINTS
 *   1. Keep three pieces of state: the timer id, the last args, and whether
 *      this burst has already fired on its leading edge.
 *   2. On each call: clear the existing timer, then set a new one. That single
 *      reset IS debouncing.
 *   3. Store `this` from the call site if you want method usage to work —
 *      which means the wrapper must be a `function`, not an arrow.
 *   4. Clear the stored args after invoking, or `flush()` will re-run stale ones.
 *
 * STRETCH
 *   a. Add `maxWait` — then explain that debounce with `maxWait` IS throttle.
 *   b. Return the last result from `flush()`. Why can't the debounced call
 *      itself return the result meaningfully?
 *   c. Promise-returning variant: what should happen to the promises of calls
 *      that get debounced away? (There is no free answer — argue for one.)
 *   d. Why is `requestAnimationFrame` the better primitive for scroll/resize?
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyFn = (...args: any[]) => any;

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface Debounced<F extends AnyFn> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void;
  cancel(): void;
  flush(): void;
  pending(): boolean;
}

export function debounce<F extends AnyFn>(
  _fn: F,
  _wait: number,
  _options: DebounceOptions = {},
): Debounced<F> {
  throw new Error('Not implemented'); // TODO
}
