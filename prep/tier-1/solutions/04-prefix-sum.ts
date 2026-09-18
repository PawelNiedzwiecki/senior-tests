/**
 * SOLUTIONS — Prefix sum / running aggregate
 */

/**
 * EXAM 1 — Range sum queries
 *
 * COMPLEXITY: O(n) build, O(1) per query, O(n) space.
 *
 * NARRATION:
 *   "Queries repeat over a fixed array, so I'll pay linear time once and make
 *    each query a subtraction. prefix[i] is the sum of the first i elements —
 *    note the leading zero, which removes the from = 0 special case."
 *
 * THE LEADING ZERO is the entire implementation detail of this pattern. With
 * `prefix` of length n + 1, `sum(from..to) = prefix[to + 1] - prefix[from]`
 * holds for every valid range including from = 0, and there is no branch.
 * Every off-by-one in prefix sums traces back to an n-length array.
 *
 * IF UPDATES INTERLEAVE WITH QUERIES this falls apart — each update
 * invalidates the suffix of the prefix array. Name the fix (Fenwick/BIT, or a
 * segment tree, O(log n) both ways) rather than pretending it scales.
 */
export function rangeSums(nums: number[], queries: Array<[number, number]>): number[] {
  const prefix = new Array<number>(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i += 1) prefix[i + 1] = prefix[i]! + nums[i]!;

  return queries.map(([from, to]) => prefix[to + 1]! - prefix[from]!);
}

/**
 * EXAM 2 — Find the pivot index
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "I don't need the whole prefix array — only the total and a running left
 *    sum. The right side is total minus left minus the pivot itself, so each
 *    index is one comparison."
 *
 * THE EMPTY SIDE SUMS TO ZERO, which makes index 0 a legitimate answer
 * whenever the rest of the array sums to zero ([2, 1, -1]). Candidates who
 * start the loop at 1 miss it, and this is the case interviewers check.
 *
 * LEFTMOST is free: return on the first hit.
 *
 * The running-sum version is the one to write, but say the prefix-array
 * version out loud first — it is the same idea with the O(1)-space
 * optimisation made explicit, which is the ladder they want to see.
 */
export function pivotIndex(nums: number[]): number {
  const total = nums.reduce((a, b) => a + b, 0);

  let left = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (left === total - left - nums[i]!) return i;
    left += nums[i]!;
  }

  return -1;
}

/**
 * EXAM 3 — Subarray sum equals k
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * NARRATION:
 *   "The sum of a subarray ending at i is running - prefixAtStart, so it
 *    equals k exactly when some earlier prefix equals running - k. I keep a
 *    map from prefix value to how many times I've seen it and add that count
 *    at every step. Negatives are fine here, which is the reason this isn't a
 *    sliding window."
 *
 * TWO DETAILS DECIDE IT:
 *   · SEED `{0: 1}` — the empty prefix. Without it, every subarray that starts
 *     at index 0 is missed, and [3] with k = 3 returns 0.
 *   · COUNT, DON'T INDEX. With negatives the same prefix value recurs, and
 *     each occurrence is a distinct subarray. A map of prefix → index answers
 *     "does one exist" and silently undercounts here.
 *
 * LOOK UP BEFORE INSERTING the current prefix, or a k of 0 counts the
 * zero-length subarray at every index.
 */
export function subarraySum(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]); // prefix value → occurrences
  let running = 0;
  let count = 0;

  for (const x of nums) {
    running += x;
    count += seen.get(running - k) ?? 0; // look up before inserting
    seen.set(running, (seen.get(running) ?? 0) + 1);
  }

  return count;
}

/**
 * EXAM 4 — Product of array except self
 *
 * COMPLEXITY: O(n) time, O(1) extra space — the output does not count.
 *
 * NARRATION:
 *   "Same shape as a prefix sum with multiplication: out[i] is the product of
 *    everything left of i times everything right of i. Left-to-right pass
 *    writes the left products into the output, right-to-left pass multiplies
 *    each slot by a running right product held in a single variable."
 *
 * WHY DIVISION IS BANNED, and why that is a good rule: total / nums[i] breaks
 * on a zero, and the "count the zeros" repair is three branches of special
 * cases. The two-pass version handles zero, one zero and many zeros with no
 * branches at all — worth saying, because it shows you know what the
 * constraint is protecting you from.
 *
 * ONE JAVASCRIPT WRINKLE: with a zero and a negative in the input some slots
 * come out as -0, which `Object.is` and `toEqual` distinguish from 0 even
 * though `===` does not. Harmless here; normalise with `x + 0` if a caller
 * cares.
 *
 * THE SECOND PASS REUSES THE OUTPUT as its accumulator, which is what earns
 * the O(1) claim. Building separate left and right arrays first is a fine
 * first answer; then improve it out loud.
 */
export function productExceptSelf(nums: number[]): number[] {
  const out = new Array<number>(nums.length).fill(1);

  let left = 1;
  for (let i = 0; i < nums.length; i += 1) {
    out[i] = left; // product of everything before i
    left *= nums[i]!;
  }

  let right = 1;
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    out[i] = out[i]! * right; // × product of everything after i
    right *= nums[i]!;
  }

  return out;
}

/**
 * EXAM 5 — Range addition (difference array)
 *
 * COMPLEXITY: O(n + m) time, O(n) space, for m updates.
 *
 * NARRATION:
 *   "Writing each range out is O(n · m). Instead I record only where each
 *    increment starts and stops — +v at `from`, -v at `to + 1` — and then one
 *    prefix-sum pass materialises the array. It's the prefix-sum idea run
 *    backwards: prefix sums make range queries cheap, difference arrays make
 *    range updates cheap."
 *
 * SIZE IT n + 1 so that `to + 1` is always in bounds when a range reaches the
 * last index, then drop the extra slot at the end. The alternative is a guard
 * on every update, which is the same thing with more places to forget it.
 *
 * WHEN THIS IS THE REAL ANSWER: any "apply m range updates, then read" problem
 * — flight bookings, car pooling, meeting-room counts. If updates and reads
 * interleave, you are back to a Fenwick tree.
 */
export function applyRangeUpdates(
  length: number,
  updates: Array<[number, number, number]>,
): number[] {
  const diff = new Array<number>(length + 1).fill(0);

  for (const [from, to, value] of updates) {
    diff[from] = diff[from]! + value;
    diff[to + 1] = diff[to + 1]! - value;
  }

  const out = new Array<number>(length).fill(0);
  let running = 0;
  for (let i = 0; i < length; i += 1) {
    running += diff[i]!;
    out[i] = running;
  }

  return out;
}
