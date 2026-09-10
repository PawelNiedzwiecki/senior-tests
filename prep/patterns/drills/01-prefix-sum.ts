/**
 * PATTERN 04 — Prefix sum / running aggregate
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: CATALOGUE.md § 4
 *
 * THE IDENTITY EVERYTHING HERE REDUCES TO:
 *
 *     sum(i..j) = prefix[j + 1] - prefix[i]
 *
 * Build the prefix array once in O(n); every range query is then O(1).
 * Rearranged, the same line answers "how many subarrays sum to K":
 *     prefix[i] = prefix[j + 1] - k     → look it up in a hash map.
 *
 * WHEN TO USE IT OVER A SLIDING WINDOW: a sliding window needs monotonicity —
 * usually "all values positive", so that shrinking always reduces the sum. The
 * moment negatives are allowed, the window breaks and prefix sum is the tool.
 * That distinction is the most valuable thing in this module.
 */

/**
 * PROBLEM 1 — Range sum, queried many times
 * Build a structure that answers sum(i..j) INCLUSIVE in O(1).
 *
 *   const rs = createRangeSum([1, 2, 3, 4]);
 *   rs.query(0, 2)  → 6      (1 + 2 + 3)
 *   rs.query(2, 3)  → 7
 *   rs.query(1, 1)  → 2
 *
 * TARGET: O(n) to build, O(1) per query.
 * HINT: prefix has length n + 1, and prefix[0] = 0. That leading zero is what
 *       removes the "what if i is 0" special case from the query.
 */
export interface RangeSum {
  query(i: number, j: number): number;
}

export function createRangeSum(_nums: number[]): RangeSum {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Count subarrays summing to exactly K  ★ the one that matters ★
 * The array MAY CONTAIN NEGATIVES, so a sliding window is invalid.
 *
 *   subarraySum([1, 1, 1], 2)        → 2
 *   subarraySum([1, 2, 3], 3)        → 2      ([1,2] and [3])
 *   subarraySum([1, -1, 0], 0)       → 3      ([1,-1], [0], [1,-1,0])
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: walk the array keeping a running sum. At index j, a subarray ending
 *       here sums to k exactly when some earlier prefix equalled
 *       `running - k`. So count how many times each prefix value has been
 *       seen, in a map.
 * THE SEED: the map must start as `{0: 1}` — the empty prefix. Without it you
 *       miss every subarray that starts at index 0. That is the bug in this
 *       problem, and the test for it is explicit below.
 */
export function subarraySum(_nums: number[], _k: number): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Product of array except self
 * Return an array where out[i] is the product of every element except nums[i].
 * Division is not allowed.
 *
 *   productExceptSelf([1, 2, 3, 4]) → [24, 12, 8, 6]
 *   productExceptSelf([-1, 1, 0, -3, 3]) → [0, 0, 9, 0, 0]
 *
 * TARGET: O(n) time, O(1) extra space (the output does not count).
 * HINT: the same identity, with multiplication. out[i] is
 *       (product of everything left of i) × (product of everything right of i).
 *       Do a left-to-right pass filling the output with prefix products, then a
 *       right-to-left pass multiplying in the suffix products with a single
 *       running variable.
 * WHY "NO DIVISION" IS IN THE PROMPT: division makes it trivial, but breaks on
 *       a zero in the input. Say that — it shows you understand the constraint
 *       rather than just obeying it.
 */
export function productExceptSelf(_nums: number[]): number[] {
  throw new Error('Not implemented');
}
