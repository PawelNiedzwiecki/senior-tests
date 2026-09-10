/**
 * SOLUTION 3.3 — Controlled and uncontrolled in one component
 *
 * Talking points:
 *
 * 1. THE RULE: A CONTROLLED COMPONENT KEEPS NO SHADOW COPY. The moment you
 *    also `setState` locally in controlled mode, you have two sources of truth
 *    that disagree the instant the parent rejects or transforms the value
 *    (validation, clamping, an optimistic update that fails). Every "the input
 *    flickers back" bug is this. Say the rule; then the code is obvious.
 *
 * 2. `value !== undefined` IS THE MODE TEST, computed fresh each render.
 *    `null` must count as controlled — it is a legitimate "nothing selected" —
 *    which is why the test is `!== undefined` and not falsiness.
 *
 * 3. HOOKS ARE UNCONDITIONAL. `useState` runs in both modes; in controlled
 *    mode its value is simply never read. Do not try to be clever here — the
 *    Rules of Hooks are not negotiable, and the wasted state costs nothing.
 *
 * 4. STABLE IDENTITY + FRESH READS. These pull in opposite directions:
 *    `useCallback` with `[]` is stable but captures the first render's values;
 *    adding deps makes it fresh but unstable. The fix is a ref refreshed on
 *    every commit — the callback closes over the ref (stable) and reads through
 *    it (fresh). Update it in a layout effect, NOT during render: a render-phase
 *    write is a side effect that concurrent React may discard or replay. Same
 *    trick as `useEffectEvent`; see drill 3.4.
 *
 * 5. THE UPDATER MUST SEE THE RIGHT `prev`. In controlled mode the previous
 *    value is the PROP, not the internal state. Resolving the updater against
 *    internal state is a subtle bug that only shows up with functional updates
 *    — exactly the case the tests cover.
 *
 * 6. `defaultValue` CHANGES ARE IGNORED, deliberately. `defaultValue` means
 *    "initial", and reacting to it later would silently overwrite user input.
 *    That is why React names the props `value` and `defaultValue` rather than
 *    `value` and `initialValue`, and it is a good API-design answer.
 */

import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface ControllableOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export type SetControllable<T> = (next: T | ((prev: T) => T)) => void;

const isUpdater = <T>(next: T | ((prev: T) => T)): next is (prev: T) => T =>
  typeof next === 'function';

export function useControllableState<T>(
  options: ControllableOptions<T>,
): readonly [T, SetControllable<T>] {
  const { value, defaultValue, onChange } = options;

  const [internal, setInternal] = useState<T>(defaultValue);

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  // Refreshed before any effect or event handler can fire, so the stable setter
  // below never reads stale data. Writing `latest.current` during render would
  // be a render-phase side effect — concurrent React may discard or replay that
  // render, and `react-hooks/refs` flags it. Same trick as drill 3.4.
  const latest = useRef({ current, isControlled, onChange });
  useLayoutEffect(() => {
    latest.current = { current, isControlled, onChange };
  });

  const setValue = useCallback<SetControllable<T>>((next) => {
    const snapshot = latest.current;
    const resolved = isUpdater(next) ? next(snapshot.current) : next;

    // Only the uncontrolled branch owns state. Controlled mode just reports.
    if (!snapshot.isControlled) setInternal(resolved);
    snapshot.onChange?.(resolved);
  }, []);

  return [current, setValue] as const;
}
