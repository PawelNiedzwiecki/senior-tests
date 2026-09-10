import { describe, it, expect } from 'vitest';
import { climbStairs, houseRobber, coinChange } from '@algo/11-dynamic-programming.ts';

describe('climbStairs', () => {
  it('handles the prompt examples', () => {
    expect(climbStairs(2)).toBe(2);
    expect(climbStairs(3)).toBe(3);
  });

  it('handles the small base cases', () => {
    expect(climbStairs(0)).toBe(1); // one way: do nothing
    expect(climbStairs(1)).toBe(1);
  });

  it('follows Fibonacci', () => {
    expect([4, 5, 6, 7].map(climbStairs)).toEqual([5, 8, 13, 21]);
  });

  it('handles a large n without exponential blow-up', () => {
    // A naive O(2^n) recursion would never finish this.
    expect(climbStairs(40)).toBe(165_580_141);
  });
});

describe('houseRobber', () => {
  it('handles the prompt examples', () => {
    expect(houseRobber([1, 2, 3, 1])).toBe(4);
    expect(houseRobber([2, 7, 9, 3, 1])).toBe(12);
  });

  it('handles empty and single input', () => {
    expect(houseRobber([])).toBe(0);
    expect(houseRobber([5])).toBe(5);
  });

  it('takes the larger of two', () => {
    expect(houseRobber([2, 9])).toBe(9);
  });

  it('handles all zeroes', () => {
    expect(houseRobber([0, 0, 0])).toBe(0);
  });

  it('beats the greedy answer', () => {
    // Greedy by largest value takes 7 then 3 = 10; optimal is 2 + 9 + 1 = 12.
    expect(houseRobber([2, 7, 9, 3, 1])).toBe(12);
  });

  it('handles a long alternating run', () => {
    expect(houseRobber([5, 1, 5, 1, 5])).toBe(15);
  });
});

describe('coinChange', () => {
  it('beats the greedy answer', () => {
    // Greedy: 4 + 1 + 1 = 3 coins. Optimal: 3 + 3 = 2 coins.
    expect(coinChange([1, 3, 4], 6)).toBe(2);
  });

  it('handles the classic example', () => {
    expect(coinChange([1, 2, 5], 11)).toBe(3); // 5 + 5 + 1
  });

  it('returns -1 when impossible', () => {
    expect(coinChange([2], 3)).toBe(-1);
    expect(coinChange([5, 10], 3)).toBe(-1);
  });

  it('needs no coins for amount 0', () => {
    expect(coinChange([1, 2], 0)).toBe(0);
    expect(coinChange([], 0)).toBe(0);
  });

  it('returns -1 for a positive amount with no coins', () => {
    expect(coinChange([], 5)).toBe(-1);
  });

  it('handles an exact single coin', () => {
    expect(coinChange([7], 7)).toBe(1);
  });

  it('handles a large amount efficiently', () => {
    // 39×25 = 975, then 24 = 2×10 + 4×1. Total 39 + 2 + 4 = 45.
    expect(coinChange([1, 5, 10, 25], 999)).toBe(45);
  });
});
