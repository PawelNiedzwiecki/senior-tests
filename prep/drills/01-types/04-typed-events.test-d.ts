import { describe, it, expectTypeOf } from 'vitest';
import type { Equal, Expect } from '../../support/type-assertions.ts';
import type {
  TranslationEvents,
  TypedEmitter,
  Listener,
  Handlers,
  Unsubscribe,
} from '@impl/01-types/04-typed-events.ts';

declare const emitter: TypedEmitter<TranslationEvents>;

type _listener = [
  Expect<
    Equal<Listener<TranslationEvents, 'progress'>, (jobId: string, percent: number) => void>
  >,
  Expect<Equal<Listener<TranslationEvents, 'cancelled'>, () => void>>,
];

type _handlers = [
  Expect<
    Equal<
      Handlers<TranslationEvents>,
      {
        onProgress?: (jobId: string, percent: number) => void;
        onDone?: (result: { text: string; detectedLang: string }) => void;
        onFailed?: (error: Error) => void;
        onCancelled?: () => void;
      }
    >
  >,
];

describe('TypedEmitter', () => {
  it('infers listener parameters without annotations', () => {
    emitter.on('progress', (jobId, percent) => {
      expectTypeOf(jobId).toEqualTypeOf<string>();
      expectTypeOf(percent).toEqualTypeOf<number>();
    });

    emitter.on('done', (result) => {
      expectTypeOf(result).toEqualTypeOf<{ text: string; detectedLang: string }>();
    });
  });

  it('returns an unsubscribe function from on()', () => {
    expectTypeOf(emitter.on('cancelled', () => {})).toEqualTypeOf<Unsubscribe>();
  });

  it('enforces emit arity from the payload tuple', () => {
    emitter.emit('progress', 'job-1', 42);
    emitter.emit('cancelled');
    emitter.emit('failed', new Error('boom'));

    // @ts-expect-error - percent is missing
    emitter.emit('progress', 'job-1');

    // @ts-expect-error - percent must be a number
    emitter.emit('progress', 'job-1', '42');

    // @ts-expect-error - 'cancelled' carries no payload
    emitter.emit('cancelled', 1);

    // @ts-expect-error - unknown event
    emitter.emit('finished');
  });

  it('rejects listeners with the wrong shape', () => {
    // @ts-expect-error - 'done' gives one object, not two strings
    emitter.on('done', (_a: string, _b: string) => {});

    // @ts-expect-error - unknown event
    emitter.on('finished', () => {});
  });

  it('types once() as a promise of the payload tuple', () => {
    expectTypeOf(emitter.once('progress')).resolves.toEqualTypeOf<
      [jobId: string, percent: number]
    >();
  });
});
