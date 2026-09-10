/**
 * DRILL 2.4 — Request coalescing + LRU + TTL
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 30 min      DIFFICULTY: ●●●●○
 *
 * WHAT YOU'RE BUILDING
 * The cache in front of a translation API. Three behaviours, and the first is
 * the one candidates forget:
 *
 *   COALESCING  — ten components ask for the same translation in the same tick;
 *                 exactly ONE request goes out and all ten await it.
 *   LRU         — bounded memory; the least recently *used* entry is evicted.
 *   TTL         — entries go stale and are refetched.
 *
 * REQUIREMENTS
 *   1. Concurrent `get(key, loader)` for the same key calls `loader` once.
 *   2. A resolved value is cached and reused.
 *   3. A REJECTED load is NOT cached — the next call must retry.
 *   4. `maxSize` evicts least-recently-used; a `get` counts as a use.
 *   5. `ttlMs` expires entries; expiry is checked on read.
 *   6. `invalidate(key)`, `clear()`, `size`, and `peek` (no loader, no promote).
 *
 * WHY IT'S ASKED
 * It is one small object that touches promise sharing, cache invalidation,
 * eviction policy and error semantics. The "don't cache the rejection" rule is
 * a favourite: get it wrong and one blip poisons the key until reload.
 *
 * HINTS
 *   1. Store the PROMISE, not the value. That IS coalescing — a second caller
 *      finds the pending promise and awaits the same one.
 *   2. Delete the entry in a `.catch()` attached at store time, so a rejection
 *      cleans up after itself. Attach a no-op catch to avoid unhandled
 *      rejection warnings when nobody is awaiting yet.
 *   3. `Map` iterates in insertion order. `delete` then `set` moves a key to
 *      the end — that is your recency list, no linked list required.
 *   4. Evict with `cache.keys().next().value` — the oldest key.
 *   5. Inject `now()` so TTL is testable without fake timers.
 *
 * STRETCH
 *   a. `stale-while-revalidate`: serve the stale value, refresh in background.
 *   b. Per-entry TTL passed at `get` time.
 *   c. Why is a `Map` LRU O(1) here, and when would you need a real linked list?
 *   d. How does this differ from what TanStack Query does for you?
 */

export interface CacheOptions {
  maxSize: number;
  /** Entry lifetime in ms. Omit for no expiry. */
  ttlMs?: number;
  /** Injected clock for tests. Defaults to `Date.now`. */
  now?: () => number;
}

export interface AsyncCache<K, V> {
  /** Return the cached value, the in-flight promise, or start a new load. */
  get(key: K, loader: () => Promise<V>): Promise<V>;
  /** Settled value if present and fresh. Does NOT promote recency or load. */
  peek(key: K): V | undefined;
  invalidate(key: K): void;
  clear(): void;
  readonly size: number;
}

export function createAsyncCache<K, V>(_options: CacheOptions): AsyncCache<K, V> {
  throw new Error('Not implemented'); // TODO
}
