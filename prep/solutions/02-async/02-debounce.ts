/**
 * SOLUTION 2.2 — debounce, with the parts people forget
 *
 * Talking points:
 *
 * 1. THE CORE IS ONE LINE: clear the pending timer, set a new one. Everything
 *    else in this file is edge-case handling. Write the core first, say
 *    "that's debounce", then layer on the options — interviewers like seeing
 *    a working skeleton before the polish.
 *
 * 2. THE `leading + trailing` SUBTLETY. After a leading call, a trailing call
 *    should only happen if MORE calls arrived during the wait. Tracking
 *    `lastArgs` gives you that for free: clear it when you invoke on the
 *    leading edge, and the timer only fires the trailing call when a later
 *    call has refilled it. Candidates who skip this fire twice for a single
 *    keystroke, which is exactly the bug you would ship.
 *
 * 3. `this` REQUIRES A `function`. An arrow wrapper captures the enclosing
 *    `this` and silently breaks method usage (`obj.debouncedMethod()`).
 *    `ThisParameterType<F>` in the type keeps that honest. Mention that this
 *    matters far less in a React codebase — but it is still the correct
 *    general implementation, and knowing why is the point.
 *
 * 4. CLEAR `lastArgs` AFTER INVOKING. Otherwise a later `flush()` replays a
 *    call that already happened. That is the "does not replay stale args"
 *    test, and it is a real bug I have seen ship.
 *
 * 5. RETURN TYPE IS `void`. The debounced call cannot meaningfully return the
 *    wrapped function's value — at call time the invocation has not happened,
 *    and may never happen. Lodash returns the *previous* result, which is a
 *    footgun. Returning `void` and exposing `flush()` is the honest API.
 *
 * 6. IN REACT: store the debounced function in a ref (or `useMemo`) so it
 *    survives re-renders, and call `cancel()` in the effect cleanup. A
 *    debounced call that fires after unmount is the classic "setState on an
 *    unmounted component" leak. See drill 3.1.
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
  fn: F,
  wait: number,
  options: DebounceOptions = {},
): Debounced<F> {
  const { leading = false, trailing = true } = options;

  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<F> | undefined;
  let lastThis: unknown;

  const invoke = () => {
    const args = lastArgs!;
    const thisArg = lastThis;
    lastArgs = undefined;
    lastThis = undefined;
    fn.apply(thisArg, args);
  };

  const debounced = function (this: unknown, ...args: Parameters<F>) {
    const isBurstStart = timer === undefined;
    lastArgs = args;
    // Aliased on purpose: the wrapper must be a `function` (not an arrow) so a
    // method call keeps its receiver, and the deferred invocation needs that
    // receiver saved. See talking point 3.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastThis = this;

    if (timer !== undefined) clearTimeout(timer);

    if (leading && isBurstStart) {
      // Fire now, and clear lastArgs so a lone call does not also fire trailing.
      invoke();
    }

    timer = setTimeout(() => {
      timer = undefined;
      // lastArgs is only set if a call arrived after the leading invocation.
      if (trailing && lastArgs !== undefined) invoke();
    }, wait);
  } as Debounced<F>;

  debounced.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  };

  debounced.flush = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    if (lastArgs !== undefined) invoke();
  };

  debounced.pending = () => lastArgs !== undefined;

  return debounced;
}
