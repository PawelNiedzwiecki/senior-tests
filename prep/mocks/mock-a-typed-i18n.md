# Mock A — A typed translation helper

**45 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only. Do not scroll ahead.

---

## Part 1 — the brief (read this, then start the timer)

> We're building the i18n layer for our web app. Right now translators give us a
> flat object of message strings, and developers call `t('some.key')` with a
> params object. It's completely untyped — typos ship, and missing interpolation
> params show up as literal `{name}` in the UI.
>
> I'd like you to design the types so both of those become compile errors.
>
> Here's the shape of a catalogue:
>
> ```ts
> const messages = {
>   nav: {
>     home: 'Home',
>     settings: { title: 'Settings' },
>   },
>   greeting: 'Hello {name}, you have {count} documents',
>   errors: { network: 'You appear to be offline' },
> };
> ```
>
> I want `createTranslator(messages)` to give me back a `t` function where the
> key has to exist, and the params are driven by the string itself.
>
> Take it wherever you think is sensible — I'm more interested in how you
> approach it than in getting all the way to the end.

**Start the timer now. Come back at 20 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~20 minutes)

> Nice. Two things I'd want next.
>
> First: `t('nav')` currently type-checks in a lot of implementations, because
> `nav` is a valid path — but it's a branch, not a message. Can we make only the
> leaves valid?
>
> Second: what happens if the message has no placeholders at all? I'd rather not
> write `t('nav.home', {})` everywhere.

**Continue. Come back at 35 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure follow-ups (at ~35 minutes)

Answer out loud. You do not have to implement these.

> - Our catalogues are getting big — a few thousand keys, nested five deep.
>   Any concerns?
> - Translators sometimes send `{count, plural, one {# doc} other {# docs}}`.
>   How would that change your approach?
> - The German catalogue is missing keys the English one has. Where would you
>   want that to fail?
> - How would you test these types?

**Stop at 45 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### What a strong answer looks like

**Framing (first 3 minutes).** Restate: two separate problems — key validity and
param validity — that happen to compose. Ask whether the catalogue is a literal
in the source (it must be, or none of this works — a runtime-loaded JSON file
has no literal types). Sketch the two type names before implementing.

**The two types.**

```ts
type TranslationKey<T> = T extends Record<string, unknown>
  ? { [K in keyof T & string]:
        T[K] extends string ? K
      : T[K] extends Record<string, unknown> ? `${K}.${TranslationKey<T[K]>}`
      : never
    }[keyof T & string]
  : never;

type Placeholder<S extends string> =
  S extends `${string}{${infer P}}${infer Rest}` ? P | Placeholder<Rest> : never;
```

**Follow-up 1 (leaves only)** is a one-line decision: emit `K` only in the
string branch. Candidates who emit both `K` and the recursive path in every
branch produce autocomplete entries that crash at runtime.

**Follow-up 2 (no params)** wants a conditional *argument list*, not an
optional object:

```ts
type TArgs<S extends string> = [Placeholder<S>] extends [never]
  ? []
  : [params: { [K in Placeholder<S>]: string | number }];

function t<K extends TranslationKey<T>>(key: K, ...args: TArgs<ValueAt<T, K>>): string;
```

The `[T] extends [never]` tuple wrap is essential — the naked version
distributes and evaluates to `never`, so the check silently never fires. If you
wrote it without the tuples, that is the single most valuable thing to take away
from this mock.

### Part 3 — what good answers contain

- **Size:** recursion is bounded by catalogue depth, so a few thousand keys is
  fine, but the *union* of keys is materialised at every call site. If tsserver
  gets slow, generate the key union at build time instead of computing it in the
  type system. Naming the escape hatch matters more than the estimate.
- **ICU plurals:** the placeholder parser becomes a small tokeniser —
  `{name}` vs `{count, plural, ...}` need different param types (`string|number`
  vs `number`). Reasonable answer: parse the leading identifier and the optional
  `, type` suffix, and bail to `string | number` for anything unrecognised. The
  honest answer is also acceptable: this is where you stop hand-rolling and use
  a library with typed ICU support.
- **Missing keys across locales:** fail at **build time**, not runtime — type
  the other locales as `Record<TranslationKey<typeof en>, string>`, so a missing
  German key is a compile error in CI. That is the answer they want: shift the
  failure left.
- **Testing types:** `expectTypeOf`, or hand-rolled `Expect<Equal<A, B>>`. Be
  able to write `Equal` and explain why the deferred conditional gives strict
  equality — see `prep/support/type-assertions.ts`.

### Related drills

`01-types/01-translation-params.ts` and `01-types/02-message-keys.ts` are this
mock, decomposed. If you struggled, redo both timed, then re-run this mock in
two days.
