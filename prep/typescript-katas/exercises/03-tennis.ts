/**
 * KATA 03 — Tennis game score (stateful)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 30 min        Guide: ../README.md
 *
 * THE TASK
 * Implement `TennisGame`: it is constructed with two player names, is told
 * who won each point via `wonPoint(name)`, and reports the score of ONE game
 * via `getScore()`.
 *
 * THE RULES — scores are always "player1-player2"
 *   points 0/1/2/3 are called Love / Fifteen / Thirty / Forty.
 *   - Unequal, nobody past Forty:        "Fifteen-Love", "Thirty-Forty"
 *   - Equal and below 3 points each:     "Love-All", "Fifteen-All", "Thirty-All"
 *   - Equal and 3+ points each:          "Deuce"          (never "Forty-All")
 *   - Both 3+ and one point ahead:       "Advantage <name>"
 *   - 4+ points and two ahead:           "Win for <name>"
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - `wonPoint` with an unknown name throws an Error.
 *   - `wonPoint` after the game is won throws an Error.
 *   - The two names must differ; the constructor throws otherwise.
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Is 3–3 "Deuce" or "Forty-All"? (Here: Deuce.)
 *   - What happens on a point after the game is over?
 *   - Just one game, or sets/matches/tie-breaks later?
 *
 * HINT
 *   Store two integers. Derive EVERYTHING in getScore() — never store "the
 *   current label" or a state machine of strings. Then order your checks:
 *   equal → won → advantage → plain. Most bugs come from checking advantage
 *   before win.
 *
 * FOLLOW-UPS
 *   - Model the score as a discriminated union
 *     ({ kind: 'deuce' } | { kind: 'advantage'; player } | ...) and format it
 *     separately from the scoring logic.
 *   - Extend to sets and a tie-break without rewriting the game.
 */

export class TennisGame {
  constructor(_player1: string, _player2: string) {
    throw new Error('Not implemented');
  }

  wonPoint(_playerName: string): void {
    throw new Error('Not implemented');
  }

  getScore(): string {
    throw new Error('Not implemented');
  }
}
