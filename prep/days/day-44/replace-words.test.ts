import { describe, it, expect } from 'vitest';
import { replaceWords } from './replace-words.ts';

describe('replaceWords', () => {
  it('handles the prompt examples', () => {
    expect(replaceWords(['cat', 'bat', 'rat'], 'the cattle was rattled by the battery')).toBe(
      'the cat was rat by the bat',
    );
    expect(replaceWords(['a', 'aa', 'aaa'], 'a aa aaa aaaa')).toBe('a a a a');
    expect(replaceWords(['cat'], 'dog')).toBe('dog');
  });

  it('prefers the SHORTEST root', () => {
    expect(replaceWords(['catt', 'cat', 'bat'], 'the cattle was rattled by the battery')).toBe(
      'the cat was rattled by the bat',
    );
  });

  it('leaves words untouched when no root matches', () => {
    expect(replaceWords(['xyz'], 'hello world')).toBe('hello world');
    expect(replaceWords([], 'hello world')).toBe('hello world');
  });

  it('replaces a word that IS a root exactly', () => {
    expect(replaceWords(['cat'], 'cat')).toBe('cat');
  });

  it('does not treat an incidental prefix as a root', () => {
    // 'ca' is only on the path to 'cat' — it is not a root itself.
    expect(replaceWords(['cat'], 'car')).toBe('car');
  });

  it('handles a single word sentence', () => {
    expect(replaceWords(['b'], 'battery')).toBe('b');
  });

  it('handles a large dictionary', () => {
    const dictionary = Array.from({ length: 2000 }, (_, i) => `root${i}`);
    expect(replaceWords(dictionary, 'root7extra root9999 plain')).toBe('root7 root9 plain');
  });
});