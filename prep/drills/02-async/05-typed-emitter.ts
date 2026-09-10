/**
 * DRILL 2.5 — The emitter runtime (pairs with drill 1.4)
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * Drill 1.4 designed the types. Now make it run. The interesting part is not
 * `Map<string, Set<fn>>` — it is what happens when listeners mutate the
 * listener set *while an event is being dispatched*.
 *
 * REQUIREMENTS
 *   1. `on` registers and returns an unsubscribe function.
 *   2. Registering the same function twice for the same event is a no-op
 *      (DOM `addEventListener` semantics, not Node's).
 *   3. Listeners fire in registration order.
 *   4. A listener added DURING an emit does not receive that emit.
 *   5. A listener removed DURING an emit does not receive that emit.
 *   6. A throwing listener does not prevent the others from running, and does
 *      not make `emit` throw.
 *   7. `once` returns a promise of the payload tuple and auto-unsubscribes.
 *   8. No leaks: removing the last listener for an event drops the event's set.
 *
 * WHY IT'S ASKED
 * Requirements 4-6 are what separate a working emitter from a correct one.
 * They also map directly to real bugs: a listener that unsubscribes itself
 * mid-dispatch is exactly what a React cleanup does.
 *
 * HINTS
 *   1. SNAPSHOT before dispatch: `for (const l of [...set])`. Iterating a live
 *      Set while listeners mutate it is how you get requirements 4 and 5 wrong.
 *   2. A snapshot alone still calls a listener that was removed mid-dispatch —
 *      re-check membership in the live set before each call.
 *   3. Wrap each call in try/catch. Re-throwing asynchronously
 *      (`setTimeout(() => { throw e })`) keeps it visible without breaking the
 *      loop — say why you would or wouldn't do that.
 *
 * STRETCH
 *   a. A wildcard `'*'` listener that receives `[eventName, ...payload]`.
 *   b. `once` with an AbortSignal so a pending wait can be cancelled.
 *   c. What would change if listeners could be async and you had to await them
 *      in order? What breaks about that idea?
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

export function createEmitter<E extends EventMap>(): Emitter<E> {
  throw new Error('Not implemented'); // TODO
}
