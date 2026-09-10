/**
 * SOLUTION 2.5 — The emitter runtime
 *
 * Talking points:
 *
 * 1. SNAPSHOT + RECHECK. Two separate bugs, two separate fixes:
 *      - Iterating the live Set means a listener added mid-dispatch gets
 *        called in that same dispatch (Set iterators see later insertions).
 *        Fix: copy to an array first.
 *      - But a snapshot alone still calls a listener that was REMOVED
 *        mid-dispatch, because the array kept it. Fix: re-check membership in
 *        the live set before each call.
 *    Almost nobody gets both without being nudged. Volunteer them and you are
 *    visibly ahead. Point at the concrete case: a listener that unsubscribes
 *    itself is what every React cleanup does.
 *
 * 2. `Set` FOR DEDUPE. DOM `addEventListener` ignores a duplicate
 *    (function, type, capture) registration; Node's EventEmitter registers it
 *    twice and calls it twice. Either is defensible — what matters is that you
 *    state which you picked and why. Set semantics also make `off` trivially
 *    idempotent.
 *
 * 3. ISOLATE LISTENER ERRORS. One bad subscriber must not stop the rest, and
 *    `emit` should not throw at its call site — the emitting code has no
 *    relationship to the failing listener and cannot handle its error.
 *    Rethrowing asynchronously keeps the failure visible to `window.onerror`
 *    and your error reporter instead of silently swallowing it. Say the
 *    trade-off out loud: swallowing hides bugs, throwing synchronously
 *    couples unrelated code.
 *
 * 4. DELETE EMPTY BUCKETS. A long-lived emitter that never removes empty Sets
 *    slowly grows one entry per event name ever used. Small, but it is exactly
 *    the sort of thing "no leaks" means.
 *
 * 5. `once` IS JUST `on` + UNSUBSCRIBE. Returning `Promise<E[K]>` is honest
 *    but note the cancellation gap: nothing rejects this promise, so a waiter
 *    for an event that never fires leaks. That is the AbortSignal stretch, and
 *    naming the gap unprompted is the senior move.
 */

export type EventMap = Record<string, unknown[]>;
export type Unsubscribe = () => void;
export type Listener<E extends EventMap, K extends keyof E> = (...args: E[K]) => void;

export type TranslationEvents = {
  progress: [jobId: string, percent: number];
  done: [result: { text: string }];
  cancelled: [];
};

export interface Emitter<E extends EventMap> {
  on<K extends keyof E>(event: K, listener: Listener<E, K>): Unsubscribe;
  off<K extends keyof E>(event: K, listener: Listener<E, K>): void;
  emit<K extends keyof E>(event: K, ...args: E[K]): void;
  once<K extends keyof E>(event: K): Promise<E[K]>;
  listenerCount<K extends keyof E>(event: K): number;
}

// `any[]` in a *parameter* position of an internal storage type is the
// pragmatic choice: every `Listener<E, K>` is assignable to it without a cast.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyListener = (...args: any[]) => void;

export function createEmitter<E extends EventMap>(): Emitter<E> {
  const registry = new Map<keyof E, Set<AnyListener>>();

  function off<K extends keyof E>(event: K, listener: Listener<E, K>): void {
    const listeners = registry.get(event);
    if (!listeners) return;
    listeners.delete(listener);
    if (listeners.size === 0) registry.delete(event);
  }

  function on<K extends keyof E>(event: K, listener: Listener<E, K>): Unsubscribe {
    let listeners = registry.get(event);
    if (!listeners) {
      listeners = new Set();
      registry.set(event, listeners);
    }
    listeners.add(listener);

    let removed = false;
    return () => {
      if (removed) return;
      removed = true;
      off(event, listener);
    };
  }

  return {
    on,
    off,

    emit(event, ...args) {
      const listeners = registry.get(event);
      if (!listeners) return;

      // Snapshot so listeners registered during dispatch are not called now...
      for (const listener of [...listeners]) {
        // ...and re-check so listeners removed during dispatch are not either.
        if (!listeners.has(listener)) continue;
        try {
          listener(...args);
        } catch (error) {
          // Keep dispatching, but do not swallow the failure entirely.
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
    },

    once(event) {
      return new Promise((resolve) => {
        const unsubscribe = on(event, ((...args: E[typeof event]) => {
          unsubscribe();
          resolve(args);
        }) as Listener<E, typeof event>);
      });
    },

    listenerCount(event) {
      return registry.get(event)?.size ?? 0;
    },
  };
}
