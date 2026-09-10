/**
 * SOLUTION 1.2 — Autocomplete for nested message catalogues
 *
 * Talking points:
 *
 * 1. "Map then index" — `{ [K in keyof T]: Something }[keyof T]` — is the
 *    standard way to collapse a mapped type into a union. Say the name out
 *    loud; interviewers recognise it as a sign you have written real types.
 *
 * 2. `keyof T & string` filters out `number | symbol` keys. Without it,
 *    `${K}.${...}` is a compile error, because a symbol cannot be spliced
 *    into a template literal type.
 *
 * 3. Excluding branch nodes is a one-line decision: emit `K` only in the
 *    string-leaf branch, and only emit `` `${K}.${Recurse}` `` otherwise.
 *    Getting *both* is the common wrong answer, and it produces autocomplete
 *    entries that crash at runtime.
 *
 * 4. `const T` on the type parameter (a const type parameter, TS 5.0+) keeps
 *    the caller's object literal narrow without forcing them to write
 *    `as const` at every call site. Worth naming — it is recent enough that
 *    it reads as "keeps up with the language".
 *
 * 5. Depth: this recursion is bounded by the shape of the object, so a normal
 *    catalogue is fine. If asked about safety, mention a depth-counter tuple
 *    (`Prev = [never, 0, 1, 2, ...]`) as the standard guard.
 */

export type TranslationKey<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends string
        ? K
        : T[K] extends Record<string, unknown>
          ? `${K}.${TranslationKey<T[K]>}`
          : never;
    }[keyof T & string]
  : never;

export type ValueAt<T, P extends string> = P extends `${infer Head}.${infer Rest}`
  ? Head extends keyof T
    ? ValueAt<T[Head], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

export function createTranslator<const T extends Record<string, unknown>>(messages: T) {
  return function t(key: TranslationKey<T>): string {
    return String(key)
      .split('.')
      .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], messages) as string;
  };
}
