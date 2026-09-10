/**
 * SOLUTION 4.1 — Keyboard navigation as a pure reducer
 *
 * Talking points:
 *
 * 1. PULL THE LOGIC OUT OF THE DOM. This is the point of the drill. Keyboard
 *    behaviour is a state machine; once it is a pure function you can test the
 *    whole key matrix in milliseconds, with no jsdom, no fake events and no
 *    flake. The component becomes a thin adapter: read `event.key`, dispatch,
 *    render from state. Say this first — it is an architectural answer, and
 *    architectural answers are what the "senior" label is testing.
 *
 * 2. FOLLOW THE ARIA AUTHORING PRACTICES, AND SAY THAT YOU ARE. ArrowUp on a
 *    closed listbox opening at the LAST item is not a quirk I invented — it is
 *    the spec, and it is what screen-reader users expect. Knowing that the
 *    APG exists and that these patterns are written down is more valuable than
 *    remembering any single key binding.
 *
 * 3. WRAPPING ARITHMETIC. `(i + 1) % n` forward, `(i - 1 + n) % n` backward.
 *    The `+ n` matters: JavaScript's `%` keeps the sign of the dividend, so
 *    `-1 % 5` is `-1`, not `4`. That one-liner is a classic off-by-one.
 *
 * 4. GUARD THE EMPTY LIST FIRST. With `n === 0` every modulo is `NaN` and the
 *    component renders `aria-activedescendant="option-NaN"`. An early return
 *    is cheaper than defending it at each branch.
 *
 * 5. ACTIVE ≠ SELECTED. `activeIndex` is the visual/AT cursor
 *    (`aria-activedescendant`); `selectedIndex` is committed state
 *    (`aria-selected`). Escape must clear the first and preserve the second —
 *    cancelling navigation is not the same as clearing the user's choice.
 *    Conflating them is the most common bug in hand-rolled dropdowns.
 *
 * 6. TYPE-AHEAD SEARCHES FROM AFTER THE ACTIVE ITEM so repeated presses walk
 *    through matches instead of sticking on the first. The rotated index list
 *    makes the wrap fall out naturally rather than needing two loops.
 *
 * 7. `aria-activedescendant` vs ROVING `tabindex`: with activedescendant, DOM
 *    focus stays on the input and the attribute points at the active option —
 *    which is what a combobox needs, because the user is still typing. Roving
 *    tabindex actually moves focus and suits a toolbar or a tree. Have the
 *    distinction ready; it is the standard follow-up.
 */

export interface ListboxState {
  isOpen: boolean;
  activeIndex: number;
  selectedIndex: number;
  typeahead: string;
  typeaheadAt: number;
}

export type ListboxAction =
  | { type: 'key'; key: string; now: number }
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'hover'; index: number };

export interface ListboxOptions {
  labels: readonly string[];
  typeaheadTimeoutMs?: number;
}

export const initialListboxState: ListboxState = {
  isOpen: false,
  activeIndex: -1,
  selectedIndex: -1,
  typeahead: '',
  typeaheadAt: 0,
};

const isPrintable = (key: string): boolean => key.length === 1;

/** Indices to search, starting after `from` and wrapping. */
function searchOrder(count: number, from: number): number[] {
  const start = from < 0 ? 0 : (from + 1) % count;
  return Array.from({ length: count }, (_, offset) => (start + offset) % count);
}

function findByPrefix(labels: readonly string[], prefix: string, from: number): number {
  const needle = prefix.toLowerCase();
  for (const index of searchOrder(labels.length, from)) {
    if (labels[index]!.toLowerCase().startsWith(needle)) return index;
  }
  return -1;
}

export function listboxReducer(
  state: ListboxState,
  action: ListboxAction,
  options: ListboxOptions,
): ListboxState {
  const { labels, typeaheadTimeoutMs = 500 } = options;
  const count = labels.length;

  switch (action.type) {
    case 'open':
      return { ...state, isOpen: true };

    case 'close':
      return { ...state, isOpen: false, activeIndex: -1, typeahead: '' };

    case 'hover':
      return { ...state, activeIndex: action.index };

    case 'key':
      break;
  }

  const { key, now } = action;

  // Closed: only the opening keys do anything.
  if (!state.isOpen) {
    if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
      return { ...state, isOpen: true, activeIndex: count > 0 ? 0 : -1 };
    }
    if (key === 'ArrowUp') {
      return { ...state, isOpen: true, activeIndex: count > 0 ? count - 1 : -1 };
    }
    if (isPrintable(key) && count > 0) {
      const match = findByPrefix(labels, key, -1);
      return {
        ...state,
        isOpen: true,
        activeIndex: match === -1 ? -1 : match,
        typeahead: key,
        typeaheadAt: now,
      };
    }
    return state;
  }

  // Open, but empty: only the closing keys make sense.
  if (count === 0) {
    if (key === 'Escape' || key === 'Tab' || key === 'Enter') {
      return { ...state, isOpen: false, activeIndex: -1, typeahead: '' };
    }
    return state;
  }

  switch (key) {
    case 'ArrowDown':
      return { ...state, activeIndex: (state.activeIndex + 1) % count };

    case 'ArrowUp':
      return {
        ...state,
        // `+ count` because JS `%` keeps the dividend's sign.
        activeIndex: (state.activeIndex - 1 + count) % count,
      };

    case 'Home':
      return { ...state, activeIndex: 0 };

    case 'End':
      return { ...state, activeIndex: count - 1 };

    case 'Enter':
      return {
        ...state,
        isOpen: false,
        selectedIndex: state.activeIndex >= 0 ? state.activeIndex : state.selectedIndex,
        typeahead: '',
      };

    case 'Escape':
      // Clears the cursor, keeps the commitment.
      return { ...state, isOpen: false, activeIndex: -1, typeahead: '' };

    case 'Tab':
      return { ...state, isOpen: false, typeahead: '' };

    default:
      break;
  }

  if (!isPrintable(key)) return state;

  const expired = now - state.typeaheadAt > typeaheadTimeoutMs;
  const buffer = expired ? key : state.typeahead + key;
  const match = findByPrefix(labels, buffer, state.activeIndex);

  return {
    ...state,
    typeahead: buffer,
    typeaheadAt: now,
    activeIndex: match === -1 ? state.activeIndex : match,
  };
}
