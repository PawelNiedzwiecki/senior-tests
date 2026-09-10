# Cheatsheet 3 — React with TypeScript

Read before Day 4. Assumes React 19.

---

## 1. Typing components

```ts
interface Props { title: string; children?: ReactNode; onClose?: () => void }

function Panel({ title, children, onClose }: Props) { … }   // ← prefer this
const Panel: React.FC<Props> = ({ title }) => { … }         // ← avoid
```

Why avoid `React.FC`: it adds nothing now that implicit `children` is gone, it
breaks generic components, and it makes the return type harder to control.
A plain annotated function is better in every respect.

**Children:** `ReactNode` for anything renderable. `ReactElement` only when you
genuinely need an element (e.g. to `cloneElement`). `JSX.Element` is the older
spelling of the same thing.

**Events:** let inference do it — `onChange={(e) => …}` already types `e`. When
you must annotate: `React.ChangeEvent<HTMLInputElement>`,
`React.MouseEvent<HTMLButtonElement>`, `React.KeyboardEvent<HTMLDivElement>`.

**`currentTarget` vs `target`:** `currentTarget` is typed to the element the
handler is on; `target` is `EventTarget` because the event may have bubbled from
anywhere. Reach for `currentTarget`.

---

## 2. Generic components

```tsx
function Select<T>(props: SelectProps<T>) { … }        // function declaration: fine
const Select = <T,>(props: SelectProps<T>) => { … };   // arrow in .tsx: needs the comma
```

`<T>` alone parses as JSX in a `.tsx` file. The trailing comma disambiguates.

**Make one prop the inference source** and mark the rest `NoInfer<T>`:

```ts
interface SelectProps<T> {
  items: readonly T[];                        // ← T comes from here
  value: NoInfer<T> | null;
  onChange: (item: NoInfer<T>) => void;
}
```

Without this, a wrong `onChange` makes `T` a union and the error is reported on
`items` — pointing at the innocent prop. This is about the *quality of the error
message your API produces*, which is a genuinely senior concern.

**`React.memo` loses generics.** `memo(Select) as typeof Select` restores them.
Usually not worth it.

---

## 3. Polymorphic components

```tsx
type TextProps<E extends ElementType> =
  OwnProps & { as?: E } & Omit<ComponentPropsWithoutRef<E>, keyof OwnProps | 'as'>;

function Text<E extends ElementType = 'span'>({ as, ...rest }: TextProps<E>) {
  const Component = (as ?? 'span') as ElementType;   // capitalised! JSX needs it
  return <Component {...rest} />;
}
```

- `ComponentPropsWithoutRef<E>`, not `ComponentProps<E>` — the latter includes
  `ref`, which fights with `forwardRef`.
- The `Omit` is load-bearing: without it your own props *intersect* with the
  element's same-named props and produce uninhabitable types.
- Cost: these are a known tsserver hot spot. A plain `<Link>` alongside `<Text>`
  is often the better engineering call — say so.

---

## 4. Hooks worth knowing cold

```ts
const [state, setState] = useState<Lang | null>(null);   // annotate when it starts null
const ref = useRef<HTMLInputElement>(null);              // DOM ref: null initial
const box = useRef<number>(0);                           // mutable box: not null

// useReducer with a discriminated union action — makes illegal states impossible
function reducer(state: State, action: Action): State { … }
```

`useRef` has two distinct uses and people conflate them: a **DOM handle**
(React assigns it) and a **mutable box that survives renders without causing
one** (you assign it). Both are legitimate; say which you mean.

`useId` for SSR-safe ids. Never `Math.random()` in render.

---

## 5. The three bugs interviewers probe

### a) The fetch race

Two requests in flight; responses can arrive in any order; the last to arrive is
not necessarily the one to show.

```ts
useEffect(() => {
  let cancelled = false;
  const controller = new AbortController();

  fetchIt(controller.signal).then((data) => {
    if (cancelled) return;         // ← the guard that makes a late response harmless
    setData(data);
  });

  return () => { cancelled = true; controller.abort(); };
}, [query]);
```

**Two guards, different jobs.** `abort()` asks a cooperating API to stop; the
`cancelled` flag makes the continuation a no-op regardless. Neither alone is
enough. Check `cancelled` after *every* `await`.

An `AbortError` is not an error state — the user caused it. Filter it out or you
render "Something went wrong" every time someone types.

### b) The stale closure

A closure captures **values, not variables**. `useCallback(fn, [])` preserves
the function *and* the render-1 values it closed over.

```ts
function useEventCallback<A extends unknown[], R>(fn: (...a: A) => R) {
  const ref = useRef(fn);
  useLayoutEffect(() => { ref.current = fn; });
  return useCallback((...args: A): R => ref.current(...args), []);
}
```

Stable identity + always-fresh closure. This is what `useEffectEvent` is. Use it
for *events*; keep `useCallback` for values passed to memoised children. Do not
call it during render — the ref may belong to a render React discards.

### c) Effects that re-run forever

Object and function dependencies are compared by reference. A fresh literal each
render re-arms the effect every time. Fixes, in order of preference: depend on a
primitive; derive instead of storing; `useEventCallback`; memoise upstream.

---

## 6. Derive, don't store

The single most useful question in React state design: **can I compute this
instead of storing it?**

```ts
const [debounced, setDebounced] = useState(value);
const isPending = debounced !== value;    // ← derived. One less thing to desync.
```

Storing `isPending` in a second `useState` means two updates to keep in sync, an
extra render, and a wrong value on the first render.

State that *is* worth storing: anything the user changed, anything from the
network. Everything else is usually a `const` in render.

---

## 7. StrictMode and React 19

Development double-mounts every component: mount → unmount → mount. It is not
being awkward; it is checking that **your cleanup fully undoes your setup**. A
hook that passes StrictMode is a hook that survives fast refresh, suspense
replays and route re-entry.

React 19 notes worth having ready:
- `ref` is a normal prop on function components — `forwardRef` is no longer
  needed for new code.
- `use()` reads a promise or context, and can be called conditionally.
- Actions / `useActionState` / `useOptimistic` for form transitions.
- The compiler auto-memoises, which changes when hand-written `useMemo` earns
  its place — but it does not fix stale closures or races.

---

## 8. Testing hooks and components

```ts
const { result, rerender, unmount } = renderHook(
  ({ q }) => useThing(q),
  { initialProps: { q: 'a' } },
);
act(() => result.current.doThing());
await waitFor(() => expect(result.current.state.status).toBe('success'));
```

- Wrap anything that triggers a state update in `act`. `userEvent` and
  `waitFor` handle it for you.
- Query by **role and accessible name** — `getByRole('button', { name: 'Save' })`.
  It is the only query that fails when your accessibility breaks.
- `getBy` throws, `queryBy` returns null (use for absence), `findBy` is async.
- With explicit imports (no `globals: true`), Testing Library's auto-cleanup
  does **not** register — wire `afterEach(cleanup)` yourself or DOM leaks
  between tests. See `prep/support/setup.ts`.
- Prefer deferred promises over fake timers when testing async ordering; they
  are deterministic and far easier to read.
