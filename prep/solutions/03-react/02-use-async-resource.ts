/**
 * SOLUTION 3.2 — Race-free async state
 *
 * Talking points (say these BEFORE writing code — that is what scores):
 *
 * 1. NAME THE RACE FIRST. "Two requests are in flight; responses can arrive in
 *    any order; the last response to arrive is not necessarily the one the UI
 *    should show." Then: "so I need the effect to know whether it is still the
 *    current one." That sentence is worth more than the implementation.
 *
 * 2. TWO GUARDS, DIFFERENT JOBS.
 *      - `controller.abort()` asks a *cooperating* API to stop. `fetch` obeys.
 *        A promise that has already resolved does not.
 *      - `cancelled` is a plain closure variable that makes the stale run's
 *        continuation a no-op. It works no matter what the fetcher does.
 *    Candidates who use only abort fail requirement 3 whenever the fetcher
 *    ignores the signal — which is most hand-written fetchers. Candidates who
 *    use only the flag leak a live request. You want both, and you should say
 *    why each is insufficient alone.
 *
 * 3. CHECK AFTER EVERY `await`. An `await` is a resumption point; anything
 *    read before it may be stale after it. The rule is mechanical: after each
 *    await, `if (cancelled) return;` before touching state.
 *
 * 4. ABORTERROR IS NOT AN ERROR STATE. The user navigated or retyped — that is
 *    the app working. Rendering "Something went wrong" for a cancellation is a
 *    real bug in a lot of shipped code. Filter on `error.name === 'AbortError'`.
 *
 * 5. `useReducer` OVER THREE `useState`s. The states are mutually exclusive:
 *    loading-with-data-and-error is not representable, and it should not be.
 *    A discriminated union plus a reducer makes illegal states unrepresentable
 *    — which is the same idea as drill 1.5, now applied to UI state.
 *
 * 6. STRICTMODE IS FREE HERE. Dev mounts, unmounts, remounts. The cleanup
 *    aborts and cancels, the remount starts fresh. StrictMode is not being
 *    awkward — it is checking exactly the property this hook needs anyway.
 *
 * 7. IN PRODUCTION, USE TANSTACK QUERY. It gives you this plus caching,
 *    dedupe, retries and devtools. Still worth knowing what it does for you:
 *    you cannot debug a stale-render bug through a library you treat as magic.
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

type Action<T> =
  | { type: 'started' }
  | { type: 'succeeded'; data: T }
  | { type: 'failed'; error: Error };

function reducer<T>(_state: AsyncState<T>, action: Action<T>): AsyncState<T> {
  switch (action.type) {
    case 'started':
      return { status: 'loading' };
    case 'succeeded':
      return { status: 'success', data: action.data };
    case 'failed':
      return { status: 'error', error: action.error };
  }
}

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value));

const isAbort = (error: unknown): boolean =>
  error instanceof Error && error.name === 'AbortError';

export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
): UseAsyncResource<T> {
  const [state, dispatch] = useReducer(reducer<T>, { status: 'loading' } as AsyncState<T>);
  const [nonce, bumpNonce] = useReducer((n: number) => n + 1, 0);

  // The fetcher is a fresh closure every render; keeping it in a ref means the
  // effect depends only on `deps`, not on the caller's memoisation discipline.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    dispatch({ type: 'started' });

    fetcherRef.current(controller.signal).then(
      (data) => {
        // The guard that makes a late response harmless.
        if (cancelled) return;
        dispatch({ type: 'succeeded', data });
      },
      (error: unknown) => {
        if (cancelled || isAbort(error)) return;
        dispatch({ type: 'failed', error: toError(error) });
      },
    );

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const refetch = useCallback(() => bumpNonce(), []);

  return { state, refetch };
}
