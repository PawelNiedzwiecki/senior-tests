import { describe, it, expect } from 'vitest';
import { equationsPossible, accountsMerge } from '@leetcode/15-union-find.ts';

describe('equationsPossible', () => {
  it('handles the prompt examples', () => {
    expect(equationsPossible(['a==b', 'b!=a'])).toBe(false);
    expect(equationsPossible(['a==b', 'b==c', 'a==c'])).toBe(true);
    expect(equationsPossible(['a==b', 'b!=c', 'c==a'])).toBe(false);
    expect(equationsPossible(['a!=a'])).toBe(false);
  });

  it('accepts a trivially satisfiable system', () => {
    expect(equationsPossible([])).toBe(true);
    expect(equationsPossible(['a==a'])).toBe(true);
    expect(equationsPossible(['a!=b'])).toBe(true);
  });

  it('requires equalities to be processed before inequalities', () => {
    // A single interleaved pass answers this one wrongly.
    expect(equationsPossible(['a!=b', 'a==b'])).toBe(false);
    expect(equationsPossible(['c!=d', 'a==b', 'b==c', 'c==d'])).toBe(false);
  });

  it('handles long transitive chains', () => {
    const chain = ['a==b', 'b==c', 'c==d', 'd==e', 'e==f'];
    expect(equationsPossible([...chain, 'a==f'])).toBe(true);
    expect(equationsPossible([...chain, 'a!=f'])).toBe(false);
  });

  it('keeps separate groups separate', () => {
    expect(equationsPossible(['a==b', 'c==d', 'a!=c'])).toBe(true);
    expect(equationsPossible(['a==b', 'c==d', 'b==c', 'a!=d'])).toBe(false);
  });
});

/** Account order is unspecified, so compare as a normalised set. */
const normalise = (accounts: string[][]) =>
  accounts.map((account) => account.join('|')).sort();

describe('accountsMerge', () => {
  it('handles the prompt example', () => {
    const merged = accountsMerge([
      ['John', 'a@x.com', 'b@x.com'],
      ['John', 'b@x.com', 'c@x.com'],
      ['Mary', 'm@x.com'],
    ]);

    expect(normalise(merged)).toEqual(
      normalise([
        ['John', 'a@x.com', 'b@x.com', 'c@x.com'],
        ['Mary', 'm@x.com'],
      ]),
    );
  });

  it('does NOT merge two different people who share a name', () => {
    const merged = accountsMerge([
      ['John', 'a@x.com'],
      ['John', 'b@x.com'],
    ]);
    expect(merged.length).toBe(2);
  });

  it('merges transitively through an intermediate account', () => {
    const merged = accountsMerge([
      ['Ann', 'a@x.com', 'b@x.com'],
      ['Ann', 'c@x.com', 'd@x.com'],
      ['Ann', 'b@x.com', 'c@x.com'],
    ]);
    expect(merged.length).toBe(1);
    expect(merged[0]).toEqual(['Ann', 'a@x.com', 'b@x.com', 'c@x.com', 'd@x.com']);
  });

  it('sorts the emails of each account ascending', () => {
    const merged = accountsMerge([['Zed', 'z@x.com', 'a@x.com', 'm@x.com']]);
    expect(merged[0]).toEqual(['Zed', 'a@x.com', 'm@x.com', 'z@x.com']);
  });

  it('deduplicates emails repeated within one account', () => {
    const merged = accountsMerge([['Bob', 'b@x.com', 'b@x.com', 'a@x.com']]);
    expect(merged[0]).toEqual(['Bob', 'a@x.com', 'b@x.com']);
  });

  it('handles accounts with no emails and an empty input', () => {
    expect(accountsMerge([])).toEqual([]);
    expect(accountsMerge([['Solo']])).toEqual([]);
  });

  it('handles a chain of many accounts', () => {
    const accounts = Array.from({ length: 200 }, (_, i) => [
      'Chain',
      `e${i}@x.com`,
      `e${i + 1}@x.com`,
    ]);
    const merged = accountsMerge(accounts);
    expect(merged.length).toBe(1);
    expect(merged[0]!.length).toBe(202); // the name plus 201 distinct emails
  });
});
