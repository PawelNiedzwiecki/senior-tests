/**
 * SOLUTION 4.2 — Focus trap
 *
 * Talking points:
 *
 * 1. QUERY, THEN FILTER. CSS cannot express "focusable": `:disabled` exists,
 *    but `tabindex="-1"`, a `hidden` ancestor and `input[type=hidden]` need
 *    real logic. Everyone reaches for a selector; the filter is what makes it
 *    correct. Note that the DOM order returned by `querySelectorAll` is the
 *    tab order only while no positive `tabindex` is in play — positive values
 *    jump the queue, which is one of the reasons they are considered an
 *    anti-pattern.
 *
 * 2. ONLY INTERVENE AT THE BOUNDARIES. Preventing default on every Tab and
 *    moving focus yourself breaks radio groups, composed widgets and anything
 *    with its own key handling. Two `if`s — first element + Shift, last
 *    element + no Shift — and the browser does the rest. Say this; it shows
 *    restraint, which is a senior trait.
 *
 * 3. QUERY ON EVERY KEYDOWN, NOT ONCE AT ACTIVATE. Modal content is dynamic:
 *    an async list loads, a validation error adds a button. A cached list goes
 *    stale and the trap starts wrapping from the wrong element. Querying per
 *    keypress costs microseconds and is always right.
 *
 * 4. CAPTURE `document.activeElement` BEFORE FOCUSING. Requirement 5 is a
 *    single line in the right place. Losing the user's place on close is one
 *    of the most common accessibility complaints about modals.
 *
 * 5. IDEMPOTENCE. An `isActive` flag makes double-activate and stray
 *    deactivate harmless. React StrictMode will call your effect twice in
 *    development, so this is not hypothetical.
 *
 * 6. jsdom HAS NO LAYOUT. `offsetParent`, `getBoundingClientRect` and
 *    `getComputedStyle` for visibility are all unusable in these tests, so the
 *    filter checks `hidden`/`disabled`/`tabindex` — things that exist in the
 *    DOM tree itself. In a real browser you would also reject elements with
 *    zero size or a `display: none` ancestor. Volunteering this — "here is
 *    what my tests can and cannot cover" — is a strong signal about how you
 *    think about test environments.
 *
 * 7. THE MODERN ANSWER IS `<dialog>` + `showModal()`, which traps focus,
 *    makes the background inert and handles Escape natively — plus the `inert`
 *    attribute for non-dialog cases. Reach for those first; being able to
 *    build the trap is what proves you understand what they are doing.
 */

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

const TABBABLE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[tabindex]',
].join(',');

function isTabbable(element: HTMLElement): boolean {
  if (element.hasAttribute('disabled')) return false;
  if (element.hidden) return false;
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false;

  // A `hidden` ancestor hides its subtree too.
  if (element.closest('[hidden]')) return false;

  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null && Number(tabindex) < 0) return false;

  return true;
}

export function getTabbableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR));
  return candidates.filter(isTabbable);
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
  let isActive = false;
  let previouslyFocused: HTMLElement | null = null;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    // Re-query every time — modal content changes while it is open.
    const tabbable = getTabbableElements(container);
    if (tabbable.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }

    const first = tabbable[0]!;
    const last = tabbable[tabbable.length - 1]!;
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }

    // Anywhere else: the browser's own traversal is already correct.
  };

  return {
    activate() {
      if (isActive) return;
      isActive = true;

      // Before moving focus anywhere.
      previouslyFocused =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      container.addEventListener('keydown', onKeyDown);

      const [first] = getTabbableElements(container);
      if (first) {
        first.focus();
      } else {
        // Needs to be programmatically focusable to receive focus at all.
        if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
        container.focus();
      }
    },

    deactivate() {
      if (!isActive) return;
      isActive = false;

      container.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
      previouslyFocused = null;
    },
  };
}
