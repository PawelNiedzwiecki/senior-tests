/**
 * DRILL 1.5 — Discriminated unions and real exhaustiveness
 * ────────────────────────────────────────────────────────────────────────────
 * TIME BOX: 20 min      DIFFICULTY: ●●○○○ (types) / ●●●○○ (the follow-ups)
 *
 * WHAT YOU'RE BUILDING
 * The state model for a translation job, plus the tools that make adding a
 * new state a *compile error* everywhere it needs to be handled.
 *
 * WHY IT'S ASKED
 * Almost every senior candidate says "I use discriminated unions". Far fewer
 * can show the exhaustiveness check, explain why `default:` silently defeats
 * it, or say what `never` is doing in `assertNever`. This drill is short on
 * purpose — the value is in the explanation you give while writing it.
 *
 * YOUR TASK
 *   1. `StateOf<S>`   — narrow the union by its discriminant.
 *   2. `assertNever`  — the exhaustiveness guard.
 *   3. `describeState`— an exhaustive switch, no `default` branch.
 *   4. `NextStatus<S>`— which statuses may follow `S`.
 *
 * HINTS
 *   1. `Extract<Union, { status: S }>` does the narrowing, and it distributes
 *      over the union automatically.
 *   2. `assertNever(x: never)` compiles only when every case is handled — at
 *      that point the narrowed type of `x` really is `never`.
 *   3. Throw in `assertNever` too: types are erased, so a bad payload from the
 *      network still needs a runtime failure.
 *
 * STRETCH (these are the actual interview questions)
 *   a. Why does adding `default: return 'unknown'` destroy the check?
 *   b. Your API adds a `'cancelled'` status. Which lines light up red, and
 *      which silently keep compiling? (Hint: think about `Record` maps vs
 *      switch statements — one of them fails open.)
 *   c. Same shape, but the discriminant is a boolean (`ok: true | false`).
 *      Does narrowing still work? Does it work for `status?: 'a' | 'b'`?
 */

export type JobState =
  | { status: 'idle' }
  | { status: 'queued'; jobId: string }
  | { status: 'translating'; jobId: string; progress: number }
  | { status: 'done'; jobId: string; text: string }
  | { status: 'failed'; jobId: string; error: Error };

export type JobStatus = JobState['status'];

/** The single member of `JobState` whose discriminant is `S`. */
export type StateOf<S extends JobStatus> = never; // TODO

/** Statuses reachable from `S`. Model: idle→queued→translating→done|failed,
 *  done→idle, failed→idle|queued. */
export type NextStatus<S extends JobStatus> = never; // TODO

/** Compiles only if `value` is provably `never`; throws if reached anyway. */
export function assertNever(_value: never, _message?: string): never {
  throw new Error('TODO'); // TODO
}

/** Human-readable description. Must be exhaustive WITHOUT a `default` branch. */
export function describeState(_state: JobState): string {
  throw new Error('Not implemented'); // TODO
}
