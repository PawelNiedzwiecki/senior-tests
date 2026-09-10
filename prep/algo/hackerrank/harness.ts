/**
 * THE HARNESS — memorise this. It is the whole "testing is key" requirement.
 * ────────────────────────────────────────────────────────────────────────────
 * HackerRank's pair-programming IDE gives you a blank file and a Run button.
 * There is no Vitest, no Jest, no `expect`. If you want to demonstrate testing —
 * and DeepL explicitly say they expect it — you type this yourself.
 *
 * It is ten lines. Practise typing it until it takes under a minute, then type
 * it FIRST, before you solve anything. Two reasons:
 *   1. It shows the interviewer you test by default, not because you were asked.
 *   2. It gives you a place to write the examples from the problem statement,
 *      which is how you check you understood the problem before coding.
 *
 * Run it with:  node harness.ts       (Node 22+ strips types natively)
 */

let passed = 0;
let failed = 0;

/** Deep-ish equality via JSON. Good enough for arrays, objects, primitives. */
export function eq(actual: unknown, expected: unknown, label = ''): void {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a === b) {
    passed += 1;
    console.log(`  ok   ${label}`);
  } else {
    failed += 1;
    console.log(`FAIL   ${label}\n         expected: ${b}\n         actual:   ${a}`);
  }
}

/** Order-insensitive comparison, for "any valid grouping" answers. */
export function eqUnordered(actual: unknown[], expected: unknown[], label = ''): void {
  const norm = (xs: unknown[]) => JSON.stringify([...xs].map((x) => JSON.stringify(x)).sort());
  eq(norm(actual), norm(expected), label);
}

export function summary(): void {
  console.log(`\n${passed} passed, ${failed} failed`);
}

// ─── Everything below is the part you delete and replace ────────────────────

function twoSum(nums: number[], target: number): [number, number] | null {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i]!;
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i]!, i);
  }
  return null;
}

// Examples from the problem statement go here FIRST, before you write the code.
eq(twoSum([2, 7, 11, 15], 9), [0, 1], 'example from the prompt');
eq(twoSum([3, 2, 4], 6), [1, 2], 'answer is not at index 0');
eq(twoSum([3, 3], 6), [0, 1], 'duplicate values');

// Then the edge cases you named out loud during framing.
eq(twoSum([], 5), null, 'empty');
eq(twoSum([1], 1), null, 'single element cannot pair with itself');
eq(twoSum([1, 2], 99), null, 'no solution');
eq(twoSum([-3, 4, 3, 90], 0), [0, 2], 'negatives');

summary();
