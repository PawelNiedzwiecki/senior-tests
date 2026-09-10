/**
 * DRILL 3.6 — The polymorphic `as` prop
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 30 min      DIFFICULTY: ●●●●●
 *
 * WHAT YOU'RE BUILDING
 * One component, any element, correct props for each:
 *
 *   <Text>plain</Text>                        → <span>
 *   <Text as="h1" tone="muted">Title</Text>   → <h1>
 *   <Text as="a" href="/de">Deutsch</Text>    → <a href>
 *   <Text href="/de">nope</Text>              → TYPE ERROR: span has no href
 *
 * REQUIREMENTS
 *   1. Defaults to `span`.
 *   2. `as` accepts any intrinsic element or component type.
 *   3. The props allowed are exactly that element's props, plus the component's
 *      own (`tone`), minus `as`.
 *   4. Passing a prop the chosen element does not accept is a type error.
 *   5. `tone` renders as `data-tone`; every other prop is forwarded.
 *
 * WHY IT'S ASKED
 * Every design system has this component, and typing it correctly is genuinely
 * hard — it is the deep end of "React + TypeScript" as one skill rather than
 * two. If you can build it and explain `ComponentPropsWithoutRef`, you have
 * demonstrated most of what a component-library role needs.
 *
 * HINTS
 *   1. `ElementType` is the constraint for `as`. `ComponentPropsWithoutRef<E>`
 *      gets that element's props — the `WithoutRef` variant matters, because
 *      `ComponentProps<E>` includes `ref` and fights with forwarding.
 *   2. Compose: own props & `{ as?: E }` & `Omit<ComponentPropsWithoutRef<E>,
 *      keyof OwnProps | 'as'>`. The `Omit` prevents the element's props from
 *      clashing with yours.
 *   3. `<E extends ElementType = 'span'>` gives the default, and it must be on
 *      the FUNCTION, not only on the props type.
 *   4. Inside, `const Component = as ?? 'span'` then `<Component {...rest} />`.
 *      A capitalised local is required — JSX treats lowercase as literal tags.
 *      Expect to need one `as never` / `as ElementType` internally; the public
 *      signature is what must be sound.
 *
 * STRETCH
 *   a. Forward refs with the correct element ref type
 *      (`ComponentPropsWithRef<E>['ref']`). This is the genuinely nasty part.
 *   b. Make `href` REQUIRED when `as="a"`.
 *   c. What does this cost at scale? (Compile time — polymorphic components
 *      are a well-known tsserver hot spot. When is a plain `<Link>` better?)
 */

import type { ReactElement, ReactNode } from 'react';

export interface TextOwnProps {
  tone?: 'default' | 'muted' | 'danger';
  children?: ReactNode;
}

// TODO: make this polymorphic. Right now it is a span and nothing else.
export type TextProps = TextOwnProps & { className?: string };

export function Text({ tone = 'default', children, ...rest }: TextProps): ReactElement {
  return (
    <span data-tone={tone} {...rest}>
      {children}
    </span>
  );
}
