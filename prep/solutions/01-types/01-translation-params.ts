/**
 * SOLUTION 1.1 — Typed interpolation keys
 *
 * Talking points, in the order an interviewer wants to hear them:
 *
 * 1. `${string}{${infer P}}${infer Rest}` matches the FIRST placeholder and
 *    hands back everything after it, which gives us a recursion handle.
 *    Template literal inference is greedy-from-the-left for the leading
 *    `${string}`, so `P` never swallows a closing brace.
 *
 * 2. Recursion terminates because `Rest` is strictly shorter each step, and
 *    the non-matching branch returns `never` — the identity of union types,
 *    so `X | never === X`. That is why the base case costs nothing.
 *
 * 3. `[Placeholder<S>] extends [never]` — the tuple wrapper is load-bearing.
 *    A bare `Placeholder<S> extends never` distributes over the union, and a
 *    distributive conditional over `never` evaluates to `never`, not `true`.
 *    This is the single most common "gotcha" question on this topic.
 *
 * 4. Returning `[]` vs `[params]` from a conditional type and spreading it as
 *    a rest parameter is how you make an argument conditionally required.
 *    Labelled tuple members (`[params: ...]`) keep editor hints readable.
 *
 * 5. Excess-property checking does the "no extra params" work for free,
 *    because the argument is an object literal. Mention that it would NOT
 *    fire for a pre-declared variable — that is a structural-typing fact,
 *    not a hole in your types.
 */

export type Placeholder<S extends string> =
  S extends `${string}{${infer P}}${infer Rest}` ? P | Placeholder<Rest> : never;

export type TranslationParams<S extends string> = [Placeholder<S>] extends [never]
  // `{}` is deliberate: it means "no required params". It is a lax type on its
  // own, but `TArgs` below turns this case into an empty argument list, so it is
  // never actually reachable as a parameter type.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ? {}
  : { [K in Placeholder<S>]: string | number };

export type TArgs<S extends string> = [Placeholder<S>] extends [never]
  ? []
  : [params: TranslationParams<S>];

export function t<S extends string>(template: S, ...args: TArgs<S>): string {
  const params = (args[0] ?? {}) as Record<string, string | number>;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  );
}
