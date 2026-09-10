import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEffect } from 'react';
import { useEventCallback } from '@impl/03-react/04-use-event-callback.ts';

describe('useEventCallback', () => {
  it('keeps a stable identity across renders', () => {
    const { result, rerender } = renderHook(
      ({ n }) => useEventCallback(() => n),
      { initialProps: { n: 1 } },
    );

    const first = result.current;
    rerender({ n: 2 });
    rerender({ n: 3 });

    expect(result.current).toBe(first);
  });

  it('calls the latest closure, not the one captured on mount', () => {
    const { result, rerender } = renderHook(
      ({ query }) => useEventCallback(() => query),
      { initialProps: { query: 'hello' } },
    );

    // Grab the callback from the FIRST render, like an event listener would.
    const captured = result.current;

    rerender({ query: 'hi' });

    // A plain useCallback([], ...) would still say 'hello' here.
    expect(captured()).toBe('hi');
  });

  it('passes arguments through', () => {
    const spy = vi.fn((a: string, b: number) => `${a}:${b}`);
    const { result } = renderHook(() => useEventCallback(spy));

    expect(result.current('de', 3)).toBe('de:3');
    expect(spy).toHaveBeenCalledWith('de', 3);
  });

  it('returns the wrapped function value', () => {
    const { result } = renderHook(() => useEventCallback((n: number) => n * 2));
    expect(result.current(21)).toBe(42);
  });

  it('lets an effect subscribe once and still see fresh state', () => {
    const seen: string[] = [];
    const listeners = new Set<() => void>();
    let subscribeCount = 0;

    const { rerender } = renderHook(
      ({ query }) => {
        const handler = useEventCallback(() => {
          seen.push(query);
        });

        // Deliberately depends on `handler`. The point of the hook is that
        // this effect subscribes ONCE, even though `query` changes every render.
        useEffect(() => {
          subscribeCount += 1;
          listeners.add(handler);
          return () => {
            listeners.delete(handler);
          };
        }, [handler]);
      },
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'b' });
    rerender({ query: 'c' });

    expect(subscribeCount).toBe(1);

    act(() => {
      listeners.forEach((listener) => listener());
    });

    // The listener registered on the first render sees the newest query.
    expect(seen).toEqual(['c']);
  });
});
