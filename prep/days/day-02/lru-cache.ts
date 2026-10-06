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
 * ordered (a list, a heap, a deque), which is exactly the LRU cache problem.
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
