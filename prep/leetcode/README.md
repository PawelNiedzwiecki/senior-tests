# LeetCode patterns — two problems each

**Twenty-two patterns. Two problems per pattern. Forty-four problems.**

Every module opens with the pattern itself — the tell, the structural condition
that makes it valid, the template, the cost, and the sentence worth saying out
loud in an interview — and only then gives you the two problems, each with its
own explanation, worked examples, target complexity and hints.

The stubs throw until you implement them. The solutions are written out with the
reasoning an interviewer is actually listening for, not just working code.

```bash
npm run drills -- leetcode              # every module in this folder
npm run drills -- 03-sliding-window     # one module
npm run drills:watch                    # re-run on save — the one you want
SOLUTIONS=1 npm run drills -- leetcode  # the same tests against the solutions
```

---

## How to work a module

1. **Read the header block.** Five minutes. It is the pattern, not the problem —
   the same twenty lines apply to every variant an interviewer can throw at you.
2. **Read problem 1 and say the approach out loud before writing anything.**
   If you cannot name the pattern and the complexity in two sentences, reread
   the header rather than starting to type.
3. **Implement it.** The test file is the specification; run it on save.
4. **Only then open the solution** — and read the prose, not the code. The code
   is ten lines you could have written; the commentary is why those ten lines
   and not the other ten.
5. **Do problem 2 the same day.** One problem teaches you a trick; two teach you
   the pattern. The second is chosen to hit the same idea from a different
   angle, which is what makes it transfer.

---

## The twenty-two modules

Tiered by how often they actually turn up.

### Tier 1 — you will almost certainly see one of these

| Module | Problems | LeetCode |
| --- | --- | --- |
| `01-hash-map` | longest consecutive sequence · LRU cache | 128, 146 |
| `02-two-pointers` | 3Sum · valid palindrome with one deletion | 15, 680 |
| `03-sliding-window` | minimum window substring · longest repeating character replacement | 76, 424 |
| `04-prefix-sum` | contiguous array (equal 0s and 1s) · 2D range sum | 525, 304 |
| `05-binary-search` | minimum in a rotated array · kth smallest in a sorted matrix | 153, 378 |
| `06-intervals` | non-overlapping intervals · insert interval | 435, 57 |
| `07-bfs-dfs` | rotting oranges · clone graph | 994, 133 |

### Tier 2 — very common, and where candidates separate

| Module | Problems | LeetCode |
| --- | --- | --- |
| `08-cyclic-sort` | numbers disappeared · all duplicates | 448, 442 |
| `09-fast-slow-pointers` | find the duplicate number · palindrome linked list | 287, 234 |
| `10-monotonic-stack` | trapping rain water · sum of subarray minimums | 42, 907 |
| `11-heap-top-k` | median from a data stream · merge k sorted lists | 295, 23 |
| `12-backtracking` | word search · N-Queens | 79, 51 |
| `13-dynamic-programming` | longest increasing subsequence · longest common subsequence | 300, 1143 |
| `14-topological-sort` | course schedule II · alien dictionary | 210, 269 |

### Tier 3 — appear regularly; know the tell even if the code is rusty

| Module | Problems | LeetCode |
| --- | --- | --- |
| `15-union-find` | equality equations · accounts merge | 990, 721 |
| `16-bit-manipulation` | single number III · bitwise AND of a range | 260, 201 |
| `17-trie` | replace words · maximum XOR of two numbers | 648, 421 |
| `18-linked-list-reversal` | reverse a sublist · reverse nodes in k-group | 92, 25 |
| `19-matrix-traversal` | search a 2D matrix II · game of life | 240, 289 |
| `20-line-sweep` | corporate flight bookings · the skyline problem | 1109, 218 |
| `21-divide-and-conquer` | sort an array · count of smaller numbers after self | 912, 315 |
| `22-greedy` | jump game II · gas station | 45, 134 |

---

## A six-day route through it

Four modules a day is roughly three hours. If you have less time, do Tier 1 and
stop — it covers most of what actually gets asked.

| Day | Modules | Why together |
| --- | --- | --- |
| 1 | 01, 02, 03, 04 | The array core. 03 and 04 are the pair most often confused: windows need monotonicity, prefix sums do not. |
| 2 | 05, 06, 20 | Everything that starts with "sort it first", plus binary search on the answer. |
| 3 | 07, 14, 15 | Graphs, three ways: traversal, ordering, connectivity. |
| 4 | 08, 09, 18, 19 | Index and pointer discipline. Low glamour, high frequency. |
| 5 | 10, 11, 21 | Structures that answer "what is the extreme right now". |
| 6 | 12, 13, 16, 17, 22 | Search and optimisation, and the two structures that look exotic until you need them. |

Then reread only the header blocks — all twenty-two in about forty minutes. That
pass is the one that makes recognition automatic.

---

## What to say, not just what to write

Every module's header ends with a sentence worth memorising, because in a real
interview the first two minutes decide how the rest goes. The pattern is these:

> "Contiguous subarray, longest, at most K distinct — sliding window with a hash
> map for the window state. O(n) time, O(k) space."

Name the pattern, name the cost, then start coding. Silence while you think is
much more expensive than a wrong first guess you correct out loud.

Five habits that are worth more than any single problem here:

1. **State the brute force first**, with its complexity, then improve it. The
   ladder is the interview; jumping to the clever answer skips the part being
   assessed.
2. **Say the validity argument.** "Each element enters and leaves the stack once,
   so it's O(n) amortised." "Feasibility is monotonic in the answer, so I can
   binary search it." These sentences are what distinguish recall from
   understanding.
3. **Ask about the constraints that change the answer** — duplicates, negatives,
   empty input, whether you may mutate the input.
4. **Flag your side effects.** "I'm mutating your array; here's how I'd undo it"
   costs five seconds and reads as experience.
5. **Name what you would do differently in production**, briefly. A stable sort,
   a Fenwick tree once updates interleave with queries, a bucket sort when k is
   large.

---

## Where this sits

| Folder | Purpose |
| --- | --- |
| **`prep/leetcode/`** | *This folder.* Two problems per pattern, with the pattern explained first. Practice. |
| [`prep/patterns/`](../patterns/README.md) | Recognition: the 22-pattern catalogue and a 60-problem "name the pattern" quiz. Read the catalogue, take the quiz, then come here. |
| [`prep/algo/`](../algo/README.md) | The Live Coding 1 kit: 12 modules, the HackerRank harness, complexity reference, playbook, timed mocks. |
| [`prep/`](../README.md) | The frontend TypeScript round. |

The three algorithm folders overlap deliberately and differ in what they train:
`patterns/` trains *naming* the pattern, this folder trains *writing* it twice,
and `algo/` trains working under the constraints of a timed HackerRank round.
