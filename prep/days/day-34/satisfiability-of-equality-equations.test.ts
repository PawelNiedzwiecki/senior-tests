import { describe, it, expect } from 'vitest';
import { equationsPossible } from './satisfiability-of-equality-equations.ts';

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