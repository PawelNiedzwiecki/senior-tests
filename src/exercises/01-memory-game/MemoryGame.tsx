import { useState, useEffect, useCallback } from 'react';
import './MemoryGame.css';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧'];

const createDeck = (): Card[] => {
  const cards = [...EMOJIS, ...EMOJIS].map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));

  // Shuffle cards using Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
};

export const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>(createDeck);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // TODO 1: Implement the handleCardClick function
  // - Should flip a card when clicked
  // - Should not allow clicking if:
  //   - isChecking is true (we're checking for a match)
  //   - the card is already flipped
  //   - the card is already matched
  //   - two cards are already flipped
  // - Should add the card id to flippedCards array
  const handleCardClick = useCallback((cardId: number) => {
    // YOUR CODE HERE

  }, [/* add dependencies */]);

  // TODO 2: Implement the match checking logic
  // When two cards are flipped:
  // - Set isChecking to true
  // - Compare the emojis of the two flipped cards
  // - If they match: add both card ids to matchedCards
  // - If they don't match: wait 1 second, then reset flippedCards
  // - Increment the moves counter
  // - Set isChecking to false when done
  useEffect(() => {
    if (flippedCards.length === 2) {
      // YOUR CODE HERE

    }
  }, [flippedCards, cards]);

  // TODO 3: Implement the resetGame function
  // - Create a new shuffled deck
  // - Reset all state (flippedCards, matchedCards, moves, isChecking)
  const resetGame = () => {
    // YOUR CODE HERE

  };

  // TODO 4: Implement win condition check
  // The game is won when all cards are matched (matchedCards.length === cards.length)
  const isGameWon = false; // Replace with actual condition

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>

      <div className="game-stats">
        <span>Moves: {moves}</span>
        <button onClick={resetGame}>New Game</button>
      </div>

      {/* TODO 5: Show winning message when isGameWon is true */}
      {/* YOUR CODE HERE */}

      <div className="cards-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              flippedCards.includes(card.id) || matchedCards.includes(card.id)
                ? 'flipped'
                : ''
            } ${matchedCards.includes(card.id) ? 'matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
