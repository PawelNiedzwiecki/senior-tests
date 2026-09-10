import { describe, it, expect, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useAsyncResource } from '@impl/03-react/02-use-async-resource.ts';
import { deferred } from '../../support/async-helpers.ts';
import type { Deferred } from '../../support/async-helpers.ts';

describe('useAsyncResource — basics', () => {
  it('starts loading and resolves to success', async () => {
    const { result } = renderHook(() => useAsyncResource(async () => 'Hallo Welt', []));

    expect(result.current.state.status).toBe('loading');

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'Hallo Welt' });
    });
  });

  it('reports errors', async () => {
    const { result } = renderHook(() =>
      useAsyncResource(async () => {
        throw new Error('network down');
      }, []),
    );

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    const state = result.current.state;
    if (state.status !== 'error') throw new Error('expected error state');
    expect(state.error.message).toBe('network down');
  });

  it('wraps a non-Error rejection in an Error', async () => {
    const { result } = renderHook(() =>
      useAsyncResource(async () => Promise.reject('just a string'), []),
    );

    await waitFor(() => {
      expect(result.current.state.status).toBe('error');
    });

    const state = result.current.state;
    if (state.status !== 'error') throw new Error('expected error state');
    expect(state.error).toBeInstanceOf(Error);
  });
});

describe('useAsyncResource — the race', () => {
  it('ignores a stale response that arrives after deps changed', async () => {
    const gates = new Map<string, Deferred<string>>();
    const fetcher = (query: string) => {
      const gate = deferred<string>();
      gates.set(query, gate);
      return gate.promise;
    };

    const { result, rerender } = renderHook(
      ({ query }) => useAsyncResource(() => fetcher(query), [query]),
      { initialProps: { query: 'hello' } },
    );

    // Second request supersedes the first.
    rerender({ query: 'hi' });

    // The SLOW first response lands now — it must be discarded.
    await act(async () => {
      gates.get('hello')!.resolve('hallo');
      await Promise.resolve();
    });

    expect(result.current.state.status).toBe('loading');

    await act(async () => {
      gates.get('hi')!.resolve('hi-translated');
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'hi-translated' });
    });
  });

  it('ignores a stale rejection too', async () => {
    const gates = new Map<string, Deferred<string>>();
    const fetcher = (query: string) => {
      const gate = deferred<string>();
      gates.set(query, gate);
      return gate.promise;
    };

    const { result, rerender } = renderHook(
      ({ query }) => useAsyncResource(() => fetcher(query), [query]),
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'b' });

    await act(async () => {
      gates.get('a')!.reject(new Error('stale failure'));
      await Promise.resolve();
    });

    expect(result.current.state.status).toBe('loading');

    await act(async () => {
      gates.get('b')!.resolve('fresh');
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'fresh' });
    });
  });
});

describe('useAsyncResource — cancellation', () => {
  it('aborts the previous request when deps change', async () => {
    const signals: AbortSignal[] = [];
    const { rerender } = renderHook(
      ({ query }) =>
        useAsyncResource((signal) => {
          signals.push(signal);
          return new Promise<string>(() => {});
        }, [query]),
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'b' });

    await waitFor(() => expect(signals).toHaveLength(2));
    expect(signals[0]!.aborted).toBe(true);
    expect(signals[1]!.aborted).toBe(false);
  });

  it('aborts on unmount', async () => {
    const signals: AbortSignal[] = [];
    const { unmount } = renderHook(() =>
      useAsyncResource((signal) => {
        signals.push(signal);
        return new Promise<string>(() => {});
      }, []),
    );

    await waitFor(() => expect(signals).toHaveLength(1));
    unmount();
    expect(signals[0]!.aborted).toBe(true);
  });

  it('does not treat an AbortError as an error state', async () => {
    const gate = deferred<string>();
    const { result, rerender } = renderHook(
      ({ query }) =>
        useAsyncResource(async (signal) => {
          if (query === 'a') {
            await gate.promise;
            throw new DOMException('aborted', 'AbortError');
          }
          void signal;
          return 'fresh';
        }, [query]),
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'b' });

    await act(async () => {
      gate.resolve('unused');
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'fresh' });
    });
  });

  it('sets no state after unmount', async () => {
    const gate = deferred<string>();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = renderHook(() => useAsyncResource(() => gate.promise, []));
    unmount();

    await act(async () => {
      gate.resolve('too late');
      await Promise.resolve();
    });

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('useAsyncResource — refetch', () => {
  it('re-runs the fetcher', async () => {
    let calls = 0;
    const { result } = renderHook(() =>
      useAsyncResource(async () => {
        calls += 1;
        return `run-${calls}`;
      }, []),
    );

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'run-1' });
    });

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.state).toEqual({ status: 'success', data: 'run-2' });
    });
  });

  it('keeps a stable refetch identity across renders', async () => {
    const { result, rerender } = renderHook(() =>
      useAsyncResource(async () => 'x', []),
    );

    const first = result.current.refetch;
    rerender();
    expect(result.current.refetch).toBe(first);
  });
});
