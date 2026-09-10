/**
 * SOLUTION 3.4 — useEventCallback
 *
 * Talking points:
 *
 * 1. A CLOSURE CAPTURES VALUES, NOT VARIABLES. Each render creates new
 *    `const`s; a function created in render 1 permanently sees render 1's
 *    values. `useCallback(fn, [])` preserves the function AND the values it
 *    closed over — that is the whole stale-closure family of bugs in one
 *    sentence. Lead with it.
 *
 * 2. A REF IS A BOX THAT SURVIVES RENDERS. Writing the newest function into
 *    `ref.current` every render, then calling *through* the ref, decouples
 *    identity from freshness: the wrapper never changes, the target always
 *    does. That is the trick, and it is the same one behind `useEffectEvent`.
 *
 * 3. WHERE TO UPDATE THE REF. Assigning during render is technically a side
 *    effect in the render phase, which concurrent React may discard or replay.
 *    `useInsertionEffect` (used by React's own `useEffectEvent` polyfills)
 *    runs before layout effects, so the ref is fresh before any effect or
 *    event handler can fire. `useLayoutEffect` is the pragmatic choice and is
 *    what most libraries ship. Pick one and be able to defend it — the wrong
 *    answer here is not having noticed there is a choice.
 *
 * 4. DO NOT CALL IT DURING RENDER. The returned function is for event handlers
 *    and effects. Calling it while rendering reads a ref that may belong to a
 *    render React is about to throw away — the exact reason `useEffectEvent`
 *    is restricted the same way.
 *
 * 5. IT DOES NOT REPLACE `useCallback`. `useCallback` is a memoisation hint
 *    with honest dependencies; this deliberately hides its dependencies so an
 *    effect need not re-run. Use it for *events* — things that "happen",
 *    where you always want the latest state. Use `useCallback` for values
 *    passed to memoised children. Blurring them is how you get an effect that
 *    silently reads stale props forever.
 */

import { useCallback, useLayoutEffect, useRef } from 'react';

export function useEventCallback<A extends unknown[], R>(
  fn: (...args: A) => R,
): (...args: A) => R {
  const ref = useRef(fn);

  // Runs before any layout effect or event handler that could call the
  // returned function, so `ref.current` is never behind the current render.
  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: A): R => ref.current(...args), []);
}
