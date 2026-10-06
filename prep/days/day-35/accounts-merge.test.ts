import { describe, it, expect } from 'vitest';
import { accountsMerge } from './accounts-merge.ts';

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
