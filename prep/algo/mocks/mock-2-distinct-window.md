# Mock 2 — Longest window with at most K distinct

**45 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only.

---

## Part 1 — the brief

> Given a string and a number `k`, return the length of the longest **contiguous
> substring** containing at most `k` distinct characters.
>
> ```
> ('eceba', 2)   → 3     ('ece')
> ('aa', 1)      → 2
> ('abcabcbb', 2) → 2
> ('', 3)        → 0
> ```

**Start the timer. Come back at 15 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~15 minutes)

> What's the complexity? Justify the time bound — I'm looking at a nested loop.
>
> And now return the substring itself, not just its length.

**Continue. Come back at 32 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure (at ~32 minutes)

> Test it properly.
>
> Then: this is going to run on real user text — German, Japanese, Arabic,
> emoji. Does your solution still do the right thing?

**Stop at 45 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### Framing

- "Is `k` guaranteed non-negative?" (k = 0 → answer 0)
- "Contiguous, so a substring not a subsequence — confirming."
- "Case-sensitive? Is 'A' distinct from 'a'?"
- "What character set — ASCII, or real text?" ← **asking this early pays off
  enormously in Part 3.**

### The solution

```ts
function longestWindow(s: string, k: number): number {
  if (k <= 0) return 0;

  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right += 1) {
    const char = s[right]!;
    counts.set(char, (counts.get(char) ?? 0) + 1);

    // Too many distinct — shrink from the left until it's valid again.
    while (counts.size > k) {
      const leftChar = s[left]!;
      const count = counts.get(leftChar)! - 1;
      if (count === 0) counts.delete(leftChar);
      else counts.set(leftChar, count);
      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

**The two things to get right:**

1. **`while`, not `if`** for the shrink. Usually one step suffices, but the loop
   is what makes it correct in general — and reasoning "is one step always
   enough?" out loud is better than getting lucky.
2. **`delete` when the count hits zero.** `counts.size` is the distinct-character
   count, so leaving a zero-count entry behind makes it permanently wrong. This
   is the bug in this problem.

### The complexity justification — the actual question in Part 2

> "It looks like a nested loop, but `left` only ever moves forward and can move
> at most n times across the entire run. `right` likewise. So the total number
> of pointer movements is bounded by 2n — it's O(n), amortised. Space is
> O(min(n, k+1)) for the map, since it never holds more than k+1 entries."

If you cannot make that argument, this is the single most valuable thing to take
from this mock.

### Returning the substring

Track `bestLeft` alongside `best` and `slice` at the end. The trap is slicing
inside the loop on every improvement — that is O(n) per slice and turns the
whole thing quadratic. Record indices, slice once at the end.

```ts
let best = 0, bestLeft = 0;
// ...
if (right - left + 1 > best) { best = right - left + 1; bestLeft = left; }
// ...
return s.slice(bestLeft, bestLeft + best);
```

### Part 3 — the Unicode question

This is where the mock is won, and it is a fair question at a translation
company.

**What breaks:** `s[i]` indexes UTF-16 **code units**. So:

- `'👍'` is two code units. Indexing it splits the surrogate pair, and your map
  counts two meaningless half-characters instead of one emoji.
- `'é'` written as `e` + combining acute is two code points; you count it as two
  distinct characters when a user sees one.
- Devanagari and Korean conjuncts have the same issue.

**What to say:**

> "This iterates UTF-16 code units, so it's wrong for anything outside the BMP —
> an emoji gets counted as two distinct characters and can even be split across
> the window boundary, which would produce mojibake if I returned the substring.
> If 'character' means what a user sees, the right unit is the grapheme cluster:
> I'd segment with `Intl.Segmenter` first and run the same window over the
> resulting array. The algorithm is unchanged — only the tokenisation differs."

```ts
const graphemes = [...new Intl.Segmenter(locale, { granularity: 'grapheme' })
  .segment(s)].map((g) => g.segment);
// same sliding window over `graphemes`, then join the slice back
```

**The nuance that lands well:** ask which definition the product wants. For a
character-limit counter, graphemes. For a storage limit, code units. They are
different questions, and knowing they are different is the point.

### Part 3 — testing

- `('', 3)` → 0, `('a', 0)` → 0
- `k` larger than the number of distinct characters → whole string
- all identical characters
- every character distinct with `k = 1` → 1
- the answer at the very start, and at the very end
- a randomised check against a brute-force O(n²) version

### Score yourself

`../../mocks/rubric.md`. Weight **complexity justification** and whether the
Unicode issue came from you or had to be dragged out of you.
