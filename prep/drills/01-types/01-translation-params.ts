/**
 * DRILL 1.1 — Typed interpolation keys
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 20 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * A `t()` translation helper where the *placeholders inside the string* decide
 * what the params object must contain:
 *
 *   t('Hello {name}', { name: 'Paweł' })   ✅
 *   t('Hello {name}', {})                  ❌ missing 'name'
 *   t('Translated {n} documents', { n: 3 })✅
 *   t('Nothing to fill')                   ✅ second arg not required at all
 *
 * WHY IT'S ASKED
 * It is the cleanest way to see whether you can drive types from *data* rather
 * than restating them by hand. Every i18n library ships some version of this,
 * so it is fair game at a translation company. It exercises template literal
 * types, `infer`, recursion, union distribution and variadic tuples in one go.
 *
 * YOUR TASK
 * Implement `Placeholder`, `TranslationParams` and `TArgs` below.
 *
 * HINTS (peek only if stuck for >5 min)
 *   1. Match one placeholder and keep the rest: `${string}{${infer P}}${infer Rest}`
 *   2. Recurse on `Rest`, union the results. Unions dedupe for free.
 *   3. `[T] extends [never]` is how you test for `never` without distributing.
 *   4. A rest parameter typed as a tuple controls arity: `...args: []` means
 *      "no more arguments allowed".
 *
 * STRETCH (interviewers WILL escalate — have an answer ready)
 *   a. Reject *extra* params that the string never mentions.
 *   b. Support typed formats: `{count:number}` → `{ count: number }`.
 *   c. What breaks when `S` is widened to `string` by a variable? Why?
 */

/** Extract every `{placeholder}` name from a template string as a union. */
export type Placeholder<S extends string> = never; // TODO

/** Build the params object required by template `S`. */
export type TranslationParams<S extends string> = {}; // TODO

/**
 * The argument list that follows the template.
 * Must be `[]` when `S` has no placeholders, `[params]` otherwise.
 */
export type TArgs<S extends string> = [params: TranslationParams<S>]; // TODO

export function t<S extends string>(template: S, ...args: TArgs<S>): string {
  const params = (args[0] ?? {}) as Record<string, string | number>;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in params ? String(params[key]) : whole,
  );
}
