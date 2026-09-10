/**
 * SOLUTION 1.4 — A fully typed event emitter interface
 *
 * Talking points:
 *
 * 1. PAYLOADS AS TUPLES. Storing `progress: [jobId: string, percent: number]`
 *    instead of `progress: { jobId, percent }` is the design decision that
 *    makes everything else fall out. `(...args: E[K]) => void` spreads the
 *    tuple into a real parameter list, so arity, order, optionality and even
 *    the parameter *names* shown in tooltips all come along for free. The
 *    empty tuple `[]` naturally produces a zero-argument `emit`.
 *
 * 2. GENERIC ON THE METHOD, NOT THE INTERFACE. `on<K extends keyof E>(...)`
 *    lets each call site infer its own `K`. If you hoist `K` to the interface
 *    you get one emitter locked to one event.
 *
 * 3. KEY REMAPPING with `as`. `[K in keyof E as \`on${Capitalize<K>}\`]` is
 *    how you rename keys in a mapped type (TS 4.1+). `Capitalize` is one of
 *    four intrinsic string types — `Uppercase`, `Lowercase`, `Capitalize`,
 *    `Uncapitalize` — implemented in the compiler, not in .d.ts files.
 *    The `& string` guard is needed because `keyof E` may include symbols.
 *
 * 4. UNSUBSCRIBE OVER off(). Returning a disposer means callers never have to
 *    keep a reference to the exact function identity, and it drops straight
 *    into a React `useEffect` return. Keep `off` too for parity with the DOM.
 *
 * 5. `once` RESOLVES THE TUPLE. `Promise<E[K]>` is the honest type — for
 *    `cancelled` that is `Promise<[]>`, which looks odd but is correct and
 *    composable. Flattening single-element tuples is a nice stretch, and the
 *    trade-off (nicer ergonomics, murkier type) is worth voicing.
 */

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

export type Listener<E, K extends keyof E> = E[K] extends unknown[]
  ? (...args: E[K]) => void
  : never;

export type Handlers<E> = {
  [K in keyof E & string as `on${Capitalize<K>}`]?: Listener<E, K>;
};

export interface TypedEmitter<E extends Record<string, unknown[]>> {
  on<K extends keyof E>(event: K, listener: Listener<E, K>): Unsubscribe;
  off<K extends keyof E>(event: K, listener: Listener<E, K>): void;
  emit<K extends keyof E>(event: K, ...args: E[K]): void;
  once<K extends keyof E>(event: K): Promise<E[K]>;
}
