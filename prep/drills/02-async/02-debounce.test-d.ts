// NOTE: this file is GREEN from the start, unlike every other drill test.
// Drill 2.2 hands you the type signature and asks for the behaviour, so these
// assertions document the contract your implementation has to satisfy rather
// than driving you towards it. The runtime tests in `02-debounce.test.ts` are
// the ones that fail until you implement `debounce`.
import { describe, it, expectTypeOf } from 'vitest';
import { debounce } from '@impl/02-async/02-debounce.ts';

describe('debounce types', () => {
  it('keeps the original parameter list', () => {
    const d = debounce((_lang: string, _count: number) => 'ok', 100);

    d('de', 3);

    // @ts-expect-error - wrong argument type
    d(3, 'de');

    // @ts-expect-error - missing argument
    d('de');
  });

  it('returns void from the debounced call, not the wrapped return type', () => {
    const d = debounce((n: number) => n * 2, 100);
    expectTypeOf(d('' as unknown as number)).toEqualTypeOf<void>();
  });

  it('exposes the control methods', () => {
    const d = debounce(() => {}, 100);
    expectTypeOf(d.cancel).toEqualTypeOf<() => void>();
    expectTypeOf(d.flush).toEqualTypeOf<() => void>();
    expectTypeOf(d.pending()).toEqualTypeOf<boolean>();
  });
});
