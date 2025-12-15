# Exercise 1: Memory Game

## Difficulty: Intermediate

## Learning Objectives
- useState for managing game state
- useEffect for side effects (checking matches, timer)
- useCallback for optimizing event handlers
- Conditional rendering

## Task
Complete the Memory Game component. Players flip cards to find matching pairs.

## Requirements
1. Implement the `handleCardClick` function to flip cards
2. Implement the `checkForMatch` logic in useEffect
3. Implement the `resetGame` function
4. Track and display the number of moves
5. Show a winning message when all pairs are found

## Files to Complete
- `MemoryGame.tsx` - Main game component (complete the TODO sections)

## Hints
- Use `flippedCards` state to track which cards are currently face-up
- Use `matchedCards` state to track which cards have been matched
- Prevent clicking on already matched or flipped cards
- Reset flipped cards after a short delay if they don't match
