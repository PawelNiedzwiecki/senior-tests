/**
 * TIER 1 · PATTERN 04 — Prefix sum / running aggregate
 * ════════════════════════════════════════════════════════════════════════════
 * FIVE EXAMS         TIME BOX: 60 min total    Catalogue: ../../patterns/CATALOGUE.md § 4
 *
 * THE PATTERN
 * Precompute `prefix[i] = nums[0] + … + nums[i - 1]` once, and any range sum
 * becomes a subtraction: `sum(i..j) = prefix[j + 1] - prefix[i]`. You pay O(n)
 * once and every query afterwards is O(1).
 *
 * THE TELL
 *   "sum of a range" asked MANY times  ·  "running total"  ·  "equal number of"
 *   "subarray summing to k" — especially WITH NEGATIVES, which rules out a window
 *
 * WHEN IT IS VALID
 * The aggregate must be invertible: sums subtract, XOR cancels, products
 * divide only when nothing is zero, maxima do not work at all. If you cannot
 * subtract, you do not have a prefix-sum problem — you have a sparse table or
 * a segment tree.
 *
 * PREFIX SUM VS SLIDING WINDOW — the distinction seniors are expected to make
 * A window needs monotonicity: adding an element must push the quantity one
 * way. Negatives kill that. Prefix sums need no such thing, which is exactly
 * why "subarray sums to k with negatives allowed" is prefix sum + hash map and
 * not a window. Naming this boundary is worth more than the code.
 *
 * THE DIFFERENCE ARRAY — the same idea backwards
 * Prefix sums make range QUERIES cheap; difference arrays make range UPDATES
 * cheap. Record `+v` at the start and `-v` one past the end, then prefix-sum
 * the whole thing once at the end. m updates over n slots in O(n + m).
 *
 * TEMPLATE
 *   const prefix = new Array(n + 1).fill(0);        // the leading 0 matters
 *   for (let i = 0; i < n; i += 1) prefix[i + 1] = prefix[i] + nums[i];
 *   const range = (i, j) => prefix[j + 1] - prefix[i];
 *
 * COST — O(n) build, O(1) per query, O(n) space.
 *
 * WHAT INTERVIEWERS ESCALATE TO
 * 2D prefix sums (inclusion–exclusion), "count the subarrays" instead of
 * "find one" (a map of prefix → COUNT, not prefix → index), and interleaved
 * updates with queries, where the honest answer is a Fenwick tree.
 *
 * THE SENTENCE WORTH SAYING
 *   "Range sums queried repeatedly, so I'll pay O(n) once to make each query a
 *    subtraction. And since negatives are allowed, a sliding window would be
 *    unsound here."
 */

/**
 * EXAM 1 — Range sum queries                                   [LeetCode 303]
 * ────────────────────────────────────────────────────────────────────────────
 * Answer many inclusive range-sum queries over a fixed array. Each query is
 * `[from, to]` with `from <= to`. Return the answers in order.
 *
 *   rangeSums([-2, 0, 3, -5, 2, -1], [[0, 2], [2, 5], [0, 5]])  → [1, -1, -3]
 *   rangeSums([1, 2, 3], [[1, 1]])                              → [2]
 *
 * TARGET: O(n + q) time, O(n) space. Recomputing each query is O(n · q) and is
 * the answer this exam exists to rule out.
 *
 * HINT: build the prefix array with a LEADING ZERO — length n + 1, where
 *       `prefix[i]` is the sum of the first i elements. Then `sum(from..to)`
 *       is `prefix[to + 1] - prefix[from]` with no special case for from = 0.
 *       Every off-by-one in this pattern comes from skipping that extra slot.
 */
export function rangeSums(_nums: number[], _queries: Array<[number, number]>): number[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 2 — Find the pivot index                                [LeetCode 724]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the LEFTMOST index where the sum of everything strictly to its left
 * equals the sum of everything strictly to its right, or -1 if there is none.
 *
 *   pivotIndex([1, 7, 3, 6, 5, 6])  → 3     (1 + 7 + 3 === 5 + 6)
 *   pivotIndex([1, 2, 3])           → -1
 *   pivotIndex([2, 1, -1])          → 0     (empty left sums to 0)
 *
 * TARGET: O(n) time, O(1) space.
 *
 * HINT: you do not need the array — only the TOTAL and a running left sum.
 *       The right sum is `total - left - nums[i]`, so the test is one
 *       comparison per index. An empty side sums to 0, which is why index 0
 *       can be a valid answer; that edge case is what is being probed.
 */
export function pivotIndex(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 3 — Subarray sum equals k                               [LeetCode 560]
 * ────────────────────────────────────────────────────────────────────────────
 * Return HOW MANY contiguous subarrays sum to exactly `k`. Values may be
 * negative.
 *
 *   subarraySum([1, 1, 1], 2)      → 2
 *   subarraySum([1, 2, 3], 3)      → 2     ([1, 2] and [3])
 *   subarraySum([1, -1, 0], 0)     → 3     ([1, -1], [1, -1, 0] and [0])
 *
 * TARGET: O(n) time, O(n) space.
 *
 * HINT: the headline problem of this pattern. A subarray ending at i sums to k
 *       exactly when some earlier prefix equals `running - k`, so keep a map
 *       of prefix value → HOW MANY TIMES SEEN, and add that count in.
 *
 *       Two details decide this one: seed the map with `{0: 1}` (the empty
 *       prefix, which is what lets a subarray starting at index 0 count), and
 *       count occurrences rather than storing an index — several prefixes can
 *       share a value once negatives are allowed.
 *
 *       Note what is NOT available: negatives mean no sliding window.
 */
export function subarraySum(_nums: number[], _k: number): number {
  throw new Error('Not implemented');
}

/**
 * EXAM 4 — Product of array except self                        [LeetCode 238]
 * ────────────────────────────────────────────────────────────────────────────
 * Return an array where `out[i]` is the product of every element EXCEPT
 * `nums[i]`. Division is forbidden. The input may contain zeros.
 *
 *   productExceptSelf([1, 2, 3, 4])    → [24, 12, 8, 6]
 *   productExceptSelf([-1, 1, 0, -3, 3]) → [0, 0, 9, 0, 0]
 *
 * TARGET: O(n) time, O(1) extra space beyond the output array.
 *
 * HINT: the same idea with multiplication instead of addition, and it is the
 *       "no division" rule that forces it: `out[i]` is (product of everything
 *       to the left) × (product of everything to the right). Do a left-to-
 *       right pass writing prefixes into the output, then a right-to-left pass
 *       multiplying by a running suffix product held in ONE variable. Zeros
 *       need no special handling at all — that is the elegance worth pointing
 *       out, since the division approach has to special-case them.
 */
export function productExceptSelf(_nums: number[]): number[] {
  throw new Error('Not implemented');
}

/**
 * EXAM 5 — Range addition (difference array)                   [LeetCode 370]
 * ────────────────────────────────────────────────────────────────────────────
 * Start with `length` zeros. Apply each update `[from, to, value]`, which adds
 * `value` to every index in the inclusive range. Return the final array.
 *
 *   applyRangeUpdates(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]])  → [-2, 0, 3, 5, 3]
 *   applyRangeUpdates(3, [])                                  → [0, 0, 0]
 *
 * TARGET: O(n + m) time for m updates. Writing each range out is O(n · m).
 *
 * HINT: PREFIX SUM RUN BACKWARDS. Instead of touching every index in a range,
 *       record the two moments the increment starts and stops: `diff[from] +=
 *       value` and `diff[to + 1] -= value`. One prefix-sum pass at the end
 *       materialises the array.
 *
 *       Size the diff array as n + 1 so `to + 1` is always writable when the
 *       range reaches the last index — the alternative is a bounds check you
 *       will forget. Say the one-liner: "prefix sums make range queries cheap,
 *       difference arrays make range updates cheap; they're inverses."
 */
export function applyRangeUpdates(
  _length: number,
  _updates: Array<[number, number, number]>,
): number[] {
  throw new Error('Not implemented');
}
