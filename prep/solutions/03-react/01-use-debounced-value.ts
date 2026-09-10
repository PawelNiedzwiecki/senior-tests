/**
 * SOLUTION 3.1 — useDebouncedValue
 *
 * Talking points:
 *
 * 1. DERIVE, DON'T STORE. `isPending` is `debounced !== value` — a pure
 *    function of two things already in hand. Storing it in a second `useState`
 *    means two updates to keep in sync, an extra render, and a wrong value on
 *    the first render. "Can I derive this instead of storing it?" is the
 *    single most useful question in React state design; say it out loud.
 *
 * 2. THE CLEANUP IS THE DEBOUNCE. React runs the cleanup before re-running the
 *    effect, so a change during the wait clears the previous timer and starts
 *    a new one. That is not incidental — the cleanup implements both "collapse
 *    the burst" and "cancel on unmount". If the interviewer asks what breaks
 *    without it: every keystroke fires its own delayed update, and the last
 *    one lands after unmount.
 *
 * 3. INITIAL VALUE VIA `useState(value)`, NOT AN EFFECT. Effects run after
 *    paint, so seeding through an effect gives you one render with the wrong
 *    value — a visible flash of empty state on mount.
 *
 * 4. STRICTMODE. In development React 18+ mounts, unmounts and remounts, so
 *    the effect runs twice. This hook is fine because the cleanup fully undoes
 *    the setup — which is exactly the property StrictMode is checking for.
 *    Mention it before you are asked.
 *
 * 5. `useDeferredValue` IS NOT A SUBSTITUTE. It defers re-rendering with the
 *    new value until React has spare time, and it never delays the actual
 *    value — no wall-clock guarantee. Use it to keep a heavy list responsive;
 *    use debounce to send fewer network requests. Different problems.
 *
 * 6. OBJECT IDENTITY. `value` is compared by reference in the dependency
 *    array. A caller passing a fresh object literal every render re-arms the
 *    timer forever and it never settles. Say the mitigation: debounce a
 *    primitive, or memoise upstream.
 */

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): readonly [T, boolean] {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return [debounced, debounced !== value] as const;
}
