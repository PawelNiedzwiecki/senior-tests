# All 22 patterns in one day

> **Read this first.** You cannot learn 22 patterns to *implementation* level in
> a day, and any plan that promises it is selling you something. What you can do
> in a day — comfortably, and it is the more valuable half — is:
>
> - **name all 22 patterns in ten seconds** from a problem statement
> - **write about twelve templates from a blank page**, no reference
> - **know which six you would be in trouble on**, which is worth knowing before
>   the interview rather than during it
>
> Naming is what the first two minutes of an interview actually tests, and it is
> what unlocks everything else: you cannot produce code for a pattern you have
> not identified, but you can nearly always reconstruct code for one you have.

**Which plan do you want?**

| If you have… | Use |
| --- | --- |
| One day, and want coverage of **all 22** | **this file** — recognition-first, breadth |
| ~10 hours, and want **depth on the likely 6** | [`algo/README.md` § "If you have fewer than five days"](./algo/README.md) |
| Five to seven days | [`algo/README.md` § "The six-day plan"](./algo/README.md) |

They are different bets. This one maximises the chance you *recognise* whatever
turns up. That one maximises the chance you *nail* the most probable questions.
If the interview is tomorrow and you have done nothing, take this one.

---

## The idea that makes a day enough: 22 patterns is a lie

There are six families. The patterns inside a family are the same idea wearing
different clothes, and once you see the family the members stop being separate
things to memorise.

### Family A — Trade space for a loop  *(2 patterns, 2 templates)*

**Hash map · Prefix sum** *(and the difference array, which is prefix sum backwards)*

> *"I've caught myself writing an inner loop that asks a question about **other**
> elements. That's O(n²) about to happen — I'll precompute the answer instead."*

Prefix sums make range **queries** cheap; difference arrays make range
**updates** cheap. They are inverses of each other, and knowing that is how you
pick instantly.

### Family B — Enters once, leaves once  *(6 patterns, 4 templates)* ← the big one

**Two pointers · Sliding window · Monotonic stack · Fast & slow pointers ·
Cyclic sort · In-place list reversal**

> *"The nested loop looks quadratic, but each element is touched a constant
> number of times across the whole run, so the total work is bounded by 2n. It's
> O(n) amortised."*

**Six of the twenty-two patterns collapse into that one sentence.** Every one of
them is "pointers move forward and never go back, and what gets discarded is
provably not part of the answer". If you take one thing from the day, take this
family — it is the best ratio of coverage to effort on the list.

### Family C — Impose order, then discard  *(4 patterns, 2 templates)*

**Binary search · Sorting + greedy (intervals) · Line sweep · Divide & conquer**

> *"Sortedness — or monotonicity of the predicate — is what licenses throwing
> half the work away. If I can't state the monotonic property, I don't have a
> binary search, I have a guess."*

Includes binary search **on the answer**, which is the version that actually
gets asked at senior level.

### Family D — Explore a graph  *(4 patterns, 3 templates)*

**BFS / DFS · Topological sort · Union-Find · Matrix traversal**

> *"It's all the same traversal. The container decides the behaviour — a queue
> gives shortest paths, a stack gives reachability — and the bookkeeping
> (in-degrees, a parent array) is the only other difference."*

A grid is a graph where each cell has four edges. Say that and half of these
problems stop looking like a separate category.

### Family E — The answer space is exponential  *(3 patterns, 2 templates)*

**Backtracking · Dynamic programming · Greedy**

> *"Three ways to handle an exponential search space: explore it with undo,
> memoise the overlapping subproblems, or prove one choice is always safe.
> Choosing between them **is** the question."*

This is the hardest family and the one where the *choice* matters more than the
code. Greedy without an exchange argument is how people lose this question.

### Family F — The problem names the structure  *(3 patterns, 1 template)*

**Heap / top-K · Trie · Bit manipulation**

> *"'k most frequent' says heap. 'Prefix' says trie. 'Every element twice except
> one' says XOR. Recognition is the whole job here."*

Deliberately last, deliberately shallow. These are lookup-able; spending an hour
on trie internals at the expense of Family B would be a bad trade.

**Write those six headings on one sheet of paper before you do anything else.**
That sheet is your day, and rewriting it from memory at the end is the last
exercise.

---

## The three techniques that do the actual work

Everything below is scheduling. These three are the mechanism.

### 1. Diagnose before you study — in the first twenty minutes

Take **quiz Round 1 cold**, before reading anything at all. Twenty problems,
ten seconds each, name the pattern and move on.

A cold score is the only honest data you will get about where your day should
go, and it is **unrecoverable** — once you have read the catalogue you can never
take it again. Studying first feels productive and destroys the measurement.

Score it, and note *which* you missed, not just how many. Three misses in one
family means that family gets the extra hour.

### 2. Blank-page reproduction, not reading

Reading a template encodes nothing. The drill is:

1. Blank sheet. Write the template from memory. **No peeking** — if you cannot
   start, that is information, write down what you do remember.
2. Open [`patterns/CATALOGUE.md`](./patterns/CATALOGUE.md). Diff yours against
   it. Mark what you missed in a different colour.
3. Close it. Write it again.
4. Move to a **different family**. Come back two hours later and write it a
   third time.

Twelve templates × three spaced reps. This is the single highest-value block of
the day, and it is the part people skip because it feels harder than reading.
That it feels harder is the point.

### 3. Interleave, and space the retrievals

**Never do two problems from the same family back to back.** Blocked practice
lets your brain use the context — you already know it is a sliding window
because the last three were — which trains exactly the wrong thing. Mixed
practice feels worse and works better.

The three quiz rounds sit at roughly hours 0, 4 and 8 on purpose. The forgetting
in between is the mechanism, not a flaw in the plan.

---

## The day

Roughly nine hours of wall clock, about seven and a half of work. Times are
elapsed, not clock times — start whenever.

| Elapsed | Block | What you actually do |
| --- | --- | --- |
| **0:00–0:20** | **Diagnose** | [`quiz.md`](./patterns/recognition/quiz.md) **Round 1** (20 problems), cold, 10s each. Score it. Note which family each miss belongs to. |
| **0:20–1:00** | **Compress** | Read the **30-second triage table** in [`CATALOGUE.md`](./patterns/CATALOGUE.md), then skim only the six family groupings above. Write the family sheet by hand. Do **not** read the catalogue end to end — you do not have time and it is not the point. |
| **1:00–2:30** | **Family B** ← the big one | Four templates, blank-page drill (technique 2). Then three problems from `leetcode/drills/`, **interleaved**: `02-two-pointers` (3Sum), `10-monotonic-stack` (trapping rain water), `03-sliding-window` (character replacement). |
| **2:30–2:45** | Break | Away from the screen. Genuinely. |
| **2:45–3:45** | **Families A + C** | Four templates. Two problems: `04-prefix-sum` (contiguous array), `05-binary-search` (kth smallest in a matrix). The second is binary search on the answer — the version that gets asked. |
| **3:45–4:05** | **Retrieval #1** | **Round 2** of the quiz (disguised tells). Compare against your Round 1 score. |
| **4:05–5:00** | Lunch | Do not study. The consolidation is doing work. |
| **5:00–6:00** | **Family D** | Three templates (BFS with a level sweep, DFS, Kahn's, Union-Find). One problem: `07-bfs-dfs` (rotting oranges — multi-source BFS). |
| **6:00–7:15** | **Family E** | The hardest block. Two templates. One problem each from `12-backtracking` and `13-dynamic-programming`. Spend the time on *choosing* between backtracking / DP / greedy, not on polishing code. |
| **7:15–7:30** | Break | |
| **7:30–8:00** | **Family F** | **Recognition only.** Read the three catalogue entries, write the heap template once. Do not attempt a trie problem. |
| **8:00–8:20** | **Retrieval #2** | **Round 3** of the quiz — traps and stacked patterns. This is the honest score. |
| **8:20–9:00** | **Mock, out loud** | One timed mock from [`algo/mocks/`](./algo/mocks/). Talk the whole way through, to an empty room. The interview is verbal; silent practice trains something you will not be asked to do. |
| **9:00–9:20** | **The sheet** | Rewrite the six families and all twelve templates from blank memory. What you cannot reproduce now is tomorrow morning's revision list — and it should be short. |

---

## If you have four hours, not nine

Do this and nothing else. It is about 60% of the value for 45% of the time.

1. **Quiz Round 1**, cold (20 min)
2. **Family B** in full — six patterns, four templates, two problems (2h)
3. **Family A** — two templates, one problem (40 min)
4. **Quiz Rounds 2 and 3** back to back (40 min)
5. **The family sheet** from memory (20 min)

You will be at recognition level on C–F and writing level on A and B. That is a
defensible place to be, and it is far better than a shallow pass over all six.

---

## What "done" looks like

Be honest with yourself against this list at 9:20. It is calibrated for one day,
not for a week.

| You should be able to | You will **not** be able to |
| --- | --- |
| Name the pattern for ~50/60 quiz problems in ten seconds | Implement all 44 problems in `leetcode/` — that is a week |
| Write ~12 templates from a blank page | Write a trie or a heap fluently under pressure |
| Say the amortised-O(n) argument for Family B unprompted | Derive the Floyd's cycle-entrance proof from scratch |
| State the brute force *and* the improvement for any Tier 1 problem | Recognise the rarer stacked patterns quickly |
| Name which family a problem belongs to even when you cannot solve it | — |

**That last row is worth more than it looks.** "This is a graph connectivity
problem, so Union-Find or DFS; let me start with DFS and talk through the
trade-off" — said confidently about a problem you then only half-finish — reads
far better than silence, and it is achievable in a day.

---

## Five habits worth more than any single pattern

Practise these *while* you work the blocks above, not separately.

1. **State the brute force first, with its complexity, then improve it.** The
   ladder is the interview. Jumping straight to the clever answer skips the part
   being assessed.
2. **Say the validity argument out loud.** *"Each element enters and leaves the
   stack once, so it's O(n) amortised."* *"Feasibility is monotonic in the
   answer, so I can binary search it."* These sentences are the difference
   between recall and understanding, and interviewers listen for exactly them.
3. **Ask about the constraints that change the answer** — duplicates, negatives,
   empty input, whether you may mutate the caller's data.
4. **Flag your side effects.** *"I'm mutating your array — here's how I'd undo
   it."* Five seconds, and it reads as experience.
5. **Name the production difference, briefly.** A stable sort; a Fenwick tree
   once updates interleave with queries; bucket sort when k is large.

---

## The morning after

- **No new material.** Reread only your own family sheet — the one you wrote
  from memory, including the gaps.
- Redo **one** problem you already solved, from a blank file, timed.
- Reread [`algo/playbook.md`](./algo/playbook.md) § 1, the minute-by-minute
  protocol.
- One easy warm-up before you start, never a hard one. A failure at 09:00 is
  noise in your head, not information.

Sleep beats one more problem, comfortably.
