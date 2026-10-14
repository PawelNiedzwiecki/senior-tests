/**
 * KATA 09 — Poker hands                                       (the hardest one)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 60 min        Guide: ../README.md
 *
 * THE TASK
 *   rankHand(hand)       — name the category of a 5-card hand.
 *   compareHands(a, b)   — 'first' | 'second' | 'tie'.
 *
 * INPUT FORMAT: five space-separated cards, rank then suit.
 *   ranks  2 3 4 5 6 7 8 9 T J Q K A        suits  C D H S
 *   "2H 3D 5S 9C KD"
 *
 * CATEGORIES, LOWEST → HIGHEST
 *   highCard · pair · twoPair · threeOfAKind · straight · flush ·
 *   fullHouse · fourOfAKind · straightFlush
 *
 * TIE-BREAKS WITHIN A CATEGORY
 *   Compare the rank GROUPS, biggest group first, then by rank:
 *     full house    — the three, then the pair       (KKK22 beats QQQAA)
 *     two pair      — high pair, low pair, kicker
 *     pair          — the pair, then kickers high → low
 *     high / flush  — every card high → low
 *     straight(s)   — the top card only
 *   Suits never break ties. Identical ranks → 'tie'.
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - The ACE IS LOW in A-2-3-4-5 (the "wheel"), which is a FIVE-high
 *     straight — the lowest straight. A-K-Q-J-T is the highest. No wrap-
 *     around: Q-K-A-2-3 is not a straight.
 *   - Invalid input throws: wrong card count, unknown rank/suit, or the same
 *     card twice in one hand. (Comparing two hands that share a card is
 *     allowed — think of them as separate games.)
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Is the ace high, low, or both?
 *   - Do suits ever rank? (Not in standard poker.)
 *   - Wild cards / jokers?
 *
 * HINT
 *   Turn each hand into a SINGLE comparable key: [categoryIndex, ...ranks]
 *   where `ranks` is ordered by (group size desc, rank desc). Then
 *   comparing two hands is lexicographic comparison of two number arrays —
 *   no per-category tie-break code at all. Handle the wheel by replacing
 *   the ace's 14 with 1 when the hand is exactly A-2-3-4-5.
 *
 * FOLLOW-UPS
 *   - Best 5-card hand from 7 cards (Texas Hold'em).
 *   - Rank 1 000 000 hands per second — what would you precompute?
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

export function rankHand(_hand: string): HandCategory {
  throw new Error('Not implemented');
}

export function compareHands(_first: string, _second: string): Winner {
  throw new Error('Not implemented');
}
