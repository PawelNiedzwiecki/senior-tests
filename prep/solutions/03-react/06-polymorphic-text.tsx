/**
 * SOLUTION 3.6 — The polymorphic `as` prop
 *
 * Talking points:
 *
 * 1. THE TYPE IS THREE PARTS, AND THE `Omit` IS LOAD-BEARING:
 *      own props            — what this component adds (`tone`)
 *      `{ as?: E }`         — the element selector itself
 *      element props MINUS  — `Omit<ComponentPropsWithoutRef<E>, keyof Own | 'as'>`
 *    Without the `Omit`, an element prop with the same name as one of yours
 *    intersects instead of being replaced, and you get an uninhabitable type
 *    such as `'default' | 'muted' & string` that nothing satisfies. Walk
 *    through the three parts out loud — it is the clearest way to show you
 *    understand the shape rather than having memorised a snippet.
 *
 * 2. `ComponentPropsWithoutRef<E>` vs `ComponentProps<E>`. The plain version
 *    includes `ref`, whose type depends on the element and clashes the moment
 *    you wrap in `forwardRef`. Start from `WithoutRef` and add the ref back
 *    deliberately (stretch a) — that is the order every design system lands on.
 *
 * 3. THE DEFAULT LIVES ON THE FUNCTION. `<E extends ElementType = 'span'>` on
 *    the generic parameter is what makes `<Text>` with no `as` resolve to span
 *    props. Putting the default only on the props type does not help, because
 *    inference happens at the call site.
 *
 * 4. CAPITALISE THE LOCAL. `const Component = as ?? 'span'` — JSX treats a
 *    lowercase identifier as a literal tag name, so `<component />` would
 *    render an unknown element. Small, and everyone hits it once.
 *
 * 5. THE INTERNAL CAST IS EXPECTED. TypeScript cannot verify that `rest`
 *    matches `Component`'s props once `E` is generic, so `Component` gets
 *    widened to `ElementType` internally. The public signature stays sound;
 *    the unsoundness is one line, inside, covered by the type tests. Say that
 *    explicitly — an interviewer who sees an unexplained cast assumes you gave
 *    up, and one who hears the reasoning sees judgement.
 *
 * 6. THE COST. Polymorphic components are a known tsserver hot spot: every
 *    call site instantiates the conditional prop machinery, and in a large app
 *    they show up in `--extendedDiagnostics`. A plain `<Link>` beside `<Text>`
 *    is often the better engineering answer. Volunteering the trade-off is
 *    worth more than the implementation.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from 'react';

export interface TextOwnProps {
  tone?: 'default' | 'muted' | 'danger';
  children?: ReactNode;
}

export type TextProps<E extends ElementType> = TextOwnProps & { as?: E } & Omit<
    ComponentPropsWithoutRef<E>,
    keyof TextOwnProps | 'as'
  >;

export function Text<E extends ElementType = 'span'>({
  as,
  tone = 'default',
  children,
  ...rest
}: TextProps<E>): ReactElement {
  // Capitalised so JSX treats it as a component reference, not a literal tag.
  const Component = (as ?? 'span') as ElementType;

  return (
    <Component data-tone={tone} {...rest}>
      {children}
    </Component>
  );
}
