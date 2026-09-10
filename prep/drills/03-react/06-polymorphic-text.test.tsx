import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from '@impl/03-react/06-polymorphic-text.tsx';

describe('Text', () => {
  it('renders a span by default', () => {
    render(<Text>Hallo</Text>);
    const node = screen.getByText('Hallo');
    expect(node.tagName).toBe('SPAN');
  });

  it('applies the tone as a data attribute', () => {
    render(<Text tone="muted">Hallo</Text>);
    expect(screen.getByText('Hallo')).toHaveAttribute('data-tone', 'muted');
  });

  it('defaults the tone', () => {
    render(<Text>Hallo</Text>);
    expect(screen.getByText('Hallo')).toHaveAttribute('data-tone', 'default');
  });

  it('renders the element named by `as`', () => {
    render(<Text as="h1">Titel</Text>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Titel');
  });

  it('forwards element-specific props', () => {
    render(
      <Text as="a" href="/de">
        Deutsch
      </Text>,
    );
    const link = screen.getByRole('link', { name: 'Deutsch' });
    expect(link).toHaveAttribute('href', '/de');
  });

  it('forwards className and other shared props', () => {
    render(
      <Text className="lead" id="intro">
        Hallo
      </Text>,
    );
    const node = screen.getByText('Hallo');
    expect(node).toHaveClass('lead');
    expect(node).toHaveAttribute('id', 'intro');
  });

  it('does not leak `as` into the DOM', () => {
    render(<Text as="p">Absatz</Text>);
    expect(screen.getByText('Absatz')).not.toHaveAttribute('as');
  });

  it('works with a custom component', () => {
    function Badge({ children, ...rest }: { children?: React.ReactNode }) {
      return <mark {...rest}>{children}</mark>;
    }

    render(<Text as={Badge}>Neu</Text>);
    expect(screen.getByText('Neu').tagName).toBe('MARK');
  });

  it('handles a button with a type prop', () => {
    render(
      <Text as="button" type="submit">
        Übersetzen
      </Text>,
    );
    expect(screen.getByRole('button', { name: 'Übersetzen' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
