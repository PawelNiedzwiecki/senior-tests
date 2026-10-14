/**
 * KATA 00 — Ten-pin bowling score            (the one you did today — reference)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 30 min        Guide: ../README.md
 *
 * THE TASK
 * Given every roll of ONE complete game as a flat array of pins knocked down,
 * return the final score.
 *
 * THE RULES
 *   - A game has 10 frames. In each frame the player has up to two rolls to
 *     knock down 10 pins.
 *   - OPEN FRAME: fewer than 10 pins in two rolls → score is the pins.
 *   - SPARE: all 10 pins in two rolls → 10 + the NEXT ONE roll.
 *   - STRIKE: all 10 pins on the first roll (frame ends) → 10 + the NEXT TWO
 *     rolls.
 *   - 10TH FRAME: a spare earns one fill ball, a strike earns two. Fill balls
 *     only count as bonus — they are not frames of their own.
 *
 * EXAMPLES
 *   20 × 0                                   →   0   gutter game
 *   20 × 1                                   →  20
 *   [5, 5, 3, ...17 × 0]                     →  16   spare: 10 + 3, then 3
 *   [10, 3, 4, ...16 × 0]                    →  24   strike: 10 + 3 + 4, then 7
 *   12 × 10                                  → 300   perfect game
 *   21 × 5                                   → 150   all spares
 *   [10,7,3,9,0,10,0,8,8,2,0,6,10,10,10,8,1] → 167
 *
 * DECISIONS ALREADY MADE FOR YOU (the tests rely on them)
 *   - Invalid input THROWS a RangeError: a roll outside 0–10 or not an integer,
 *     two rolls in one frame totalling more than 10, an incomplete game, or
 *     extra rolls after the game is over.
 *   - In the 10th frame, after a strike, the two fill balls follow normal pin
 *     rules: if the first is not a strike, the two together cannot exceed 10.
 *
 * CLARIFYING QUESTIONS WORTH ASKING (in an interview)
 *   - Is the input one complete game, or might I get a game in progress?
 *   - Throw on invalid input, or return an error value?
 *   - Flat rolls, or already grouped into frames?
 *
 * HINT
 *   Iterate FRAMES (exactly 10), not rolls, and keep an index into `rolls`.
 *   A strike advances the index by 1, everything else by 2. Iterating rolls
 *   is what makes the 10th frame's fill balls get counted twice.
 *
 * FOLLOW-UPS INTERVIEWERS ESCALATE TO
 *   - Score a game IN PROGRESS (return running score per frame).
 *   - Turn it into a stateful class: `game.roll(pins)` + `game.score()`.
 *   - Return frame-by-frame breakdown for a UI scoreboard.
 */

export function bowlingScore(_rolls: readonly number[]): number {
  throw new Error('Not implemented');
}
