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

  // SOLUTION 1: Implement the handleCardClick function
  const handleCardClick = useCallback((cardId: number) => {
    // Don't allow clicking if we're checking for a match
    if (isChecking) return;

    // Don't allow clicking on already flipped or matched cards
    if (flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

    // Don't allow clicking if two cards are already flipped
    if (flippedCards.length >= 2) return;

    // Add the card to flipped cards
    setFlippedCards((prev) => [...prev, cardId]);
  }, [isChecking, flippedCards, matchedCards]);

  // SOLUTION 2: Implement the match checking logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Cards match - add to matchedCards
        setMatchedCards((prev) => [...prev, firstId, secondId]);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // Cards don't match - flip them back after a delay
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // SOLUTION 3: Implement the resetGame function
  const resetGame = () => {
    setCards(createDeck());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setIsChecking(false);
  };

  // SOLUTION 4: Implement win condition check
  const isGameWon = matchedCards.length === cards.length && cards.length > 0;

  return (
    <div className="memory-game">
      <h1>Memory Game</h1>

      <div className="game-stats">
        <span>Moves: {moves}</span>
        <button onClick={resetGame}>New Game</button>
      </div>

      {/* SOLUTION 5: Show winning message when isGameWon is true */}
      {isGameWon && (
        <div className="winning-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You won in {moves} moves!</p>
        </div>
      )}

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
