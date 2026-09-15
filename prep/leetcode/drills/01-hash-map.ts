/**
 * PATTERN 01 — Hash map / frequency counting            [LeetCode 128, 146]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 35 min      Catalogue: ../patterns/CATALOGUE.md § 1
 *
 * THE PATTERN
 * A hash map turns a question about *other* elements into an O(1) lookup.
 * Whenever you catch yourself writing an inner loop that scans the array to
 * ask "does something else exist / how many of these are there / which group
 * does this belong to", that inner loop is a map waiting to happen.
 *
 * THE TELL
 *   "have I seen it before"  ·  "how many times"  ·  "group these together"
 *   "find the pair that…"    ·  "O(1) get and put"
 *
 * WHEN IT IS VALID
 * The question you ask about each element must depend only on membership or
 * counts — not on order. If order matters you want a map *plus* something
 * ordered (a list, a heap, a deque). Problem 2 below is exactly that case.
 *
 * TEMPLATE
 *   const seen = new Map<K, V>();
 *   for (const x of xs) {
 *     if (seen.has(key(x))) { ...  }   // check BEFORE insert for pair problems
 *     seen.set(key(x), value(x));
 *   }
 *
 * COST — O(n) time, O(n) space. The trade is always the same: spend memory to
 * delete a loop.
 *
 * THE SENTENCE TO SAY OUT LOUD
 *   "The brute force is quadratic because each element asks a question about
 *    every other element. A map answers that question in O(1), so one pass."
 */

/**
 * PROBLEM 1 — Longest consecutive sequence                      [LeetCode 128]
 * ────────────────────────────────────────────────────────────────────────────
 * Given an unsorted array, return the length of the longest run of consecutive
 * integers (the run does NOT have to be contiguous in the array).
 *
 *   longestConsecutive([100, 4, 200, 1, 3, 2])      → 4     (1,2,3,4)
 *   longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) → 9
 *   longestConsecutive([])                          → 0
 *
 * TARGET: O(n) time, O(n) space.
 *
 * WHY IT IS INTERESTING: sorting solves it in O(n log n) and the interviewer
 * will accept that as a warm-up — then ask for O(n). Sorting is disallowed by
 * the target, so the set has to do the work.
 *
 * HINT: put everything in a Set. Only start counting a run at a number that is
 *       the START of its run — i.e. when `n - 1` is not in the set. Then walk
 *       upwards while `n + 1` exists.
 *
 * WHY THAT IS STILL O(n) DESPITE THE INNER WHILE LOOP: the inner loop only
 *       ever runs from a run's starting element, so across the whole input each
 *       element is visited by an inner loop at most once. Amortised O(n) — say
 *       this out loud, because the nested loop looks quadratic and an
 *       interviewer is waiting to see whether you can defend it.
 */
export function longestConsecutive(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — LRU cache                                         [LeetCode 146]
 * ────────────────────────────────────────────────────────────────────────────
 * Design a fixed-capacity cache with O(1) `get` and `put`. When it is full, a
 * `put` evicts the LEAST RECENTLY USED key. A `get` counts as a use.
 *
 *   const c = createLRUCache(2);
 *   c.put(1, 1); c.put(2, 2);
 *   c.get(1)        → 1          (1 is now the most recent)
 *   c.put(3, 3);                 (evicts 2, the least recent)
 *   c.get(2)        → undefined
 *
 * TARGET: O(1) for both operations.
 *
 * THE PATTERN STACK: a map gives O(1) lookup but no order; a list gives order
 * but O(n) lookup. Combine them — that combination IS the answer, and naming it
 * in the first thirty seconds is most of the interview.
 *
 * HINT (the shortcut): a JavaScript `Map` preserves insertion order and exposes
 *       it — `map.keys().next().value` is the oldest key. So "touch" a key by
 *       deleting and re-setting it, which moves it to the back. That gives a
 *       genuinely O(1) solution in about fifteen lines.
 *
 * SAY IT ANYWAY: mention that the language-agnostic answer is a hash map of
 *       key → node plus a doubly-linked list for recency, and that you are
 *       using `Map`'s insertion order as a ready-made version of that list.
 *       Interviewers respect the shortcut far more when you show you know what
 *       it is standing in for.
 */
export interface LRUCache {
  get(key: number): number | undefined;
  put(key: number, value: number): void;
  readonly size: number;
}

export function createLRUCache(_capacity: number): LRUCache {
  throw new Error('Not implemented');
}
