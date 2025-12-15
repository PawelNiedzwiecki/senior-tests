# Exercise 2: useDebounce Custom Hook

## Difficulty: Intermediate

## Learning Objectives
- Creating custom hooks
- Understanding useEffect cleanup
- Working with useRef for mutable values
- TypeScript generics in hooks

## Task
Create a `useDebounce` hook that debounces a value. This is commonly used for search inputs to avoid making API calls on every keystroke.

## Requirements
1. Implement the `useDebounce` hook that accepts a value and delay
2. Return the debounced value after the specified delay
3. Handle cleanup properly to avoid memory leaks
4. Use the hook in a search component that simulates API calls

## Files to Complete
- `useDebounce.ts` - The custom hook (complete the implementation)
- `SearchDemo.tsx` - Demo component using the hook

## Hints
- Use useEffect to set up a timeout
- Return the cleanup function to clear the timeout
- The debounced value should only update after the user stops typing
