import { describe, it, expect } from 'vitest';
import { isValidParentheses, MinStack, dailyTemperatures } from '@algo/05-stack-queue.ts';

describe('isValidParentheses', () => {
  it('accepts well-formed input', () => {
    expect(isValidParentheses('()')).toBe(true);
    expect(isValidParentheses('()[]{}')).toBe(true);
    expect(isValidParentheses('{[()]}')).toBe(true);
  });

  it('rejects mismatched pairs', () => {
    expect(isValidParentheses('(]')).toBe(false);
    expect(isValidParentheses('([)]')).toBe(false);
  });

  it('accepts the empty string', () => {
    expect(isValidParentheses('')).toBe(true);
  });

  it('rejects an unclosed opener', () => {
    expect(isValidParentheses('(')).toBe(false);
    expect(isValidParentheses('([]')).toBe(false);
  });

  it('rejects a closer with nothing open', () => {
    expect(isValidParentheses(')')).toBe(false);
    expect(isValidParentheses('()]')).toBe(false);
  });

  it('handles deep nesting', () => {
    expect(isValidParentheses('('.repeat(500) + ')'.repeat(500))).toBe(true);
    expect(isValidParentheses('('.repeat(500) + ')'.repeat(499))).toBe(false);
  });
});

describe('MinStack', () => {
  it('tracks the minimum through pushes and pops', () => {
    const s = new MinStack();
    s.push(-2);
    s.push(0);
    s.push(-3);
    expect(s.getMin()).toBe(-3);
    expect(s.pop()).toBe(-3);
    expect(s.top()).toBe(0);
    expect(s.getMin()).toBe(-2);
  });

  it('handles duplicate minimums', () => {
    const s = new MinStack();
    s.push(1);
    s.push(1);
    s.push(2);
    expect(s.getMin()).toBe(1);
    s.pop();
    expect(s.getMin()).toBe(1);
    s.pop();
    // Both 1s must be accounted for — popping one must not lose the other.
    expect(s.getMin()).toBe(1);
  });

  it('handles an increasing sequence', () => {
    const s = new MinStack();
    [3, 4, 5].forEach((n) => s.push(n));
    expect(s.getMin()).toBe(3);
    s.pop();
    expect(s.getMin()).toBe(3);
  });

  it('returns undefined when empty', () => {
    const s = new MinStack();
    expect(s.pop()).toBeUndefined();
    expect(s.top()).toBeUndefined();
    expect(s.getMin()).toBeUndefined();
    expect(s.size).toBe(0);
  });

  it('recovers after being emptied', () => {
    const s = new MinStack();
    s.push(5);
    s.pop();
    expect(s.getMin()).toBeUndefined();
    s.push(9);
    expect(s.getMin()).toBe(9);
    expect(s.size).toBe(1);
  });

  it('reports its size', () => {
    const s = new MinStack();
    s.push(1);
    s.push(2);
    expect(s.size).toBe(2);
    s.pop();
    expect(s.size).toBe(1);
  });
});

describe('dailyTemperatures', () => {
  it('handles the prompt example', () => {
    expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([
      1, 1, 4, 2, 1, 1, 0, 0,
    ]);
  });

  it('returns zeroes for a non-increasing sequence', () => {
    expect(dailyTemperatures([5, 4, 3, 2])).toEqual([0, 0, 0, 0]);
  });

  it('returns ones for a strictly increasing sequence', () => {
    expect(dailyTemperatures([1, 2, 3, 4])).toEqual([1, 1, 1, 0]);
  });

  it('handles all-equal temperatures (equal is not warmer)', () => {
    expect(dailyTemperatures([5, 5, 5])).toEqual([0, 0, 0]);
  });

  it('handles empty and single-element input', () => {
    expect(dailyTemperatures([])).toEqual([]);
    expect(dailyTemperatures([50])).toEqual([0]);
  });

  it('agrees with brute force on a longer input', () => {
    const temps = [30, 60, 90, 20, 10, 50, 40, 70, 65, 80];
    const brute = temps.map((t, i) => {
      for (let j = i + 1; j < temps.length; j += 1) if (temps[j]! > t) return j - i;
      return 0;
    });
    expect(dailyTemperatures(temps)).toEqual(brute);
  });
});
