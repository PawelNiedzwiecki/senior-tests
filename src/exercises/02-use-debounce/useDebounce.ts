import { useState, useEffect } from 'react';

/**
 * useDebounce hook - debounces a value by the specified delay
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 *
 * TODO: Implement this hook
 *
 * Example usage:
 * const debouncedSearch = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This will only run 500ms after user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
  // TODO 1: Create state to hold the debounced value
  // Initialize it with the passed value

  // TODO 2: Set up useEffect that:
  // - Creates a timeout that updates the debounced value after the delay
  // - Returns a cleanup function that clears the timeout
  // - Has the correct dependency array

  // TODO 3: Return the debounced value
  return value; // Replace this
}

export default useDebounce;
