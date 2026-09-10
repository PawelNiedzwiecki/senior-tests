import { describe, it, expectTypeOf } from 'vitest';
import { Select } from '@impl/03-react/05-generic-select.tsx';

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

describe('Select types', () => {
  it('infers T from items — no explicit type argument needed', () => {
    <Select
      label="Into"
      items={languages}
      value={null}
      onChange={(lang) => {
        // The payoff: `lang` is Language, inferred all the way from `items`.
        expectTypeOf(lang).toEqualTypeOf<Language>();
      }}
      getKey={(lang) => {
        expectTypeOf(lang).toEqualTypeOf<Language>();
        return lang.code;
      }}
      getLabel={(lang) => lang.name}
    />;
  });

  it('rejects a value of the wrong type', () => {
    <Select
      label="Into"
      items={languages}
      // @ts-expect-error - value must be Language | null
      value={'en'}
      onChange={() => {}}
      getKey={(lang) => lang.code}
      getLabel={(lang) => lang.name}
    />;
  });

  it('rejects accessors that return the wrong type', () => {
    <Select
      label="Into"
      items={languages}
      value={null}
      onChange={() => {}}
      // @ts-expect-error - getKey must return string
      getKey={(lang) => lang}
      getLabel={(lang) => lang.name}
    />;
  });

  it('rejects an onChange that expects something else', () => {
    <Select
      label="Into"
      items={languages}
      value={null}
      // @ts-expect-error - the handler cannot demand a narrower parameter
      onChange={(code: string) => code}
      getKey={(lang) => lang.code}
      getLabel={(lang) => lang.name}
    />;
  });

  it('works with primitives', () => {
    <Select
      label="Quality"
      items={[1, 2, 3]}
      value={1}
      onChange={(n) => expectTypeOf(n).toEqualTypeOf<number>()}
      getKey={(n) => String(n)}
      getLabel={(n) => `Level ${n}`}
    />;
  });
});
