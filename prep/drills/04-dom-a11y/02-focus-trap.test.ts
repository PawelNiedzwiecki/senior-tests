import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createFocusTrap, getTabbableElements } from '@impl/04-dom-a11y/02-focus-trap.ts';

let container: HTMLElement;
let outsideButton: HTMLButtonElement;

function mount(html: string) {
  outsideButton = document.createElement('button');
  outsideButton.textContent = 'outside';
  document.body.append(outsideButton);

  container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);
  return container;
}

function pressTab(target: Element, shiftKey = false) {
  const event = new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  target.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getTabbableElements', () => {
  it('finds the usual suspects in document order', () => {
    mount(`
      <a href="/x">link</a>
      <button>b</button>
      <input />
      <select><option>o</option></select>
      <textarea></textarea>
    `);

    const tabbable = getTabbableElements(container);
    expect(tabbable.map((el) => el.tagName)).toEqual([
      'A',
      'BUTTON',
      'INPUT',
      'SELECT',
      'TEXTAREA',
    ]);
  });

  it('skips disabled controls', () => {
    mount(`<button>one</button><button disabled>two</button><input disabled />`);
    expect(getTabbableElements(container)).toHaveLength(1);
  });

  it('skips tabindex="-1"', () => {
    mount(`<button>one</button><button tabindex="-1">two</button>`);
    const tabbable = getTabbableElements(container);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]!.textContent).toBe('one');
  });

  it('includes positive and zero tabindex on non-interactive elements', () => {
    mount(`<div tabindex="0">focusable</div><span tabindex="2">also</span>`);
    expect(getTabbableElements(container)).toHaveLength(2);
  });

  it('skips hidden elements', () => {
    mount(`<button>one</button><button hidden>two</button><input type="hidden" />`);
    expect(getTabbableElements(container)).toHaveLength(1);
  });

  it('skips anchors without href', () => {
    mount(`<a>no href</a><a href="/x">with href</a>`);
    expect(getTabbableElements(container)).toHaveLength(1);
  });

  it('returns an empty array when there is nothing tabbable', () => {
    mount(`<p>just text</p>`);
    expect(getTabbableElements(container)).toEqual([]);
  });
});

describe('createFocusTrap', () => {
  it('focuses the first tabbable element on activate', () => {
    mount(`<button>first</button><button>second</button>`);
    const trap = createFocusTrap(container);

    trap.activate();
    expect(document.activeElement?.textContent).toBe('first');

    trap.deactivate();
  });

  it('focuses the container when nothing inside is tabbable', () => {
    mount(`<p>just text</p>`);
    const trap = createFocusTrap(container);

    trap.activate();
    expect(document.activeElement).toBe(container);

    trap.deactivate();
  });

  it('wraps forward from the last element to the first', () => {
    mount(`<button>first</button><button>middle</button><button>last</button>`);
    const trap = createFocusTrap(container);
    trap.activate();

    const last = container.querySelectorAll('button')[2]!;
    last.focus();

    const event = pressTab(last);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe('first');

    trap.deactivate();
  });

  it('wraps backward from the first element to the last', () => {
    mount(`<button>first</button><button>middle</button><button>last</button>`);
    const trap = createFocusTrap(container);
    trap.activate();

    const first = container.querySelectorAll('button')[0]!;
    first.focus();

    const event = pressTab(first, true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe('last');

    trap.deactivate();
  });

  it('leaves Tab alone in the middle of the list', () => {
    mount(`<button>first</button><button>middle</button><button>last</button>`);
    const trap = createFocusTrap(container);
    trap.activate();

    const middle = container.querySelectorAll('button')[1]!;
    middle.focus();

    const event = pressTab(middle);
    // The browser's own traversal is correct here — do not fight it.
    expect(event.defaultPrevented).toBe(false);

    trap.deactivate();
  });

  it('ignores keys other than Tab', () => {
    mount(`<button>first</button>`);
    const trap = createFocusTrap(container);
    trap.activate();

    const event = new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    });
    container.querySelector('button')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);

    trap.deactivate();
  });

  it('restores focus on deactivate', () => {
    mount(`<button>first</button>`);
    outsideButton.focus();
    expect(document.activeElement).toBe(outsideButton);

    const trap = createFocusTrap(container);
    trap.activate();
    expect(document.activeElement).not.toBe(outsideButton);

    trap.deactivate();
    expect(document.activeElement).toBe(outsideButton);
  });

  it('stops trapping after deactivate', () => {
    mount(`<button>first</button><button>last</button>`);
    const trap = createFocusTrap(container);
    trap.activate();
    trap.deactivate();

    const last = container.querySelectorAll('button')[1]!;
    const event = pressTab(last);
    expect(event.defaultPrevented).toBe(false);
  });

  it('is safe to activate twice and deactivate twice', () => {
    mount(`<button>first</button>`);
    outsideButton.focus();

    const trap = createFocusTrap(container);
    trap.activate();
    trap.activate();
    trap.deactivate();
    trap.deactivate();

    expect(document.activeElement).toBe(outsideButton);
  });

  it('picks up elements added after activation', () => {
    mount(`<button>first</button>`);
    const trap = createFocusTrap(container);
    trap.activate();

    const added = document.createElement('button');
    added.textContent = 'added';
    container.append(added);

    added.focus();
    pressTab(added);
    expect(document.activeElement?.textContent).toBe('first');

    trap.deactivate();
  });
});
