import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce } from '@impl/02-async/02-debounce.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('debounce — trailing edge (default)', () => {
  it('does not fire immediately', () => {
    const fn = vi.fn();
    debounce(fn, 100)();
    expect(fn).not.toHaveBeenCalled();
  });

  it('fires once after the wait', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('collapses a burst into a single trailing call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a');
    vi.advanceTimersByTime(50);
    d('b');
    vi.advanceTimersByTime(50);
    d('c');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('restarts the clock on every call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    for (let i = 0; i < 10; i += 1) {
      d(i);
      vi.advanceTimersByTime(90);
    }
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(9);
  });

  it('allows a second burst after the first settles', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('first');
    vi.advanceTimersByTime(150);
    d('second');
    vi.advanceTimersByTime(150);
    expect(fn.mock.calls).toEqual([['first'], ['second']]);
  });
});

describe('debounce — leading edge', () => {
  it('fires immediately then suppresses the rest', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100, { leading: true, trailing: false });
    d('a');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    d('b');
    d('c');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('fires on both edges when a burst has more than one call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100, { leading: true, trailing: true });
    d('a');
    d('b');
    vi.advanceTimersByTime(100);

    expect(fn.mock.calls).toEqual([['a'], ['b']]);
  });

  it('fires only once for a burst of exactly one call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100, { leading: true, trailing: true });
    d('only');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('only');
  });
});

describe('debounce — control methods', () => {
  it('cancel() drops the pending call', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a');
    d.cancel();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();
  });

  it('flush() invokes the pending call right away', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a');
    d.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('flush() with nothing pending does nothing', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d.flush();
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not replay stale args on a later flush', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d('a');
    vi.advanceTimersByTime(100);
    d.flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('pending() reflects queued state', () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    expect(d.pending()).toBe(false);
    d('a');
    expect(d.pending()).toBe(true);
    vi.advanceTimersByTime(100);
    expect(d.pending()).toBe(false);
  });
});

describe('debounce — binding and types', () => {
  it('preserves the call-site `this`', () => {
    const seen: unknown[] = [];
    const obj = {
      name: 'translator',
      run: debounce(function (this: { name: string }) {
        seen.push(this.name);
      }, 100),
    };

    obj.run();
    vi.advanceTimersByTime(100);
    expect(seen).toEqual(['translator']);
  });

  it('passes every argument through', () => {
    const fn = vi.fn((_a: string, _b: number, _c: boolean) => {});
    const d = debounce(fn, 100);
    d('de', 42, true);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('de', 42, true);
  });
});
