/**
 * DRILL 3.2 — Race-free async state  ★ THE ONE TO PRACTISE ★
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 35 min      DIFFICULTY: ●●●●●
 *
 * WHAT YOU'RE BUILDING
 * Data fetching in a hook, done correctly. Not the tutorial version — the one
 * that survives a user typing quickly.
 *
 * THE BUG THIS EXISTS TO PREVENT
 * The user types "hello", then "hi". Two requests go out. The "hello" response
 * is slower and lands second. Now the box says "hi" and the result says
 * "hallo". Every naive `useEffect` + `setState` fetch hook has this bug, and it
 * is the single most asked senior React question there is.
 *
 * REQUIREMENTS
 *   1. `status: 'loading'` on mount, then `'success'` with the data.
 *   2. A thrown/rejected fetch produces `status: 'error'` with an `Error`.
 *   3. When `deps` change, a response from the PREVIOUS run is discarded even
 *      if it arrives later. (The whole point.)
 *   4. The previous request's `AbortSignal` is aborted when deps change.
 *   5. Unmount aborts the in-flight request and sets no state afterwards.
 *   6. An `AbortError` must NOT surface as an error state — the user caused it.
 *   7. `refetch()` re-runs the current fetcher.
 *
 * WHY IT'S ASKED
 * Because it separates people who have shipped React from people who have read
 * about it. The interviewer is listening for you to *name* the race before you
 * write the fix.
 *
 * HINTS
 *   1. Two guards, not one. An `AbortController` cancels the request; a
 *      `cancelled` flag in the effect closure ignores a response that arrives
 *      anyway. You need both — abort is cooperative, and a resolved promise
 *      still runs its `.then`.
 *   2. The cleanup function is where both live: set the flag AND abort.
 *   3. Check `if (cancelled) return;` AFTER every `await`, before any setState.
 *   4. `useReducer` is a decent fit here — one dispatch per transition beats
 *      three `useState`s that can disagree.
 *   5. For `refetch`, a counter in state that you add to the effect deps is
 *      the simplest correct trick.
 *
 * STRETCH
 *   a. Keep the previous data visible while refetching (`isValidating`).
 *   b. StrictMode double-mounts in dev. Why is this hook already fine?
 *   c. Where would request deduplication live — here, or in the fetcher?
 *   d. Why is this ultimately TanStack Query's job, and what would you still
 *      need to reason about even with it?
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { DependencyList } from 'react';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export interface UseAsyncResource<T> {
  state: AsyncState<T>;
  refetch: () => void;
}

export function useAsyncResource<T>(
  _fetcher: (signal: AbortSignal) => Promise<T>,
  _deps: DependencyList,
): UseAsyncResource<T> {
  void useCallback;
  void useEffect;
  void useReducer;
  void useRef;
  throw new Error('Not implemented'); // TODO
}
