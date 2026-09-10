# Cheatsheet 1 — The TypeScript type system

Read before Day 1. Come back whenever a drill leaves you guessing.
Everything here has shown up in a senior interview.

---

## 1. Inference: why is this `string` and not `'en'`?

The most common real TypeScript question, and there are four answers.

```ts
let a = 'en';                      // string   — `let` widens
const b = 'en';                    // 'en'     — `const` does not
const c = { lang: 'en' };          // { lang: string } — properties widen
const d = { lang: 'en' } as const; // { readonly lang: 'en' }
```

| Tool | Since | Use it when |
| --- | --- | --- |
| `as const` | 3.4 | You control the call site and want literals + readonly |
| `<const T>` | 5.0 | You own the *function* and want callers to keep literals free |
| `satisfies` | 4.9 | You want the constraint checked but the narrow type kept |
| `NoInfer<T>` | 5.4 | One parameter should be checked against `T`, not decide it |

```ts
// The `satisfies` difference, in two lines:
const x: Record<string, string> = { en: 'English' };          // keyof → string. Typos compile.
const y = { en: 'English' } satisfies Record<string, string>; // keyof → 'en'. Checked AND narrow.
```

`satisfies` caveat: the target still supplies a *contextual* type, so
`{ rtl: true } satisfies { rtl?: boolean }` infers `boolean`, not `true`.
Combine with `as const` when you need the literal.

---

## 2. Generics and where inference comes from

TypeScript collects candidates for `T` from **every parameter that mentions
it**, then picks a best common type.

```ts
declare function pick<T>(items: T[], fallback: T): T;
pick(['en', 'de'], 'xx');   // T = string. No error. The bug typed itself in.

declare function pick2<const T extends string>(items: readonly T[], fallback: NoInfer<T>): T;
pick2(['en', 'de'], 'xx');  // Error: 'xx' is not 'en' | 'de'
```

`NoInfer<T>` marks a position "check-only". Use it whenever one argument should
*define* the type and the others should be *validated against it* — including
generic React components (see `drills/03-react/05-generic-select.tsx`, where it
makes the error land on the wrong prop instead of on `items`).

**Constrain to the minimum you need.** `<T extends { id: string }>` accepts more
callers than `<T extends User>` and gives the same safety.

---

## 3. Conditional types

```ts
type IsString<T> = T extends string ? true : false;
```

**Distribution is the thing to understand.** A conditional distributes over a
union *only when the checked type is a naked type parameter*:

```ts
type ToArray<T>    = T extends unknown ? T[] : never;   // distributive
type NoDist<T> = [T] extends [unknown] ? T[] : never;   // NOT distributive

ToArray<string | number>  // string[] | number[]
NoDist<string | number>   // (string | number)[]
```

Two consequences that come up constantly:

```ts
ToArray<never>   // never   ← distributing over an empty union does nothing
NoDist<never>    // never[]

// So this is ALWAYS wrong:
type Bad<T>  = T extends never ? 'yes' : 'no';     // Bad<never> → never
// And this is the fix:
type Good<T> = [T] extends [never] ? 'yes' : 'no'; // Good<never> → 'yes'
```

`Exclude`, `Extract` and `NonNullable` are built entirely on distribution.

**`infer`** binds a type variable inside the check:

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;
type Params<F> = F extends (...args: infer P) => unknown ? P : never;
type First<T>  = T extends [infer H, ...unknown[]] ? H : never;
type Prefix<S> = S extends `${infer P}-${string}` ? P : never;
```

Prefer built-in `Awaited<T>` over hand-rolled promise unwrapping — it handles
nesting and thenables.

---

## 4. Mapped types

```ts
type Optional<T>  = { [K in keyof T]?: T[K] };
type Mutable<T>   = { -readonly [K in keyof T]: T[K] };
type Required2<T> = { [K in keyof T]-?: T[K] };
```

**Homomorphic** means `{ [K in keyof T]: ... }` where `T` is a type parameter.
These preserve the shape of what they map:

- over an **array** → an array
- over a **tuple** → a tuple of the same length, labels intact
- modifiers (`readonly`, `?`) are preserved unless you change them

That is why `DeepReadonly` should map over `keyof T` rather than special-casing
`T extends (infer U)[]` — the naive array branch destroys tuples.

**Key remapping with `as`** (4.1) is the underused one:

```ts
type Handlers<E> = {
  [K in keyof E & string as `on${Capitalize<K>}`]?: (payload: E[K]) => void;
};

// Filtering: map to `never` in the key position to drop a key
type StringKeys<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };
```

**Map then index** collapses a mapped type into a union — the workhorse pattern:

```ts
type Values<T> = { [K in keyof T]: T[K] }[keyof T];
```

---

## 5. Template literal types

```ts
type Route = `/${string}`;
type Event = `on${Capitalize<'click' | 'focus'>}`;   // 'onClick' | 'onFocus'
```

Intrinsics implemented in the compiler: `Uppercase`, `Lowercase`, `Capitalize`,
`Uncapitalize`.

Recursion pattern — match one, recurse on the rest, union the results:

```ts
type Placeholder<S extends string> =
  S extends `${string}{${infer P}}${infer Rest}` ? P | Placeholder<Rest> : never;
```

Watch out: unions multiply. `` `${A}-${B}` `` with 100 members each is 10,000
types, and the compiler caps out around 100k.

---

## 6. Discriminated unions

```ts
type State =
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };
```

Narrowing needs a **common literal-typed property** on every member. `boolean`
discriminants work (`ok: true | false`); optional ones (`status?: 'a' | 'b'`)
do not narrow reliably.

**Exhaustiveness:**

```ts
function assertNever(value: never, message = 'Unhandled'): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}

switch (state.status) {
  case 'loading': return '…';
  case 'success': return state.data;
  case 'error':   return state.error.message;
  // NO default — a `default` handles the rest, so `state` never narrows to
  // `never` and the check below becomes decorative.
}
return assertNever(state);
```

Where exhaustiveness **fails open**: `Partial<Record<Status, X>>` and anything
with an index signature. `Record<Status, X>` fails closed (good).

---

## 7. Variance and the bivariance hazard

```ts
interface A { run(cb: (x: string) => void): void }     // method → BIVARIANT
interface B { run: (cb: (x: string) => void) => void } // property → contravariant
```

Method shorthand is checked bivariantly for legacy reasons, even under
`strictFunctionTypes`. Property syntax gets the strict check. If you want sound
callback parameters, **declare functions as properties**.

- Parameters are **contravariant** (a handler taking `unknown` can stand in for
  one taking `string`).
- Returns are **covariant**.
- Arrays are covariant, which is unsound and deliberate:
  `const a: unknown[] = ['x']` then `a.push(1)`.

`<in T>` / `<out T>` (4.7) annotate variance explicitly — mostly a
compiler-performance tool, but knowing what they mean is a good signal.

---

## 8. `any` vs `unknown` vs `never`

| | Assignable **to** it | Assignable **from** it | Meaning |
| --- | --- | --- | --- |
| `any` | everything | everything | off switch — disables checking both ways |
| `unknown` | everything | nothing (until narrowed) | "I don't know yet" — safe top type |
| `never` | nothing | everything | "cannot happen" — the bottom type |

`catch (e)` gives `unknown` under `useUnknownInCatchVariables` (on with
`strict`) — narrow it: `e instanceof Error ? e : new Error(String(e))`.

Detect a stray `any`: `type IsAny<T> = 0 extends 1 & T ? true : false`.

---

## 9. Narrowing tools

```ts
// type predicate — you assert the relationship, the compiler trusts you
function isLang(x: unknown): x is Language {
  return typeof x === 'object' && x !== null && 'code' in x;
}

// assertion function — needs an explicit annotation on the declaration
function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error('missing');
}

// 5.5: inferred type predicates — this now narrows without an annotation
const langs = items.filter((x) => x !== null);   // Language[], not (Language|null)[]
```

`typeof` + `instanceof` + `in` + discriminants cover ~95% of real narrowing.
Reach for a predicate only when those cannot express it — and say out loud that
a predicate is an *unchecked promise* to the compiler.

---

## 10. `interface` vs `type` — the answer that scores

Mostly interchangeable. The differences that matter:

- **Interfaces get no implicit index signature.** An interface therefore does
  *not* satisfy `Record<string, unknown>`; a type alias does. Cause:
  declaration merging means an interface can be reopened, so its key set is
  never provably closed. Very common interview gotcha — see drill 1.4.
- Interfaces **merge** across declarations; type aliases error on redeclare.
  Merging is what enables module augmentation — and what makes interfaces the
  wrong choice for a closed union.
- Only type aliases express unions, tuples, mapped and conditional types.
- Interfaces are marginally better for compiler performance in deep hierarchies
  (they cache; intersections of aliases do not).

Practical rule: **`interface` for object shapes you might extend or augment,
`type` for everything else.** Then be able to give the index-signature reason.

---

## 11. Compiler flags worth naming

| Flag | Why it matters |
| --- | --- |
| `strict` | The umbrella. Assume it is on. |
| `noUncheckedIndexedAccess` | `arr[0]` becomes `T \| undefined`. Catches real bugs; noisy. |
| `exactOptionalPropertyTypes` | `{ a?: string }` stops accepting `{ a: undefined }`. |
| `verbatimModuleSyntax` | Forces `import type`. Predictable emit, no phantom imports. |
| `erasableSyntaxOnly` | Bans enums, namespaces, parameter properties — for Node type stripping. |
| `noImplicitOverride` | `override` required. Cheap, catches renames. |

Good answer to "which would you turn on in a large codebase":
`noUncheckedIndexedAccess` first (highest real-bug yield), and be honest that it
is noisy at first — that trade-off *is* the answer.
