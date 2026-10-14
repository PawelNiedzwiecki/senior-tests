/**
 * SOLUTION — Yatzy category scoring
 *
 * COMPLEXITY: O(1) — five dice, six faces.
 *
 * NARRATION:
 *   "I build a face-count histogram once. Every category is then a tiny pure
 *    function over the histogram, stored in a Record keyed by Category — so
 *    the type system guarantees every category has a scorer."
 *
 * HISTOGRAM FIRST. "Pair", "three of a kind", "full house" and "straight" are
 * all questions about counts, not about positions. Sorting the dice and
 * comparing neighbours works too, but every category then re-derives the
 * same information.
 *
 * `Record<Category, Scorer>` replaces a long switch AND is exhaustive: delete
 * one entry and it is a compile error.
 *
 * TYPES DON'T VALIDATE RUNTIME DATA. `Dice` is a tuple of 1..6 at compile
 * time, but values arriving from a UI or API can be anything — so `score`
 * still checks at runtime. Say that sentence in the interview.
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

const FACES: readonly Die[] = [1, 2, 3, 4, 5, 6];
const FACES_HIGH_FIRST: readonly Die[] = [6, 5, 4, 3, 2, 1];

/** counts[face] = how many dice show that face (index 0 unused). */
type Counts = readonly number[];
type Scorer = (counts: Counts, total: number) => number;

const countOf = (counts: Counts, face: Die): number => counts[face] ?? 0;

const faceScorer =
  (face: Die): Scorer =>
  (counts) =>
    countOf(counts, face) * face;

/** Sum of `n` of the highest face that appears at least `n` times. */
const ofAKind =
  (n: number): Scorer =>
  (counts) => {
    const face = FACES_HIGH_FIRST.find((f) => countOf(counts, f) >= n);
    return face ? face * n : 0;
  };

const straight =
  (from: Die): Scorer =>
  (counts, total) =>
    FACES.slice(from - 1, from + 4).every((f) => countOf(counts, f) === 1) ? total : 0;

const SCORERS: Record<Category, Scorer> = {
  ones: faceScorer(1),
  twos: faceScorer(2),
  threes: faceScorer(3),
  fours: faceScorer(4),
  fives: faceScorer(5),
  sixes: faceScorer(6),
  chance: (_, total) => total,
  yatzy: (counts) => (FACES.some((f) => countOf(counts, f) === 5) ? 50 : 0),
  pair: ofAKind(2),
  threeOfAKind: ofAKind(3),
  fourOfAKind: ofAKind(4),
  twoPairs: (counts) => {
    const pairs = FACES.filter((f) => countOf(counts, f) >= 2);
    return pairs.length === 2 ? pairs.reduce((sum, f) => sum + f * 2, 0) : 0;
  },
  smallStraight: straight(1),
  largeStraight: straight(2),
  fullHouse: (counts, total) => {
    const shape = FACES.map((f) => countOf(counts, f))
      .filter((c) => c > 0)
      .sort();
    return shape.length === 2 && shape[0] === 2 && shape[1] === 3 ? total : 0;
  },
};

export function score(dice: Dice, category: Category): number {
  if (dice.length !== 5 || !dice.every((v) => Number.isInteger(v) && v >= 1 && v <= 6)) {
    throw new RangeError(`Invalid dice: ${JSON.stringify(dice)}`);
  }

  const counts = Array<number>(7).fill(0);
  for (const die of dice) counts[die] = (counts[die] ?? 0) + 1;
  const total = dice.reduce<number>((sum, v) => sum + v, 0);

  return SCORERS[category](counts, total);
}
