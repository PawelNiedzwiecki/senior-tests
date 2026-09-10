import { describe, it, expect } from 'vitest';
import { Trie } from '@patterns/08-trie.ts';

const withWords = (...words: string[]) => {
  const trie = new Trie();
  for (const w of words) trie.insert(w);
  return trie;
};

describe('insert / search / startsWith', () => {
  it('finds an inserted word', () => {
    const trie = withWords('apple');
    expect(trie.search('apple')).toBe(true);
  });

  it('distinguishes a word from a prefix of one', () => {
    const trie = withWords('apple');
    expect(trie.search('app')).toBe(false); // the isWord flag test
    expect(trie.startsWith('app')).toBe(true);
  });

  it('finds a word that is also a prefix', () => {
    const trie = withWords('app', 'apple');
    expect(trie.search('app')).toBe(true);
    expect(trie.search('apple')).toBe(true);
  });

  it('rejects words that were never inserted', () => {
    const trie = withWords('apple');
    expect(trie.search('banana')).toBe(false);
    expect(trie.startsWith('ban')).toBe(false);
  });

  it('rejects a longer string than any stored word', () => {
    const trie = withWords('app');
    expect(trie.search('apple')).toBe(false);
    expect(trie.startsWith('apple')).toBe(false);
  });

  it('handles the empty string', () => {
    const trie = withWords('a');
    expect(trie.search('')).toBe(false);
    expect(trie.startsWith('')).toBe(true); // every word starts with ''
  });

  it('treats an inserted empty string as a word', () => {
    const trie = withWords('');
    expect(trie.search('')).toBe(true);
  });

  it('is idempotent on repeated inserts', () => {
    const trie = withWords('dog', 'dog');
    expect(trie.search('dog')).toBe(true);
    expect(trie.wordsWithPrefix('d')).toEqual(['dog']);
  });

  it('is case-sensitive', () => {
    const trie = withWords('Apple');
    expect(trie.search('apple')).toBe(false);
    expect(trie.search('Apple')).toBe(true);
  });
});

describe('wordsWithPrefix', () => {
  it('collects every word under a prefix, sorted', () => {
    const trie = withWords('app', 'apple', 'apply', 'banana');
    expect(trie.wordsWithPrefix('app')).toEqual(['app', 'apple', 'apply']);
  });

  it('returns sorted order regardless of insertion order', () => {
    const trie = withWords('apply', 'apple', 'app');
    expect(trie.wordsWithPrefix('app')).toEqual(['app', 'apple', 'apply']);
  });

  it('handles a prefix matching one word', () => {
    const trie = withWords('app', 'banana');
    expect(trie.wordsWithPrefix('b')).toEqual(['banana']);
  });

  it('returns an empty list for an unknown prefix', () => {
    const trie = withWords('app');
    expect(trie.wordsWithPrefix('xyz')).toEqual([]);
  });

  it('returns everything for the empty prefix', () => {
    const trie = withWords('b', 'a', 'c');
    expect(trie.wordsWithPrefix('')).toEqual(['a', 'b', 'c']);
  });

  it('handles an empty trie', () => {
    expect(new Trie().wordsWithPrefix('a')).toEqual([]);
  });

  it('includes the prefix itself when it is a word', () => {
    const trie = withWords('do', 'dog', 'dodge');
    expect(trie.wordsWithPrefix('do')).toEqual(['do', 'dodge', 'dog']);
  });
});

describe('searchPattern', () => {
  it('matches a wildcard at any position', () => {
    const trie = withWords('bad', 'dad', 'mad');
    expect(trie.searchPattern('.ad')).toBe(true);
    expect(trie.searchPattern('b..')).toBe(true);
    expect(trie.searchPattern('..d')).toBe(true);
  });

  it('requires the length to match', () => {
    const trie = withWords('bad');
    expect(trie.searchPattern('b.')).toBe(false);
    expect(trie.searchPattern('b...')).toBe(false);
  });

  it('matches an exact pattern with no wildcards', () => {
    const trie = withWords('bad');
    expect(trie.searchPattern('bad')).toBe(true);
    expect(trie.searchPattern('bat')).toBe(false);
  });

  it('matches all wildcards', () => {
    const trie = withWords('bad');
    expect(trie.searchPattern('...')).toBe(true);
    expect(trie.searchPattern('....')).toBe(false);
  });

  it('returns false on an empty trie', () => {
    expect(new Trie().searchPattern('.')).toBe(false);
  });

  it('does not match a prefix that is not a word', () => {
    const trie = withWords('apple');
    expect(trie.searchPattern('app')).toBe(false);
    expect(trie.searchPattern('a..')).toBe(false);
  });

  it('backtracks across several branches', () => {
    const trie = withWords('cat', 'cot', 'cut');
    expect(trie.searchPattern('c.t')).toBe(true);
    expect(trie.searchPattern('c.p')).toBe(false);
  });
});
