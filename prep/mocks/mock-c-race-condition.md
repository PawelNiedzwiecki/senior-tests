# Mock C — The race condition

**45 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only.

> This is the highest-probability scenario in the whole kit. If you run one
> mock, run this one.

---

## Part 1 — the brief (read this, then start the timer)

> Here's a hook one of our engineers wrote. It's in production. There's a bug
> report that says: *"sometimes the translation shown doesn't match what I
> typed."* It's intermittent and nobody's been able to reproduce it reliably.
>
> ```ts
> function useTranslation(query: string) {
>   const [data, setData] = useState<string | null>(null);
>   const [loading, setLoading] = useState(false);
>   const [error, setError] = useState<Error | null>(null);
>
>   useEffect(() => {
>     setLoading(true);
>     translate(query)
>       .then((result) => {
>         setData(result);
>         setLoading(false);
>       })
>       .catch((e) => {
>         setError(e);
>         setLoading(false);
>       });
>   }, [query]);
>
>   return { data, loading, error };
> }
> ```
>
> Have a look. Tell me what you see, then fix it.

**Start the timer. Come back at 15 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~15 minutes)

> Good. Now: the request should actually be cancelled, not just ignored — we're
> paying for these. And when the component unmounts mid-request, nothing should
> touch state afterwards.
>
> Also, I'm not thrilled about three `useState`s. Can we do better?

**Continue. Come back at 32 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure follow-ups (at ~32 minutes)

> - When the query changes, the box goes blank and then fills in. Product wants
>   the previous translation to stay visible while the new one loads. Do it.
> - Add a `refetch()`.
> - We turned on StrictMode and now every request fires twice in dev. Is that a
>   bug?
> - How would you write a test that fails on the original code and passes on
>   yours?

**Stop at 45 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### The diagnosis (say this in the first two minutes)

> "There are actually three bugs. The big one is a race: if the user types
> 'hello' then 'hi', two requests are in flight, and there's nothing tying a
> response back to the query that caused it. If 'hello' is slower and lands
> second, the box says 'hi' and the result says the translation of 'hello'.
> That's exactly the intermittent bug report.
>
> Second, `error` is never cleared, so one failure sticks forever.
>
> Third, if the component unmounts mid-request, `setData` runs on an unmounted
> component."

Naming the race **before** touching the code is the single highest-scoring
moment in this mock. Naming all three is a 4.

### The fix

```ts
useEffect(() => {
  let cancelled = false;
  const controller = new AbortController();
  dispatch({ type: 'started' });

  translate(query, controller.signal).then(
    (data) => { if (!cancelled) dispatch({ type: 'succeeded', data }); },
    (e)    => { if (!cancelled && e.name !== 'AbortError')
                  dispatch({ type: 'failed', error: toError(e) }); },
  );

  return () => { cancelled = true; controller.abort(); };
}, [query]);
```

**Two guards, and you must be able to say why neither is sufficient alone:**

- `abort()` asks a *cooperating* API to stop. `fetch` obeys; a plain promise has
  no cancellation mechanism, so a fetcher that ignores the signal still resolves.
- `cancelled` is a plain closure variable that makes the continuation a no-op
  whatever the fetcher does.

**`AbortError` must not become an error state.** The user typed; that is the app
working. Rendering "Something went wrong" every time someone edits is a real bug
in a lot of shipped code.

**Three `useState`s → one discriminated union + `useReducer`.** The states are
mutually exclusive: `loading` with stale `data` and a stale `error` is not a
real state and should not be representable. This is drill 1.5's idea applied to
UI state, and saying that connection out loud is worth a mark.

### Part 3 — what good answers contain

- **Keep previous data visible:** add `{ status: 'refreshing'; data: T }` to the
  union rather than a boolean beside it. Watch for the trap: on `query` change
  you now want to keep `data` but discard it if the *identity* of the resource
  changed in a way that makes stale data misleading. Say which you're choosing.
- **`refetch`:** a counter in state added to the effect deps is the simplest
  correct trick. Keep the returned function identity stable (`useCallback`) or
  every consumer's memo breaks.
- **StrictMode:** not a bug — it is dev-only, and it double-mounts precisely to
  check that your cleanup fully undoes your setup. Your fixed hook passes it;
  the original did not. The right answer is "that's the check working, and it's
  telling us the old version was broken."
- **The failing test:** this is the part most candidates fumble. You need
  *controllable* promises, not timers:

  ```ts
  const gates = new Map<string, Deferred<string>>();
  // render with 'hello' → rerender with 'hi'
  // resolve gates.get('hello') FIRST
  // assert the state is still loading, not success('hallo')
  // then resolve 'hi' and assert success
  ```

  Deterministic, no timing, fails reliably on the original. Say why deferreds
  beat `setTimeout` here: you are testing *ordering*, and ordering tests should
  never depend on wall-clock.

### Related drills

`03-react/02-use-async-resource.ts` is this mock as a drill. Do it twice.
`02-async/07-abort-composition.ts` covers the cancellation half.
