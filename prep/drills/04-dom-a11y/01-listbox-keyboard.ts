/**
 * DRILL 4.1 — Keyboard navigation as a pure reducer
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 35 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * The keyboard behaviour of a language picker, extracted from the DOM into a
 * pure function. No refs, no events, no rendering — just
 * `(state, action) => state`, which is why it can be tested exhaustively in
 * milliseconds.
 *
 * SPEC (from the ARIA Authoring Practices listbox pattern)
 *   CLOSED
 *     ArrowDown / Enter / ' '  → open, activate index 0
 *     ArrowUp                  → open, activate the LAST item
 *   OPEN
 *     ArrowDown                → next, wrapping to the first
 *     ArrowUp                  → previous, wrapping to the last
 *     Home / End               → first / last
 *     Enter                    → select the active item and close
 *     Escape                   → close, clear the active item, keep selection
 *     Tab                      → close, keep selection (focus moves on)
 *     printable character      → type-ahead (see below)
 *   ANY
 *     hover                    → activate that index without opening/closing
 *
 * TYPE-AHEAD
 *   Characters typed within `typeaheadTimeoutMs` of each other accumulate into
 *   a buffer. Activate the first item whose label starts with the buffer,
 *   case-insensitively, searching from the item AFTER the active one and
 *   wrapping. A gap longer than the timeout starts a fresh buffer.
 *
 * EDGE CASES THAT ARE TESTED
 *   - An empty list: nothing activates, nothing crashes.
 *   - No type-ahead match: the active item does not move.
 *   - Escape keeps `selectedIndex`; it only clears `activeIndex`.
 *
 * WHY IT'S ASKED
 * Two signals at once: you know the ARIA pattern (most candidates only know
 * ArrowUp/ArrowDown), and you know that pulling logic out of the DOM is what
 * makes interaction code testable. Volunteer the second point — "I'd model
 * this as a reducer so I can test the keyboard matrix without a browser" is
 * a strong opening sentence.
 *
 * HINTS
 *   1. `(index + 1) % count` wraps forward; `(index - 1 + count) % count` wraps
 *      backward. The `+ count` is what stops `-1 % n` from being negative.
 *   2. Treat `activeIndex === -1` as "nothing active" and handle it before the
 *      arithmetic.
 *   3. Type-ahead search order: build the rotated index list
 *      `[(start+1)…count, 0…start]` and take the first match.
 *   4. A key is "printable" when `key.length === 1`.
 *
 * STRETCH
 *   a. Repeating the same character should cycle through items starting with
 *      it (the Windows listbox behaviour). Where does that go?
 *   b. `aria-activedescendant` vs roving `tabindex` — when do you use each?
 *   c. How does this change for a multi-select listbox with Shift+Arrow?
 *   d. PageUp / PageDown by 10.
 */

export interface ListboxState {
  isOpen: boolean;
  /** -1 means nothing is active. */
  activeIndex: number;
  /** -1 means nothing has been selected yet. */
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
  /** Default 500. */
  typeaheadTimeoutMs?: number;
}

export const initialListboxState: ListboxState = {
  isOpen: false,
  activeIndex: -1,
  selectedIndex: -1,
  typeahead: '',
  typeaheadAt: 0,
};

export function listboxReducer(
  _state: ListboxState,
  _action: ListboxAction,
  _options: ListboxOptions,
): ListboxState {
  throw new Error('Not implemented'); // TODO
}
