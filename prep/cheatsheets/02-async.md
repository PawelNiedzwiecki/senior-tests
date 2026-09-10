# Cheatsheet 2 — Async, concurrency and cancellation

Read before Day 3. The interview value here is judgement, not syntax.

---

## 1. The event loop, in the version you should say out loud

One call stack. When it empties:

1. Drain the **microtask** queue completely — promise callbacks,
   `queueMicrotask`, `MutationObserver`. A microtask that queues a microtask is
   run in the same drain, so an infinite chain starves everything else.
2. Run **one** macrotask — `setTimeout`, `setInterval`, I/O, events.
3. In browsers, `requestAnimationFrame` callbacks run before style/layout/paint,
   after the microtask drain.

```ts
console.log('1');
setTimeout(() => console.log('4'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('2');
// 1 2 3 4
```

`await x` is sugar for `.then` — everything after it is a microtask. `async`
function bodies run **synchronously up to the first `await`**, which is the
detail people miss:

```ts
async function f() { console.log('a'); await null; console.log('c'); }
f(); console.log('b');   // a b c
```

---

## 2. Promise combinators

| | Resolves when | Rejects when | Use for |
| --- | --- | --- | --- |
| `all` | all fulfil | first rejection | "I need all of these" |
| `allSettled` | all settle | never | "show me what worked" |
| `race` | first to **settle** | first to settle, if rejected | timeouts |
| `any` | first to **fulfil** | all reject (`AggregateError`) | mirrors/fallbacks |

`Promise.all` does **not** cancel siblings on rejection — they keep running,
and an unhandled rejection in a sibling can still surface. Say that; it is a
common follow-up.

**`Promise.race` is a memory hazard.** The losing promise stays subscribed for
as long as it lives. Racing a never-settling promise on every keystroke leaks
one closure chain per keystroke.

---

## 3. Bounded concurrency

Chunking is the naive answer and it is measurably worse:

```ts
// Bad: each batch idles waiting for its slowest member
for (const batch of chunk(items, 4)) await Promise.all(batch.map(work));

// Good: N workers pulling from a shared cursor — all N stay busy
let cursor = 0;
const workers = Array.from({ length: 4 }, async () => {
  while (cursor < items.length) {
    const i = cursor++;             // safe: no await between read and increment
    results[i] = await work(items[i]);
  }
});
await Promise.all(workers);
```

Write results **by index**, never `push` — pushing gives you completion order.
In production: `p-limit` / `p-map`. Say that, then show you can build it.

---

## 4. Retry, backoff and jitter

- **Exponential backoff** so load falls off as an outage continues. Fixed
  retries turn your fleet into a DDoS of your own service.
- **Jitter** because backoff alone still synchronises: everyone who failed at
  t=0 retries at t=100, t=300, t=700 *together*. Full jitter picks uniformly
  from `[0, delay]`. This is the thundering-herd answer.
- **Cap the delay**, then fail honestly.
- **Retry budget**, not infinite retries.

**Which errors are retryable** — the judgement question:

| Retry | Do not retry |
| --- | --- |
| 429, 502, 503, 504 | 400, 401, 403, 404, 422 |
| Network / DNS / connection reset | Anything where the request itself is wrong |
| Idempotent methods freely | POST — only with an idempotency key |

Rethrow the **original** error when retries run out. Wrapping it destroys the
stack and the status code the caller needs.

---

## 5. Cancellation

**A signal does not cancel a promise.** It tells a *cooperating* API to stop.
`fetch` cooperates; a plain promise has no cancellation mechanism at all.

```ts
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();                // AbortError

AbortSignal.timeout(5000);         // native, TimeoutError
AbortSignal.any([a, b]);           // native, first to abort wins
```

Error names are the contract: `AbortError` (user cancelled — say nothing) vs
`TimeoutError` (probably retry). Collapsing them loses the distinction.

Three things people get wrong:

1. **Already-aborted signals do not re-fire.** Always check `signal.aborted`
   before subscribing, or you will fire a request nobody wants.
2. **Listeners leak.** Composing against a long-lived signal on every keystroke
   adds a listener per keystroke. `{ once: true }` covers the fired case; an
   explicit `cleanup()` covers the much more common unfired case.
3. **Timers must be cleared.** `Promise.race` with an uncleared `setTimeout`
   holds a handle for the full duration after the winner settles.

---

## 6. Caching and request coalescing

**Cache the promise, not the value.** That single decision gives deduplication
for free: the second caller in the same tick finds the pending promise and
awaits it.

```ts
const inFlight = new Map<string, Promise<T>>();
function get(key: string, load: () => Promise<T>) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = load();
  inFlight.set(key, promise);
  promise.catch(() => inFlight.delete(key));   // never cache a rejection
  return promise;
}
```

**Never cache a rejection** — a rejected promise stays rejected forever, so one
network blip poisons the key until reload.

**LRU with a `Map`**: Maps iterate in insertion order, so `delete` + `set`
promotes a key and `keys().next().value` is the oldest. O(1), no linked list.

---

## 7. Async iterators and streaming

```ts
async function* sentences(chunks: AsyncIterable<string>) {
  let buffer = '';
  try {
    for await (const chunk of chunks) {
      buffer += chunk;
      // drain complete units from the front of the buffer…
    }
    if (buffer.trim()) yield buffer.trim();
  } finally {
    // runs on completion, on throw, AND when the consumer `break`s
  }
}
```

- Chunk boundaries are meaningless — they are wherever the network split. Buffer.
- Generators are **lazy**: the body does not start until the first `next()`, so
  the consumer sets the pace. That is backpressure, free.
- **`finally` runs on `break`** — the runtime calls `.return()` on the
  generator. That is where you abort the underlying fetch. Few candidates know
  generator cleanup exists; say it.

---

## 8. Debounce vs throttle vs rAF

| | Fires | Use for |
| --- | --- | --- |
| debounce | after silence of N ms | search-as-you-type, autosave |
| throttle | at most once per N ms | scroll/resize handlers |
| `requestAnimationFrame` | once per frame, before paint | anything visual |

Debounce with `maxWait` **is** throttle. For anything that reads or writes the
DOM, rAF is the better primitive — it is aligned to the frame, so your work
cannot land mid-frame and tear across two paints.

Things a debounce interview expects you to handle: leading edge, trailing edge,
`cancel`, `flush`, `this` binding, and *not* firing twice for a single call when
both edges are enabled.

---

## 9. Error handling

```ts
try { await work(); }
catch (e) {
  const error = e instanceof Error ? e : new Error(String(e));   // `e` is unknown
  throw new Error('Translation failed', { cause: error });        // keeps the chain
}
```

- `error.cause` (ES2022) preserves the original — use it instead of string
  concatenation.
- An `async` function that throws returns a **rejected promise**; it does not
  throw synchronously. So `try { fn() }` without `await` catches nothing.
- A rejection with no handler attached **in the same tick** is an unhandled
  rejection. Attaching a `.catch` later does not always save you.
- `finally` runs on both paths — the right place for cleanup, and it does not
  swallow the outcome unless you `return` from it.
