# Mock B — A streaming translation client

**50 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only.

---

## Part 1 — the brief (read this, then start the timer)

> Our translation endpoint streams. You send text, and you get back chunks of
> translated output over time — arbitrary chunks, split wherever the network
> split them, not at sentence boundaries.
>
> I'd like a client function the UI can consume. Assume you have:
>
> ```ts
> declare function openStream(
>   text: string,
>   options: { signal?: AbortSignal },
> ): AsyncIterable<string>;   // yields raw chunks
> ```
>
> The UI wants to reveal one complete sentence at a time rather than flickering
> mid-word. Build me the thing in between.
>
> Design the signature however you like.

**Start the timer. Come back at 20 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~20 minutes)

> Good. Now the real usage: this is a translate-as-you-type box.
>
> The user keeps typing. Each edit should start a new stream and abandon the
> previous one — we shouldn't be paying for a translation nobody will read, and
> we definitely shouldn't render its output.
>
> How does that change what you've written?

**Continue. Come back at 38 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure follow-ups (at ~38 minutes)

Answer out loud; implement only if there is time.

> - The connection drops halfway through. What should happen?
> - We're sending a request on every keystroke. Fix that.
> - The user pastes a 200-page document. What breaks first?
> - How would you test this without a server?

**Stop at 50 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### What a strong answer looks like

**Framing.** The insight to state before writing anything: *chunk boundaries are
meaningless — they are wherever TCP split the bytes. So this is a buffering
problem, not a parsing problem.* Then ask the one question that matters: what
counts as a sentence boundary, and do we care about abbreviations?

**The core.**

```ts
async function* streamSentences(chunks: AsyncIterable<string>) {
  let buffer = '';
  try {
    for await (const chunk of chunks) {
      buffer += chunk;
      let match: RegExpExecArray | null;
      while ((match = /[.!?…]\s/.exec(buffer))) {
        const end = match.index + 1;
        const sentence = buffer.slice(0, end).trim();
        buffer = buffer.slice(end);
        if (sentence) yield sentence;
      }
    }
    if (buffer.trim()) yield buffer.trim();   // flush — the last sentence has no trailing space
  } finally {
    // runs on completion, throw, AND consumer `break`
  }
}
```

Two things to say out loud while writing it:

- **Why the lookahead.** Requiring whitespace *after* the terminator means a
  terminator at the end of the buffer waits for more input — correct, because we
  do not yet know if the sentence is finished. It also stops you splitting
  `3.14` and `z.B.`.
- **The flush.** Forget it and the final sentence silently never renders.

**Returning an async generator** is the right call and worth defending: it is
lazy, so the consumer sets the pace and gets backpressure for free; a callback
API pushes regardless of whether anyone can keep up.

### Follow-up 1 — the real test

This is where the mock is decided. A strong answer covers:

1. **AbortController per keystroke**, aborting the previous one. The signal goes
   into `openStream`.
2. **`finally` runs when the consumer `break`s** — the runtime calls `.return()`
   on the generator. That is where cleanup belongs, and most candidates do not
   know generator cleanup exists. Saying it unprompted is a strong signal.
3. **Abort alone is not enough.** The consumer must also ignore results from a
   superseded run — same two-guard reasoning as the React race (drill 3.2). If
   you only abort, a chunk already in flight can still render.
4. **`AbortError` is not an error state.** The user typed; that is the app
   working. Filter it before it reaches any error UI.

### Part 3 — what good answers contain

- **Connection drops:** partial output is already rendered, so decide the
  product behaviour explicitly — resume from an offset if the API supports it,
  or mark the tail as incomplete. Do *not* silently retry from the start and
  duplicate text. Say that retrying a stream is not like retrying a request.
- **Request per keystroke:** debounce (300ms is the conventional starting
  point), and mention that the abort story above is what makes the debounce
  safe. Bonus: coalesce identical in-flight requests (drill 2.4).
- **200-page paste:** the unbounded `buffer` is the first thing to break if the
  document has no sentence terminators — add a `maxBufferLength` and emit a
  fragment when exceeded. Then rendering: thousands of sentence nodes need
  virtualisation (drill 4.3). Naming *which* breaks first, and why, is the point.
- **Testing:** hand-roll an async generator that yields a scripted chunk list
  with controllable gaps. Deferred promises beat fake timers for ordering tests.
  Demonstrate laziness by asserting the source is not pulled before the first
  `next()`.

### The answer that separates senior

Volunteer, unprompted:

> "For anything user-facing I'd use `Intl.Segmenter` with sentence granularity
> rather than a regex — it handles abbreviations, and CJK has no spaces at all
> so a whitespace-based rule fails completely. But `Segmenter` wants the whole
> text, so the buffering strategy stays exactly the same; I'd just swap what
> decides the boundary."

That answer shows you know the platform, know the limitation of your own code,
and know that the *architecture* is unaffected by the swap.

### Related drills

`02-async/06-stream-sentences.ts`, `02-async/07-abort-composition.ts`,
`02-async/02-debounce.ts`.
