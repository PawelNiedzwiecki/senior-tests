import { describe, it, expect, vi } from 'vitest';
import { createAsyncCache } from '@impl/02-async/04-async-cache.ts';
import { deferred, delay } from '../../support/async-helpers.ts';

describe('coalescing', () => {
  it('runs the loader once for concurrent gets of the same key', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const gate = deferred<string>();
    const loader = vi.fn(() => gate.promise);

    const all = Promise.all([
      cache.get('hallo', loader),
      cache.get('hallo', loader),
      cache.get('hallo', loader),
    ]);

    expect(loader).toHaveBeenCalledTimes(1);
    gate.resolve('hello');
    await expect(all).resolves.toEqual(['hello', 'hello', 'hello']);
  });

  it('keeps different keys independent', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const loader = vi.fn(async (): Promise<string> => 'x');

    await Promise.all([cache.get('a', loader), cache.get('b', loader)]);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('reuses the resolved value on later calls', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const loader = vi.fn(async () => 'hello');

    await cache.get('hallo', loader);
    await cache.get('hallo', loader);
    await cache.get('hallo', loader);

    expect(loader).toHaveBeenCalledTimes(1);
  });
});

describe('error handling', () => {
  it('does not cache a rejection', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const loader = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce('hello');

    await expect(cache.get('hallo', loader)).rejects.toThrow('network');
    await expect(cache.get('hallo', loader)).resolves.toBe('hello');
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('rejects every concurrent caller of a failing load', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const gate = deferred<string>();
    const loader = vi.fn(() => gate.promise);

    const a = cache.get('k', loader);
    const b = cache.get('k', loader);
    gate.reject(new Error('boom'));

    await expect(a).rejects.toThrow('boom');
    await expect(b).rejects.toThrow('boom');
    expect(cache.size).toBe(0);
  });

  it('leaves no size behind after a failure', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    await expect(
      cache.get('k', async () => {
        throw new Error('nope');
      }),
    ).rejects.toThrow();
    await delay(0);
    expect(cache.size).toBe(0);
  });
});

describe('LRU eviction', () => {
  it('evicts the oldest entry past maxSize', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 2 });
    const loader = (v: string) => async () => v;

    await cache.get('a', loader('A'));
    await cache.get('b', loader('B'));
    await cache.get('c', loader('C'));

    expect(cache.size).toBe(2);
    expect(cache.peek('a')).toBeUndefined();
    expect(cache.peek('b')).toBe('B');
    expect(cache.peek('c')).toBe('C');
  });

  it('counts a get as a use', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 2 });
    const loader = (v: string) => async () => v;

    await cache.get('a', loader('A'));
    await cache.get('b', loader('B'));
    await cache.get('a', loader('A')); // 'a' is now the most recent
    await cache.get('c', loader('C')); // so 'b' should go

    expect(cache.peek('a')).toBe('A');
    expect(cache.peek('b')).toBeUndefined();
    expect(cache.peek('c')).toBe('C');
  });

  it('peek does not promote recency', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 2 });
    const loader = (v: string) => async () => v;

    await cache.get('a', loader('A'));
    await cache.get('b', loader('B'));
    cache.peek('a'); // must NOT save 'a'
    await cache.get('c', loader('C'));

    expect(cache.peek('a')).toBeUndefined();
  });
});

describe('TTL', () => {
  it('refetches once an entry has expired', async () => {
    let clock = 1000;
    const cache = createAsyncCache<string, string>({
      maxSize: 10,
      ttlMs: 500,
      now: () => clock,
    });
    const loader = vi.fn(async () => 'hello');

    await cache.get('k', loader);
    clock += 499;
    await cache.get('k', loader);
    expect(loader).toHaveBeenCalledTimes(1);

    clock += 2;
    await cache.get('k', loader);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('peek returns undefined for a stale entry', async () => {
    let clock = 0;
    const cache = createAsyncCache<string, string>({
      maxSize: 10,
      ttlMs: 100,
      now: () => clock,
    });

    await cache.get('k', async () => 'v');
    expect(cache.peek('k')).toBe('v');
    clock = 101;
    expect(cache.peek('k')).toBeUndefined();
  });
});

describe('manual invalidation', () => {
  it('invalidate forces a refetch', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    const loader = vi.fn(async () => 'hello');

    await cache.get('k', loader);
    cache.invalidate('k');
    await cache.get('k', loader);

    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('clear empties the cache', async () => {
    const cache = createAsyncCache<string, string>({ maxSize: 10 });
    await cache.get('a', async () => 'A');
    await cache.get('b', async () => 'B');
    expect(cache.size).toBe(2);

    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.peek('a')).toBeUndefined();
  });
});
