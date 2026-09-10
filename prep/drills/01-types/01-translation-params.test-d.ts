import { describe, it, expectTypeOf } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import { t } from '@impl/01-types/01-translation-params.ts';
import type {
  Placeholder,
  TranslationParams,
  TArgs,
} from '@impl/01-types/01-translation-params.ts';

type _cases = [
  // Placeholder extraction
  Expect<Equal<Placeholder<'Hello {name}'>, 'name'>>,
  Expect<Equal<Placeholder<'{greeting}, {name}!'>, 'greeting' | 'name'>>,
  Expect<Equal<Placeholder<'no placeholders here'>, never>>,
  // Repeats collapse, because unions dedupe.
  Expect<Equal<Placeholder<'{name} und {name}'>, 'name'>>,
  Expect<Equal<Placeholder<'{a}{b}{c}'>, 'a' | 'b' | 'c'>>,

  // Params object
  Expect<
    Equal<TranslationParams<'Hello {name}'>, { name: string | number }>
  >,
  Expect<
    Equal<
      TranslationParams<'{from} → {to}'>,
      { from: string | number; to: string | number }
    >
  >,
  Expect<Equal<TranslationParams<'static'>, {}>>,

  // Arity control
  Expect<Equal<TArgs<'static'>, []>>,
  Expect<Equal<TArgs<'Hi {name}'>, [params: { name: string | number }]>>,
];

describe('t()', () => {
  it('requires exactly the params the template mentions', () => {
    t('Hello {name}', { name: 'Paweł' });
    t('Translated {n} documents', { n: 3 });

    // @ts-expect-error - 'name' is missing
    t('Hello {name}', {});

    // @ts-expect-error - template needs params, none given
    t('Hello {name}');

    // @ts-expect-error - 'surname' is not in the template
    t('Hello {name}', { name: 'P', surname: 'N' });
  });

  it('takes no second argument when there is nothing to interpolate', () => {
    t('Document translated');

    // @ts-expect-error - no params accepted
    t('Document translated', { anything: 1 });
  });

  it('still returns a plain string', () => {
    expectTypeOf(t('Hello {name}', { name: 'x' })).toEqualTypeOf<string>();
  });
});
