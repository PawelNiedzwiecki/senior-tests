/**
 * DRILL 1.2 — Autocomplete for nested message catalogues
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * Given a nested message catalogue, produce the union of dotted keys that
 * actually resolve to a *string leaf*, plus a lookup type:
 *
 *   const messages = {
 *     nav: { settings: { title: 'Settings' }, home: 'Home' },
 *     errors: { network: 'Offline' },
 *   };
 *
 *   TranslationKey<typeof messages>
 *     → 'nav.settings.title' | 'nav.home' | 'errors.network'
 *
 * Note what is NOT in there: 'nav' and 'nav.settings' are branches, not
 * messages, so offering them in autocomplete would be a lie.
 *
 * WHY IT'S ASKED
 * This is the type behind every "why doesn't my i18n library autocomplete"
 * complaint. It shows recursion over object types, key remapping, template
 * literal composition, and the discipline to exclude intermediate nodes.
 *
 * YOUR TASK
 * Implement `TranslationKey` and `ValueAt`, then type `createTranslator` so
 * that `t()` only accepts real keys.
 *
 * HINTS
 *   1. Map over `keyof T & string` — the `& string` matters, because `keyof`
 *      also yields `number | symbol` and those break template literals.
 *   2. `{ [K in keyof T]: ... }[keyof T]` turns a mapped type into a union.
 *      This "map then index" trick is the workhorse of this whole family.
 *   3. To exclude branches, only emit `K` itself when `T[K]` is a string.
 *   4. For `ValueAt`, split the path: `P extends `${infer Head}.${infer Rest}``.
 *
 * STRETCH
 *   a. Cap the recursion depth so a cyclic type cannot hang the compiler.
 *   b. Make it work when some leaves are `(n: number) => string` formatters.
 *   c. Combine with drill 1.1: infer params from the *value* at that key.
 */

/** Dotted paths that resolve to a string leaf. */
export type TranslationKey<T> = never; // TODO

/** The value type sitting at dotted path `P` inside `T`. */
export type ValueAt<T, P extends string> = never; // TODO

export function createTranslator<const T extends Record<string, unknown>>(messages: T) {
  return function t(key: TranslationKey<T>): string {
    return String(key)
      .split('.')
      .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], messages) as string;
  };
}
