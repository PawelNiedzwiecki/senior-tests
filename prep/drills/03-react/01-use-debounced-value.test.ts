import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebouncedValue } from '@impl/03-react/01-use-debounced-value.ts';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useDebouncedValue', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('Hallo', 300));
    expect(result.current[0]).toBe('Hallo');
    expect(result.current[1]).toBe(false);
  });

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'ab' });
    expect(result.current[0]).toBe('a');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current[0]).toBe('a');
  });

  it('updates once the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current[0]).toBe('ab');
    expect(result.current[1]).toBe(false);
  });

  it('collapses a burst of changes into the last value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: '' } },
    );

    for (const value of ['H', 'Ha', 'Hal', 'Hall', 'Hallo']) {
      rerender({ value });
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }

    expect(result.current[0]).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current[0]).toBe('Hallo');
  });

  it('reports isPending while a change is in flight', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    expect(result.current[1]).toBe(false);

    rerender({ value: 'ab' });
    expect(result.current[1]).toBe(true);

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current[1]).toBe(false);
  });

  it('restarts the timer when the delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'a', delay: 300 } },
    );

    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'ab', delay: 1000 });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current[0]).toBe('a');

    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current[0]).toBe('ab');
  });

  it('cancels the pending timer on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'ab' });
    unmount();

    expect(clearSpy).toHaveBeenCalled();
    // No "update on unmounted component" warning should follow.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    clearSpy.mockRestore();
  });

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 100),
      { initialProps: { value: { count: 1 } } },
    );

    const next = { count: 2 };
    rerender({ value: next });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current[0]).toBe(next);
  });
});
