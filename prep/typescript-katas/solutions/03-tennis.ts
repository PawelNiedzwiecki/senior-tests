/**
 * SOLUTION — Tennis game score
 *
 * COMPLEXITY: O(1) per call.
 *
 * NARRATION:
 *   "State is two integers. The label is a pure function of those two
 *    numbers, so I derive it on every getScore() call instead of storing it.
 *    I compute a small discriminated union first and format it second, so the
 *    rules and the wording can change independently."
 *
 * MINIMAL STATE: storing "Advantage alice" or a state-machine enum invites
 * the two to drift apart. Two counters can't be inconsistent.
 *
 * ORDER OF CHECKS: won → equal → advantage → plain. "Win" must come before
 * "advantage" because 5–3 satisfies "both 3+ and someone ahead".
 *
 * `Score` IS A DISCRIMINATED UNION. `format` switches on `kind`, and the
 * `never` check makes the compiler fail if a new kind is added and not
 * formatted. That is what interviewers mean by "make illegal states
 * unrepresentable".
 */

const CALLS = ['Love', 'Fifteen', 'Thirty', 'Forty'] as const;

type Score =
  | { kind: 'won'; player: string }
  | { kind: 'deuce' }
  | { kind: 'all'; points: number }
  | { kind: 'advantage'; player: string }
  | { kind: 'plain'; p1: number; p2: number };

export class TennisGame {
  private p1Points = 0;
  private p2Points = 0;

  constructor(
    private readonly player1: string,
    private readonly player2: string,
  ) {
    if (player1 === player2) throw new Error('Players must have different names');
  }

  wonPoint(playerName: string): void {
    if (this.score().kind === 'won') throw new Error('Game is already over');
    if (playerName === this.player1) this.p1Points++;
    else if (playerName === this.player2) this.p2Points++;
    else throw new Error(`Unknown player: ${playerName}`);
  }

  getScore(): string {
    return format(this.score());
  }

  private score(): Score {
    const { p1Points: a, p2Points: b } = this;
    const leader = a > b ? this.player1 : this.player2;

    if (Math.max(a, b) >= 4 && Math.abs(a - b) >= 2) return { kind: 'won', player: leader };
    if (a === b) return a >= 3 ? { kind: 'deuce' } : { kind: 'all', points: a };
    if (a >= 3 && b >= 3) return { kind: 'advantage', player: leader };
    return { kind: 'plain', p1: a, p2: b };
  }
}

function format(score: Score): string {
  switch (score.kind) {
    case 'won':
      return `Win for ${score.player}`;
    case 'deuce':
      return 'Deuce';
    case 'all':
      return `${CALLS[score.points]}-All`;
    case 'advantage':
      return `Advantage ${score.player}`;
    case 'plain':
      return `${CALLS[score.p1]}-${CALLS[score.p2]}`;
    default: {
      const unreachable: never = score;
      return unreachable;
    }
  }
}
