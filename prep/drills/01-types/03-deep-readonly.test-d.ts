import { describe, it } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import type { DeepReadonly, DeepMutable } from '@impl/01-types/03-deep-readonly.ts';

interface Job {
  id: string;
  source: { lang: string; segments: string[] };
  retries: number;
}

type _objects = [
  Expect<
    Equal<
      DeepReadonly<Job>,
      {
        readonly id: string;
        readonly source: { readonly lang: string; readonly segments: readonly string[] };
        readonly retries: number;
      }
    >
  >,
];

type _arrays = [
  Expect<Equal<DeepReadonly<string[]>, readonly string[]>>,
  Expect<
    Equal<DeepReadonly<{ a: number }[]>, readonly { readonly a: number }[]>
  >,
  // Tuples keep their arity and element types.
  Expect<Equal<DeepReadonly<[string, number]>, readonly [string, number]>>,
  Expect<
    Equal<DeepReadonly<[{ a: 1 }, number]>, readonly [{ readonly a: 1 }, number]>
  >,
];

type _passthrough = [
  Expect<Equal<DeepReadonly<string>, string>>,
  Expect<Equal<DeepReadonly<number | undefined>, number | undefined>>,
  // Functions must survive intact, not become `{}`.
  Expect<Equal<DeepReadonly<(a: string) => number>, (a: string) => number>>,
  Expect<
    Equal<
      DeepReadonly<{ run: (a: string) => number }>,
      { readonly run: (a: string) => number }
    >
  >,
];

type _collections = [
  Expect<Equal<DeepReadonly<Map<string, { a: number }>>, ReadonlyMap<string, { readonly a: number }>>>,
  Expect<Equal<DeepReadonly<Set<{ a: number }>>, ReadonlySet<{ readonly a: number }>>>,
];

type _mutable = [
  Expect<Equal<DeepMutable<DeepReadonly<Job>>, Job>>,
  Expect<Equal<DeepMutable<readonly string[]>, string[]>>,
  Expect<Equal<DeepMutable<readonly [string, number]>, [string, number]>>,
];

describe('DeepReadonly', () => {
  it('is a compile-time only construct', () => {
    // Nothing to assert at runtime — that is the point. If this file compiles,
    // every assertion above held.
  });
});
