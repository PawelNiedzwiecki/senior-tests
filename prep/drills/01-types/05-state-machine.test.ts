import { describe, it, expect } from 'vitest';
import { describeState, assertNever } from '@impl/01-types/05-state-machine.ts';
import type { JobState } from '@impl/01-types/05-state-machine.ts';

describe('describeState', () => {
  const cases: Array<[JobState, string]> = [
    [{ status: 'idle' }, 'Nothing to translate'],
    [{ status: 'queued', jobId: 'j1' }, 'Job j1 is queued'],
    [{ status: 'translating', jobId: 'j1', progress: 42 }, 'Job j1 is 42% translated'],
    [{ status: 'done', jobId: 'j1', text: 'Hallo Welt' }, 'Job j1 produced 10 characters'],
    [{ status: 'failed', jobId: 'j1', error: new Error('offline') }, 'Job j1 failed: offline'],
  ];

  it.each(cases)('describes %o', (state, expected) => {
    expect(describeState(state)).toBe(expected);
  });
});

describe('assertNever', () => {
  it('throws when reached at runtime', () => {
    // Types are erased. A server that invents a new status will land here,
    // so the guard has to fail loudly rather than fall through.
    const rogue = { status: 'cancelled' } as unknown as never;
    expect(() => assertNever(rogue)).toThrow();
  });

  it('includes the offending value in the message', () => {
    const rogue = { status: 'cancelled' } as unknown as never;
    expect(() => assertNever(rogue)).toThrow(/cancelled/);
  });
});
