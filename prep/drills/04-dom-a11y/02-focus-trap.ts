/**
 * DRILL 4.2 — Focus trap
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 30 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * A modal that a keyboard user cannot Tab out of, and that returns focus where
 * it came from when it closes. Without this, Tab walks into the page behind
 * the overlay and the user is lost with no way back.
 *
 * REQUIREMENTS
 *   1. `activate()` moves focus to the first tabbable element inside the
 *      container. If there is none, focus the container itself.
 *   2. Tab on the LAST tabbable element wraps to the first.
 *   3. Shift+Tab on the FIRST wraps to the last.
 *   4. Tab anywhere else is left alone — the browser already does it right.
 *   5. `deactivate()` restores focus to whatever was focused before activation.
 *   6. Non-tabbable elements are skipped: `disabled`, `tabindex="-1"`,
 *      `hidden`, and `input[type=hidden]`.
 *   7. `activate()` twice, or `deactivate()` without `activate()`, is safe.
 *
 * WHY IT'S ASKED
 * It is the accessibility question that is actually a DOM-API question. It
 * needs the tabbable-selector list, `event.preventDefault()`, listener
 * lifecycle, and remembering `document.activeElement` before you move it —
 * and every one of those is a place to leave a bug.
 *
 * HINTS
 *   1. Query with a selector list, then FILTER — the selector alone cannot
 *      express "not disabled and not tabindex=-1".
 *   2. Capture `document.activeElement` at activate time, before focusing
 *      anything. One line, easy to forget, and it is requirement 5.
 *   3. Listen on the container, not on `document`: the event bubbles, and a
 *      container-scoped listener cannot fight with other traps.
 *   4. Only intervene at the boundaries. Calling `preventDefault` on every Tab
 *      and re-implementing traversal is how you break Tab inside a form.
 *
 * STRETCH
 *   a. jsdom has no layout, so `offsetParent` and `getBoundingClientRect` are
 *      useless for visibility. How would you detect a `display: none` ancestor
 *      in a real browser, and what does that mean for testing?
 *   b. What if the DOM changes while the trap is active?
 *   c. `inert` and `aria-hidden` on the background — what do they each do, and
 *      why is `<dialog>` with `showModal()` the modern answer?
 *   d. Nested modals: what breaks?
 */

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

/** Elements that can receive sequential keyboard focus. */
export function getTabbableElements(_container: HTMLElement): HTMLElement[] {
  throw new Error('Not implemented'); // TODO
}

export function createFocusTrap(_container: HTMLElement): FocusTrap {
  throw new Error('Not implemented'); // TODO
}
