/**
 * SOLUTION 2.4 — Request coalescing + LRU + TTL
 *
 * Talking points:
 *
 * 1. CACHE THE PROMISE, NOT THE VALUE. This single decision gives you
 *    coalescing for free: the second caller in the same tick finds a pending
 *    promise and awaits it. If you cache only settled values, N concurrent
 *    callers produce N requests — the exact stampede the cache exists to stop.
 *    Say this first; it is the insight the question is built around.
 *
 * 2. DON'T CACHE REJECTIONS. A promise that rejects stays rejected forever, so
 *    caching it turns one network blip into a permanently broken key. Delete
 *    on failure. The `.catch(() => {})` attached at store time is not
 *    swallowing the error — the caller still gets the original promise and
 *    its rejection; this handler exists only to (a) evict and (b) stop Node
 *    reporting an unhandled rejection during the window where nobody has
 *    awaited yet. Worth explaining, because it looks wrong at a glance.
 *
 * 3. `Map` AS AN LRU. Maps iterate in insertion order, so `delete` + `set`
 *    moves a key to the newest position and `keys().next().value` is the
 *    oldest. Every operation is O(1) and there is no linked list to maintain.
 *    You would need a real list only if you had to evict from the middle by
 *    something other than recency.
 *
 * 4. `peek` MUST NOT PROMOTE. A read-only inspector that quietly changes
 *    eviction order makes the cache untestable and surprises callers. Small
 *    detail; interviewers notice when you volunteer it.
 *
 * 5. LAZY TTL. Expiry is checked on read rather than by a timer. No timers to
 *    clean up, no work for entries nobody asks for; the cost is that a stale
 *    entry occupies a slot until touched. That trade-off is the right one
 *    here, and naming it is better than pretending there isn't one.
 *
 * 6. INJECTED CLOCK. `now()` as an option means the TTL tests need no fake
 *    timers, so they stay fast and readable.
 *
 * 7. IN PRODUCTION, this is what TanStack Query / SWR give you, plus
 *    revalidation, focus refetching and devtools. Say that — then note that
 *    the dedupe window and eviction policy are exactly what you would still
 *    have to reason about.
 */

export interface CacheOptions {
  maxSize: number;
  ttlMs?: number;
  now?: () => number;
}

export interface AsyncCache<K, V> {
  get(key: K, loader: () => Promise<V>): Promise<V>;
  peek(key: K): V | undefined;
  invalidate(key: K): void;
  clear(): void;
  readonly size: number;
}

interface Entry<V> {
  promise: Promise<V>;
  /** Set once the promise fulfils, so `peek` can be synchronous. */
  value?: V;
  settled: boolean;
  storedAt: number;
}

export function createAsyncCache<K, V>(options: CacheOptions): AsyncCache<K, V> {
  const { maxSize, ttlMs, now = Date.now } = options;
  if (maxSize < 1) throw new RangeError('maxSize must be >= 1');

  const entries = new Map<K, Entry<V>>();

  const isExpired = (entry: Entry<V>): boolean =>
    ttlMs !== undefined && now() - entry.storedAt > ttlMs;

  const evictIfNeeded = () => {
    while (entries.size > maxSize) {
      const oldest = entries.keys().next();
      if (oldest.done) break;
      entries.delete(oldest.value);
    }
  };

  return {
    get(key, loader) {
      const existing = entries.get(key);

      if (existing && !isExpired(existing)) {
        // Promote: delete + set moves the key to the most-recent position.
        entries.delete(key);
        entries.set(key, existing);
        return existing.promise;
      }

      if (existing) entries.delete(key);

      const promise = loader();
      const entry: Entry<V> = { promise, settled: false, storedAt: now() };
      entries.set(key, entry);
      evictIfNeeded();

      promise.then(
        (value) => {
          entry.value = value;
          entry.settled = true;
        },
        () => {
          // Never cache a rejection — drop the entry so the next call retries.
          // Only delete if this exact entry is still the one stored.
          if (entries.get(key) === entry) entries.delete(key);
        },
      );

      return promise;
    },

    peek(key) {
      const entry = entries.get(key);
      if (!entry || !entry.settled || isExpired(entry)) return undefined;
      return entry.value;
    },

    invalidate(key) {
      entries.delete(key);
    },

    clear() {
      entries.clear();
    },

    get size() {
      return entries.size;
    },
  };
}
