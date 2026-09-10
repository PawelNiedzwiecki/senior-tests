import { describe, it, expectTypeOf } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import {
  defineLanguages,
  withFallback,
  LANGUAGES,
} from '@impl/01-types/07-inference-control.ts';
import type {
  ToArray,
  ToArrayNonDist,
  LanguageCode,
} from '@impl/01-types/07-inference-control.ts';

// ── (c) is pure type-level, assert it up front ──────────────────────────────
type _distribution = [
  Expect<Equal<ToArray<string | number>, string[] | number[]>>,
  Expect<Equal<ToArrayNonDist<string | number>, (string | number)[]>>,
  Expect<Equal<ToArray<string>, string[]>>,
  // A distributive conditional over `never` produces `never` — the classic trap.
  Expect<Equal<ToArray<never>, never>>,
  Expect<Equal<ToArrayNonDist<never>, never[]>>,
];

// ── (d) literal keys survive ────────────────────────────────────────────────
type _satisfies = [
  Expect<Equal<LanguageCode, 'en' | 'de' | 'ar'>>,
];

describe('(a) defineLanguages', () => {
  it('keeps literals without as const at the call site', () => {
    const langs = defineLanguages(['en', 'de', 'pl']);
    expectTypeOf(langs).toEqualTypeOf<readonly ['en', 'de', 'pl']>();
  });

  it('still rejects non-strings', () => {
    // @ts-expect-error - numbers are not language codes
    defineLanguages(['en', 1]);
  });
});

describe('(b) withFallback', () => {
  it('accepts a fallback drawn from the items', () => {
    const picked = withFallback(['en', 'de'], 'de');
    expectTypeOf(picked).toEqualTypeOf<'en' | 'de'>();
  });

  it('rejects a fallback that is not one of the items', () => {
    // @ts-expect-error - 'xx' is not in ['en', 'de']
    withFallback(['en', 'de'], 'xx');
  });
});

describe('(d) LANGUAGES', () => {
  it('is still checked against the table shape', () => {
    expectTypeOf(LANGUAGES.en.label).toEqualTypeOf<string>();
  });

  it('exposes only the codes that exist', () => {
    // Note: `const code: LanguageCode = 'ar'` would narrow the *reference* to
    // 'ar' via control-flow analysis, so assert on the type itself.
    expectTypeOf<LanguageCode>().toEqualTypeOf<'en' | 'de' | 'ar'>();

    // @ts-expect-error - not a configured language
    const missing: LanguageCode = 'fr';
    void missing;
  });
});
