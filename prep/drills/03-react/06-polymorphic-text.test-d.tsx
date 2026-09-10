import { describe, it } from 'vitest';
import { Text } from '@impl/03-react/06-polymorphic-text.tsx';

describe('Text types', () => {
  it('allows only the chosen element’s props', () => {
    <Text as="a" href="/de" target="_blank">
      Deutsch
    </Text>;

    <Text as="button" type="submit" disabled>
      Übersetzen
    </Text>;

    <Text as="img" src="/flag.png" alt="Flag" />;
  });

  it('rejects props the default element does not have', () => {
    // @ts-expect-error - a span has no href
    <Text href="/de">nope</Text>;
  });

  it('rejects props the chosen element does not have', () => {
    // @ts-expect-error - a button has no href
    <Text as="button" href="/de">
      nope
    </Text>;
  });

  it('still checks its own props', () => {
    // @ts-expect-error - 'loud' is not a tone
    <Text tone="loud">nope</Text>;
  });

  it('keeps its own props available on any element', () => {
    <Text as="h2" tone="muted">
      Untertitel
    </Text>;
  });

  it('types the event handlers for the chosen element', () => {
    // A plain annotation is the assertion here: it fails to compile if
    // `currentTarget` is not exactly this element type.
    <Text
      as="button"
      onClick={(event) => {
        const target: HTMLButtonElement = event.currentTarget;
        void target;
      }}
    >
      Klick
    </Text>;

    <Text
      as="a"
      href="#x"
      onClick={(event) => {
        const target: HTMLAnchorElement = event.currentTarget;
        // @ts-expect-error - an anchor is not a button
        const wrong: HTMLButtonElement = event.currentTarget;
        void target;
        void wrong;
      }}
    >
      Link
    </Text>;
  });

  it('accepts a custom component and its props', () => {
    function Badge(props: { children?: React.ReactNode; count: number }) {
      return <mark>{props.count}</mark>;
    }

    <Text as={Badge} count={3}>
      Neu
    </Text>;

    // @ts-expect-error - Badge requires `count`
    <Text as={Badge}>Neu</Text>;
  });
});
