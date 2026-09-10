import { describe, it, expectTypeOf } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import { allSettledTyped, allSettledRecord } from '@impl/01-types/06-variadic-batch.ts';
import type { Settled, SettledTuple } from '@impl/01-types/06-variadic-batch.ts';

type _tuple = [
  Expect<
    Equal<
      SettledTuple<[Promise<string>, Promise<number>]>,
      [Settled<string>, Settled<number>]
    >
  >,
  // Non-promise members unwrap to themselves.
  Expect<Equal<SettledTuple<[string, Promise<number>]>, [Settled<string>, Settled<number>]>>,
  Expect<Equal<SettledTuple<[]>, []>>,
  // Nested promises collapse, courtesy of Awaited.
  Expect<Equal<SettledTuple<[Promise<Promise<string>>]>, [Settled<string>]>>,
];

describe('allSettledTyped', () => {
  it('keeps each position typed', async () => {
    const results = await allSettledTyped([
      Promise.resolve('Hallo Welt'),
      Promise.resolve(42),
      Promise.resolve({ code: 'de' }),
    ]);

    expectTypeOf(results).toEqualTypeOf<
      [Settled<string>, Settled<number>, Settled<{ code: string }>]
    >();

    const [text] = results;
    if (text.status === 'fulfilled') {
      // The whole point: `string`, not `string | number | { code: string }`.
      expectTypeOf(text.value).toEqualTypeOf<string>();
    }
  });

  it('does not widen the argument to an array', async () => {
    const results = await allSettledTyped([Promise.resolve('a')]);
    // A widened `Settled<string>[]` would make this assertion fail.
    expectTypeOf(results).toEqualTypeOf<[Settled<string>]>();
  });
});

describe('allSettledRecord', () => {
  it('keeps keys and per-key value types', async () => {
    const results = await allSettledRecord({
      translation: Promise.resolve('Hallo'),
      quota: Promise.resolve(1000),
    });

    expectTypeOf(results).toEqualTypeOf<{
      translation: Settled<string>;
      quota: Settled<number>;
    }>();
  });
});
