# LeetCode / algorithms interview prep

One track: array/string/graph problem solving for a technical interview.
Everything frontend-TS-specific has been removed — this repo is LeetCode only.

```bash
npm install
npm run drills:watch      # leave this running while you work
```

| Command | What it does |
| --- | --- |
| `npm run drills` | Run every drill/exam once |
| `npm run drills:watch` | Re-run on save — the one you want |
| `npm run drills -- day-05` | Run one day (or any filename fragment) |
| `npm run drills:types:check` | Plain `tsc` over everything, no test runner |

### Layout

```
prep/
├── days/           ← START HERE. day-01, day-02, ... — one problem per folder, in solving order.
├── leetcode/       ← Source material `days/` is generated from. 22 patterns × 2 problems, tiered by frequency.
├── tier-1/         ← Optional extra reps: the 7 highest-frequency patterns, 5 exams each.
├── patterns/       ← CATALOGUE.md (reference, read don't drill) + a 60-question recognition quiz.
├── algo/           ← Interview-format practice: no-framework harness, timed mocks.
└── ONE-DAY.md      ← Emergency compressed version if a date gets fixed suddenly.
```

No fixed interview date right now, so the only rule is **one solved problem a
day, every day.** Recognition is not a separate phase — it comes from solving
problems, not from memorizing the catalogue first. Use `patterns/CATALOGUE.md`
only as a lookup when stuck, not as required reading up front.

---

## Tracking progress

**[`PROGRESS.md`](./PROGRESS.md)** — one row per day, two checkboxes: solved,
reviewed. Edit by hand as you go. It lives here, not inside `days/`, so
regenerating that folder later never wipes your checkmarks.

---

## `prep/days/` — the daily driver

**[`days/INDEX.md`](./days/INDEX.md)** is the full schedule: 44 problems +
9 review days, one folder each (`day-01`, `day-02`, …), ordered
**easiest/most-foundational pattern first, hardest last** — hash maps and two
pointers on day one, dynamic programming and backtracking at the end. This is
deliberately *not* the frequency order `leetcode/` uses: the goal here is
building up the pattern vocabulary fastest, not front-loading what's most
likely to be asked.

Every 5th new problem is followed by a **review day** — no new material, just
redo the oldest problem from that block, cold, from a blank file. That's the
spaced repetition that's supposed to make the earlier, AI-assisted days
actually stick.

Each `day-NN/` folder is self-contained:

- `<problem-slug>.ts` — the pattern explanation + problem spec + a stub that
  throws until you implement it. Everything you need is in this one file.
- `<problem-slug>.test.ts` — the spec. Run it: `npx vitest run prep/days/day-01`
- `solution.ts` — reference implementation with the reasoning an interviewer
  is listening for. Open it after a genuine attempt, not before.
- `README.md` — day number, pattern, LeetCode link, and (on review days)
  which earlier day to redo.

**Expect to need AI help on the early days** — that's the point. Ask for it,
read the reasoning, then redo the same problem from a blank file the same
day. The review days are what turn "I needed help" into "I remember this."

`days/` is generated from `leetcode/`, which stays untouched as the canonical,
frequency-tiered reference — if you ever want to regenerate or reorder it,
the pattern order and review cadence are both just a list at the top of the
generator, easy to change.

---

## After day 53 (44 problems + 9 reviews)

- **Reread every pattern's header block** — all 22 in about 40 minutes, via
  `leetcode/drills/`. That pass is what makes recognition automatic; it works
  far better after having solved the problems than before.
- **`tier-1/` exams** — 5 more per Tier 1 pattern (35 total) for depth on the
  highest-frequency ones, done cold with a timer.
- **`patterns/recognition/quiz.md`** — 60 problem statements, name the
  pattern, don't solve. Good five-minutes-a-day filler on low-energy days.
- **`algo/hackerrank/`** — once a week, solve one problem in the no-framework
  format (`node file.ts`, your own assertions) instead of Vitest. That's the
  actual interview environment if the round is HackerRank-based.
- **`algo/mocks/`** — timed full mocks once the pattern vocabulary feels solid.

## If a date gets fixed

Come back and say how many days are left — the plan compresses differently at
1 day (`ONE-DAY.md`, recognition only) vs 5–7 days (Tier 1 + `tier-1/` depth,
skip Tier 2/3) vs 3+ weeks (`days/`, unchanged).
