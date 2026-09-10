/**
 * SOLUTION 1.5 — Discriminated unions and real exhaustiveness
 *
 * Talking points:
 *
 * 1. WHY `never` WORKS. In the last `case`, control flow analysis has removed
 *    every union member, so the narrowed type of `state` is `never`. `never`
 *    is assignable to every type but nothing is assignable to `never`, so the
 *    call typechecks *only* while the switch is exhaustive. Add a case to the
 *    union and the argument becomes the unhandled member — instant red.
 *
 * 2. NO `default` BRANCH. A `default` handles the remaining members, so the
 *    narrowed type never reaches `never` and the guard becomes decorative.
 *    Same for `if/else if/else`. This is the trap in the follow-up question.
 *
 * 3. IT STILL THROWS. Types vanish at runtime. A backend that ships a new
 *    status hits this line, and silently returning `''` would turn a type
 *    hole into a user-visible bug. Include the value in the message.
 *
 * 4. `Extract<T, U>` IS DISTRIBUTIVE, which is why `StateOf<'idle' | 'failed'>`
 *    gives a two-member union rather than `never`. Distribution is a feature
 *    here; drill 1.7 covers when it bites you instead.
 *
 * 5. WHERE EXHAUSTIVENESS FAILS OPEN. A `Record<JobStatus, X>` lookup table
 *    errors when you add a status (good), but `Partial<Record<...>>` or an
 *    object with an index signature does not. If asked "what breaks when we
 *    add 'cancelled'", the honest answer names both the places that go red
 *    and the places that do not.
 */

export type JobState =
  | { status: 'idle' }
  | { status: 'queued'; jobId: string }
  | { status: 'translating'; jobId: string; progress: number }
  | { status: 'done'; jobId: string; text: string }
  | { status: 'failed'; jobId: string; error: Error };

export type JobStatus = JobState['status'];

export type StateOf<S extends JobStatus> = Extract<JobState, { status: S }>;

type TransitionMap = {
  idle: 'queued';
  queued: 'translating' | 'failed';
  translating: 'done' | 'failed';
  done: 'idle';
  failed: 'idle' | 'queued';
};

// Using `Record<JobStatus, JobStatus>` as the constraint means a new status
// added to JobState breaks THIS line too, not just the switch below.
export type NextStatus<S extends JobStatus> = TransitionMap[S];

export function assertNever(value: never, message = 'Unhandled union member'): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}

export function describeState(state: JobState): string {
  switch (state.status) {
    case 'idle':
      return 'Nothing to translate';
    case 'queued':
      return `Job ${state.jobId} is queued`;
    case 'translating':
      return `Job ${state.jobId} is ${state.progress}% translated`;
    case 'done':
      return `Job ${state.jobId} produced ${state.text.length} characters`;
    case 'failed':
      return `Job ${state.jobId} failed: ${state.error.message}`;
    // No `default`. That is the point — see talking point 2.
  }
  return assertNever(state, 'Unhandled job status');
}
