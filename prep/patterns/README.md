# Pattern recognition

Interview problems are not new maths. They are variations on about twenty
recurring shapes. The hard part is not implementing a sliding window — it is
*noticing* that the problem in front of you is a sliding window.

**This folder trains recognition.** `prep/algo/` trains implementation.

---

## The three files that matter

| | |
| --- | --- |
| **[`CATALOGUE.md`](./CATALOGUE.md)** | All 22 patterns. For each: the words that give it away, the structural condition that makes it valid, the code template, the cost, and the variations interviewers escalate to. Starts with a **30-second triage table** — read the problem, read down the table, first match wins. |
| **[`recognition/quiz.md`](./recognition/quiz.md)** | 60 problem statements. Name the pattern, do not solve. Answer key explains the tell *and* the wrong guess. This is the drill that actually builds the skill. |
| **[`drills/`](./drills/)** | Runnable practice for the 8 patterns `prep/algo/` does not cover. Stubs fail until you implement them. |

---

## How to use it — the loop

**1. Read the catalogue once, properly.** Not to memorise the code — to learn
the *tells*. About an hour. Pay most attention to the triage table and to the
"how patterns stack" section at the end.

**2. Take the quiz cold.** Ten seconds per problem, say the pattern out loud,
write it down. Score yourself. Target 45/60 first pass.

**3. Work the drills for whatever you missed.** Recognition without having
written the code once is fragile — you will recognise the pattern and then not
be able to produce it.

**4. Retake the quiz two days later.** The gap is the point; recognition is a
memory skill and spaced repetition is how it sticks.

### The daily habit that costs five minutes

Open any problem list — LeetCode, HackerRank, anywhere. Read five problem
statements. **Do not solve them.** For each, say out loud:

> "Contiguous subarray, longest, at most K distinct — sliding window with a
> hash map for the window state. O(n) time, O(k) space."

That is the exact sentence you want to produce in the interview's first two
minutes. Five a day for a week is thirty-five reps.

---

## The 22 patterns

Tiered by how often they actually appear.

### Tier 1 — you will almost certainly see one of these

| # | Pattern | Practice |
| --- | --- | --- |
| 1 | Hash map / frequency counting | `prep/algo/drills/01-hash-maps.ts` |
| 2 | Two pointers | `prep/algo/drills/02-two-pointers.ts` |
| 3 | Sliding window | `prep/algo/drills/03-sliding-window.ts` |
| 4 | **Prefix sum / running aggregate** | `drills/01-prefix-sum.ts` |
| 5 | Binary search (incl. on the answer) | `prep/algo/drills/04-binary-search.ts` |
| 6 | Sorting + greedy (intervals) | `prep/algo/drills/06-sorting-intervals.ts` |
| 7 | BFS / DFS | `prep/algo/drills/09-graphs.ts`, `08-trees.ts` |

### Tier 2 — very common, and where candidates separate

| # | Pattern | Practice |
| --- | --- | --- |
| 8 | **Cyclic sort** | `drills/02-cyclic-sort.ts` |
| 9 | **Fast & slow pointers** | `drills/03-fast-slow-pointers.ts` |
| 10 | **Monotonic stack / deque** | `prep/algo/drills/05-stack-queue.ts`, `drills/04-monotonic-deque.ts` |
| 11 | Heap / top-K / two heaps | `prep/algo/drills/10-heaps-topk.ts` |
| 12 | Backtracking | `prep/algo/drills/07-recursion-backtracking.ts` |
| 13 | Dynamic programming | `prep/algo/drills/11-dynamic-programming.ts` |
| 14 | Topological sort | `prep/algo/drills/09-graphs.ts` |

### Tier 3 — appear regularly; know the tell even if the code is rusty

| # | Pattern | Practice |
| --- | --- | --- |
| 15 | **Union-Find** | `drills/05-union-find.ts` |
| 16 | **Bit manipulation** | `drills/06-bit-manipulation.ts` |
| 17 | **Trie** | `drills/08-trie.ts` |
| 18 | In-place linked list reversal | `drills/03-fast-slow-pointers.ts` (shares the node type) |
| 19 | **Matrix traversal** | `drills/07-matrix-traversal.ts` |
| 20 | Line sweep / event-based | `prep/algo/drills/06-sorting-intervals.ts` |
| 21 | Divide and conquer | catalogue only |
| 22 | Greedy (without sorting) | catalogue only |

**Bold** entries are the drills in this folder — the patterns `prep/algo/` does
not already cover.

---

## Running the drills

```bash
npm run drills -- 01-prefix-sum      # one module
npm run drills:watch                 # everything, re-running on save
npm run drills:solutions             # the same tests against the solutions
```

24 problems across 8 modules:

| Module | Problems |
| --- | --- |
| `01-prefix-sum` | range sum queries · subarrays summing to K (with negatives) · product except self |
| `02-cyclic-sort` | missing number · all duplicates and missing · first missing positive |
| `03-fast-slow-pointers` | cycle detection + entry · middle node · happy number |
| `04-monotonic-deque` | sliding window maximum · next greater circular · largest rectangle |
| `05-union-find` | the structure · connected components · redundant connection |
| `06-bit-manipulation` | single number · counting bits · single number II |
| `07-matrix-traversal` | spiral order · rotate in place · set matrix zeroes |
| `08-trie` | insert/search/startsWith · words with prefix · wildcard search |

---

## Six sentences worth memorising

These carry the most weight per word in an interview. They are the *reasoning*
behind the six trickiest patterns, and interviewers listen for exactly this.

1. **Sliding window / monotonic stack** — *"The nested loop looks quadratic, but
   each element enters and leaves at most once, so the total work is bounded by
   2n. It's O(n) amortised."*

2. **Prefix sum vs sliding window** — *"A sliding window needs the sum to be
   monotonic in the window size, which fails once negatives are allowed.
   Prefix sums plus a hash map don't need that."*

3. **Binary search on the answer** — *"I'm searching the answer space, not the
   array. The property that licenses it is that the feasibility predicate is
   monotonic in the answer."*

4. **Intervals** — *"Sort by start to merge; sort by end to fit the most in.
   Taking the earliest-ending interval always leaves the most room — that's the
   exchange argument."*

5. **Cyclic sort** — *"The values are indices in disguise. Every swap puts one
   value permanently home, so there are at most n swaps — O(n), O(1) space."*

6. **BFS vs DFS** — *"Every edge costs the same, so the first time BFS reaches a
   node it has done so by a shortest path. DFS would find a path, not the
   shortest one."*

---

## Where this sits

| Folder | Purpose |
| --- | --- |
| **`prep/patterns/`** | *This folder.* Which pattern is this? Recognition first. |
| [`prep/algo/`](../algo/README.md) | The Live Coding 1 kit: 12 modules, the HackerRank harness, complexity reference, playbook, timed mocks. |
| [`prep/`](../README.md) | The frontend TypeScript round (likely Live Coding 2). |

If you are preparing for the algorithms interview, work `prep/algo/README.md`'s
six-day plan as the spine and use this folder as the reference you keep open
beside it.
