/** Test helpers shared by the async drills. */

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

/** A promise you can settle from the outside — the cleanest way to control
 *  scheduling in a test without leaning on timers. */
export function deferred<T = void>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Let every already-queued microtask run. */
export async function flushMicrotasks(times = 5): Promise<void> {
  for (let i = 0; i < times; i += 1) await Promise.resolve();
}

/** Tracks how many workers are in flight at once. */
export function createConcurrencyTracker() {
  let active = 0;
  let peak = 0;
  return {
    get peak() {
      return peak;
    },
    async track<T>(fn: () => Promise<T>): Promise<T> {
      active += 1;
      peak = Math.max(peak, active);
      try {
        return await fn();
      } finally {
        active -= 1;
      }
    },
  };
}
