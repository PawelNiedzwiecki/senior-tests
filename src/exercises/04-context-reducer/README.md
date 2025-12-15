# Exercise 4: Context & useReducer - Shopping Cart

## Difficulty: Advanced

## Learning Objectives
- Creating and using React Context
- useReducer for complex state management
- Combining Context with useReducer pattern
- TypeScript with Context and Reducers
- Avoiding prop drilling

## Task
Build a shopping cart with global state management using Context and useReducer. Include a theme switcher to demonstrate multiple contexts.

## Requirements
1. Implement the cart reducer with actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
2. Create CartContext and CartProvider
3. Implement the useCart custom hook
4. Create ThemeContext for dark/light mode
5. Build components that consume these contexts

## Files to Complete
- `CartContext.tsx` - Cart context and reducer
- `ThemeContext.tsx` - Theme context
- `ShoppingCart.tsx` - Main shopping cart component
- `ProductCard.tsx` - Product card component
- `CartSummary.tsx` - Cart summary sidebar

## Hints
- Use TypeScript discriminated unions for action types
- Remember to memoize context values to prevent unnecessary re-renders
- The useReducer hook returns [state, dispatch]
- Context consumers will re-render when context value changes
