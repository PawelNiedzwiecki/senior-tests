import { describe, it, expect } from 'vitest';
import { allSettledTyped, allSettledRecord } from '@impl/01-types/06-variadic-batch.ts';

describe('allSettledTyped', () => {
  it('settles every promise without rejecting', async () => {
    const results = await allSettledTyped([
      Promise.resolve('Hallo Welt'),
      Promise.reject(new Error('rate limited')),
      Promise.resolve(42),
    ]);

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({ status: 'fulfilled', value: 'Hallo Welt' });
    expect(results[1]).toMatchObject({ status: 'rejected' });
    expect(results[2]).toEqual({ status: 'fulfilled', value: 42 });
  });

  it('preserves input order regardless of settle order', async () => {
    const slow = new Promise((resolve) => setTimeout(() => resolve('slow'), 20));
    const fast = Promise.resolve('fast');

    const [first, second] = await allSettledTyped([slow, fast]);
    expect(first).toEqual({ status: 'fulfilled', value: 'slow' });
    expect(second).toEqual({ status: 'fulfilled', value: 'fast' });
  });

  it('accepts plain values alongside promises', async () => {
    const [a, b] = await allSettledTyped(['plain', Promise.resolve('wrapped')]);
    expect(a).toEqual({ status: 'fulfilled', value: 'plain' });
    expect(b).toEqual({ status: 'fulfilled', value: 'wrapped' });
  });

  it('handles the empty tuple', async () => {
    await expect(allSettledTyped([])).resolves.toEqual([]);
  });
});

describe('allSettledRecord', () => {
  it('keeps the keys', async () => {
    const results = await allSettledRecord({
      translation: Promise.resolve('Hallo'),
      quota: Promise.reject(new Error('nope')),
    });

    expect(results.translation).toEqual({ status: 'fulfilled', value: 'Hallo' });
    expect(results.quota).toMatchObject({ status: 'rejected' });
    expect(Object.keys(results).sort()).toEqual(['quota', 'translation']);
  });
});
