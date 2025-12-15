# Exercise 3: Performance Optimization

## Difficulty: Advanced

## Learning Objectives
- React.memo for component memoization
- useMemo for expensive calculations
- useCallback for stable function references
- Understanding React's reconciliation
- Profiling and optimizing renders

## Task
Optimize a product list component that has performance issues. The list has expensive calculations and unnecessary re-renders.

## Requirements
1. Use React.memo to prevent unnecessary re-renders of list items
2. Use useMemo to cache expensive calculations
3. Use useCallback to stabilize callback references
4. Implement proper comparison functions where needed

## Files to Complete
- `ProductList.tsx` - Main component with performance issues to fix
- `ProductItem.tsx` - Individual item component to optimize

## Hints
- Watch for anonymous functions being passed as props
- Expensive calculations should be memoized
- Child components receiving the same props shouldn't re-render
- Use React DevTools Profiler to verify your optimizations
