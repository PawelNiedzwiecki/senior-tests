/**
 * SOLUTION 1.6 — Variadic tuples: keep positions, keep types
 *
 * Talking points:
 *
 * 1. `T extends readonly unknown[] | []` IS THE WHOLE TRICK. On its own,
 *    `readonly unknown[]` makes TypeScript infer an *array* from an array
 *    literal — `Promise<string>[]` — and every position collapses into one
 *    union. Adding the `| []` member gives the inference algorithm a tuple
 *    candidate, so it keeps arity and per-position types. `const T` is the
 *    modern alternative; mention both and note that `| []` also works on
 *    older TypeScript versions, which matters in real codebases.
 *
 * 2. HOMOMORPHIC MAPPING OVER TUPLES. `{ -readonly [K in keyof T]: ... }`
 *    over a tuple yields a tuple — same length, same labels. You never touch
 *    a numeric index. `-readonly` normalises a `readonly` input away so
 *    callers can destructure and reassign.
 *
 * 3. `Awaited<T>` unwraps recursively and leaves non-promises alone, which is
 *    exactly the semantics of `await`. Hand-rolling it with
 *    `T extends Promise<infer U> ? U : T` misses thenables and nesting.
 *
 * 4. THE CAST IS FINE, AND YOU SHOULD SAY WHY. Inside the implementation the
 *    compiler cannot see that `.map` preserves arity, so one `as` is
 *    unavoidable. What matters is that the *signature* is honest and the cast
 *    is confined to one line that is covered by tests. That framing — "the
 *    unsound step is localised and tested" — is the senior answer.
 *
 * 5. THE RECORD VARIANT is a plain mapped type: keys are preserved because
 *    the mapping is homomorphic over `keyof T`. Note that `Promise.all` over
 *    `Object.values` is safe only because `Object.entries` and the
 *    reconstruction both walk the same key order.
 */

export type Settled<T> =
  | { status: 'fulfilled'; value: T }
  | { status: 'rejected'; reason: unknown };

export type SettledTuple<T extends readonly unknown[]> = {
  -readonly [K in keyof T]: Settled<Awaited<T[K]>>;
};

export type SettledRecord<T extends Record<string, unknown>> = {
  [K in keyof T]: Settled<Awaited<T[K]>>;
};

async function settle(value: unknown): Promise<Settled<unknown>> {
  try {
    return { status: 'fulfilled', value: await value };
  } catch (reason) {
    return { status: 'rejected', reason };
  }
}

export async function allSettledTyped<T extends readonly unknown[] | []>(
  promises: T,
): Promise<SettledTuple<T>> {
  const settled = await Promise.all(Array.from(promises, settle));
  return settled as SettledTuple<T>;
}

export async function allSettledRecord<T extends Record<string, unknown>>(
  promises: T,
): Promise<SettledRecord<T>> {
  const entries = Object.entries(promises);
  const settled = await Promise.all(entries.map(([, value]) => settle(value)));
  const out: Record<string, Settled<unknown>> = {};
  entries.forEach(([key], i) => {
    out[key] = settled[i]!;
  });
  return out as SettledRecord<T>;
}
