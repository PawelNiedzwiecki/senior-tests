/**
 * KATA 05 — Yatzy category scoring
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 35 min        Guide: ../README.md
 *
 * THE TASK
 * Given five dice and a category, return what that roll scores in that
 * category. A roll that doesn't qualify scores 0 — it is not an error.
 *
 * THE CATEGORIES
 *   ones … sixes     sum of dice showing that number      [1,1,2,4,4] ones → 2
 *   chance           sum of all dice                      [1,1,3,3,6] → 14
 *   yatzy            all five the same → 50
 *   pair             the HIGHEST pair, sum of those two   [3,3,3,4,4] → 8
 *   twoPairs         two DIFFERENT pairs, sum of the four [1,1,2,3,3] → 8
 *   threeOfAKind     sum of the three                     [3,3,3,4,5] → 9
 *   fourOfAKind      sum of the four                      [2,2,2,2,5] → 8
 *   smallStraight    exactly 1-2-3-4-5 → 15
 *   largeStraight    exactly 2-3-4-5-6 → 20
 *   fullHouse        exactly a three and a DIFFERENT pair, sum of all dice
 *                                                         [1,1,2,2,2] → 8
 *
 * DECISIONS ALREADY MADE FOR YOU (the European "Yatzy" variant)
 *   - Four or five of a kind DO contain a pair / three / four of a kind:
 *     [4,4,4,4,4] pair → 8, threeOfAKind → 12, fourOfAKind → 16.
 *   - Five of a kind is NOT twoPairs and NOT fullHouse.
 *   - Four of a kind is NOT twoPairs ([3,3,3,3,1] → 0), but a full house IS
 *     ([1,1,2,2,2] twoPairs → 6).
 *   - Dice must be five integers 1..6, otherwise throw a RangeError.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Yatzy (European) or Yahtzee (US)? They score straights differently.
 *   - Does a four-of-a-kind count as two pairs?
 *
 * HINT
 *   Compute ONE thing first: counts per face (index 1..6). Every category is
 *   then a few lines over `counts`. A record mapping Category → scorer
 *   function beats a 13-case if/else, and `Record<Category, ...>` makes the
 *   compiler tell you when you forgot one.
 *
 * FOLLOW-UPS
 *   - `bestCategory(dice, unusedCategories)` — the highest-scoring choice.
 *   - Add US Yahtzee rules without forking the code.
 */

export type Die = 1 | 2 | 3 | 4 | 5 | 6;
export type Dice = readonly [Die, Die, Die, Die, Die];

export type Category =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'chance'
  | 'yatzy'
  | 'pair'
  | 'twoPairs'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'smallStraight'
  | 'largeStraight'
  | 'fullHouse';

export function score(_dice: Dice, _category: Category): number {
  throw new Error('Not implemented');
}
