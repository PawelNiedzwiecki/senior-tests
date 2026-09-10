import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { retry } from '@impl/02-async/03-retry-backoff.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

/** Collects the delay used before each retry. */
function recorder() {
  const delays: number[] = [];
  return {
    delays,
    onRetry: (info: { delayMs: number }) => delays.push(info.delayMs),
  };
}

describe('retry — happy path', () => {
  it('returns the first successful value without waiting', async () => {
    const fn = vi.fn(async () => 'Hallo Welt');
    await expect(retry(fn, { retries: 3 })).resolves.toBe('Hallo Welt');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes the attempt number to the function', async () => {
    const fn = vi.fn(async (attempt: number) => {
      if (attempt < 2) throw new Error('flaky');
      return attempt;
    });

    const promise = retry(fn, { retries: 3, baseDelayMs: 10 });
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBe(2);
    expect(fn.mock.calls.map(([a]) => a)).toEqual([0, 1, 2]);
  });
});

describe('retry — backoff schedule', () => {
  it('grows the delay exponentially', async () => {
    const rec = recorder();
    const fn = vi.fn(async () => {
      throw new Error('503');
    });

    const promise = retry(fn, {
      retries: 3,
      baseDelayMs: 100,
      factor: 2,
      onRetry: rec.onRetry,
    }).catch(() => 'failed');

    await vi.runAllTimersAsync();
    await promise;

    expect(rec.delays).toEqual([100, 200, 400]);
    expect(fn).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });

  it('caps the delay at maxDelayMs', async () => {
    const rec = recorder();
    const promise = retry(
      async () => {
        throw new Error('503');
      },
      { retries: 5, baseDelayMs: 100, factor: 10, maxDelayMs: 1000, onRetry: rec.onRetry },
    ).catch(() => 'failed');

    await vi.runAllTimersAsync();
    await promise;

    expect(rec.delays).toEqual([100, 1000, 1000, 1000, 1000]);
  });

  it('actually waits — no retry before the timer fires', async () => {
    const fn = vi.fn(async () => {
      throw new Error('503');
    });
    const promise = retry(fn, { retries: 2, baseDelayMs: 500 }).catch(() => 'failed');

    await vi.advanceTimersByTimeAsync(0);
    expect(fn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(499);
    expect(fn).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);

    await vi.runAllTimersAsync();
    await promise;
  });

  it('applies full jitter within [0, delay]', async () => {
    const rec = recorder();
    // Deterministic "random": always half way.
    const promise = retry(
      async () => {
        throw new Error('503');
      },
      {
        retries: 3,
        baseDelayMs: 100,
        factor: 2,
        jitter: 'full',
        random: () => 0.5,
        onRetry: rec.onRetry,
      },
    ).catch(() => 'failed');

    await vi.runAllTimersAsync();
    await promise;

    expect(rec.delays).toEqual([50, 100, 200]);
  });
});

describe('retry — giving up', () => {
  it('rejects with the last error once retries are exhausted', async () => {
    let n = 0;
    const promise = retry(
      async () => {
        n += 1;
        throw new Error(`failure ${n}`);
      },
      { retries: 2, baseDelayMs: 10 },
    );

    const assertion = expect(promise).rejects.toThrow('failure 3');
    await vi.runAllTimersAsync();
    await assertion;
  });

  it('does not retry when shouldRetry returns false', async () => {
    const fn = vi.fn(async () => {
      throw Object.assign(new Error('bad request'), { status: 400 });
    });

    const promise = retry(fn, {
      retries: 5,
      baseDelayMs: 10,
      shouldRetry: (error) => (error as { status?: number }).status !== 400,
    });

    const assertion = expect(promise).rejects.toThrow('bad request');
    await vi.runAllTimersAsync();
    await assertion;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('consults shouldRetry once per retry decision, not on the final attempt', async () => {
    const seen: number[] = [];
    const promise = retry(
      async () => {
        throw new Error('503');
      },
      {
        retries: 2,
        baseDelayMs: 10,
        shouldRetry: (_error, attempt) => {
          seen.push(attempt);
          return true;
        },
      },
    ).catch(() => 'failed');

    await vi.runAllTimersAsync();
    await promise;
    // retries: 2 → attempts 0, 1, 2. After attempt 2 there is nothing left to
    // decide, so the predicate is short-circuited: only 0 and 1 ask it.
    expect(seen).toEqual([0, 1]);
  });
});

describe('retry — cancellation', () => {
  it('rejects immediately when the signal is already aborted', async () => {
    const fn = vi.fn(async () => 'never');
    await expect(
      retry(fn, { retries: 3, signal: AbortSignal.abort() }),
    ).rejects.toThrow();
    expect(fn).not.toHaveBeenCalled();
  });

  it('stops during a backoff wait', async () => {
    const controller = new AbortController();
    const fn = vi.fn(async () => {
      throw new Error('503');
    });

    const promise = retry(fn, {
      retries: 5,
      baseDelayMs: 1000,
      signal: controller.signal,
    });
    const assertion = expect(promise).rejects.toThrow();

    await vi.advanceTimersByTimeAsync(10);
    expect(fn).toHaveBeenCalledTimes(1);

    controller.abort();
    await assertion;

    await vi.runAllTimersAsync();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
