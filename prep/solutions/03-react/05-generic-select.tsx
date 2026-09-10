/**
 * SOLUTION 3.5 — A generic component
 *
 * Talking points:
 *
 * 1. GENERIC PROPS, INFERRED FROM ONE PLACE. `T` appears in `items`, `value`,
 *    `onChange`, `getKey` and `getLabel`. TypeScript picks it from `items` and
 *    then *checks* the rest against it, which is why a wrong `onChange` is an
 *    error at the call site rather than a cast inside the handler. That is the
 *    entire value proposition — say it in those terms.
 *
 * 2. INFER FROM ONE PROP ONLY. Without help, TypeScript collects candidates
 *    for `T` from every prop that mentions it — so
 *    `onChange={(code: string) => ...}` makes `T` a union with `string` and
 *    the error surfaces on `items`, pointing at the innocent prop. Wrapping
 *    the non-source props in `NoInfer<T>` (TS 5.4) makes `items` the single
 *    inference site, so mistakes are reported where they were made. This is
 *    drill 1.7(b) applied to a real component, and it is a genuinely senior
 *    detail: it is about the quality of the error message your API produces.
 *
 * 3. `<T,>` IN .tsx. A generic arrow function needs the trailing comma
 *    (`const Select = <T,>(props) => ...`) because `<T>` alone parses as JSX.
 *    A `function` declaration has no such problem, which is why this file uses
 *    one. Knowing this off-hand reads as real .tsx mileage.
 *
 * 4. ACCESSORS vs A SHAPE CONSTRAINT. The alternative is
 *    `T extends { id: string; label: string }`, which is less code for the
 *    consumer but forces them to reshape their data. Accessors keep the
 *    component honest about what it needs and work with types you do not own
 *    (an API response, a third-party model). Trade-off worth voicing: more
 *    props, but no adapter layer at every call site.
 *
 * 5. IDENTITY COMPARISON. `item === value` compares by reference. Fine when
 *    the caller passes an item straight out of `items`; wrong the moment they
 *    pass a freshly-parsed object with the same contents. Comparing
 *    `getKey(item) === getKey(value)` is the robust version, and it is a good
 *    thing to raise unprompted — it shows you thought about how it will be
 *    used, not just about whether it compiles.
 *
 * 6. `React.memo` LOSES GENERICS. `memo(Select)` returns a non-generic
 *    component; keeping the generic needs a cast such as
 *    `memo(Select) as typeof Select`. Mention it, do not do it by default —
 *    memoising a component whose props include inline arrows achieves nothing.
 *
 * 7. ACCESSIBILITY. `role="listbox"` + `role="option"` + `aria-selected` is
 *    the minimum. Real keyboard support (roving tabindex, type-ahead,
 *    aria-activedescendant) is drill 4.1 — say that you know it is missing
 *    rather than letting the interviewer find it.
 */

import { useId } from 'react';
import type { ReactElement } from 'react';

export interface SelectProps<T> {
  label: string;
  items: readonly T[];
  // `NoInfer` makes `items` the ONLY source of `T`; every other prop is then
  // checked against it, so a mistake is reported on the prop that is wrong.
  value: NoInfer<T> | null;
  onChange: (item: NoInfer<T>) => void;
  getKey: (item: NoInfer<T>) => string;
  getLabel: (item: NoInfer<T>) => string;
  emptyMessage?: string;
}

export function Select<T>(props: SelectProps<T>): ReactElement {
  const { label, items, value, onChange, getKey, getLabel, emptyMessage } = props;
  const labelId = useId();

  const selectedKey = value === null ? null : getKey(value);

  return (
    <div>
      <span id={labelId}>{label}</span>

      {items.length === 0 ? (
        <p>{emptyMessage ?? 'Nothing to choose from'}</p>
      ) : (
        <ul role="listbox" aria-labelledby={labelId}>
          {items.map((item) => {
            const key = getKey(item);
            // Compare by key, not reference — see talking point 4.
            const isSelected = selectedKey !== null && selectedKey === key;

            return (
              // In the ARIA listbox pattern an option is NOT a button — the
              // listbox owns keyboard interaction. That part is drill 4.1.
              <li
                key={key}
                role="option"
                aria-selected={isSelected}
                onClick={() => onChange(item)}
              >
                {getLabel(item)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
