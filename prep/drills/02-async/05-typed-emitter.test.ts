import { describe, it, expect, vi } from 'vitest';
import { createEmitter } from '@impl/02-async/05-typed-emitter.ts';
import type { TranslationEvents } from '@impl/02-async/05-typed-emitter.ts';

const make = () => createEmitter<TranslationEvents>();

describe('basic dispatch', () => {
  it('calls a listener with the payload', () => {
    const emitter = make();
    const listener = vi.fn();
    emitter.on('progress', listener);
    emitter.emit('progress', 'job-1', 42);
    expect(listener).toHaveBeenCalledWith('job-1', 42);
  });

  it('supports zero-payload events', () => {
    const emitter = make();
    const listener = vi.fn();
    emitter.on('cancelled', listener);
    emitter.emit('cancelled');
    expect(listener).toHaveBeenCalledWith();
  });

  it('emitting with no listeners is a no-op', () => {
    const emitter = make();
    expect(() => emitter.emit('cancelled')).not.toThrow();
  });

  it('calls listeners in registration order', () => {
    const emitter = make();
    const order: number[] = [];
    emitter.on('cancelled', () => order.push(1));
    emitter.on('cancelled', () => order.push(2));
    emitter.on('cancelled', () => order.push(3));
    emitter.emit('cancelled');
    expect(order).toEqual([1, 2, 3]);
  });

  it('ignores a duplicate registration of the same function', () => {
    const emitter = make();
    const listener = vi.fn();
    emitter.on('cancelled', listener);
    emitter.on('cancelled', listener);
    expect(emitter.listenerCount('cancelled')).toBe(1);
    emitter.emit('cancelled');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('keeps events separate', () => {
    const emitter = make();
    const onProgress = vi.fn();
    const onCancelled = vi.fn();
    emitter.on('progress', onProgress);
    emitter.on('cancelled', onCancelled);
    emitter.emit('cancelled');
    expect(onProgress).not.toHaveBeenCalled();
    expect(onCancelled).toHaveBeenCalledTimes(1);
  });
});

describe('unsubscribing', () => {
  it('stops calling after the returned unsubscribe runs', () => {
    const emitter = make();
    const listener = vi.fn();
    const off = emitter.on('cancelled', listener);
    off();
    emitter.emit('cancelled');
    expect(listener).not.toHaveBeenCalled();
  });

  it('is idempotent', () => {
    const emitter = make();
    const off = emitter.on('cancelled', vi.fn());
    off();
    expect(() => off()).not.toThrow();
    expect(emitter.listenerCount('cancelled')).toBe(0);
  });

  it('supports off()', () => {
    const emitter = make();
    const listener = vi.fn();
    emitter.on('cancelled', listener);
    emitter.off('cancelled', listener);
    emitter.emit('cancelled');
    expect(listener).not.toHaveBeenCalled();
  });

  it('drops the event bucket when the last listener leaves', () => {
    const emitter = make();
    const off = emitter.on('cancelled', vi.fn());
    off();
    expect(emitter.listenerCount('cancelled')).toBe(0);
  });
});

describe('mutation during dispatch', () => {
  it('does not call a listener added during the same emit', () => {
    const emitter = make();
    const added = vi.fn();
    emitter.on('cancelled', () => {
      emitter.on('cancelled', added);
    });

    emitter.emit('cancelled');
    expect(added).not.toHaveBeenCalled();

    emitter.emit('cancelled');
    expect(added).toHaveBeenCalledTimes(1);
  });

  it('does not call a listener removed during the same emit', () => {
    const emitter = make();
    const second = vi.fn();
    emitter.on('cancelled', () => emitter.off('cancelled', second));
    emitter.on('cancelled', second);

    emitter.emit('cancelled');
    expect(second).not.toHaveBeenCalled();
  });

  it('survives a listener that unsubscribes itself', () => {
    const emitter = make();
    const calls: string[] = [];
    const off = emitter.on('cancelled', () => {
      calls.push('self');
      off();
    });
    emitter.on('cancelled', () => calls.push('other'));

    emitter.emit('cancelled');
    emitter.emit('cancelled');

    expect(calls).toEqual(['self', 'other', 'other']);
  });
});

describe('listener errors', () => {
  // NOTE: the reference solution re-throws asynchronously so the failure stays
  // visible to window.onerror / your error reporter. That prints an
  // "Error: listener blew up" line in the Vitest output even when this test
  // passes — that is the design working, not a failure.
  it('keeps going after a listener throws', () => {
    const emitter = make();
    const after = vi.fn();
    emitter.on('cancelled', () => {
      throw new Error('listener blew up');
    });
    emitter.on('cancelled', after);

    expect(() => emitter.emit('cancelled')).not.toThrow();
    expect(after).toHaveBeenCalledTimes(1);
  });
});

describe('once', () => {
  it('resolves with the payload tuple', async () => {
    const emitter = make();
    const promise = emitter.once('progress');
    emitter.emit('progress', 'job-1', 99);
    await expect(promise).resolves.toEqual(['job-1', 99]);
  });

  it('resolves with an empty tuple for payload-free events', async () => {
    const emitter = make();
    const promise = emitter.once('cancelled');
    emitter.emit('cancelled');
    await expect(promise).resolves.toEqual([]);
  });

  it('unsubscribes itself after firing', async () => {
    const emitter = make();
    const promise = emitter.once('cancelled');
    emitter.emit('cancelled');
    await promise;
    expect(emitter.listenerCount('cancelled')).toBe(0);
  });

  it('only resolves for the first emit', async () => {
    const emitter = make();
    const promise = emitter.once('progress');
    emitter.emit('progress', 'first', 1);
    emitter.emit('progress', 'second', 2);
    await expect(promise).resolves.toEqual(['first', 1]);
  });
});
