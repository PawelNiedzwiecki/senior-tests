/**
 * MODULE 05 — Stacks, queues and monotonic stacks
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min      DIFFICULTY: ●●●○○
 *
 * THE PATTERN
 * A stack is the right tool whenever the answer depends on the MOST RECENT
 * unresolved thing. That is a surprisingly large family:
 *   - matching pairs (brackets, tags, quotes)
 *   - undo / history
 *   - "the previous larger/smaller element" → MONOTONIC STACK
 *   - iterative replacements for recursion (an explicit stack IS the call stack)
 *
 * IN JAVASCRIPT: a plain array is your stack. `push`/`pop` are O(1) amortised.
 * A queue is the trap — `shift()` is O(n) because it re-indexes the whole
 * array. For interview-sized inputs that is usually fine, but SAY SO:
 *   "I'm using shift() for readability; it's O(n), so for large inputs I'd keep
 *    a head index and advance it instead, or use a linked list."
 * That single sentence converts a weakness into a signal.
 *
 * MONOTONIC STACK — the pattern worth learning properly. Keep the stack sorted
 * (increasing or decreasing). When the incoming element breaks the order, pop
 * — and each pop is the moment you have learned that element's answer. Every
 * element is pushed once and popped once, so it is O(n) despite the nested
 * loops. That amortised argument is the thing to say out loud.
 *
 * RECOGNITION CUES: "next greater", "previous smaller", "how many days until",
 * "largest rectangle", "valid nesting".
 */

/**
 * PROBLEM 1 — Valid Parentheses
 * `s` contains only ()[]{}. Return whether every bracket is closed correctly
 * and in the right order.
 *
 *   isValidParentheses('()[]{}') → true
 *   isValidParentheses('(]')     → false
 *   isValidParentheses('([)]')   → false
 *   isValidParentheses('')       → true
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: push openers; on a closer, the top of the stack must be its match.
 *       Two failure modes to handle explicitly: a closer with an EMPTY stack,
 *       and a NON-EMPTY stack at the end.
 */
export function isValidParentheses(_s: string): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Min Stack
 * A stack that also reports its minimum in O(1).
 *
 *   const s = new MinStack();
 *   s.push(-2); s.push(0); s.push(-3);
 *   s.getMin(); // -3
 *   s.pop();
 *   s.getMin(); // -2
 *
 * TARGET: every operation O(1). `getMin` scanning the stack is O(n) and is the
 * answer this problem exists to reject.
 * HINT: a second stack holding the minimum AS OF each push. Push to it on every
 *       push (repeating the current min if it does not improve) and the two
 *       stacks stay in lockstep, which makes `pop` trivially correct.
 * DECIDE AND SAY: what should `pop`/`top`/`getMin` do when empty? Throwing,
 *       returning undefined, and returning null are all defensible. These tests
 *       expect `undefined`.
 */
export class MinStack {
  push(_value: number): void {
    throw new Error('Not implemented');
  }

  pop(): number | undefined {
    throw new Error('Not implemented');
  }

  top(): number | undefined {
    throw new Error('Not implemented');
  }

  getMin(): number | undefined {
    throw new Error('Not implemented');
  }

  get size(): number {
    throw new Error('Not implemented');
  }
}

/**
 * PROBLEM 3 — Daily Temperatures  ★ the monotonic stack ★
 * For each day, how many days until a WARMER temperature? 0 if never.
 *
 *   dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])
 *     → [1, 1, 4, 2, 1, 1, 0, 0]
 *
 * TARGET: O(n) time, O(n) space. Brute force is O(n²).
 * HINT: keep a stack of INDICES whose answer is still unknown, with
 *       temperatures decreasing. When today is warmer than the top, you have
 *       just found that day's answer — pop it and record `today - thatDay`.
 *       Repeat while the stack top is colder.
 * THE COMPLEXITY ARGUMENT: it looks O(n²) because of the inner while, but each
 *       index is pushed once and popped at most once — 2n operations total.
 *       Say this; it is the whole point of the problem.
 */
export function dailyTemperatures(_temperatures: number[]): number[] {
  throw new Error('Not implemented');
}
