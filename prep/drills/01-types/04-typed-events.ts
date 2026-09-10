/**
 * DRILL 1.4 — A fully typed event emitter interface
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * The *type surface* of an emitter driven by an event map. Drill 2.5 asks you
 * to implement the runtime for this exact interface, so make the types ones
 * you would actually want to satisfy.
 *
 *   emitter.emit('progress', 'job-1', 42)   ✅
 *   emitter.emit('progress', 'job-1')       ❌ missing percent
 *   emitter.emit('cancelled')               ✅ no payload at all
 *   emitter.on('done', (r) => r.text)       ✅ r inferred, no annotation
 *
 * WHY IT'S ASKED
 * Event emitters are the canonical "make this API type-safe" exercise, and
 * the payload-arity part is where most candidates hand-wave. It also lets the
 * interviewer ask about key remapping, which is the single most useful mapped
 * type feature people never learn.
 *
 * YOUR TASK
 * Implement `Listener`, `Unsubscribe`, `TypedEmitter` and `Handlers`.
 * The event map stores payloads as *tuples*, which is what makes variadic
 * `emit` possible.
 *
 * HINTS
 *   1. `(...args: E[K]) => void` spreads a tuple into a parameter list. That
 *      one line gives you correct arity for free, including the empty tuple.
 *   2. `on` should return an unsubscribe function — nicer than pairing on/off,
 *      and it is what React effects want.
 *   3. `Handlers` needs key REMAPPING: `[K in keyof E as \`on${Capitalize<K>}\`]`.
 *      `Capitalize` is a built-in intrinsic string type.

 *   4. The event map is a `type`, not an `interface` — see the note below;
 *      interfaces do not satisfy `Record<string, unknown[]>`.
 *   5. Constrain `K extends keyof E` on each method, not on the interface, so
 *      each call site narrows independently.
 *
 * STRETCH
 *   a. `once(event)` returning `Promise<E[K]>` — what should the empty-tuple
 *      case resolve to?
 *   b. Add a wildcard `'*'` listener receiving `[K, ...E[K]]` for every event.
 *   c. How would you type `emitter.on` so passing a handler for an unknown
 *      event is an error *and* the error message is readable?
 */

/** Payload tuples per event name. */
/**
 * NOTE: this is a `type`, not an `interface`, and that is deliberate.
 * An interface has no implicit index signature, so `TranslationEvents` written
 * as an interface does NOT satisfy `Record<string, unknown[]>` — the compiler
 * says "Index signature for type 'string' is missing". A type alias for an
 * object literal DOES get one. It is a favourite interview gotcha; the reason
 * is declaration merging: an interface can be reopened and extended later, so
 * the compiler cannot promise its key set is closed.
 */
export type TranslationEvents = {
  progress: [jobId: string, percent: number];
  done: [result: { text: string; detectedLang: string }];
  failed: [error: Error];
  cancelled: [];
};

export type Unsubscribe = () => void;

/** The listener signature for a single event. */
export type Listener<E, K extends keyof E> = () => void; // TODO

/** `{ onProgress?, onDone?, onFailed?, onCancelled? }` derived from `E`. */
export type Handlers<E> = {}; // TODO

export interface TypedEmitter<E extends Record<string, unknown[]>> {
  on(event: unknown, listener: unknown): Unsubscribe; // TODO
  off(event: unknown, listener: unknown): void; // TODO
  emit(event: unknown, ...args: unknown[]): void; // TODO
  once(event: unknown): Promise<unknown>; // TODO
}
