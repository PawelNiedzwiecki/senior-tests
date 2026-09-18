/**
 * TIER 1 · PATTERN 01 — Hash map / frequency counting
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 60 min total    Catalogue: ../../patterns/CATALOGUE.md § 1
 *
 * THE PATTERN
 * A hash map buys you O(1) answers to questions about elements you have
 * already walked past. That is the whole idea: instead of looking for a
 * partner by scanning the rest of the array, you record what you have seen on
 * the way in and ask the map.
 *
 * THE TELL
 *   "have I seen it before"  ·  "how many times"  ·  "group these"
 *   "find the pair that sums to"  ·  "are these two things the same shape"
 *
 * WHEN IT IS VALID
 * You catch yourself writing an inner loop that asks a question about OTHER
 * elements. That inner loop is O(n²) about to happen, and a map removes it.
 * There is no ordering requirement and no monotonicity requirement — this is
 * the pattern with the fewest preconditions, which is why it is the most
 * common one.
 *
 * THE THREE SHAPES
 *   COMPLEMENT      value → index, look for `target - x` BEFORE inserting x
 *   COUNTING        value → count, one pass in, one pass over the counts
 *   CANONICAL KEY   derive a key that collides exactly when two items belong
 *                   together ('eat' and 'tea' → 'aet'), then group by it
 *
 * TEMPLATE
 *   const seen = new Map<number, number>();
 *   for (let i = 0; i < nums.length; i += 1) {
 *     const need = target - nums[i]!;
 *     if (seen.has(need)) return [seen.get(need)!, i];   // check BEFORE insert
 *     seen.set(nums[i]!, i);
 *   }
 *
 * COST — O(n) time, O(n) space. You are trading memory for a loop; say that
 * trade out loud, because "O(1) extra space" in the prompt forbids it and
 * points at two pointers (§ 2) instead.
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * "Now do it in O(1) space" (sort first, two pointers), "now the input is a
 * stream" (you cannot sort, so the map is forced), "now return the k most
 * frequent in O(n)" (bucket sort by count, exam 4).
 *
 * THE SENTENCE WORTH SAYING
 *   "I'm asking a question about elements I've already passed, so I'll record
 *    them on the way in. One pass, O(n) time and O(n) space."
 */

/**
 * EXAM 1 — Two sum                                               [LeetCode 1]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the indices of the two numbers that add up to `target`, or null if no
 * pair does. Exactly one pair exists when there is one. The input is NOT
 * sorted.
 *
 *   twoSum([2, 7, 11, 15], 9)  → [0, 1]
 *   twoSum([3, 2, 4], 6)       → [1, 2]
 *   twoSum([3, 3], 6)          → [0, 1]
 *   twoSum([1, 2], 7)          → null
 *
 * TARGET: O(n) time, O(n) space.
 *
 * HINT: one pass, not two. For each x look up `target - x` in the map BEFORE
 *       you insert x — that ordering is what stops an element pairing with
 *       itself, and it is why [3, 3] still works.
 */
export function twoSum(_nums: number[], _target: number): [number, number] | null {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Group anagrams                                       [LeetCode 49]
 * ────────────────────────────────────────────────────────────────────────────
 * Group the words that are anagrams of each other. Groups may come back in any
 * order, and so may the words inside a group.
 *
 *   groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
 *     → [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
 *   groupAnagrams([''])   → [['']]
 *
 * TARGET: O(n · k log k) time with a sorted key, where k is the word length —
 * or O(n · k) with a count key.
 *
 * HINT: this is the CANONICAL KEY shape. You need a key that two words share
 *       exactly when they are anagrams; sorting the letters is the obvious
 *       one. Be ready for the follow-up: with a fixed alphabet you can build a
 *       26-slot count signature instead and drop the log k.
 */
export function groupAnagrams(_words: string[]): string[][] {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Isomorphic strings                                  [LeetCode 205]
 * ────────────────────────────────────────────────────────────────────────────
 * Two strings are isomorphic when the characters of `a` can be replaced to get
 * `b`, with the mapping consistent in both directions: no two characters of
 * `a` may map to the same character of `b`, and order is preserved.
 *
 *   isIsomorphic('egg', 'add')      → true
 *   isIsomorphic('foo', 'bar')      → false   ('o' would need to be both a and r)
 *   isIsomorphic('badc', 'baba')    → false   (both 'd' and 'c' map to 'a')
 *   isIsomorphic('paper', 'title')  → true
 *
 * TARGET: O(n) time, O(1) space for a fixed alphabet.
 *
 * HINT: one map is not enough, and that is the entire exam. A single a→b map
 *       accepts 'badc'/'baba'. You need the reverse map too — or, more
 *       elegantly, compare the position of the first occurrence of each
 *       character in both strings.
 */
export function isIsomorphic(_a: string, _b: string): boolean {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Top k frequent elements                             [LeetCode 347]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the k most frequent values, in any order. Ties may be broken however
 * you like. `k` is always between 1 and the number of distinct values.
 *
 *   topKFrequent([1, 1, 1, 2, 2, 3], 2)  → [1, 2]
 *   topKFrequent([1], 1)                 → [1]
 *   topKFrequent([4, 4, 5, 5, 6], 2)     → [4, 5]
 *
 * TARGET: O(n) time. Sorting the counts is O(n log n) and a heap is
 * O(n log k) — both are accepted answers, but the linear one is the point.
 *
 * HINT: BUCKET SORT. A count can never exceed n, so make an array of n + 1
 *       buckets indexed BY COUNT, drop each value into bucket[count], then
 *       walk the buckets from the top. No comparisons, so no log factor.
 *       Say the bound out loud: "counts are bounded by n, which is what lets
 *       me index by them instead of sorting them."
 */
export function topKFrequent(_nums: number[], _k: number): number[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Valid Sudoku                                         [LeetCode 36]
 * ────────────────────────────────────────────────────────────────────────────
 * A 9×9 board, where '.' is an empty cell. Return whether the filled cells
 * break any rule: no digit may repeat within a row, within a column, or within
 * a 3×3 box. The board need not be solvable — only currently consistent.
 *
 * TARGET: O(81) time and space, i.e. O(1) — but say "one pass over the cells".
 *
 * HINT: resist three separate passes. One pass with ONE set and a composite
 *       key does all three rules at once: encode each observation as a string
 *       like `r3-5`, `c7-5`, `b1,2-5`. The box index is
 *       `(row / 3 | 0, col / 3 | 0)` — deriving that on the spot is half of
 *       what is being watched here.
 */
export function isValidSudoku(_board: string[][]): boolean {
  throw new Error('Not implemented');
}
