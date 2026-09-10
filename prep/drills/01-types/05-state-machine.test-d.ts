import { describe, it } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import type {
  JobState,
  JobStatus,
  StateOf,
  NextStatus,
} from '@impl/01-types/05-state-machine.ts';

type _status = [Expect<Equal<JobStatus, 'idle' | 'queued' | 'translating' | 'done' | 'failed'>>];

type _narrowing = [
  Expect<Equal<StateOf<'idle'>, { status: 'idle' }>>,
  Expect<
    Equal<StateOf<'translating'>, { status: 'translating'; jobId: string; progress: number }>
  >,
  Expect<Equal<StateOf<'done'>, { status: 'done'; jobId: string; text: string }>>,
  // Distributes over a union of discriminants.
  Expect<
    Equal<StateOf<'idle' | 'failed'>, { status: 'idle' } | { status: 'failed'; jobId: string; error: Error }>
  >,
  // Every member is reachable, so the union round-trips.
  Expect<Equal<StateOf<JobStatus>, JobState>>,
];

type _transitions = [
  Expect<Equal<NextStatus<'idle'>, 'queued'>>,
  Expect<Equal<NextStatus<'queued'>, 'translating' | 'failed'>>,
  Expect<Equal<NextStatus<'translating'>, 'done' | 'failed'>>,
  Expect<Equal<NextStatus<'done'>, 'idle'>>,
  Expect<Equal<NextStatus<'failed'>, 'idle' | 'queued'>>,
];

describe('JobState', () => {
  it('narrows by discriminant', () => {});
});
