/**
 * DRILL 3.1 — useDebouncedValue
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 20 min      DIFFICULTY: ●●○○○
 *
 * WHAT YOU'RE BUILDING
 * The hook behind a translate-as-you-type box. It returns the settled value
 * plus a pending flag, so the UI can show "…" while the user is still typing.
 *
 *   const [query, isPending] = useDebouncedValue(input, 300);
 *
 * REQUIREMENTS
 *   1. The FIRST render returns the initial value immediately and `isPending`
 *      false — no flash of empty state on mount.
 *   2. After `value` changes, the returned value updates `delayMs` later.
 *   3. Rapid changes collapse into one update (the last value wins).
 *   4. `isPending` is true from the moment `value` differs until it settles.
 *   5. Unmounting cancels the pending timer — no update after unmount.
 *   6. Changing `delayMs` restarts the pending timer with the new delay.
 *
 * WHY IT'S ASKED
 * It is the shortest hook that still requires correct effect cleanup, and the
 * pending flag forces you to think about what the *user* sees rather than just
 * what the state does. Expect a follow-up about `useDeferredValue`.
 *
 * HINTS
 *   1. One `useEffect` keyed on `[value, delayMs]`, returning a cleanup that
 *      clears the timer. The cleanup is what implements requirements 3 and 5.
 *   2. Derive `isPending` from `debounced !== value` rather than storing it —
 *      one less state to keep in sync, and it is correct on the very first
 *      render for free.
 *   3. `useState<T>(value)` for the initial value. Do not use an effect for it.
 *
 * STRETCH
 *   a. When is `useDeferredValue` the better tool? (Hint: it yields to
 *      rendering priority; debounce is wall-clock. They are not substitutes.)
 *   b. Add a `maxWait` so a fast typist still gets updates.
 *   c. Why is `Object.is` comparison a problem if `value` is an object
 *      literal built during render?
 *   d. How would you test this without fake timers?
 */

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(_value: T, _delayMs: number): readonly [T, boolean] {
  // TODO: replace this with a real implementation.
  void useEffect;
  void useState;
  throw new Error('Not implemented');
}
