import { describe, it, expect } from 'vitest';
import {
  listboxReducer,
  initialListboxState,
} from '@impl/04-dom-a11y/01-listbox-keyboard.ts';
import type {
  ListboxState,
  ListboxAction,
  ListboxOptions,
} from '@impl/04-dom-a11y/01-listbox-keyboard.ts';

const options: ListboxOptions = {
  labels: ['English', 'Deutsch', 'Español', 'Polski', 'Português'],
};

const open = (overrides: Partial<ListboxState> = {}): ListboxState => ({
  ...initialListboxState,
  isOpen: true,
  activeIndex: 0,
  ...overrides,
});

const key = (k: string, now = 0): ListboxAction => ({ type: 'key', key: k, now });

const run = (state: ListboxState, actions: ListboxAction[], opts = options): ListboxState =>
  actions.reduce((acc, action) => listboxReducer(acc, action, opts), state);

describe('opening', () => {
  it('ArrowDown opens and activates the first item', () => {
    const next = listboxReducer(initialListboxState, key('ArrowDown'), options);
    expect(next.isOpen).toBe(true);
    expect(next.activeIndex).toBe(0);
  });

  it('ArrowUp opens and activates the last item', () => {
    const next = listboxReducer(initialListboxState, key('ArrowUp'), options);
    expect(next.isOpen).toBe(true);
    expect(next.activeIndex).toBe(4);
  });

  it('Enter opens without selecting', () => {
    const next = listboxReducer(initialListboxState, key('Enter'), options);
    expect(next.isOpen).toBe(true);
    expect(next.selectedIndex).toBe(-1);
  });

  it('Space opens', () => {
    expect(listboxReducer(initialListboxState, key(' '), options).isOpen).toBe(true);
  });

  it('an unrelated key leaves it closed', () => {
    const next = listboxReducer(initialListboxState, key('Tab'), options);
    expect(next.isOpen).toBe(false);
  });
});

describe('arrow navigation', () => {
  it('moves down', () => {
    expect(listboxReducer(open(), key('ArrowDown'), options).activeIndex).toBe(1);
  });

  it('wraps from the last item to the first', () => {
    expect(
      listboxReducer(open({ activeIndex: 4 }), key('ArrowDown'), options).activeIndex,
    ).toBe(0);
  });

  it('moves up', () => {
    expect(
      listboxReducer(open({ activeIndex: 2 }), key('ArrowUp'), options).activeIndex,
    ).toBe(1);
  });

  it('wraps from the first item to the last', () => {
    expect(listboxReducer(open(), key('ArrowUp'), options).activeIndex).toBe(4);
  });

  it('Home goes to the first, End to the last', () => {
    expect(
      listboxReducer(open({ activeIndex: 3 }), key('Home'), options).activeIndex,
    ).toBe(0);
    expect(listboxReducer(open(), key('End'), options).activeIndex).toBe(4);
  });

  it('does not move the selection while navigating', () => {
    const next = run(open({ selectedIndex: 2 }), [key('ArrowDown'), key('ArrowDown')]);
    expect(next.selectedIndex).toBe(2);
    expect(next.activeIndex).toBe(2);
  });
});

describe('closing', () => {
  it('Enter selects the active item and closes', () => {
    const next = listboxReducer(open({ activeIndex: 3 }), key('Enter'), options);
    expect(next.selectedIndex).toBe(3);
    expect(next.isOpen).toBe(false);
  });

  it('Escape closes and clears the active item but keeps the selection', () => {
    const next = listboxReducer(
      open({ activeIndex: 3, selectedIndex: 1 }),
      key('Escape'),
      options,
    );
    expect(next.isOpen).toBe(false);
    expect(next.activeIndex).toBe(-1);
    expect(next.selectedIndex).toBe(1);
  });

  it('Tab closes and keeps the selection', () => {
    const next = listboxReducer(open({ selectedIndex: 2 }), key('Tab'), options);
    expect(next.isOpen).toBe(false);
    expect(next.selectedIndex).toBe(2);
  });

  it('the close action closes', () => {
    expect(listboxReducer(open(), { type: 'close' }, options).isOpen).toBe(false);
  });
});

describe('type-ahead', () => {
  it('jumps to the first item starting with the character', () => {
    const next = listboxReducer(open(), key('p', 1000), options);
    expect(next.activeIndex).toBe(3); // Polski
  });

  it('is case-insensitive', () => {
    expect(listboxReducer(open(), key('D', 1000), options).activeIndex).toBe(1);
  });

  it('accumulates characters typed within the timeout', () => {
    const next = run(open(), [key('p', 1000), key('o', 1100)]);
    expect(next.typeahead).toBe('po');
    expect(next.activeIndex).toBe(4); // Português
  });

  it('starts a new buffer after the timeout', () => {
    const next = run(open(), [key('p', 1000), key('d', 2000)]);
    expect(next.typeahead).toBe('d');
    expect(next.activeIndex).toBe(1); // Deutsch
  });

  it('searches from after the active item and wraps', () => {
    // 'e' matches English (0) and Español (2). From index 0, the next is 2.
    expect(listboxReducer(open({ activeIndex: 0 }), key('e', 1000), options).activeIndex).toBe(2);
    // From index 2, it wraps back to 0.
    expect(listboxReducer(open({ activeIndex: 2 }), key('e', 1000), options).activeIndex).toBe(0);
  });

  it('leaves the active item alone when nothing matches', () => {
    const next = listboxReducer(open({ activeIndex: 2 }), key('z', 1000), options);
    expect(next.activeIndex).toBe(2);
  });

  it('opens the list if it was closed', () => {
    const next = listboxReducer(initialListboxState, key('d', 1000), options);
    expect(next.isOpen).toBe(true);
    expect(next.activeIndex).toBe(1);
  });
});

describe('pointer', () => {
  it('hover activates without changing open state', () => {
    const next = listboxReducer(open({ activeIndex: 0 }), { type: 'hover', index: 3 }, options);
    expect(next.activeIndex).toBe(3);
    expect(next.isOpen).toBe(true);
  });
});

describe('empty list', () => {
  const empty: ListboxOptions = { labels: [] };

  it('ArrowDown does not activate anything', () => {
    const next = listboxReducer(initialListboxState, key('ArrowDown'), empty);
    expect(next.activeIndex).toBe(-1);
  });

  it('Enter selects nothing', () => {
    const next = listboxReducer(open({ activeIndex: -1 }), key('Enter'), empty);
    expect(next.selectedIndex).toBe(-1);
  });

  it('type-ahead is a no-op', () => {
    const next = listboxReducer(open({ activeIndex: -1 }), key('a', 1000), empty);
    expect(next.activeIndex).toBe(-1);
  });
});
