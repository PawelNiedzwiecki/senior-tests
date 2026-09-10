/**
 * DRILL 1.6 — Variadic tuples: keep positions, keep types
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * `Promise.allSettled` loses your types: you get `PromiseSettledResult<A|B|C>[]`
 * and have to narrow every element by hand. Build the version that keeps each
 * position's type — plus a variant that settles an *object* of promises, which
 * is what you actually reach for when the call sites are named.
 *
 *   const [text, langs, quota] = await allSettledTyped([
 *     translate('Hallo'),        // Promise<string>
 *     listLanguages(),           // Promise<Lang[]>
 *     getQuota(),                // Promise<number>
 *   ]);
 *   // text.status === 'fulfilled' → text.value is string, not string|Lang[]|number
 *
 * WHY IT'S ASKED
 * Tuple-preserving generics are the difference between a helper people enjoy
 * and one they cast their way out of. The inference trick involved is small,
 * specific, and impossible to fake.
 *
 * YOUR TASK
 * Implement `Settled`, `SettledTuple`, `SettledRecord`, and both functions.
 * Neither function ever rejects.
 *
 * HINTS
 *   1. THE TRICK: constrain with `T extends readonly unknown[] | []`. The
 *      empty-tuple member is what pushes TypeScript into tuple inference
 *      instead of widening the argument to an array. Nothing else in this
 *      drill is as easy to get wrong.
 *   2. Mapping over a tuple is homomorphic — `{ [K in keyof T]: F<T[K]> }`
 *      returns a tuple of the same length, so you never index by number.
 *   3. `Awaited<T>` unwraps nested promises recursively; do not hand-roll it.
 *   4. One `as` cast inside the implementation is acceptable and expected.
 *      Say so out loud, and say why the *signature* is still sound.
 *
 * STRETCH
 *   a. `allTyped` that rejects on first failure — same tuple preservation.
 *   b. Add a concurrency limit; which part of the type changes? (None — say
 *      that, it is the point.)
 *   c. Type a `partition` that splits results into fulfilled values and
 *      reasons, keeping the value types.
 */

export type Settled<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown };

/** Positionally-typed results for a tuple of promises. */
export type SettledTuple<T extends readonly unknown[]> = Settled<unknown>[]; // TODO

/** Key-preserving results for a record of promises. */
export type SettledRecord<T extends Record<string, unknown>> = Record<string, Settled<unknown>>; // TODO

export function allSettledTyped<T extends readonly unknown[] | []>(
  _promises: T,
): Promise<SettledTuple<T>> {
  throw new Error('Not implemented'); // TODO
}

export function allSettledRecord<T extends Record<string, unknown>>(
  _promises: T,
): Promise<SettledRecord<T>> {
  throw new Error('Not implemented'); // TODO
}
