/**
 * SOLUTIONS — Hash map / frequency counting
 */

/**
 * PROBLEM 2 — LRU cache
 *
 * COMPLEXITY: O(1) per operation, O(capacity) space.
 *
 * NARRATION:
 *   "I need O(1) lookup and O(1) reordering. A hash map gives the first, a
 *    doubly-linked list the second, and the classic answer is both wired
 *    together. In JavaScript a `Map` already keeps insertion order and lets me
 *    read the oldest key, so I can use it as the list: delete-then-set moves a
 *    key to the back, and the first key is the eviction candidate."
 *
 * WHY DELETE-THEN-SET: `set` on an existing key updates the value but leaves
 * the key in its original position. Deleting first is what actually re-orders.
 * Forgetting this is the bug — the cache then evicts by insertion time rather
 * than by use, which every LRU test catches.
 *
 * EVICT AFTER INSERTING, not before, and only when the key is genuinely new —
 * otherwise overwriting an existing key at full capacity evicts a victim it
 * did not need to.
 *
 * THE FOLLOW-UP you should pre-empt: LFU (least frequently used) needs a count
 * per key plus buckets of equal-count keys; and a thread-safe or multi-process
 * cache needs the list operations under a lock, which is why production caches
 * often approximate LRU (CLOCK, sampled-LRU in Redis) instead of tracking it
 * exactly.
 */
export interface LRUCache {
  get(key: number): number | undefined;
  put(key: number, value: number): void;
  readonly size: number;
}

export function createLRUCache(capacity: number): LRUCache {
  const entries = new Map<number, number>();

  return {
    get(key) {
      if (!entries.has(key)) return undefined;
      const value = entries.get(key)!;
      entries.delete(key); // …and re-insert to mark it most-recently-used
      entries.set(key, value);
      return value;
    },

    put(key, value) {
      entries.delete(key); // no-op for a new key; re-orders an existing one
      entries.set(key, value);

      if (entries.size > capacity) {
        const oldest = entries.keys().next().value as number;
        entries.delete(oldest);
      }
    },

    get size() {
      return entries.size;
    },
  };
}
