import { describe, it, expect } from 'vitest';
import { rangeBitwiseAnd } from './bitwise-and-of-a-number-range.ts';
const sorted = (pair: [number, number]) => [...pair].sort((a, b) => a - b);



describe('rangeBitwiseAnd', () => {
  it('handles the prompt examples', () => {
    expect(rangeBitwiseAnd(5, 7)).toBe(4);
    expect(rangeBitwiseAnd(0, 0)).toBe(0);
    expect(rangeBitwiseAnd(1, 2147483647)).toBe(0);
    expect(rangeBitwiseAnd(12, 15)).toBe(12);
  });

  it('returns the value itself for a single-element range', () => {
    expect(rangeBitwiseAnd(1, 1)).toBe(1);
    expect(rangeBitwiseAnd(255, 255)).toBe(255);
  });

  it('returns 0 whenever the range crosses a power of two', () => {
    expect(rangeBitwiseAnd(7, 8)).toBe(0);
    expect(rangeBitwiseAnd(15, 16)).toBe(0);
    expect(rangeBitwiseAnd(0, 1)).toBe(0);
  });

  it('handles a huge range without iterating it', () => {
    // Reference: the common binary prefix, found by shifting rather than looping.
    const commonPrefix = (left: number, right: number) => {
      let shifts = 0;
      while (left !== right) {
        left >>= 1;
        right >>= 1;
        shifts += 1;
      }
      return left << shifts;
    };

    const started = Date.now();
    expect(rangeBitwiseAnd(2_000_000_000, 2_147_483_647)).toBe(
      commonPrefix(2_000_000_000, 2_147_483_647),
    );
    expect(rangeBitwiseAnd(1_000_000, 1_048_575)).toBe(commonPrefix(1_000_000, 1_048_575));
    expect(Date.now() - started).toBeLessThan(500);
  });

  it('agrees with a brute-force AND over small ranges', () => {
    for (let left = 0; left <= 40; left += 1) {
      for (let right = left; right <= 40; right += 1) {
        let expected = right;
        for (let n = left; n < right; n += 1) expected &= n;
        expect(rangeBitwiseAnd(left, right)).toBe(expected);
      }
    }
  });
});
