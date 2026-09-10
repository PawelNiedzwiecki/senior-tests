/**
 * DRILL 1.7 — Controlling inference: const, NoInfer, satisfies, distribution
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * Four small tasks, each about one lever that changes what TypeScript infers.
 * These are the levers seniors are expected to reach for by name.
 *
 * WHY IT'S ASKED
 * "Why is this `string` and not `'en'`?" is the most common real-world TS
 * question there is. Being able to answer *and* name the fix (`as const`,
 * a const type parameter, `satisfies`, `NoInfer`) is a strong signal, because
 * three of those four shipped in the last few years.
 *
 * YOUR TASKS
 *   a) `defineLanguages` — keep the caller's literals without `as const`.
 *   b) `withFallback`    — the fallback must be one of the listed items.
 *   c) `ToArray` / `ToArrayNonDist` — show you can turn distribution off.
 *   d) `LANGUAGES`       — keep literal keys while still being checked.
 *
 * HINTS
 *   a) A `const` modifier on the type parameter: `<const T extends ...>`.
 *   b) `NoInfer<T>` (built in since TS 5.4) removes a position from the set of
 *      inference candidates, so `T` is decided by the *other* argument.
 *   c) A conditional distributes only over a NAKED type parameter. Wrap both
 *      sides in a tuple to stop it: `[T] extends [U] ? ... : ...`.
 *   d) `satisfies` checks the value against a type WITHOUT widening it to that
 *      type. An annotation checks and widens; that is the difference.
 *
 * STRETCH
 *   a. What does `as const` do that a const type parameter does not, and
 *      vice versa? (Think: readonly-ness, nested objects, call sites.)
 *   b. Write `NoInfer<T>` yourself. (Intrinsic today; the old trick was
 *      `[T][T extends any ? 0 : never]`.)
 *   c. When is distribution what you want? `Exclude` and `Extract` rely on it.
 */

// ── (a) Keep the caller's literal types ─────────────────────────────────────
// defineLanguages(['en', 'de']) should be readonly ['en', 'de'], NOT string[].
export function defineLanguages<T extends readonly string[]>(langs: T): T {
  return langs;
} // TODO: one keyword is missing from the type parameter

// ── (b) The fallback must be one of the items ───────────────────────────────
// withFallback(['en', 'de'], 'xx') must be an error, because 'xx' is not listed.
export function withFallback<const T extends string>(items: readonly T[], fallback: T): T {
  return items[0] ?? fallback;
} // TODO: stop `fallback` from contributing to inference

// ── (c) Distribution on and off ─────────────────────────────────────────────
/** Distributive: `ToArray<string | number>` → `string[] | number[]`. */
export type ToArray<T> = T[]; // TODO

/** Non-distributive: `ToArrayNonDist<string | number>` → `(string | number)[]`. */
export type ToArrayNonDist<T> = T[]; // TODO

// ── (d) Checked, but not widened ────────────────────────────────────────────
export type LanguageTable = Record<string, { label: string; rtl?: boolean }>;

// TODO: keep the check, keep the literal keys. `LanguageCode` must end up as
// 'en' | 'de' | 'ar', not `string`.
export const LANGUAGES: LanguageTable = {
  en: { label: 'English' },
  de: { label: 'Deutsch' },
  ar: { label: 'العربية', rtl: true },
};

export type LanguageCode = keyof typeof LANGUAGES;
