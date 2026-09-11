/**
 * SOLUTIONS — Prefix sum
 */

export interface RangeSum {
  query(i: number, j: number): number;
}

/**
 * PROBLEM 1 — Range sum
 *
 * COMPLEXITY: O(n) build, O(1) query, O(n) space.
 *
 * THE LEADING ZERO. `prefix` has n + 1 entries with `prefix[0] = 0`, so
 * `prefix[j + 1] - prefix[i]` works even when i is 0. Sizing it at n instead
 * forces a special case on every query — a small design decision that removes
 * a whole class of off-by-one bugs.
 *
 * WHEN THIS IS THE WRONG TOOL: if the array is UPDATED between queries, every
 * update costs O(n) to rebuild. That is the point at which you name a Fenwick
 * tree (Binary Indexed Tree) or a segment tree — both O(log n) for update and
 * query. Knowing the boundary is more useful than knowing the implementation.
 */
export function createRangeSum(nums: number[]): RangeSum {
  const prefix = new Array<number>(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i += 1) prefix[i + 1] = prefix[i]! + nums[i]!;

  return {
    query(i, j) {
      return prefix[j + 1]! - prefix[i]!;
    },
  };
}

/**
 * PROBLEM 2 — Subarrays summing to K
 *
 * NARRATION — lead with why the obvious tool is wrong:
 *   "This looks like a sliding window, but the array can contain negatives, so
 *    shrinking the window can INCREASE the sum — 'grow then shrink while valid'
 *    is unsound. Instead I'll use a running prefix: a subarray ending at j sums
 *    to k exactly when some earlier prefix equals running - k. Count the prefix
 *    values I've seen in a map and it's one pass."
 *
 * COMPLEXITY: O(n) time, O(n) space.
 *
 * THE `{0: 1}` SEED is the empty prefix — "before I started, I had seen a sum
 * of zero once". Without it, any subarray that begins at index 0 is missed,
 * because its prefix difference is `running - k === 0` with nothing recorded at
 * 0. This is the single most common bug in the problem.
 *
 * COUNT, DON'T JUST MARK: the map stores how many times each prefix has
 * occurred, not merely whether it has. `[1, 1, 1]` with k = 2 needs the count.
 *
 * ORDER MATTERS: look up BEFORE recording the current prefix, or a k of 0
 * counts the empty subarray ending at the current index.
 */
export function subarraySum(nums: number[], k: number): number {
  const seen = new Map<number, number>([[0, 1]]); // the empty prefix
  let running = 0;
  let count = 0;

  for (const num of nums) {
    running += num;
    count += seen.get(running - k) ?? 0; // look up first…
    seen.set(running, (seen.get(running) ?? 0) + 1); // …then record
  }

  return count;
}

/**
 * PROBLEM 3 — Product except self
 *
 * NARRATION:
 *   "Same identity as prefix sum, with multiplication: the answer at i is
 *    (everything to the left) × (everything to the right). I'll fill the output
 *    with left products on a forward pass, then multiply in the right products
 *    on a backward pass using a single running variable — so no second array."
 *
 * COMPLEXITY: O(n) time, O(1) extra space (the output array is required, so it
 *             does not count as auxiliary — say that distinction explicitly).
 *
 * WHY NO DIVISION: dividing the total product by nums[i] is O(n) and trivial,
 * but it dies on a zero, and on two zeroes it cannot be repaired. The
 * constraint exists to force the prefix/suffix insight. Handling zeroes falls
 * out of this solution for free, which is worth pointing at.
 *
 * THE -0 CURIOSITY: multiplying a negative by zero gives -0. It compares equal
 * to 0 with `===`, but `Object.is(-0, 0)` is false, so strict deep-equality
 * assertions distinguish them. Not a bug — but if a test framework ever flags
 * it, that is why. (`JSON.stringify(-0)` is "0", so a JSON-based harness hides
 * it entirely.)
 *
 * THE TWO PASSES both need care at the boundary: the leftmost element has no
 * left product (so 1) and the rightmost has no right product (so 1). Seeding
 * both running variables at 1 is what encodes "the empty product".
 */
export function productExceptSelf(nums: number[]): number[] {
  const out = new Array<number>(nums.length).fill(1);

  // Forward: out[i] = product of everything strictly left of i.
  let leftProduct = 1;
  for (let i = 0; i < nums.length; i += 1) {
    out[i] = leftProduct;
    leftProduct *= nums[i]!;
  }

  // Backward: multiply in the product of everything strictly right of i.
  let rightProduct = 1;
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    out[i]! *= rightProduct;
    rightProduct *= nums[i]!;
  }

  return out;
}
