# Tier 1 — the seven patterns you will almost certainly be asked

Seven patterns. **Five exams each. Thirty-five problems.**

These are the Tier 1 entries from [`../patterns/CATALOGUE.md`](../patterns/CATALOGUE.md)
— the ones that turn up in nearly every array, string or graph interview. If
you only have time for one folder in this repository, it is this one.

Every module is built the same way:

- **the pattern explained first** — the tell, the condition that makes it
  valid, the template from memory, the cost, what interviewers escalate to,
  and the sentence worth saying out loud;
- **five exams**, each with worked examples, a target complexity and **a hint**
  that points at the specific trap that exam exists to catch;
- **a solution** written out with the reasoning an interviewer is listening
  for, not just working code.

The exam stubs throw until you implement them. The tests are the specification.

```bash
npm install
npm run drills -- tier-1              # all 35 exams
npm run drills -- 03-sliding-window   # one module
npm run drills:watch                  # re-run on save — the one you want
SOLUTIONS=1 npm run drills -- tier-1  # the same tests against the solutions
```

---

## The seven modules

| Module | The tell | The five exams |
| --- | --- | --- |
| [`01-hash-map`](./exams/01-hash-map.ts) | "have I seen it", "how many times", "group these" | two sum · group anagrams · isomorphic strings · top k frequent · valid Sudoku |
| [`02-two-pointers`](./exams/02-two-pointers.ts) | sorted input, "in place", "O(1) space", symmetric from both ends | sorted squares · remove duplicates (keep 2) · container with most water · 3Sum closest · merge sorted in place |
| [`03-sliding-window`](./exams/03-sliding-window.ts) | "contiguous" + longest / shortest / at most K | longest substring without repeats · max average of size k · at most k distinct · min subarray sum · find all anagrams |
| [`04-prefix-sum`](./exams/04-prefix-sum.ts) | "sum of a range" asked many times, "running total", negatives allowed | range sum queries · pivot index · subarray sum equals k · product except self · range addition |
| [`05-binary-search`](./exams/05-binary-search.ts) | sorted + O(log n), or "minimum X such that…" | first & last position · rotated array · find a peak · Koko eating bananas · split array largest sum |
| [`06-intervals`](./exams/06-intervals.ts) | "intervals", "meetings", "overlap", "merge" | merge intervals · minimum meeting rooms · minimum arrows · interval intersections · car pooling |
| [`07-bfs-dfs`](./exams/07-bfs-dfs.ts) | "shortest path" (BFS) · "is there a path", "components" (DFS) | number of islands · number of provinces · shortest path in a binary matrix · Pacific Atlantic · open the lock |

---

## The seven patterns, in one line each

Enough to recognise the pattern cold. The full explanation is the header block
of each module; the mechanism behind each is in
[`../patterns/CATALOGUE.md`](../patterns/CATALOGUE.md).

**1 · Hash map** — record what you have already walked past so a question about
*other* elements costs O(1) instead of a nested loop. Three shapes: complement
lookup, counting, canonical key. The pattern with the fewest preconditions,
which is why it is the most common.

**2 · Two pointers** — two indices that never go backwards, so the scan is O(n)
despite looking quadratic. Valid only when a comparison tells you which side
*cannot* be part of the answer. Converging, read/write, or parallel.

**3 · Sliding window** — a contiguous window where `right` always advances and
`left` advances only to restore validity. Needs monotonicity: growing must push
the quantity one way. Negatives usually break it — that is when you want prefix
sums instead.

**4 · Prefix sum** — pay O(n) once so every range query is a subtraction.
Requires an invertible aggregate. Run backwards as a *difference array*, it
makes range updates cheap instead of range queries.

**5 · Binary search** — halve the space using a monotone predicate. Sortedness
is sufficient, not necessary. The senior version searches the **answer**, not an
index: "minimum capacity / speed / cap such that a feasibility check passes".

**6 · Sorting + greedy** — sort, then sweep with tiny state. The only real
decision is sort by *start* (you are building spans) or by *end* (you are
keeping as many as possible). Getting that backwards still compiles.

**7 · BFS / DFS** — one traversal, two containers: a queue gives shortest paths,
a stack gives reachability. A grid is a graph with four (or eight) edges per
cell. Mark nodes when you *enqueue* them, not when you pop them.

---

## How to work a module

1. **Read the header block.** Five minutes. It is the pattern, not the problem
   — the same twenty lines apply to every variant of it you can be asked.
2. **Read exam 1 and say the approach out loud before typing.** If you cannot
   name the pattern and its complexity in two sentences, reread the header
   instead of starting.
3. **Only then read the hint.** Each one names the specific trap in that exam.
   Reading it first turns an exam into a transcription task.
4. **Implement it**, with the test running on save.
5. **Open the solution and read the prose**, not the code. The narration is
   what you would actually say in the room.
6. **Do all five in one sitting if you can.** One problem teaches a trick; five
   teach the pattern, and the fifth in each module is deliberately the one that
   escalates.

---

## A four-day route

Roughly two and a half hours a day.

| Day | Modules | Why together |
| --- | --- | --- |
| 1 | `01-hash-map`, `02-two-pointers` | The two ways to kill a nested loop: buy memory, or exploit order. |
| 2 | `03-sliding-window`, `04-prefix-sum` | The pair most often confused. Windows need monotonicity; prefix sums do not. |
| 3 | `05-binary-search`, `06-intervals` | Everything that starts with "sort it first" — plus binary search on the answer. |
| 4 | `07-bfs-dfs` | Longest module. Five traversals with five different neighbour functions. |

Then reread only the seven header blocks — about twenty-five minutes. That pass
is what makes recognition automatic.

---

## Where this sits

| Folder | Purpose |
| --- | --- |
| **`prep/tier-1/`** | *This folder.* The 7 highest-frequency patterns, five exams each, hints included. Depth on what is most likely to be asked. |
| [`prep/patterns/`](../patterns/README.md) | All 22 patterns catalogued, plus a 60-problem "name the pattern" quiz. Recognition. |
| [`prep/leetcode/`](../leetcode/README.md) | All 22 patterns, two problems each. Breadth. |
| [`prep/algo/`](../algo/README.md) | The timed HackerRank round: harness, complexity reference, mocks. |
| [`prep/ONE-DAY.md`](../ONE-DAY.md) | All 22 patterns compressed into six families, for when the interview is tomorrow. |
