/**
 * SOLUTIONS 05 — Stacks, queues and monotonic stacks
 */

/**
 * PROBLEM 1 — Valid Parentheses
 *
 * NARRATION:
 *   "Nesting means the most recently opened bracket must close first — that's
 *    last-in-first-out, so a stack. Push openers; on a closer, the top must be
 *    its match. Two failure modes besides a mismatch: a closer with an empty
 *    stack, and leftovers at the end."
 *
 * COMPLEXITY: O(n) time, O(n) space — worst case '((((((' pushes everything.
 *
 * THE PAIRS MAP is cleaner than three if-branches and generalises for free when
 * the interviewer adds a bracket type. Keying it closer → opener (rather than
 * the other way round) means the lookup also acts as the "is this a closer?"
 * test, so you need one map, not two.
 *
 * FOLLOW-UP: "return the index of the first invalid character" — trivial once
 * you have this shape; return `i` instead of `false`. Worth offering.
 */
const CLOSER_TO_OPENER = new Map([
  [')', '('],
  [']', '['],
  ['}', '{'],
]);

export function isValidParentheses(s: string): boolean {
  const stack: string[] = [];

  for (const char of s) {
    const expectedOpener = CLOSER_TO_OPENER.get(char);

    if (expectedOpener === undefined) {
      stack.push(char); // it is an opener
    } else if (stack.pop() !== expectedOpener) {
      // Covers both "wrong match" and "nothing open" — pop() on an empty
      // array is undefined, which never equals an opener.
      return false;
    }
  }

  return stack.length === 0; // leftovers mean unclosed openers
}

/**
 * PROBLEM 2 — Min Stack
 *
 * NARRATION:
 *   "getMin has to be O(1), so I can't scan. I'll keep a parallel stack whose
 *    top is always the minimum of everything currently in the main stack. On
 *    push I append min(value, currentMin) — even when the value isn't a new
 *    minimum. That keeps the two stacks the same height, so pop is just two
 *    pops and can't get out of sync."
 *
 * COMPLEXITY: every operation O(1). O(n) extra space.
 *
 * WHY PUSH THE REPEATED MINIMUM rather than only on improvement: the
 * space-optimised variant (push only when value <= min) needs `<=` not `<`, or
 * duplicate minimums break — pop the first 1 of [1, 1] and you lose the record
 * of the second. That off-by-one is precisely why the "duplicate minimums" test
 * exists. The simple version cannot have that bug at all. Offer the optimisation,
 * explain the hazard, then say you'd ship the simple one.
 */
export class MinStack {
  private readonly values: number[] = [];
  private readonly minima: number[] = [];

  push(value: number): void {
    this.values.push(value);
    const currentMin = this.minima[this.minima.length - 1];
    this.minima.push(currentMin === undefined ? value : Math.min(currentMin, value));
  }

  pop(): number | undefined {
    this.minima.pop();
    return this.values.pop();
  }

  top(): number | undefined {
    return this.values[this.values.length - 1];
  }

  getMin(): number | undefined {
    return this.minima[this.minima.length - 1];
  }

  get size(): number {
    return this.values.length;
  }
}

/**
 * PROBLEM 3 — Daily Temperatures (monotonic stack)
 *
 * NARRATION — lead with the observation, not the data structure:
 *   "Brute force is O(n²): for each day scan forward. The waste is that when I
 *    find a warm day, it answers the question for SEVERAL earlier days at once,
 *    and brute force rediscovers that each time. So I'll keep a stack of days
 *    whose answer is still unknown, with temperatures decreasing. Today resolves
 *    every day on the stack that it beats."
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *   The inner `while` looks like it makes this quadratic. It does not: each
 *   index is pushed exactly once and popped at most once, so the total work
 *   across the whole run is bounded by 2n. State this as an AMORTISED argument
 *   — being able to justify O(n) in the presence of a nested loop is the whole
 *   reason this problem is asked.
 *
 * WHY INDICES ON THE STACK, not temperatures: the answer is a distance, so you
 * need to know where each unresolved day was.
 *
 * `>` NOT `>=`: the question asks for a strictly WARMER day. `[5,5,5]` must be
 * all zeroes, which is what that test checks.
 */
export function dailyTemperatures(temperatures: number[]): number[] {
  const answer = new Array<number>(temperatures.length).fill(0);
  const unresolved: number[] = []; // indices, temperatures decreasing

  for (let today = 0; today < temperatures.length; today += 1) {
    // Today resolves every colder day still waiting.
    while (
      unresolved.length > 0 &&
      temperatures[today]! > temperatures[unresolved[unresolved.length - 1]!]!
    ) {
      const coldDay = unresolved.pop()!;
      answer[coldDay] = today - coldDay;
    }

    unresolved.push(today);
  }

  // Anything left never saw a warmer day — already 0 from the fill.
  return answer;
}
