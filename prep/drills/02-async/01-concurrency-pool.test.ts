import { describe, it, expect, vi } from 'vitest';
import { mapWithConcurrency } from '@impl/02-async/01-concurrency-pool.ts';
import { delay, createConcurrencyTracker } from '../../support/async-helpers.ts';

describe('mapWithConcurrency', () => {
  it('returns results in input order', async () => {
    const items = [5, 1, 4, 2, 3];
    const results = await mapWithConcurrency(
      items,
      async (n) => {
        // Deliberately inverted: bigger numbers finish last.
        await delay(n * 4);
        return n * 10;
      },
      { concurrency: 2 },
    );

    expect(results).toEqual([50, 10, 40, 20, 30]);
  });

  it('never exceeds the concurrency limit', async () => {
    const tracker = createConcurrencyTracker();
    const items = Array.from({ length: 12 }, (_, i) => i);

    await mapWithConcurrency(
      items,
      (n) => tracker.track(async () => {
        await delay(5);
        return n;
      }),
      { concurrency: 3 },
    );

    expect(tracker.peak).toBe(3);
  });

  it('actually runs work in parallel (not sequentially)', async () => {
    const started = Date.now();
    await mapWithConcurrency(
      [1, 2, 3, 4],
      async () => {
        await delay(20);
        return 1;
      },
      { concurrency: 4 },
    );
    // Sequential would be ~80ms; parallel ~20ms. Generous bound for CI.
    expect(Date.now() - started).toBeLessThan(60);
  });

  it('handles an empty list', async () => {
    await expect(mapWithConcurrency([], async (n) => n, { concurrency: 4 })).resolves.toEqual([]);
  });

  it('handles concurrency larger than the input', async () => {
    const results = await mapWithConcurrency([1, 2], async (n) => n * 2, { concurrency: 10 });
    expect(results).toEqual([2, 4]);
  });

  it('passes the index to the worker', async () => {
    const worker = vi.fn(async (item: string, index: number) => `${index}:${item}`);
    const results = await mapWithConcurrency(['a', 'b', 'c'], worker, { concurrency: 2 });
    expect(results).toEqual(['0:a', '1:b', '2:c']);
  });

  it('rejects with the first error', async () => {
    await expect(
      mapWithConcurrency(
        [1, 2, 3, 4],
        async (n) => {
          if (n === 2) throw new Error('segment 2 failed');
          await delay(10);
          return n;
        },
        { concurrency: 2 },
      ),
    ).rejects.toThrow('segment 2 failed');
  });

  it('starts no new work after a failure', async () => {
    const worker = vi.fn(async (n: number) => {
      await delay(5);
      if (n === 0) throw new Error('boom');
      return n;
    });

    await expect(
      mapWithConcurrency([0, 1, 2, 3, 4, 5, 6, 7], worker, { concurrency: 2 }),
    ).rejects.toThrow('boom');

    await delay(40);
    // Two slots were busy when it blew up, so at most those two plus nothing new.
    expect(worker.mock.calls.length).toBeLessThanOrEqual(2);
  });

  it('stops when the signal aborts', async () => {
    const controller = new AbortController();
    const worker = vi.fn(async (n: number) => {
      await delay(10);
      return n;
    });

    const promise = mapWithConcurrency(
      Array.from({ length: 20 }, (_, i) => i),
      worker,
      { concurrency: 2, signal: controller.signal },
    );

    await delay(25);
    controller.abort();

    await expect(promise).rejects.toThrow();
    const callsAtAbort = worker.mock.calls.length;

    await delay(40);
    expect(worker.mock.calls.length).toBe(callsAtAbort);
  });

  it('rejects immediately if the signal is already aborted', async () => {
    const worker = vi.fn(async (n: number) => n);
    await expect(
      mapWithConcurrency([1, 2, 3], worker, {
        concurrency: 2,
        signal: AbortSignal.abort(),
      }),
    ).rejects.toThrow();
    expect(worker).not.toHaveBeenCalled();
  });
});
