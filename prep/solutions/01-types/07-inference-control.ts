/**
 * SOLUTION 1.7 — Controlling inference
 *
 * Talking points:
 *
 * (a) CONST TYPE PARAMETERS (TS 5.0). `<const T>` makes the compiler infer as
 *     if the argument had `as const` at the call site: literals stay literal
 *     and arrays become readonly tuples. The win over `as const` is that the
 *     *library* opts in once instead of every caller remembering. It only
 *     affects inference from arguments — it does nothing to a `T` supplied
 *     explicitly, and it does not deep-freeze anything at runtime.
 *
 * (b) `NoInfer<T>` (TS 5.4, intrinsic). Inference collects candidates from
 *     every parameter position mentioning `T`; without help, `fallback`
 *     contributes `'xx'` and `T` widens to `'en' | 'de' | 'xx'`, so the bug
 *     types itself into existence. `NoInfer<T>` marks that position
 *     "check-only", so `T` is fixed by `items` and the fallback is then
 *     validated against it. Before 5.4 people wrote `[T][T extends any ? 0 : never]`.
 *
 * (c) DISTRIBUTION. A conditional distributes only over a *naked* type
 *     parameter. `T extends unknown ? T[] : never` runs once per union member
 *     and unions the results. Wrapping both sides in tuples —
 *     `[T] extends [unknown]` — makes the parameter non-naked and the whole
 *     union is tested at once. Two consequences worth naming: distribution
 *     over `never` yields `never` (nothing to iterate — the trap behind
 *     `[T] extends [never]`), and `Exclude`/`Extract`/`NonNullable` are built
 *     entirely on distribution being ON.
 *
 * (d) `satisfies` (TS 4.9). An annotation checks AND widens: `const LANGUAGES:
 *     LanguageTable` makes `keyof typeof LANGUAGES` collapse to `string`, so
 *     autocomplete dies and typos compile. `satisfies` checks without
 *     widening, so you get both the constraint and the literal keys. The
 *     one-line rule: "annotate when you want the wider type, `satisfies` when
 *     you want the check but the narrow type."
 *     Caveat worth mentioning: the target still provides a contextual type, so
 *     `rtl: true` here infers as `boolean`, not `true`. Use `satisfies` plus
 *     `as const`, or narrow the target, if you need the literal.
 */

export function defineLanguages<const T extends readonly string[]>(langs: T): T {
  return langs;
}

export function withFallback<const T extends string>(
  items: readonly T[],
  fallback: NoInfer<T>,
): T {
  return items[0] ?? fallback;
}

export type ToArray<T> = T extends unknown ? T[] : never;

export type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

export type LanguageTable = Record<string, { label: string; rtl?: boolean }>;

export const LANGUAGES = {
  en: { label: 'English' },
  de: { label: 'Deutsch' },
  ar: { label: 'العربية', rtl: true },
} satisfies LanguageTable;

export type LanguageCode = keyof typeof LANGUAGES;
