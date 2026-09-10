/**
 * DRILL 3.4 — useEventCallback (the stale-closure fix)
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 15 min      DIFFICULTY: ●●○○○ (code) / ●●●●○ (the explanation)
 *
 * WHAT YOU'RE BUILDING
 * A callback whose identity never changes, but which always runs the newest
 * closure. That combination is impossible with `useCallback` alone, and it is
 * why React is shipping `useEffectEvent`.
 *
 * THE PROBLEM IT SOLVES
 *   const onScroll = useCallback(() => track(query), []);   // stale `query`
 *   const onScroll = useCallback(() => track(query), [query]); // new identity
 *                                                              // every keystroke
 *   useEffect(() => {
 *     window.addEventListener('scroll', onScroll);
 *     return () => window.removeEventListener('scroll', onScroll);
 *   }, [onScroll]);   // ...so the listener is torn down and re-added constantly
 *
 * REQUIREMENTS
 *   1. The returned function is referentially stable for the component's life.
 *   2. Calling it invokes the MOST RECENT function passed in.
 *   3. Arguments and return value pass through unchanged.
 *
 * WHY IT'S ASKED
 * Because "why does my effect re-run on every keystroke" is the most common
 * real React bug after the fetch race, and the fix requires understanding that
 * a closure captures values, not variables.
 *
 * HINTS
 *   1. A ref holding the latest function, updated on every render.
 *   2. `useCallback(..., [])` around a call THROUGH the ref.
 *   3. Update the ref during render or in a layout effect? Both appear in the
 *      wild. Know the trade-off (see the solution) and pick one deliberately.
 *
 * STRETCH
 *   a. Why must you NOT call this during render? (Concurrent rendering: the
 *      ref may hold a function from a render that gets thrown away.)
 *   b. How does this relate to `useEffectEvent`? Why is it not `useCallback`
 *      with an escape hatch?
 *   c. Does this make `useCallback` unnecessary? (No — argue both sides.)
 */

import { useCallback, useRef } from 'react';

export function useEventCallback<A extends unknown[], R>(
  _fn: (...args: A) => R,
): (...args: A) => R {
  void useCallback;
  void useRef;
  throw new Error('Not implemented'); // TODO
}
