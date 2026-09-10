/**
 * DRILL 3.5 — A generic component
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 25 min      DIFFICULTY: ●●●○○
 *
 * WHAT YOU'RE BUILDING
 * A language picker that works for ANY item type without `any`, without
 * `unknown`, and without the consumer casting in `onChange`.
 *
 *   <Select
 *     label="Translate into"
 *     items={languages}                    // Language[]
 *     value={selected}                     // Language | null
 *     onChange={(lang) => setSelected(lang)}  // lang is Language. Not unknown.
 *     getKey={(lang) => lang.code}
 *     getLabel={(lang) => lang.name}
 *   />
 *
 * REQUIREMENTS
 *   1. `T` is inferred from `items`; every other prop is checked against it.
 *   2. Renders `role="listbox"` with one `role="option"` per item.
 *   3. The selected option has `aria-selected="true"`, the rest `"false"`.
 *   4. Clicking an option calls `onChange` with the ITEM, not its key.
 *   5. `value={null}` selects nothing; an empty list renders `emptyMessage`.
 *   6. The listbox is labelled by the visible label (`aria-labelledby`).
 *
 * WHY IT'S ASKED
 * Generic components are where TypeScript and React actually meet. It is also
 * a small API-design exercise: `getKey`/`getLabel` accessors versus requiring
 * `{ id, label }` shaped items is a real trade-off with a real answer.
 *
 * HINTS
 *   1. `function Select<T>(props: SelectProps<T>)` — a plain function
 *      declaration. In a .tsx file an arrow generic needs `<T,>` because `<T>`
 *      parses as JSX. Know that; it comes up live.
 *   2. `React.memo` does not preserve generics without a cast. Mention it if
 *      asked about memoising this; do not do it here.
 *   3. `useId()` for the label id — stable and SSR-safe.
 *
 * STRETCH
 *   a. Add a `renderItem?: (item: T) => ReactNode` that defaults to `getLabel`.
 *   b. Make `getKey` optional when `T extends { id: string }`. (Overloads, or
 *      a conditional on the props type — both are legitimate; compare them.)
 *   c. Full keyboard support belongs in track 04 — say what you would add.
 */

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

// TODO: make this generic in `T` and implement it.
export function Select(_props: SelectProps<unknown>): ReactElement | null {
  return null;
}
