import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@impl/03-react/05-generic-select.tsx';

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pl', name: 'Polski' },
];

function renderSelect(overrides: Partial<Parameters<typeof Select<Language>>[0]> = {}) {
  const onChange = vi.fn();
  const utils = render(
    <Select<Language>
      label="Translate into"
      items={languages}
      value={null}
      onChange={onChange}
      getKey={(lang) => lang.code}
      getLabel={(lang) => lang.name}
      {...overrides}
    />,
  );
  return { ...utils, onChange };
}

describe('Select', () => {
  it('renders the label', () => {
    renderSelect();
    expect(screen.getByText('Translate into')).toBeInTheDocument();
  });

  it('renders one option per item', () => {
    renderSelect();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.textContent)).toEqual(['English', 'Deutsch', 'Polski']);
  });

  it('exposes a listbox labelled by the visible label', () => {
    renderSelect();
    expect(screen.getByRole('listbox', { name: 'Translate into' })).toBeInTheDocument();
  });

  it('marks nothing selected when value is null', () => {
    renderSelect();
    for (const option of screen.getAllByRole('option')) {
      expect(option).toHaveAttribute('aria-selected', 'false');
    }
  });

  it('marks the selected option', () => {
    renderSelect({ value: languages[1] });
    expect(screen.getByRole('option', { name: 'Deutsch' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('option', { name: 'English' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('calls onChange with the item, not the key', async () => {
    const user = userEvent.setup();
    const { onChange } = renderSelect();

    await user.click(screen.getByRole('option', { name: 'Polski' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ code: 'pl', name: 'Polski' });
  });

  it('renders the empty message for an empty list', () => {
    renderSelect({ items: [], emptyMessage: 'No languages available' });
    expect(screen.getByText('No languages available')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('works with a completely different item type', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Select<number>
        label="Quality"
        items={[1, 2, 3]}
        value={2}
        onChange={onChange}
        getKey={(n) => String(n)}
        getLabel={(n) => `Level ${n}`}
      />,
    );

    expect(screen.getByRole('option', { name: 'Level 2' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.click(screen.getByRole('option', { name: 'Level 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });
});
