# The pattern catalogue

Twenty-two patterns. Almost every array/string/graph interview problem is one of
them, or two of them stacked.

Each entry has the same five parts:

- **TELL** — the words in the problem statement that give it away
- **WHEN** — the structural condition that makes the pattern valid
- **TEMPLATE** — the code shape, from memory
- **COST** — time and space
- **VARIATIONS** — what the interviewer escalates to

---

## The 30-second triage table

Read the problem, then read down this table. The first row that matches is
almost always right.

| If the problem says… | Reach for |
| --- | --- |
| "contiguous subarray / substring" + longest/shortest/at most K | **Sliding window** |
| "sum of a range", "running total", asked many times | **Prefix sum** |
| input is **sorted**, find a pair/triplet | **Two pointers** |
| input is **sorted**, find one thing, O(log n) | **Binary search** |
| "minimum X such that…", X is a number, answer is monotonic | **Binary search on the answer** |
| "have I seen…", "count of…", "group by…" | **Hash map** |
| numbers are **1..n** (or 0..n-1), missing/duplicate | **Cyclic sort** |
| "intervals", "meetings", "overlap", "merge" | **Sort by start + greedy** |
| "maximum concurrent", "at any point in time" | **Line sweep** |
| "next greater / previous smaller", "days until" | **Monotonic stack** |
| "maximum of every window of size k" | **Monotonic deque** |
| "k largest / smallest / most frequent" | **Heap (or bucket sort)** |
| "median of a stream" | **Two heaps** |
| linked list + "cycle", "middle", "nth from end" | **Fast & slow pointers** |
| "shortest path", unweighted | **BFS** |
| "is there a path", "connected components", "flood fill" | **DFS** |
| "order that satisfies dependencies", "course schedule" | **Topological sort** |
| "are these connected", many merge/query operations | **Union-Find** |
| "all combinations / permutations / subsets" | **Backtracking** |
| "how many ways", "min/max cost to reach" + overlapping subproblems | **Dynamic programming** |
| "every element appears twice except…" | **Bit manipulation (XOR)** |
| "prefix", "autocomplete", "dictionary of words" | **Trie** |
| "rotate / spiral / transpose the matrix" | **Matrix traversal** |
| "reverse the list in place", "reorder nodes" | **Linked-list reversal** |

**When two rows match, they usually stack.** "Longest substring with at most K
distinct" is sliding window *plus* hash map. "Kth largest in a stream" is heap
*plus* streaming. Stacking is normal; say both names out loud.

---

# TIER 1 — you will almost certainly see one of these

## 1. Hash map / frequency counting

**TELL** — "have I seen it before", "how many times", "group these", "find the
pair that sums to".

**WHEN** — you catch yourself writing a nested loop that asks a question about
*other* elements. That is O(n²) about to happen; a map makes it O(n).

```ts
// Seen-before / complement
const seen = new Map<number, number>();          // value → index
for (let i = 0; i < nums.length; i += 1) {
  const need = target - nums[i]!;
  if (seen.has(need)) return [seen.get(need)!, i];  // check BEFORE insert
  seen.set(nums[i]!, i);
}

// Counting
const counts = new Map<string, number>();
for (const x of items) counts.set(x, (counts.get(x) ?? 0) + 1);

// Grouping by a canonical key
const groups = new Map<string, string[]>();
for (const w of words) {
  const key = [...w].sort().join('');
  (groups.get(key) ?? groups.set(key, []).get(key)!).push(w);
}
```

**COST** — O(n) time, O(n) space.

**VARIATIONS** — complement lookup (two-sum), canonical-key grouping (anagrams),
seen-set for dedup, index map for "distance between duplicates", count map as
the state inside a sliding window.

**Repo:** `prep/algo/drills/01-hash-maps.ts`

---

## 2. Two pointers

**TELL** — the input is sorted, or the problem is symmetric from both ends, or
it says "in place" / "O(1) extra space".

**WHEN** — a comparison at the current pair tells you *which side cannot
possibly be part of the answer*. That is what licenses discarding it.

```ts
// CONVERGING — sorted pairs, palindromes
let lo = 0, hi = n - 1;
while (lo < hi) {
  const sum = nums[lo]! + nums[hi]!;
  if (sum === target) return [lo, hi];
  if (sum < target) lo += 1; else hi -= 1;
}

// FAST/SLOW (compaction) — in-place filtering
let write = 0;
for (let read = 0; read < nums.length; read += 1) {
  if (keep(nums[read]!)) { nums[write] = nums[read]!; write += 1; }
}

// PARALLEL — merging two sorted inputs
let i = 0, j = 0;
while (i < a.length && j < b.length) { /* take the smaller */ }
```

**COST** — O(n) time, O(1) space. Sorting first, if needed, makes it O(n log n).

**VARIATIONS** — three-sum (fix one, two-pointer the rest), container with most
water, remove duplicates in place, merge two sorted arrays, partition.

**Repo:** `prep/algo/drills/02-two-pointers.ts`

---

## 3. Sliding window

**TELL** — "contiguous" + "longest / shortest / maximum / at most K".

**WHEN** — the window's summary can be updated incrementally as it moves, so you
never recompute from scratch. **If the problem is not contiguous, this is the
wrong pattern.**

```ts
// FIXED SIZE k
let sum = 0;
for (let i = 0; i < k; i += 1) sum += nums[i]!;
let best = sum;
for (let r = k; r < nums.length; r += 1) {
  sum += nums[r]! - nums[r - k]!;                 // add entering, drop leaving
  best = Math.max(best, sum);
}

// VARIABLE SIZE — the template worth memorising
let left = 0;
for (let right = 0; right < n; right += 1) {
  add(right);                                     // grow
  while (invalid()) { remove(left); left += 1; }  // shrink — `while`, not `if`
  best = Math.max(best, right - left + 1);
}
```

**COST** — O(n) time. **Say the amortised argument**: `left` and `right` each
advance at most n times over the whole run, so the nested loop is still linear.

**VARIATIONS** — longest without repeats, at most K distinct, minimum window
containing all of T, fixed-window average, count of anagram positions.

**WATCH** — with negative numbers, "shrink while still valid" breaks, because
removing an element can *increase* the sum. Then you need prefix sums instead.

**Repo:** `prep/algo/drills/03-sliding-window.ts`

---

## 4. Prefix sum / running aggregate

**TELL** — "sum between index i and j", "running total", "average so far",
"how many subarrays sum to K", or the same range queried repeatedly.

**WHEN** — you need range aggregates and the array does not change between
queries. Build once in O(n), then answer each query in O(1).

```ts
// Build: prefix[i] = sum of the first i elements
const prefix = new Array<number>(nums.length + 1).fill(0);
for (let i = 0; i < nums.length; i += 1) prefix[i + 1] = prefix[i]! + nums[i]!;

// Query [i, j] inclusive, in O(1)
const rangeSum = prefix[j + 1]! - prefix[i]!;

// "Subarrays summing to K" — prefix sum PLUS a hash map
const seen = new Map<number, number>([[0, 1]]);   // empty prefix seen once
let running = 0, count = 0;
for (const x of nums) {
  running += x;
  count += seen.get(running - k) ?? 0;            // a previous prefix completes it
  seen.set(running, (seen.get(running) ?? 0) + 1);
}
```

**COST** — O(n) to build, O(1) per query, O(n) space.

**THE KEY IDENTITY** — `sum(i..j) = prefix[j+1] - prefix[i]`. Everything in this
family is that one line rearranged. For "how many subarrays sum to K", rearrange
to `prefix[i] = prefix[j+1] - k` and look it up in a map.

**VARIATIONS** — 2D prefix sum (rectangle sums, inclusion–exclusion), prefix XOR
(same trick, XOR instead of +), **difference array** (range *updates* in O(1),
then one pass to materialise), running max/min, prefix products.

**WHY IT BEATS SLIDING WINDOW SOMETIMES** — sliding window needs monotonicity
(usually "all positive"). Prefix sum plus a hash map does not, which is why it is
the tool for arrays containing negatives.

**Repo:** `prep/patterns/drills/01-prefix-sum.ts`

---

## 5. Binary search

**TELL** — sorted input, or "O(log n) required", or **"minimum/maximum X such
that some condition holds"**.

**WHEN** — the search space is ordered, *or* you can write a predicate
`isOk(x)` that is monotonic: `false, false, …, false, true, true, …`.

```ts
// ON A SORTED ARRAY — inclusive bounds [lo, hi]
let lo = 0, hi = n - 1;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid]! < target) lo = mid + 1; else hi = mid - 1;
}
return -1;

// ON THE ANSWER SPACE — the higher-value variant
let lo = minPossible, hi = maxPossible, answer = hi;
while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  if (isOk(mid)) { answer = mid; hi = mid - 1; }   // feasible: try smaller
  else lo = mid + 1;
}
return answer;
```

**COST** — O(log n), or O(n log range) when each `isOk` is an O(n) scan.

**THE DISCIPLINE** — say your interval convention out loud before writing:
"inclusive bounds, so `while (lo <= hi)` and `hi = mid - 1`." Mixing conventions
is where every off-by-one comes from.

**VARIATIONS** — first/last occurrence (on a match, keep searching that side),
rotated array, search in a 2D matrix, **binary search the answer** (minimum
eating speed, ship capacity in D days, smallest divisor, split array largest
sum).

**Repo:** `prep/algo/drills/04-binary-search.ts`

---

## 6. Sorting + greedy (intervals)

**TELL** — "intervals", "meetings", "schedule", "merge", "overlap", "minimum
number of X to cover Y".

**WHEN** — sorting collapses a pairwise O(n²) comparison into a single pass,
because after sorting only *adjacent* items can interact.

```ts
// MERGE OVERLAPPING
const sorted = [...intervals].sort((a, b) => a[0] - b[0]);   // by START
const out = [sorted[0]!];
for (const [s, e] of sorted.slice(1)) {
  const open = out[out.length - 1]!;
  if (s <= open[1]) open[1] = Math.max(open[1], e);          // max(), not e
  else out.push([s, e]);
}

// GREEDY SELECTION — most non-overlapping intervals: sort by END
const byEnd = [...intervals].sort((a, b) => a[1] - b[1]);
let count = 0, lastEnd = -Infinity;
for (const [s, e] of byEnd) if (s >= lastEnd) { count += 1; lastEnd = e; }
```

**COST** — O(n log n), dominated by the sort.

**SORT BY START OR BY END?** This is the decision the pattern turns on:
- **by START** → merging, or asking "do these overlap"
- **by END** → greedy "how many can I fit" / "how few to remove" (taking the
  earliest-ending item always leaves the most room; that is the exchange argument)

**WATCH** — `Math.max(open[1], e)`, never `e`. A fully-contained interval like
`[1,10]` then `[2,3]` would otherwise shrink the end to 3.

**Repo:** `prep/algo/drills/06-sorting-intervals.ts`

---

## 7. BFS and DFS (graphs and grids)

**TELL** — grid, maze, network, dependencies, "connected", "reachable",
"shortest path", "how many islands/regions".

**WHEN** — the data is a graph, even when it is not presented as one. **Say the
translation out loud**: "each cell is a node, adjacent cells are edges."

```ts
const DIRS: Array<[number, number]> = [[-1,0],[1,0],[0,-1],[0,1]];

// BFS — shortest path in an UNWEIGHTED graph
const queue: Array<[number, number, number]> = [[r0, c0, 0]];
const visited = /* rows × cols of false */;
visited[r0]![c0] = true;                       // mark on ENQUEUE, not dequeue
let head = 0;                                  // index queue: shift() is O(n)
while (head < queue.length) {
  const [r, c, d] = queue[head]!; head += 1;
  if (isTarget(r, c)) return d;
  for (const [dr, dc] of DIRS) { /* bounds, visited, push */ }
}

// DFS — connectivity / flood fill. Use an EXPLICIT STACK on big grids:
// recursion depth is O(rows × cols) and will overflow.
const stack: Array<[number, number]> = [[r0, c0]];
while (stack.length > 0) { const [r, c] = stack.pop()!; /* … */ }
```

**COST** — O(V + E). For a grid: O(rows × cols).

**BFS OR DFS?** If the question says **shortest** and edges are unweighted, it is
BFS — the first time BFS reaches a node it has done so by a shortest path. DFS
finds *a* path, not the shortest. Getting this backwards is a large miss.

**VARIATIONS** — number of islands, flood fill, shortest path in a maze, level
order on a tree, word ladder, rotting oranges (multi-source BFS: seed the queue
with *all* starts), bipartite check (BFS with 2-colouring).

**Repo:** `prep/algo/drills/09-graphs.ts`, `prep/algo/drills/08-trees.ts`

---

# TIER 2 — very common, and the ones that separate candidates

## 8. Cyclic sort

**TELL** — the array contains **n numbers from 1..n** (or 0..n-1), and the
question is about a missing number, a duplicate, or several of each.

**WHEN** — the values *are* indices in disguise. That is the whole insight: if
every value belongs at a known slot, you can place them all in O(n) with O(1)
space, and whatever is out of place afterwards is the answer.

```ts
// Place every value at its home index: value v belongs at index v - 1
let i = 0;
while (i < nums.length) {
  const home = nums[i]! - 1;                       // use nums[i] for 0..n-1
  if (nums[i]! !== nums[home]!) {                  // compare VALUES, not indices
    [nums[i], nums[home]] = [nums[home]!, nums[i]!];  // swap, do NOT advance
  } else {
    i += 1;                                        // in place (or a duplicate)
  }
}

// Now scan: the first index where nums[i] !== i + 1 is the answer
for (let j = 0; j < nums.length; j += 1) if (nums[j] !== j + 1) return j + 1;
```

**COST** — O(n) time, O(1) space. It looks quadratic because of the `while` with
no unconditional increment, but **each swap puts one value permanently home**, so
there are at most n swaps in total. Say that amortised argument.

**THE BUG** — comparing `nums[i] !== home` (indices) instead of
`nums[i] !== nums[home]` (values). With duplicates the index version loops
forever. This single line is why the pattern is worth practising.

**VARIATIONS** — missing number, find the duplicate, find all duplicates, find
all missing numbers, first missing positive (the hard one: ignore out-of-range
values), set mismatch.

**ALTERNATIVES worth naming** — XOR (missing number only, O(1) space), a Set
(O(n) space), Gauss's sum formula `n(n+1)/2` (overflows for large n and cannot
find duplicates). Cyclic sort is the one that generalises.

**Repo:** `prep/patterns/drills/02-cyclic-sort.ts`

---

## 9. Fast & slow pointers (Floyd's)

**TELL** — a linked list, plus "cycle", "middle", "nth from the end", "does it
terminate"; or a number sequence that might loop.

**WHEN** — you need a positional relationship in a structure you can only walk
forwards, without extra space.

```ts
// CYCLE DETECTION
let slow = head, fast = head;
while (fast !== null && fast.next !== null) {
  slow = slow!.next;
  fast = fast.next.next;
  if (slow === fast) return true;      // they can only meet inside a loop
}
return false;

// MIDDLE — when fast hits the end, slow is halfway
// NTH FROM END — advance fast n steps first, then move both together
```

**COST** — O(n) time, O(1) space. The O(n)-space answer (a Set of visited nodes)
is correct but the point of the problem is avoiding it.

**WHY THEY MEET** — inside a cycle the fast pointer gains one position per step
on the slow one, so the gap shrinks by exactly one each iteration and must reach
zero. It cannot jump over: the gap is an integer decreasing by one.

**FINDING THE CYCLE START** (the follow-up) — after they meet, reset one pointer
to the head and advance both one step at a time; they meet at the entry. Worth
memorising the *fact* even if the proof is not at your fingertips.

**VARIATIONS** — linked list cycle + entry point, middle node, palindrome linked
list (find middle, reverse second half, compare), happy number (the "sequence"
version), reorder list.

**Repo:** `prep/patterns/drills/03-fast-slow-pointers.ts`

---

## 10. Monotonic stack / deque

**TELL** — "next greater element", "previous smaller", "how many days until",
"largest rectangle", "maximum of every window of size k".

**WHEN** — an element's answer depends on the nearest element that beats it. The
stack holds items *still waiting for their answer*, kept in sorted order.

```ts
// MONOTONIC STACK — next greater. Stack holds INDICES, values decreasing.
const answer = new Array<number>(n).fill(0);
const waiting: number[] = [];
for (let i = 0; i < n; i += 1) {
  while (waiting.length > 0 && nums[i]! > nums[waiting[waiting.length - 1]!]!) {
    const j = waiting.pop()!;
    answer[j] = i - j;                  // i is j's answer
  }
  waiting.push(i);
}

// MONOTONIC DEQUE — maximum of every window of size k.
// Front holds the window max; values decrease towards the back.
const deque: number[] = [];             // indices
for (let i = 0; i < n; i += 1) {
  while (deque.length && deque[0]! <= i - k) deque.shift();          // expired
  while (deque.length && nums[deque[deque.length - 1]!]! <= nums[i]!) deque.pop();
  deque.push(i);
  if (i >= k - 1) out.push(nums[deque[0]!]!);
}
```

**COST** — O(n) time despite the nested `while`: every index is pushed once and
popped at most once, so total work is bounded by 2n. **This amortised argument is
the reason the problem is asked** — lead with it.

**VARIATIONS** — daily temperatures, next greater element I/II (circular: loop
twice mod n), largest rectangle in a histogram, trapping rain water, sliding
window maximum, stock span.

**Repo:** `prep/algo/drills/05-stack-queue.ts`, `prep/patterns/drills/04-monotonic-deque.ts`

---

## 11. Heap / top-K / two heaps

**TELL** — "k largest / smallest / most frequent", "merge k sorted", "median of
a stream", "schedule by priority".

**WHEN** — you repeatedly need the extreme of a *changing* set. Sorting gives you
that once; a heap gives it to you continuously.

```ts
// TOP-K: a MIN-heap of size k for the k LARGEST (the bit people invert)
for (const x of nums) { heap.push(x); if (heap.size > k) heap.pop(); }
return heap.peek();          // the kth largest

// TWO HEAPS for a running median:
//   maxHeap holds the smaller half, minHeap the larger half
//   keep sizes within 1; median is a top, or the mean of both tops
```

**COST** — O(n log k) for top-K, better than sorting's O(n log n) when k ≪ n.
Push/pop O(log n), peek O(1).

**JAVASCRIPT HAS NO BUILT-IN HEAP.** Say so, then give the three options: write
one (~30 lines), sort instead (usually fine at interview scale), or sidestep it
— **bucket sort by frequency is O(n) and beats the heap** for top-K-frequent.

**VARIATIONS** — kth largest, top k frequent, merge k sorted lists, median from a
data stream, task scheduler, meeting rooms II (min-heap of end times), k closest
points.

**Repo:** `prep/algo/drills/10-heaps-topk.ts`

---

## 12. Backtracking

**TELL** — "all combinations", "all permutations", "every subset", "generate all
valid…", "N-queens", "word search".

**WHEN** — you must enumerate a search space, pruning branches that cannot work.
The output is exponential, and that is expected.

```ts
function backtrack(path: T[], start: number): void {
  if (isComplete(path)) { results.push([...path]); return; }   // COPY
  for (let i = start; i < choices.length; i += 1) {
    if (!isValid(choices[i]!)) continue;       // prune
    path.push(choices[i]!);                    // choose
    backtrack(path, i + 1);                    // explore (i, not i+1, if reusable)
    path.pop();                                // UNCHOOSE
  }
}
```

**COST** — subsets O(n · 2ⁿ), permutations O(n · n!). Exponential is the correct
answer; do not pretend otherwise.

**THE TWO BUGS** — `results.push(path)` without the spread (you stored a
reference to an array you keep mutating), and forgetting `path.pop()`.

**THE `start` PARAMETER** is how you avoid duplicate combinations: never look
backwards, so each combination is reachable by exactly one path. Pass `i` to
allow reuse, `i + 1` to forbid it. One character, completely different problem.

**Repo:** `prep/algo/drills/07-recursion-backtracking.ts`

---

## 13. Dynamic programming

**TELL** — "how many ways", "minimum/maximum cost to reach", "can you make",
"longest subsequence" — plus subproblems that repeat.

**WHEN** — the same subproblem is solved more than once by naive recursion.
If subproblems do **not** overlap, it is plain recursion or greedy, not DP.

```ts
// Answer the four questions OUT LOUD before coding:
//   1. STATE      — what does dp[i] mean, in one sentence?
//   2. RECURRENCE — how does dp[i] depend on earlier entries?
//   3. BASE CASE  — what is dp[0]?
//   4. ORDER      — which order fills the table so dependencies are ready?

const dp = new Array<number>(n + 1).fill(Infinity);
dp[0] = 0;
for (let i = 1; i <= n; i += 1)
  for (const step of options)
    if (step <= i && dp[i - step]! !== Infinity)
      dp[i] = Math.min(dp[i]!, dp[i - step]! + 1);
```

**COST** — usually O(states × transitions).

**SPACE OPTIMISATION** — if `dp[i]` only reads `dp[i-1]` and `dp[i-2]`, two
variables replace the array and you drop to O(1). Show this ladder: exponential →
memoised → tabulated → rolling variables.

**GREEDY vs DP** — greedy commits and never reconsiders; it is correct only with
the greedy-choice property. **The counterexample to memorise**: coins [1,3,4] and
amount 6 — greedy takes 4+1+1 (three coins), the optimum is 3+3 (two).

**VARIATIONS** — climbing stairs, house robber, coin change, longest increasing
subsequence (O(n log n) with patience sorting), edit distance, 0/1 knapsack,
unique paths.

**Repo:** `prep/algo/drills/11-dynamic-programming.ts`

---

## 14. Topological sort

**TELL** — "prerequisites", "dependencies", "build order", "can all tasks be
finished", "course schedule".

**WHEN** — a directed graph, and you need a linear order respecting the edges —
or just to know whether one exists (i.e. whether there is a cycle).

```ts
// KAHN'S ALGORITHM (BFS). Also detects cycles, and yields the order for free.
const inDegree = new Array<number>(n).fill(0);
const unlocks: number[][] = Array.from({ length: n }, () => []);
for (const [after, before] of edges) { unlocks[before]!.push(after); inDegree[after]! += 1; }

const queue = [...inDegree.keys()].filter((i) => inDegree[i] === 0);
const order: number[] = [];
for (let head = 0; head < queue.length; head += 1) {
  const node = queue[head]!;
  order.push(node);
  for (const next of unlocks[node]!) if (--inDegree[next]! === 0) queue.push(next);
}
return order.length === n ? order : null;      // short order ⇒ a cycle remains
```

**COST** — O(V + E).

**"CAN I FINISH EVERYTHING" IS "IS THIS GRAPH ACYCLIC"** — say the translation.

**THE DFS ALTERNATIVE NEEDS THREE STATES**, not two: unvisited / in-progress /
done. Hitting an *in-progress* node is a back edge, so a cycle; hitting a *done*
node is fine (a diamond, not a cycle). A plain two-state `visited` set reports
false cycles on any diamond — the classic bug.

**Repo:** `prep/algo/drills/09-graphs.ts`

---

# TIER 3 — appear regularly; know the tell even if you're rusty on the code

## 15. Union-Find (disjoint set union)

**TELL** — "are these two connected", "number of groups", "redundant
connection", many merge-and-query operations, edges arriving over time.

**WHEN** — connectivity questions where the graph **changes**. BFS/DFS answers
"what is connected" once, in O(V + E). Union-Find answers it repeatedly, in
near-O(1) per operation, and handles edges arriving one at a time.

```ts
class UnionFind {
  private parent: number[];
  private rank: number[];
  count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);   // everyone their own root
    this.rank = new Array<number>(n).fill(0);
    this.count = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]!);  // path compression
    return this.parent[x]!;
  }

  union(a: number, b: number): boolean {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;                 // already together ⇒ this edge makes a cycle
    if (this.rank[ra]! < this.rank[rb]!) this.parent[ra] = rb;
    else { this.parent[rb] = ra; if (this.rank[ra] === this.rank[rb]) this.rank[ra]! += 1; }
    this.count -= 1;
    return true;
  }
}
```

**COST** — with path compression *and* union by rank, effectively O(α(n)) per
operation, where α is the inverse Ackermann function and is under 5 for any
input that fits in the universe. Say "effectively constant".

**`union` RETURNING false IS THE CYCLE DETECTOR** — if both endpoints already
share a root, this edge closes a cycle. That single fact solves redundant
connection, "is this a valid tree", and Kruskal's MST.

**VARIATIONS** — number of provinces/connected components, redundant connection,
accounts merge, number of islands (as an alternative to flood fill), Kruskal's
minimum spanning tree.

**Repo:** `prep/patterns/drills/05-union-find.ts`

---

## 16. Bit manipulation

**TELL** — "every element appears twice except one", "without using extra
space", "count the set bits", "subsets of a small set", "swap without a temp".

**WHEN** — XOR's algebra does the work for you: `x ^ x = 0`, `x ^ 0 = x`, and it
is commutative and associative. So XOR-ing everything cancels all the pairs.

```ts
// SINGLE NUMBER — everything paired except one
let single = 0;
for (const x of nums) single ^= x;               // pairs cancel to 0

// THE OPERATIONS WORTH KNOWING
x & 1                     // is odd
x >> 1                    // integer divide by 2 (non-negative)
x & (x - 1)               // clear the lowest set bit  ⇒ Brian Kernighan popcount
x & -x                    // isolate the lowest set bit
x ^ y                     // differing bits
1 << i                    // bit i as a mask
(x >> i) & 1              // read bit i

// ENUMERATE ALL SUBSETS of an n-element set (n ≤ ~20)
for (let mask = 0; mask < (1 << n); mask += 1)
  for (let i = 0; i < n; i += 1) if (mask & (1 << i)) { /* item i is in */ }
```

**COST** — O(n) for a pass, O(1) space. Popcount via `x & (x - 1)` runs once per
*set* bit rather than per bit.

**JAVASCRIPT CAVEAT, worth saying** — bitwise operators coerce to **32-bit
signed** integers. `1 << 31` is negative, and anything above 2³¹ silently breaks.
Use `BigInt` beyond that, and note that `>>>` is the unsigned right shift.

**VARIATIONS** — single number (I: XOR; II: bit counts mod 3; III: split by a
differing bit), counting bits, power of two (`x > 0 && (x & (x - 1)) === 0`),
missing number, subset enumeration, bitmask DP.

**Repo:** `prep/patterns/drills/06-bit-manipulation.ts`

---

## 17. Trie (prefix tree)

**TELL** — "prefix", "autocomplete", "dictionary", "word search on a board",
"does any word start with", many lookups over a fixed word set.

**WHEN** — repeated prefix queries. A hash set answers "is this a word" in O(1),
but cannot answer "does *any* word start with this" without scanning everything.

```ts
interface TrieNode { children: Map<string, TrieNode>; isWord: boolean }
const makeNode = (): TrieNode => ({ children: new Map(), isWord: false });

function insert(root: TrieNode, word: string): void {
  let node = root;
  for (const ch of word) {
    if (!node.children.has(ch)) node.children.set(ch, makeNode());
    node = node.children.get(ch)!;
  }
  node.isWord = true;                    // mark the END, not just the path
}
```

**COST** — insert and search O(L) in the word length, independent of how many
words are stored. Space O(total characters), which is the trade.

**THE `isWord` FLAG IS THE WHOLE POINT** — without it you cannot distinguish a
stored word from a prefix of one. "app" vs "apple" is the test case.

**VARIATIONS** — implement trie, word search II (trie + DFS on a grid — the
classic hard combination), longest common prefix, autocomplete, replace words,
design add-and-search with `.` wildcards.

**Repo:** `prep/patterns/drills/08-trie.ts`

---

## 18. In-place linked list reversal

**TELL** — "reverse the list", "reverse between positions m and n", "reorder",
"swap pairs", "O(1) space".

**WHEN** — you must rewire pointers rather than build a new list.

```ts
let prev: Node | null = null;
let curr: Node | null = head;
while (curr !== null) {
  const next = curr.next;      // 1. SAVE — or you lose the rest of the list
  curr.next = prev;            // 2. REVERSE
  prev = curr;                 // 3. ADVANCE prev
  curr = next;                 // 4. ADVANCE curr
}
return prev;                   // prev is the new head
```

**COST** — O(n) time, O(1) space.

**THE ORDER OF THOSE FOUR LINES IS THE PROBLEM.** Reverse before saving `next`
and you have severed the list. Write them in that order every time; it is
muscle memory, not cleverness.

**THE DUMMY-HEAD TRICK** — for any problem that might remove or replace the head
(remove nth from end, remove duplicates, partition), allocate
`const dummy = { next: head }` and work from there. It removes every
"what if it's the first node" special case, and mentioning why you did it is a
good signal.

**VARIATIONS** — reverse a list, reverse between m and n, reverse in groups of k,
swap pairs, palindrome list (middle + reverse + compare), reorder list.

**Repo:** `prep/patterns/drills/03-fast-slow-pointers.ts` (shares the node type)

---

## 19. Matrix traversal

**TELL** — "spiral order", "rotate the image", "transpose", "set matrix zeroes",
"in place" on a 2D grid.

**WHEN** — the answer is an index-manipulation exercise. These problems are not
about algorithms; they are about not making an off-by-one error under pressure.

```ts
// ROTATE 90° CLOCKWISE, IN PLACE = transpose, then reverse each row
for (let r = 0; r < n; r += 1)
  for (let c = r + 1; c < n; c += 1)              // c = r + 1, or you undo it
    [m[r]![c], m[c]![r]] = [m[c]![r]!, m[r]![c]!];
for (const row of m) row.reverse();

// SPIRAL — four moving boundaries
let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
while (top <= bottom && left <= right) {
  for (let c = left; c <= right; c += 1) out.push(m[top]![c]!);      top += 1;
  for (let r = top; r <= bottom; r += 1) out.push(m[r]![right]!);    right -= 1;
  if (top <= bottom) { for (let c = right; c >= left; c -= 1) out.push(m[bottom]![c]!); bottom -= 1; }
  if (left <= right) { for (let r = bottom; r >= top; r -= 1) out.push(m[r]![left]!);   left += 1; }
}
```

**COST** — O(rows × cols) time, O(1) extra space when done in place.

**THE TWO GUARDS IN THE SPIRAL** (`if (top <= bottom)`, `if (left <= right)`)
exist for non-square matrices — a single leftover row or column would otherwise
be emitted twice. That is the bug this problem is built to catch.

**DECLARING A GRID** — `Array.from({length: r}, () => new Array(c).fill(0))`.
Never `new Array(r).fill(new Array(c))`: every row would be the *same* array
reference, and writing one cell writes a whole column. A genuine, common bug.

**Repo:** `prep/patterns/drills/07-matrix-traversal.ts`

---

## 20. Line sweep / event-based

**TELL** — "maximum concurrent", "at any point in time", "how many rooms",
"busiest interval", "when do we exceed capacity".

**WHEN** — intervals, but you care about a *running count* rather than the
intervals themselves. Decouple starts from ends: you do not care *which* meeting
ends, only that one does.

```ts
// As two sorted lists
const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
const ends   = intervals.map((i) => i[1]).sort((a, b) => a - b);
let active = 0, peak = 0, e = 0;
for (const s of starts) {
  while (e < ends.length && ends[e]! <= s) { active -= 1; e += 1; }   // `<=`: touching frees
  active += 1;
  peak = Math.max(peak, active);
}

// Or as +1/-1 events — generalises to weights and to "when" questions
const events: Array<[number, number]> = [];
for (const [s, e2] of intervals) { events.push([s, +1]); events.push([e2, -1]); }
events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // -1 before +1 at a tie
```

**COST** — O(n log n) for the sort, O(n) sweep.

**THE TIE RULE IS A SPEC QUESTION** — does a meeting ending at 5 conflict with
one starting at 5? Usually no, so process `-1` before `+1`. Ask.

**VARIATIONS** — meeting rooms II, car pooling, my calendar, skyline (harder:
needs a heap), maximum population year, employee free time.

**Repo:** `prep/algo/drills/06-sorting-intervals.ts`

---

## 21. Divide and conquer

**TELL** — "merge", "sort", "count inversions", "closest pair", or an O(n log n)
target that is not achievable by sorting alone.

**WHEN** — the problem splits into independent halves whose answers combine
cheaply. If the halves interact, it is DP, not divide and conquer.

```ts
function solve(lo: number, hi: number): T {
  if (hi - lo <= 1) return base;
  const mid = (lo + hi) >> 1;
  const left = solve(lo, mid);
  const right = solve(mid, hi);
  return combine(left, right);          // the interesting part lives here
}
```

**COST** — usually O(n log n): log n levels of recursion, O(n) work per level.
The Master Theorem formalises it; naming it is enough.

**VARIATIONS** — merge sort, count inversions (merge sort with a counter),
quickselect, majority element, maximum subarray (though Kadane's O(n) DP is
better), closest pair of points.

---

## 22. Greedy (without sorting)

**TELL** — "minimum number of steps", "can you reach", "maximum profit", and a
locally-obvious choice that turns out to be globally safe.

**WHEN** — you can argue the **exchange argument**: any optimal solution can be
transformed into one that makes your greedy choice, without getting worse.
If you cannot make that argument, it is probably DP.

```ts
// JUMP GAME — track the furthest reachable index
let furthest = 0;
for (let i = 0; i < nums.length; i += 1) {
  if (i > furthest) return false;                 // stranded
  furthest = Math.max(furthest, i + nums[i]!);
}
return true;

// KADANE'S — maximum subarray. Greedy: drop the prefix the moment it hurts.
let best = nums[0]!, running = nums[0]!;
for (let i = 1; i < nums.length; i += 1) {
  running = Math.max(nums[i]!, running + nums[i]!);
  best = Math.max(best, running);
}
```

**COST** — usually O(n), or O(n log n) if a sort is needed first.

**THE HONEST WARNING** — greedy is the pattern most often applied wrongly.
Before committing, try to *break* it with a small counterexample. If you cannot
find one in thirty seconds, say "I believe greedy is safe here because <exchange
argument>" and proceed. If you can, it is DP.

**VARIATIONS** — jump game I/II, gas station, maximum subarray (Kadane),
assign cookies, partition labels, best time to buy and sell stock.

---

# How patterns stack

Real problems combine two. Recognising the *pair* is the senior move:

| Problem | Stack |
| --- | --- |
| Longest substring with at most K distinct | sliding window **+** hash map |
| Subarray sum equals K (with negatives) | prefix sum **+** hash map |
| Top K frequent elements | hash map **+** bucket sort (or heap) |
| Sliding window maximum | sliding window **+** monotonic deque |
| Word search II | trie **+** DFS backtracking |
| Meeting rooms II | sorting **+** line sweep (or heap) |
| Course schedule II | graph **+** topological sort |
| Median from a data stream | two heaps **+** streaming |
| Merge k sorted lists | heap **+** k-way merge |
| Kth largest in a stream | heap **+** streaming |
| Number of islands (dynamic) | union-find **+** grid indexing |
| Palindrome linked list | fast/slow **+** in-place reversal |

When you spot a stack, say it: *"This is a sliding window, but the window's
summary needs a max, and recomputing that is O(k) — so the window carries a
monotonic deque."* That sentence is worth more than the implementation.
