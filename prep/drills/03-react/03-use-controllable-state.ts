/**
 * DRILL 3.3 — Controlled and uncontrolled in one component
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * The hook every design-system component needs: `<Select>` should work as
 * `<Select defaultValue="en" />` (it owns its state) AND as
 * `<Select value={v} onChange={setV} />` (the parent owns it), with one
 * implementation.
 *
 * REQUIREMENTS
 *   1. UNCONTROLLED (`value` is undefined): the hook holds the state and
 *      updates it. `onChange` still fires.
 *   2. CONTROLLED (`value` is provided): the hook returns the prop, never its
 *      own state. Calling the setter fires `onChange` and changes NOTHING
 *      locally — the parent decides.
 *   3. The setter accepts a value OR an updater `(prev) => next`, and the
 *      updater sees the correct `prev` in both modes.
 *   4. The setter identity is stable across renders.
 *
 * WHY IT'S ASKED
 * It is an API-design question wearing a hook costume. The interviewer wants
 * to hear you talk about who owns state, why a controlled component must not
 * keep a shadow copy, and what React does when a component flips between the
 * two modes.
 *
 * HINTS
 *   1. `const isControlled = value !== undefined;` — computed every render, not
 *      stored. Storing it is how you get the two modes out of sync.
 *   2. Keep `useState(defaultValue)` unconditionally. Hooks cannot be
 *      conditional, and the internal state is simply unused when controlled.
 *   3. For requirement 3, resolve the updater against the CURRENT value, which
 *      in controlled mode is the prop, not the internal state.
 *   4. To keep the setter stable while still reading fresh values, put the
 *      moving parts in a ref that you update on every render.
 *
 * STRETCH
 *   a. React warns when a component flips controlled ↔ uncontrolled. Implement
 *      that warning. Why does it matter?
 *   b. `defaultValue` changing later is ignored. Is that right? (Yes — argue it.)
 *   c. How would you extend this to several controllable props at once?
 */

import { useCallback, useRef, useState } from 'react';

export interface ControllableOptions<T> {
  /** Provided → controlled. Undefined → uncontrolled. */
  value?: T;
  /** Initial value in uncontrolled mode. */
  defaultValue: T;
  onChange?: (value: T) => void;
}

export type SetControllable<T> = (next: T | ((prev: T) => T)) => void;

export function useControllableState<T>(
  _options: ControllableOptions<T>,
): readonly [T, SetControllable<T>] {
  void useCallback;
  void useRef;
  void useState;
  throw new Error('Not implemented'); // TODO
}
