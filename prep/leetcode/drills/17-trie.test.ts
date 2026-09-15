import { describe, it, expect } from 'vitest';
import { replaceWords, findMaximumXOR } from '@leetcode/17-trie.ts';

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

describe('findMaximumXOR', () => {
  it('handles the prompt examples', () => {
    expect(findMaximumXOR([3, 10, 5, 25, 2, 8])).toBe(28);
    expect(findMaximumXOR([0])).toBe(0);
    expect(findMaximumXOR([2, 4])).toBe(6);
  });

  it('handles an empty array and identical values', () => {
    expect(findMaximumXOR([])).toBe(0);
    expect(findMaximumXOR([7, 7, 7])).toBe(0);
  });

  it('handles zeroes mixed in', () => {
    expect(findMaximumXOR([0, 0, 15])).toBe(15);
  });

  it('handles large values', () => {
    expect(findMaximumXOR([1 << 29, (1 << 29) + 1, 1])).toBe((1 << 29) + 1);
    expect(findMaximumXOR([2147483647 >> 1, 0])).toBe(2147483647 >> 1);
  });

  it('agrees with the brute-force pair scan', () => {
    const brute = (nums: number[]) => {
      let best = 0;
      for (let i = 0; i < nums.length; i += 1)
        for (let j = i + 1; j < nums.length; j += 1) best = Math.max(best, nums[i]! ^ nums[j]!);
      return best;
    };

    const cases = [
      [3, 10, 5, 25, 2, 8],
      [14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70],
      [8, 10, 2],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [0, 1_000_000, 999_999, 12345],
    ];
    for (const nums of cases) expect(findMaximumXOR(nums)).toBe(brute(nums));
  });

  it('stays linear on a large input', () => {
    const nums = Array.from({ length: 20_000 }, (_, i) => (i * 7919) % 1_048_576);
    const started = Date.now();
    expect(findMaximumXOR(nums)).toBeGreaterThan(0);
    expect(Date.now() - started).toBeLessThan(3000);
  });
});
