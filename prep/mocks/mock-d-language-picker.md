# Mock D — An accessible language picker

**50 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only.

---

## Part 1 — the brief (read this, then start the timer)

> Build me a language picker component. It's the "translate into…" dropdown —
> around 30 languages, used constantly, and it needs to work for keyboard and
> screen-reader users because a lot of our users are professional translators
> who live in this UI all day.
>
> ```ts
> interface Language { code: string; name: string; }
> ```
>
> React and TypeScript. Don't use a component library — I want to see how you'd
> build it. Styling doesn't matter; behaviour and the API do.
>
> Start wherever you like.

**Start the timer. Come back at 20 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~20 minutes)

> Let's talk about the keyboard. Walk me through every key a user might press
> and what should happen — then implement the ones you haven't.
>
> And a design question: right now this is hard-coded to `Language`. We have
> another dropdown for glossaries, and one for document formats. Can this be one
> component?

**Continue. Come back at 38 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure follow-ups (at ~38 minutes)

Answer out loud; implement only if there is time.

> - How does a screen reader know which option is highlighted?
> - Some of our users have 200+ glossaries in that other dropdown. Concerns?
> - How would you test the keyboard behaviour?
> - We support Arabic and Hebrew. Anything change?

**Stop at 50 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### What a strong answer looks like

**Framing.** The best opening here is a question about scope, because the honest
senior answer is "I probably wouldn't build this":

> "In production I'd reach for a headless library — Radix, React Aria — because
> the accessible combobox is one of the most-got-wrong widgets there is, and
> those are tested against real screen readers. I'm going to build it because
> that's the exercise, and it's worth knowing what they're doing for you."

Then: *"Is it a listbox — pick from a fixed set — or a combobox with a text
field for filtering? That changes the ARIA pattern."* Asking this is a genuine
signal; the two patterns have different roles and different keyboard contracts.

**The architectural move that scores.** Pull the keyboard behaviour out of the
component into a pure reducer:

> "Keyboard behaviour is a state machine, and it's the part with all the edge
> cases. I'll model it as `(state, action) => state` so I can test the whole key
> matrix without a DOM, and the component becomes a thin adapter."

**The key matrix** (from the ARIA Authoring Practices — say that you are
following a written spec, not improvising):

| State | Key | Behaviour |
| --- | --- | --- |
| closed | ↓ / Enter / Space | open, activate first |
| closed | ↑ | open, activate **last** |
| open | ↓ / ↑ | next / previous, **wrapping** |
| open | Home / End | first / last |
| open | Enter | select active, close |
| open | Esc | close, clear active, **keep selection** |
| open | Tab | close, keep selection, focus moves on |
| open | printable char | type-ahead |

The two most commonly missed: **↑ on a closed list opens at the last item**, and
**Esc clears the active item but not the selection**. Active (the cursor) and
selected (the commitment) are different things; conflating them is the most
common bug in hand-rolled dropdowns.

**Type-ahead** is the detail that marks someone who has actually read the spec:
characters within ~500ms accumulate into a buffer, and the search starts *after*
the currently active item so repeated presses cycle through matches.

### Follow-up: making it generic

```tsx
interface SelectProps<T> {
  items: readonly T[];
  value: NoInfer<T> | null;
  onChange: (item: NoInfer<T>) => void;
  getKey: (item: NoInfer<T>) => string;
  getLabel: (item: NoInfer<T>) => string;
}
function Select<T>(props: SelectProps<T>) { … }
```

Points available here:

- **`NoInfer` on everything but `items`**, so `T` has one inference source and a
  wrong `onChange` is reported on `onChange` — not on the innocent `items` prop.
  This is about the quality of the error message your API produces.
- **Accessors vs a shape constraint** (`T extends { id: string; label: string }`)
  is a real trade-off: accessors mean more props but no adapter layer, and they
  work with types you do not own. State which you chose and why.
- **`<T,>` in `.tsx`** if you use an arrow function — `<T>` parses as JSX.

### Part 3 — what good answers contain

- **Screen reader / active option:** `aria-activedescendant` on the input,
  pointing at the active option's `id`; DOM focus never leaves the input, which
  is what a combobox needs because the user is still typing. Contrast with
  roving `tabindex`, which actually moves focus and suits a toolbar or tree.
  Plus `role="listbox"`, `role="option"`, `aria-selected`, `aria-expanded`,
  `aria-controls`.
- **200+ items:** virtualisation — and then immediately name what it costs:
  `aria-activedescendant` must point at a **rendered** element, so the active
  option has to be inside the window. That interaction is the interesting part
  of the answer, and it is what shows you have actually done it. Also mention
  that find-in-page stops working across unrendered rows.
- **Testing:** the reducer exhaustively as pure unit tests (fast, no DOM), then
  a handful of integration tests with `userEvent.keyboard('{ArrowDown}{Enter}')`
  queried by role and accessible name. Say that `getByRole` is the query that
  fails when your accessibility breaks — which is the point of using it.
- **RTL:** `dir="rtl"` on the container; arrow *up/down* semantics are
  unchanged (vertical), but any horizontal affordance flips. Use logical CSS
  properties (`margin-inline-start`, `inset-inline-end`) rather than
  `left`/`right`. Also: language names should render in their own script, and
  the list itself should not be sorted with a naive `localeCompare()` default —
  pass the user's locale.

### The senior close

If you have two minutes left, volunteer the summary:

> "What I've got handles keyboard, roles and selection. What I haven't done:
> screen-reader announcements for the result count, virtualisation for the long
> case, and testing against an actual screen reader — which is the only way to
> really know. And for production I'd still argue for React Aria over this."

Knowing what is missing is worth more than another five minutes of code.

### Related drills

`04-dom-a11y/01-listbox-keyboard.ts` is the reducer.
`03-react/05-generic-select.tsx` is the generic component.
`04-dom-a11y/03-virtual-window.ts` is the long-list follow-up.
