import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useControllableState } from '@impl/03-react/03-use-controllable-state.ts';

describe('uncontrolled mode', () => {
  it('starts at defaultValue', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 'en' }));
    expect(result.current[0]).toBe('en');
  });

  it('updates its own state', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 'en' }));

    act(() => result.current[1]('de'));
    expect(result.current[0]).toBe('de');
  });

  it('still calls onChange', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'en', onChange }),
    );

    act(() => result.current[1]('de'));
    expect(onChange).toHaveBeenCalledWith('de');
  });

  it('supports the updater form', () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));

    act(() => result.current[1]((prev) => prev + 1));
    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(3);
  });

  it('ignores a later change to defaultValue', () => {
    const { result, rerender } = renderHook(
      ({ defaultValue }) => useControllableState({ defaultValue }),
      { initialProps: { defaultValue: 'en' } },
    );

    rerender({ defaultValue: 'de' });
    expect(result.current[0]).toBe('en');
  });
});

describe('controlled mode', () => {
  it('returns the prop, not internal state', () => {
    const { result } = renderHook(() =>
      useControllableState({ value: 'fr', defaultValue: 'en' }),
    );
    expect(result.current[0]).toBe('fr');
  });

  it('does not change locally when the setter is called', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 'fr', defaultValue: 'en', onChange }),
    );

    act(() => result.current[1]('de'));

    expect(result.current[0]).toBe('fr'); // the parent has not moved it
    expect(onChange).toHaveBeenCalledWith('de');
  });

  it('follows the prop when the parent updates', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 'en' }),
      { initialProps: { value: 'fr' } },
    );

    rerender({ value: 'pl' });
    expect(result.current[0]).toBe('pl');
  });

  it('resolves the updater against the controlled value', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ value: 10, defaultValue: 0, onChange }),
    );

    act(() => result.current[1]((prev) => prev + 5));
    expect(onChange).toHaveBeenCalledWith(15);
  });
});

describe('setter identity', () => {
  it('is stable across renders', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 'en' }),
      { initialProps: { value: 'fr' } },
    );

    const first = result.current[1];
    rerender({ value: 'pl' });
    expect(result.current[1]).toBe(first);
  });

  it('is stable in uncontrolled mode too', () => {
    const { result, rerender } = renderHook(() =>
      useControllableState({ defaultValue: 'en' }),
    );

    const first = result.current[1];
    act(() => result.current[1]('de'));
    rerender();
    expect(result.current[1]).toBe(first);
  });

  it('a stable setter still sees fresh values', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: 0, onChange }),
      { initialProps: { value: 1 } },
    );

    const setter = result.current[1];
    rerender({ value: 99 });

    act(() => setter((prev) => prev + 1));
    expect(onChange).toHaveBeenCalledWith(100);
  });
});
