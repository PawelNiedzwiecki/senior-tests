# Recognition quiz — 60 problems, name the pattern

**Do not solve these.** The whole exercise is the first thirty seconds: read the
statement, say the pattern out loud, say the tell that gave it away, move on.
Aim for ten seconds per problem.

Write your answers down before checking. Target: **45/60 on the first pass.**
Anything below that on a round tells you which catalogue section to re-read.

The answer key is at the bottom, after a long gap. Do not scroll into it.

---

## Round 1 — the tells are on the surface (20)

1. A sorted array of integers. Find two numbers that add up to a target.
2. Find the length of the longest substring with no repeating characters.
3. An array holds n integers, each between 1 and n, with one missing. Find it.
4. Merge all overlapping intervals in a list.
5. Return the index of a target in a sorted array. Must be O(log n).
6. Count how many times each word appears in a document.
7. Return the k most frequent elements in an array.
8. Determine whether a singly linked list contains a cycle.
9. A grid of land and water cells. How many islands are there?
10. Given course prerequisites, determine whether all courses can be completed.
11. Generate every subset of a set of distinct integers.
12. Fewest coins needed to make a given amount, with unlimited coins of each value.
13. Return the sum of elements between indices i and j. You will be asked ~10,000 times on the same array.
14. For each day's temperature, how many days until a warmer one?
15. Every number in an array appears twice except one. Find it, using O(1) space.
16. Implement autocomplete over a fixed dictionary of words.
17. Reverse a singly linked list in place.
18. Rotate an n×n matrix 90° clockwise, in place.
19. Given meeting time intervals, how many rooms are needed at the busiest moment?
20. Two user accounts are the same person if they share any email. How many distinct people?

---

## Round 2 — the pattern is disguised (20)

21. A robot at the top-left of an m×n grid can move only right or down. How many distinct paths to the bottom-right?
22. Find the contiguous subarray with the largest sum.
23. You eat bananas at k per hour. Find the smallest integer k that clears all piles within h hours.
24. Find the shortest substring of S containing every character of T.
25. Numbers arrive one at a time. After each, report the median so far.
26. An array of n+1 integers, each between 1 and n. Find any duplicate without modifying the array, in O(1) space.
27. Given a list of airline tickets, reconstruct the full itinerary in order.
28. Find the length of the longest strictly increasing subsequence.
29. A row of houses each containing money. You cannot take from two adjacent houses. Maximise the total.
30. Return an array where each element is the product of every other element. Division is not allowed.
31. Return the values of a binary tree grouped by depth.
32. Determine whether a string of brackets is correctly balanced and nested.
33. Given intervals, find the minimum number to remove so that none overlap.
34. Find the index of the first character in a string that appears exactly once.
35. A grid with obstacles. Find the shortest route from the top-left to the bottom-right.
36. Generate all valid arrangements of n pairs of parentheses.
37. Find the kth smallest element in a matrix whose rows and columns are both sorted.
38. Group a list of words so that anagrams are together.
39. An array of positive integers. Find the shortest contiguous subarray summing to at least a target.
40. Repeatedly replace a number with the sum of the squares of its digits. Does it reach 1?

---

## Round 3 — traps and stacked patterns (20)

41. Count the subarrays that sum to exactly K. The array may contain negative numbers.
42. Longest substring containing at most two distinct characters.
43. Return the maximum of every contiguous window of size k.
44. Given a board of letters and a dictionary, find every dictionary word present on the board.
45. A sorted array was rotated at an unknown pivot. Find a target in O(log n).
46. Numbers arrive in a stream. After each, report the kth largest seen so far.
47. Edges are added to a graph one at a time. After each, report the number of connected components.
48. Determine whether a linked list is a palindrome, using O(1) extra space.
49. Merge k sorted linked lists into one sorted list.
50. Given an elevation map, compute how much rainwater it traps.
51. Find the smallest positive integer missing from an unsorted array. O(n) time, O(1) space.
52. Given each employee's working intervals, find the free time common to everyone.
53. Count the number of inversions in an array (pairs where a larger value precedes a smaller one).
54. Find the longest palindromic substring of a string.
55. Serialise a binary tree to a string and reconstruct it exactly.
56. Given task dependencies, output an order in which all tasks can be completed.
57. Given daily stock prices, find the maximum profit from a single buy and a single later sell.
58. Move all zeroes in an array to the end, in place, preserving the order of the rest.
59. An array holds 1..n with exactly one number duplicated and one missing. Find both.
60. Design a structure supporting insert, delete, and getRandom, all in O(1) average.

---
---
---
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

# Answer key

Each answer gives the **pattern**, the **tell**, and where relevant **the wrong
guess** — because knowing what it *isn't* is half the skill.

## Round 1

1. **Two pointers.** "Sorted" + "find a pair". Converging pointers, O(n) time and O(1) space. *Hash map also works in O(n) but costs O(n) space — mention both and pick two pointers because it exploits the sortedness.*
2. **Sliding window** (+ hash set). "Longest" + "substring" = contiguous + extremum.
3. **Cyclic sort.** "n integers, each between 1 and n" is the giveaway — values are indices. *XOR and the Gauss sum formula also work here, but only cyclic sort generalises to duplicates and to multiple missing values.*
4. **Sort by start + greedy.** "Merge overlapping intervals" is the canonical statement.
5. **Binary search.** "Sorted" + explicit O(log n).
6. **Hash map.** Pure frequency counting.
7. **Heap, or bucket sort.** "k most frequent". *Bucket sort is O(n) and beats the O(n log k) heap, because frequencies are bounded by n — say this.*
8. **Fast & slow pointers.** "Linked list" + "cycle". Floyd's.
9. **DFS or BFS flood fill.** Connected components on an implicit grid graph.
10. **Topological sort.** "Prerequisites" + "can all be completed" = is the directed graph acyclic.
11. **Backtracking.** "Every subset" — enumerate a search space.
12. **Dynamic programming.** "Fewest to make an amount" with overlapping subproblems. *Greedy is the trap: coins [1,3,4] and amount 6 breaks it.*
13. **Prefix sum.** "Range sum" asked repeatedly on an unchanging array. Build once O(n), query O(1).
14. **Monotonic stack.** "How many days until a warmer one" = next greater element.
15. **Bit manipulation (XOR).** "Appears twice except one" + O(1) space. `x ^ x = 0`.
16. **Trie.** "Autocomplete" over a fixed dictionary — prefix queries.
17. **In-place linked list reversal.** Save `next`, reverse, advance, advance.
18. **Matrix traversal.** Transpose, then reverse each row.
19. **Line sweep** (or a min-heap of end times). "How many at the busiest moment" = maximum concurrency.
20. **Union-Find.** "Are these connected through shared X" with merging.

## Round 2

21. **Dynamic programming.** *The trap is BFS — it's a grid, so it looks like pathfinding. But you're asked to COUNT paths, not find one. `dp[r][c] = dp[r-1][c] + dp[r][c-1]`.*
22. **Greedy (Kadane's), which is DP in disguise.** "Contiguous subarray" + "largest sum". Drop the running prefix the moment it goes negative.
23. **Binary search on the answer.** "Smallest k such that…" and feasibility is monotonic in k. *Not a sorted array anywhere — that's why it's disguised.*
24. **Sliding window (variable size).** "Shortest substring containing all of…".
25. **Two heaps.** "Median of a stream" is the canonical two-heaps problem.
26. **Fast & slow pointers.** *The real trap in this quiz.* "Array" suggests sorting or a hash set, but both are ruled out by "without modifying" and "O(1) space". Treat `i → nums[i]` as a linked list: a duplicate value means two indices point to the same place, so the list has a cycle. Floyd's finds it.
27. **DFS on a graph** (Hierholzer's, an Eulerian path). Tickets are edges; you must use each exactly once.
28. **Dynamic programming**, O(n²) — or **binary search** with patience sorting for O(n log n). "Subsequence", not substring, so *not* a sliding window.
29. **Dynamic programming.** "Cannot take two adjacent" → `dp[i] = max(dp[i-1], dp[i-2] + v)`.
30. **Prefix (and suffix) products.** Same identity as prefix sum, with multiplication. *"No division" is there specifically to block the obvious answer.*
31. **BFS.** "Grouped by depth" = level order. Snapshot `queue.length` before each level.
32. **Stack.** Nesting means last-opened-first-closed.
33. **Sort by END + greedy.** *The trap is sorting by start.* Keeping the earliest-ending interval always leaves the most room for the rest — that's the exchange argument.
34. **Hash map**, two passes. Count, then scan for the first count of 1. Two passes is still O(n); don't contort yourself avoiding it.
35. **BFS.** "Shortest route" with unweighted moves. DFS would find *a* route, not the shortest.
36. **Backtracking.** Generate-all, pruning on the invariant (never more `)` than `(`).
37. **Heap**, or **binary search on the value range**. Rows and columns sorted, but the matrix is not globally sorted, so plain binary search on position does not apply.
38. **Hash map with a canonical key.** Sorted letters, or a 26-slot count vector.
39. **Sliding window.** "Shortest contiguous subarray with sum ≥ target" — and "positive integers" is the load-bearing constraint that makes shrinking safe.
40. **Fast & slow pointers.** The digit-square sequence either reaches 1 or cycles. Same cycle detection, no linked list in sight.

## Round 3

41. **Prefix sum + hash map.** *This is the most important trap here.* It looks exactly like a sliding window — "subarrays that sum to K" — but **negatives break the window**: shrinking can increase the sum, so "grow, then shrink while valid" is no longer sound. Running prefix plus a map of previously-seen prefixes is the correct tool.
42. **Sliding window + hash map.** "At most K distinct" is the standard variable window; the map is the window's state, and `map.size` is the distinct count.
43. **Sliding window + monotonic deque.** The window needs a max, and recomputing it is O(k). A deque holding indices in decreasing value order gives O(1) per step, so the whole thing stays O(n).
44. **Trie + DFS backtracking.** The classic stack. A trie prunes the board search the moment the current path stops being any word's prefix.
45. **Binary search, modified.** At any mid, at least one half is properly sorted; test which, then decide which half can contain the target.
46. **Heap** — a min-heap of size k. Root is the kth largest. *A max-heap of size k is the classic inversion.*
47. **Union-Find.** *The trap is DFS.* DFS answers connectivity once, in O(V + E). Here edges arrive over time and you must answer after each — that's what Union-Find is for.
48. **Fast & slow + in-place reversal.** Find the middle with fast/slow, reverse the second half, compare. Two patterns stacked.
49. **Heap** (k-way merge). Push the head of each list, pop the smallest, push its successor.
50. **Two pointers** — or a **monotonic stack**. Both are O(n). Two pointers is O(1) space: at each step the shorter side's max bounds the water, so move that side inwards.
51. **Cyclic sort.** *The variation that catches people:* values outside 1..n exist and must simply be skipped rather than placed. After sorting, the first index where `nums[i] !== i + 1` is the answer.
52. **Line sweep** (or merge all intervals, then look at the gaps). Free time is where the concurrency count is zero.
53. **Divide and conquer** — merge sort with a counter. Every time you take from the right half, it inverts with everything remaining in the left.
54. **Expand around centre** (O(n²), O(1) space), or DP. *Not a sliding window* — the validity condition isn't monotonic as the window grows, so you can't shrink your way to correctness.
55. **DFS**, preorder with explicit null markers. The markers are what make reconstruction unambiguous.
56. **Topological sort.** Same as #10, but returning the order rather than a boolean. Kahn's gives it for free.
57. **Greedy, single pass.** Track the minimum price so far and the best profit so far. *People reach for DP; it's one pass and two variables.*
58. **Two pointers** (compaction: `write` trails `read`). Same shape as remove-duplicates and remove-element.
59. **Cyclic sort.** One duplicate and one missing — after placing everything, the index that's wrong reveals both values at once.
60. **Hash map + array.** A design problem, not an algorithm: the array gives O(1) random access, the map gives O(1) lookup of an element's index, and deletion swaps the target with the last element before popping. *The swap-with-last trick is the whole answer.*

---

## Scoring

| Score | What to do |
| --- | --- |
| 50–60 | Recognition is solid. Spend your remaining time on implementation speed. |
| 40–49 | Good. Re-read the catalogue entries for the ones you missed, then retake in two days. |
| 30–39 | Re-read the whole catalogue, then retake. Focus on Tier 1 and Tier 2. |
| under 30 | Work the drills in `prep/algo/` and `prep/patterns/` first — recognition comes from having written the code at least once. |

**Track which ones you miss, not just how many.** Three misses in the same
pattern means one catalogue section to re-read. Three misses scattered across
different patterns usually means you were rushing.
