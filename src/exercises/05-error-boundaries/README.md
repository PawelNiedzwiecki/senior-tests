# Exercise 5: Error Boundaries & Data Fetching

## Difficulty: Advanced

## Learning Objectives
- Class components for Error Boundaries
- componentDidCatch and getDerivedStateFromError
- Graceful error handling in React
- Data fetching with loading and error states
- Retry mechanisms

## Task
Create an Error Boundary component and use it to gracefully handle errors in a data fetching scenario.

## Requirements
1. Implement an ErrorBoundary class component
2. Implement getDerivedStateFromError to update state when an error occurs
3. Implement componentDidCatch for logging
4. Create a fallback UI with a retry button
5. Implement data fetching with proper error handling

## Files to Complete
- `ErrorBoundary.tsx` - The error boundary component
- `UserProfile.tsx` - A component that fetches and displays user data
- `DataFetcher.tsx` - Main component that uses the error boundary

## Hints
- Error boundaries must be class components (no hooks equivalent)
- getDerivedStateFromError is static and returns new state
- componentDidCatch receives error and errorInfo
- Consider adding a "retry" functionality that resets the error state
