/**
 * SOLUTION — Poker hands
 *
 * COMPLEXITY: O(1) — five cards.
 *
 * NARRATION:
 *   "I parse into typed cards, then reduce each hand to one comparable key:
 *    [category index, ...ranks ordered by group size then rank]. Comparing
 *    hands is then plain lexicographic comparison — the category decides
 *    first, and all the per-category tie-break rules fall out of the
 *    ordering for free."
 *
 * THE KEY IS THE WHOLE TRICK. Writing nine bespoke tie-break functions is the
 * trap. Ordering ranks by (count desc, rank desc) puts the three of a full
 * house before its pair, the high pair before the low pair, and kickers last
 * — exactly the rules, with zero branches.
 *
 * PARSE, DON'T VALIDATE: `parseHand` turns a string into `Card[]` or throws.
 * Everything after it works on data that is known to be valid.
 *
 * THE WHEEL is one special case in one place: if the ranks are exactly
 * A-5-4-3-2, rewrite the ace as 1 before anything else looks at them.
 */

export type HandCategory =
  | 'highCard'
  | 'pair'
  | 'twoPair'
  | 'threeOfAKind'
  | 'straight'
  | 'flush'
  | 'fullHouse'
  | 'fourOfAKind'
  | 'straightFlush';

export type Winner = 'first' | 'second' | 'tie';

const CATEGORY_ORDER: readonly HandCategory[] = [
  'highCard',
  'pair',
  'twoPair',
  'threeOfAKind',
  'straight',
  'flush',
  'fullHouse',
  'fourOfAKind',
  'straightFlush',
];

const RANKS = '23456789TJQKA';
const SUITS = 'CDHS';

interface Card {
  rank: number; // 2..14
  suit: string;
}

function parseHand(hand: string): Card[] {
  const tokens = hand.trim().split(/\s+/);
  if (tokens.length !== 5) throw new Error(`A hand has 5 cards: "${hand}"`);
  if (new Set(tokens).size !== 5) throw new Error(`Duplicate card in "${hand}"`);

  return tokens.map((token) => {
    const [r, s] = token;
    const index = RANKS.indexOf(r ?? '');
    if (token.length !== 2 || index === -1 || !SUITS.includes(s ?? '')) {
      throw new Error(`Invalid card: "${token}"`);
    }
    return { rank: index + 2, suit: s! };
  });
}

interface Evaluated {
  category: HandCategory;
  key: number[];
}

function evaluate(hand: string): Evaluated {
  const cards = parseHand(hand);

  let ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  if (ranks.join() === '14,5,4,3,2') ranks = [5, 4, 3, 2, 1];

  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);

  // Ranks ordered by (group size desc, rank desc): the tie-break order.
  const grouped = [...counts.entries()]
    .sort(([ra, ca], [rb, cb]) => cb - ca || rb - ra)
    .map(([rank]) => rank);
  const shape = [...counts.values()].sort((a, b) => b - a).join('');

  const isFlush = cards.every((c) => c.suit === cards[0]?.suit);
  const isStraight = counts.size === 5 && ranks[0]! - ranks[4]! === 4;

  const category = categorise(shape, isStraight, isFlush);
  return { category, key: [CATEGORY_ORDER.indexOf(category), ...grouped] };
}

/** Checked highest first, so the first match wins. */
function categorise(shape: string, isStraight: boolean, isFlush: boolean): HandCategory {
  if (isStraight && isFlush) return 'straightFlush';
  if (shape === '41') return 'fourOfAKind';
  if (shape === '32') return 'fullHouse';
  if (isFlush) return 'flush';
  if (isStraight) return 'straight';
  if (shape === '311') return 'threeOfAKind';
  if (shape === '221') return 'twoPair';
  if (shape === '2111') return 'pair';
  return 'highCard';
}

export function rankHand(hand: string): HandCategory {
  return evaluate(hand).category;
}

export function compareHands(first: string, second: string): Winner {
  const a = evaluate(first).key;
  const b = evaluate(second).key;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff > 0 ? 'first' : 'second';
  }
  return 'tie';
}
