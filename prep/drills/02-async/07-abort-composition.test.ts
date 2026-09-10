import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withTimeout, anySignal } from '@impl/02-async/07-abort-composition.ts';
import { deferred } from '../../support/async-helpers.ts';

describe('withTimeout', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves when the promise wins', async () => {
    await expect(withTimeout(Promise.resolve('Hallo'), 1000)).resolves.toBe('Hallo');
  });

  it('forwards the original rejection when the promise loses', async () => {
    await expect(withTimeout(Promise.reject(new Error('network')), 1000)).rejects.toThrow(
      'network',
    );
  });

  it('rejects with a TimeoutError once the deadline passes', async () => {
    const never = new Promise<string>(() => {});
    const promise = withTimeout(never, 500);
    const assertion = expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });

    await vi.advanceTimersByTimeAsync(500);
    await assertion;
  });

  it('does not time out just before the deadline', async () => {
    const gate = deferred<string>();
    const promise = withTimeout(gate.promise, 500);

    await vi.advanceTimersByTimeAsync(499);
    gate.resolve('made it');
    await expect(promise).resolves.toBe('made it');
  });

  it('clears its timer when the promise settles first', async () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    await withTimeout(Promise.resolve('fast'), 1000);
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});

describe('anySignal', () => {
  it('is not aborted when no input is aborted', () => {
    const { signal } = anySignal([new AbortController().signal]);
    expect(signal.aborted).toBe(false);
  });

  it('aborts when any input aborts', () => {
    const a = new AbortController();
    const b = new AbortController();
    const { signal } = anySignal([a.signal, b.signal]);

    expect(signal.aborted).toBe(false);
    b.abort();
    expect(signal.aborted).toBe(true);
  });

  it('is already aborted when an input was aborted beforehand', () => {
    const done = new AbortController();
    done.abort(new Error('too late'));

    const { signal } = anySignal([new AbortController().signal, done.signal]);
    expect(signal.aborted).toBe(true);
  });

  it('propagates the abort reason', () => {
    const controller = new AbortController();
    const reason = new Error('user navigated away');
    const { signal } = anySignal([controller.signal]);

    controller.abort(reason);
    expect(signal.reason).toBe(reason);
  });

  it('ignores undefined entries', () => {
    const controller = new AbortController();
    const { signal } = anySignal([undefined, controller.signal, undefined]);

    expect(signal.aborted).toBe(false);
    controller.abort();
    expect(signal.aborted).toBe(true);
  });

  it('handles an empty list', () => {
    const { signal } = anySignal([]);
    expect(signal.aborted).toBe(false);
  });

  it('fires abort listeners on the combined signal', () => {
    const controller = new AbortController();
    const { signal } = anySignal([controller.signal]);
    const onAbort = vi.fn();
    signal.addEventListener('abort', onAbort);

    controller.abort();
    expect(onAbort).toHaveBeenCalledTimes(1);
  });

  it('cleanup() detaches from the sources', () => {
    const controller = new AbortController();
    const { signal, cleanup } = anySignal([controller.signal]);

    cleanup();
    controller.abort();

    // After cleanup the combined signal is inert — this is what stops a
    // long-lived source signal from accumulating listeners.
    expect(signal.aborted).toBe(false);
  });

  it('does not leak listeners on the source signal', () => {
    const controller = new AbortController();
    const addSpy = vi.spyOn(controller.signal, 'addEventListener');
    const removeSpy = vi.spyOn(controller.signal, 'removeEventListener');

    const { cleanup } = anySignal([controller.signal]);
    expect(addSpy).toHaveBeenCalledTimes(1);

    cleanup();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
