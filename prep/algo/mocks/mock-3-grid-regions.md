# Mock 3 — Regions in a grid

**50 minutes. Blank file. Timer on. Talk out loud.**
Read Part 1 only.

---

## Part 1 — the brief

> You're given a 2D grid of characters. A **region** is a group of identical
> characters connected horizontally or vertically. Return the size of the
> largest region.
>
> ```
> [['a','a','b'],
>  ['a','b','b'],
>  ['c','c','b']]      → 4    (the four 'b's)
>
> [['x']]              → 1
> []                   → 0
> ```

**Start the timer. Come back at 18 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 2 — first follow-up (at ~18 minutes)

> What's the complexity, in time and space?
>
> Now: the grid is 5000 × 5000, all the same character. Does your solution
> survive?

**Continue. Come back at 35 minutes.**

---

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

## Part 3 — pressure (at ~35 minutes)

> Test it.
>
> Then: I'd like the region sizes for every distinct character, not just the
> largest. And what changes if regions can also connect diagonally?

**Stop at 50 minutes. Score yourself before reading on.**

---

<br><br><br><br><br><br><br><br><br><br>

## Debrief

### Framing — say the translation

The single highest-value sentence in the first two minutes:

> "This is a connected-components problem on an implicit graph — each cell is a
> node, and edges connect orthogonally adjacent cells with the same character.
> So it's a flood fill over every cell, tracking the largest component."

Questions worth asking:
- "Four-directional or eight?" (they said horizontally/vertically — confirm it)
- "Can the grid be ragged, or is every row the same length?"
- "May I modify the grid?"
- "How large can it get?" ← sets up Part 2, and asking it *first* is much better
  than being ambushed by it

### The solution

```ts
const DIRS: Array<[number, number]> = [[-1,0],[1,0],[0,-1],[0,1]];

function largestRegion(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return 0;

  const visited = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));
  let best = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (visited[r]![c]) continue;

      const target = grid[r]![c];
      let size = 0;

      // Explicit stack — recursion would overflow on a large uniform grid.
      const stack: Array<[number, number]> = [[r, c]];
      visited[r]![c] = true;

      while (stack.length > 0) {
        const [row, col] = stack.pop()!;
        size += 1;

        for (const [dr, dc] of DIRS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (visited[nr]![nc] || grid[nr]![nc] !== target) continue;
          visited[nr]![nc] = true;   // mark on PUSH
          stack.push([nr, nc]);
        }
      }

      best = Math.max(best, size);
    }
  }

  return best;
}
```

Three details worth narrating as you write them:
- **`visited` rather than mutating the grid** — non-destructive, and say that
  the mutation trick exists and why you chose not to use it.
- **Mark on push, not on pop** — otherwise the same cell is stacked many times
  before being processed once.
- **Bounds check before indexing.**

### Part 2 — complexity and the 5000×5000 question

**Complexity:** O(rows × cols) time — every cell is visited at most twice, once
by the scan and once by a fill. O(rows × cols) space for `visited` plus the
worst-case stack.

**The 5000×5000 uniform grid is the real question**, and it is asking one thing:
*did you use recursion?*

- A recursive flood fill recurses up to 25,000,000 deep. Node's stack is around
  10,000 frames. **It crashes** — `RangeError: Maximum call stack size exceeded`.
  This is not theoretical.
- The iterative version above is fine on stack, but its explicit stack can still
  hold O(rows × cols) entries — 25M pairs is gigabytes.

**The good answer:** "The iterative version won't blow the call stack, but the
explicit stack can still hold every cell. I'd switch to BFS with a queue, which
has the same worst case, or reduce the per-entry cost by pushing a single
encoded number `row * cols + col` instead of a two-element array — that's one
number per entry instead of an object, which is a large constant-factor win at
this scale."

If you used recursion in Part 1 and spot the problem here yourself, say so
plainly and fix it. Catching your own bug is a strong signal.

### Part 3 — sizes per character

Small change, and the interviewer is checking whether your code was structured
well enough to absorb it:

```ts
const sizesByChar = new Map<string, number[]>();
// inside the loop, after computing `size`:
const list = sizesByChar.get(target) ?? [];
list.push(size);
sizesByChar.set(target, list);
```

If your Part 1 solution had the fill inlined and tangled, this hurts. If you had
factored the fill into a `floodFill(r, c): number`, it drops straight in. That
is why "did the follow-up require a rewrite" is a rubric line.

### Part 3 — diagonal connectivity

One line: add the four diagonals to `DIRS`.

```ts
const DIRS8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
```

**Better:** make it a parameter rather than a rewrite —
`largestRegion(grid, { diagonal: false })`. Say why: connectivity is a property
of the problem, not of the algorithm, so it belongs in configuration. That is a
design observation, and design observations are what "senior" means in a round
that is otherwise about fundamentals.

### Part 3 — testing

- `[]` and `[[]]` → 0
- single cell → 1
- all identical → rows × cols
- all different → 1
- a snake-shaped region that doubles back
- two equal-sized regions (either answer is the same number — check you don't
  double-count)
- a ragged grid, if you allowed one — or assert you rejected it

Randomised check against a deliberately naive implementation is again the
strongest move if time allows.

### Score yourself

`../../mocks/rubric.md`. Weight: **did you name it as a graph problem
unprompted**, **did you avoid recursion or catch it in Part 2**, and **did the
follow-ups drop in or require surgery**.
