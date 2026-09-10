import { describe, it, expect, vi } from 'vitest';
import { streamSentences } from '@impl/02-async/06-stream-sentences.ts';
import { delay } from '../../support/async-helpers.ts';

async function* fromArray(chunks: string[], gapMs = 0): AsyncGenerator<string> {
  for (const chunk of chunks) {
    if (gapMs) await delay(gapMs);
    yield chunk;
  }
}

async function collect(source: AsyncIterable<string>): Promise<string[]> {
  const out: string[] = [];
  for await (const item of source) out.push(item);
  return out;
}

describe('streamSentences', () => {
  it('splits a single chunk into sentences', async () => {
    const result = await collect(streamSentences(fromArray(['Guten Tag. Wie geht es dir?'])));
    expect(result).toEqual(['Guten Tag.', 'Wie geht es dir?']);
  });

  it('buffers across chunk boundaries', async () => {
    const result = await collect(
      streamSentences(fromArray(['Guten ', 'Tag. Wie geht', ' es dir? Gut.'])),
    );
    expect(result).toEqual(['Guten Tag.', 'Wie geht es dir?', 'Gut.']);
  });

  it('handles a terminator split across chunks', async () => {
    const result = await collect(streamSentences(fromArray(['Hallo Welt', '.', ' Noch was.'])));
    expect(result).toEqual(['Hallo Welt.', 'Noch was.']);
  });

  it('flushes an unterminated tail at the end of the stream', async () => {
    const result = await collect(streamSentences(fromArray(['Fertig. Kein Punkt hier'])));
    expect(result).toEqual(['Fertig.', 'Kein Punkt hier']);
  });

  it('keeps all three terminators', async () => {
    const result = await collect(
      streamSentences(fromArray(['Was? Wirklich! Ja. Vielleicht…  Ende'])),
    );
    expect(result).toEqual(['Was?', 'Wirklich!', 'Ja.', 'Vielleicht…', 'Ende']);
  });

  it('never yields whitespace-only fragments', async () => {
    const result = await collect(streamSentences(fromArray(['Eins.   ', '   ', '  \n  '])));
    expect(result).toEqual(['Eins.']);
  });

  it('yields nothing for an empty stream', async () => {
    expect(await collect(streamSentences(fromArray([])))).toEqual([]);
    expect(await collect(streamSentences(fromArray(['', '', ''])))).toEqual([]);
  });

  it('emits each sentence as soon as it is complete, not at the end', async () => {
    const seen: string[] = [];
    const source = fromArray(['Erste. ', 'Zweite. ', 'Dritte.'], 5);

    for await (const sentence of streamSentences(source)) {
      seen.push(sentence);
      // If the implementation buffered the whole stream, all three would be
      // present on the first iteration.
      if (seen.length === 1) expect(seen).toEqual(['Erste.']);
    }

    expect(seen).toEqual(['Erste.', 'Zweite.', 'Dritte.']);
  });

  it('is lazy — nothing is pulled before the first next()', async () => {
    const pull = vi.fn();
    async function* tracked(): AsyncGenerator<string> {
      pull();
      yield 'Hallo.';
    }

    const iterator = streamSentences(tracked());
    expect(pull).not.toHaveBeenCalled();

    await iterator.next();
    expect(pull).toHaveBeenCalledTimes(1);
  });

  it('propagates an error from the source', async () => {
    async function* failing(): AsyncGenerator<string> {
      yield 'Erste. ';
      throw new Error('connection reset');
    }

    await expect(collect(streamSentences(failing()))).rejects.toThrow('connection reset');
  });

  it('handles a terminator at the very end with no trailing space', async () => {
    const result = await collect(streamSentences(fromArray(['Nur ein Satz.'])));
    expect(result).toEqual(['Nur ein Satz.']);
  });

  it('treats a newline as a sentence boundary after a terminator', async () => {
    const result = await collect(streamSentences(fromArray(['Zeile eins.\nZeile zwei.'])));
    expect(result).toEqual(['Zeile eins.', 'Zeile zwei.']);
  });
});
