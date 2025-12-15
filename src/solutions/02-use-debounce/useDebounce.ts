import { useState, useEffect } from 'react';

/**
 * useDebounce hook - debounces a value by the specified delay
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  // SOLUTION 1: Create state to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // SOLUTION 2: Set up useEffect
  useEffect(() => {
    // Create a timeout that updates the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: clear the timeout if value changes or component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]); // Re-run when value or delay changes

  // SOLUTION 3: Return the debounced value
  return debouncedValue;
}

export default useDebounce;
