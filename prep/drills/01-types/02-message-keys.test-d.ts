import { describe, it, expect, expectTypeOf } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import { createTranslator } from '@impl/01-types/02-message-keys.ts';
import type { TranslationKey, ValueAt } from '@impl/01-types/02-message-keys.ts';

const messages = {
  nav: {
    home: 'Home',
    settings: { title: 'Settings', privacy: 'Privacy' },
  },
  errors: { network: 'You appear to be offline' },
} as const;

type Messages = {
  nav: { home: string; settings: { title: string; privacy: string } };
  errors: { network: string };
};

type _cases = [
  Expect<
    Equal<
      TranslationKey<Messages>,
      'nav.home' | 'nav.settings.title' | 'nav.settings.privacy' | 'errors.network'
    >
  >,
  // Flat catalogues still work.
  Expect<Equal<TranslationKey<{ ok: string; cancel: string }>, 'ok' | 'cancel'>>,
  // Branch nodes must NOT appear.
  Expect<Equal<Extract<TranslationKey<Messages>, 'nav' | 'nav.settings'>, never>>,

  Expect<Equal<ValueAt<Messages, 'nav.settings.title'>, string>>,
  Expect<
    Equal<ValueAt<Messages, 'nav.settings'>, { title: string; privacy: string }>
  >,
];

describe('createTranslator', () => {
  it('accepts only leaf keys', () => {
    const t = createTranslator(messages);
    expectTypeOf(t('nav.settings.title')).toEqualTypeOf<string>();

    // @ts-expect-error - branch node, not a message
    t('nav.settings');

    // @ts-expect-error - typo
    t('nav.setting.title');
  });

  it('resolves the message at runtime', () => {
    const t = createTranslator(messages);
    expect(t('errors.network')).toBe('You appear to be offline');
    expect(t('nav.home')).toBe('Home');
  });
});
