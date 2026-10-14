/**
 * SOLUTION — Ten-pin bowling score
 *
 * COMPLEXITY: O(n) time, O(1) extra space.
 *
 * NARRATION:
 *   "A game is exactly ten frames, so I loop over frames and keep a cursor
 *    into the rolls. A strike consumes one roll and peeks at the next two; a
 *    spare consumes two and peeks at one; an open frame consumes two. The
 *    10th frame is the only special case: its bonus rolls are consumed, not
 *    just peeked at, so I advance the cursor past them."
 *
 * WHY FRAMES, NOT ROLLS: looping over rolls means you must work out which
 * frame each roll belongs to, and the fill balls look like an 11th and 12th
 * frame. Looping over frames makes "10" a constant in the code, which is
 * exactly what the domain says.
 *
 * `roll(k)` IS A GUARDED READ. With `noUncheckedIndexedAccess` every
 * `rolls[k]` is `number | undefined`; one helper turns "undefined" into the
 * domain error "incomplete game" instead of scattering `?? 0` around — and
 * `?? 0` would be a BUG here, because it would silently score a half game.
 *
 * VALIDATE AT THE BOUNDARY: per-roll checks up front, per-frame checks in the
 * loop, and "too many rolls" once at the end. Every throw names the problem.
 */

const PINS = 10;
const FRAMES = 10;

export function bowlingScore(rolls: readonly number[]): number {
  for (const pins of rolls) {
    if (!Number.isInteger(pins) || pins < 0 || pins > PINS) {
      throw new RangeError(`Invalid roll: ${pins}`);
    }
  }

  const roll = (k: number): number => {
    const pins = rolls[k];
    if (pins === undefined) throw new RangeError('Incomplete game');
    return pins;
  };

  let score = 0;
  let cursor = 0;

  for (let frame = 1; frame <= FRAMES; frame++) {
    const isLast = frame === FRAMES;
    const first = roll(cursor);

    if (first === PINS) {
      const bonus1 = roll(cursor + 1);
      const bonus2 = roll(cursor + 2);
      // Earlier frames validate these rolls as their own frame; in the 10th
      // nobody else will, so check them here.
      if (isLast && bonus1 !== PINS && bonus1 + bonus2 > PINS) {
        throw new RangeError('10th-frame fill balls knock down more than 10 pins');
      }
      score += PINS + bonus1 + bonus2;
      cursor += isLast ? 3 : 1;
      continue;
    }

    const second = roll(cursor + 1);
    if (first + second > PINS) {
      throw new RangeError(`Frame ${frame} knocks down more than ${PINS} pins`);
    }

    if (first + second === PINS) {
      score += PINS + roll(cursor + 2);
      cursor += isLast ? 3 : 2;
    } else {
      score += first + second;
      cursor += 2;
    }
  }

  if (cursor !== rolls.length) throw new RangeError('Rolls after the game is over');
  return score;
}
