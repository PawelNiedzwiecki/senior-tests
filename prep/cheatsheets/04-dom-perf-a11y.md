# Cheatsheet 4 — DOM, performance and accessibility

Read before Day 6. This is the track most candidates are weakest on, which
makes it the cheapest place to look strong.

---

## 1. Rendering pipeline

```
JS → Style → Layout → Paint → Composite
```

- **Layout (reflow)**: geometry. Triggered by size/position changes.
- **Paint**: pixels. Triggered by colour, shadow, border-radius.
- **Composite**: GPU. `transform` and `opacity` only.

Animate `transform` and `opacity` and you skip layout and paint entirely. Animate
`width`/`top`/`left` and you pay for the whole pipeline every frame.

**Layout thrashing** is reading a layout property while a style change is
pending:

```ts
for (const row of rows) {
  const h = row.offsetHeight;         // forces layout NOW so the number is correct
  row.style.height = h * 2 + 'px';    // invalidates it again
}
```

N rows, N forced reflows. Fix by ordering, not by speed: batch all reads, then
all writes. One layout instead of N.

**Properties that force layout:** `offsetTop/Left/Width/Height`,
`clientTop/Left/Width/Height`, `scrollTop/Left/Width/Height`,
`getBoundingClientRect()`, `getComputedStyle()`, `focus()`. Know three.

**Free measurements:** `ResizeObserver` and `IntersectionObserver` deliver
values the browser already computed, at a defined point in the frame — no
forced reflow at all. Reaching for these instead of measuring in a scroll
handler is the highest-value habit in this area.

---

## 2. Scheduling

| | Runs | Use for |
| --- | --- | --- |
| `queueMicrotask` | end of current task | promise-adjacent work |
| `requestAnimationFrame` | before style/layout/paint | anything visual |
| `setTimeout(0)` | next macrotask, clamped ≥4ms nested | yielding, rarely correct |
| `requestIdleCallback` | when idle | analytics, prefetch, non-urgent |
| `scheduler.postTask` | priority-aware | modern replacement, patchy support |

rAF is the right primitive for DOM work: it is frame-aligned, so your work
cannot land mid-frame and tear across two paints.

---

## 3. Virtualisation

Render only what is visible; add a spacer of the full height so the scrollbar
tells the truth.

```
first = floor(scrollTop / h)
last  = ceil((scrollTop + viewportHeight) / h) - 1
start = max(0, first - overscan)          ← overscan first
end   = min(count - 1, last + overscan)   ← clamp second
offsetY = start * h                       ← the OVERSCANNED start
```

`floor` for the top and `ceil - 1` for the bottom is what includes the partially
visible rows. Using `floor` for both leaves a one-row gap while scrolling.
Translating by the *visible* start while rendering from the *overscanned* start
is the other classic bug — it looks like jitter.

Variable heights: prefix-sum the heights, binary-search the offsets (O(log n) —
a linear scan per scroll event spends the frame budget you were saving).
Measure after render, patch the offsets, and adjust `scrollTop` by the delta if
the correction was above the viewport, or the content jumps under the cursor.

Costs: Ctrl+F stops working, and so does screen-reader browse mode across
unrendered rows. Check `content-visibility: auto` with `contain-intrinsic-size`
first — it is native and keeps find-in-page working.

---

## 4. Accessibility: the parts that come up

**The first rule of ARIA is not to use ARIA.** A `<button>` gives you focus,
Enter/Space activation, and the right role for free. `<div role="button">`
requires you to reimplement all three, and you will miss one.

**Roles you should know cold:** `listbox`/`option`, `combobox`, `dialog`,
`tablist`/`tab`/`tabpanel`, `menu`/`menuitem` (menus are for *application*
menus, not nav links).

**Keyboard patterns (APG):**

| Widget | Keys |
| --- | --- |
| Listbox | ↑↓ (wrap), Home/End, type-ahead, Enter select, Esc close |
| Combobox | as listbox, plus text entry; ↓ opens |
| Dialog | focus trap, Esc closes, focus restored on close |
| Tabs | ←→ between tabs, Tab moves *out* of the tablist |

**`aria-activedescendant` vs roving `tabindex`:** with activedescendant, DOM
focus stays put (on the input) and an attribute points at the active option —
what a combobox needs, because the user is still typing. Roving `tabindex`
actually moves focus and suits a toolbar or a tree.

**Focus management:** capture `document.activeElement` *before* you move focus,
restore it on close. Only intervene at the boundaries of a focus trap —
preventing default on every Tab breaks composed widgets. Modern answer:
`<dialog>` + `showModal()`, plus the `inert` attribute for backgrounds.

**Live regions:** `aria-live="polite"` announces when the user is idle;
`assertive` interrupts (use it almost never). The element must exist in the DOM
*before* the content changes, or nothing is announced.

**Labels:** `aria-labelledby` (points at visible text) beats `aria-label`
(invisible string, untranslated, invisible to your i18n pipeline). Relevant at a
translation company — say that.

---

## 5. Loading and Core Web Vitals

| Metric | Measures | Main levers |
| --- | --- | --- |
| **LCP** | largest element painted | preload the hero, cut render-blocking CSS/JS, server response time |
| **INP** | responsiveness to interaction | break up long tasks, yield, less JS on the main thread |
| **CLS** | unexpected layout shift | dimensions on images/embeds, reserve ad/banner space, `font-display: optional` |

INP replaced FID in 2024 — it measures *all* interactions, not just the first,
so a slow dropdown now counts. Fix by yielding: `await scheduler.yield()` or
chunking work across tasks.

Script loading: `defer` (execute in order after parse), `async` (execute
whenever, order not guaranteed), `type="module"` (deferred by default).

---

## 6. Internationalisation (worth being sharp on here)

```ts
new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(1234.5);
new Intl.RelativeTimeFormat('pl', { numeric: 'auto' }).format(-1, 'day');
new Intl.PluralRules('pl').select(2);          // 'few' — Polish has 4 plural forms
new Intl.Segmenter('de', { granularity: 'sentence' });
new Intl.ListFormat('en', { type: 'conjunction' }).format(['a', 'b', 'c']);
```

Points that land:

- **Never concatenate translated strings.** Word order differs; interpolate into
  a whole sentence instead.
- **Plurals are not `n === 1 ? a : b`.** Polish has four categories, Arabic six.
  `Intl.PluralRules` exists for exactly this.
- **RTL is `dir`, not CSS.** Use logical properties (`margin-inline-start`,
  `padding-block`) rather than `left`/`right`.
- **Text expands.** German runs ~30% longer than English; a fixed-width button
  that fits "Save" will not fit "Speichern". Test with pseudo-localisation.
- **Sentence splitting** is `Intl.Segmenter`, not a regex — abbreviations, CJK
  (no spaces at all) and locale rules make regexes wrong in ways users notice.
