/**
 * SOLUTIONS — Cyclic sort
 */

/**
 * PROBLEM 1 — Missing number (range 0..n)
 *
 * NARRATION:
 *   "The values are 0..n with one absent, so each value v has a home at index
 *    v. I'll walk the array swapping each value home; anything that can't go
 *    home is out of range. Then one scan finds the index whose value isn't
 *    itself — that index is the missing number. O(n) time, O(1) space."
 *
 * COMPLEXITY: O(n) time. The `while` has no unconditional increment, but every
 *             swap places a value permanently, so at most n swaps occur.
 *             O(1) space.
 *
 * THE RANGE DETERMINES THE HOME FORMULA. Here values are 0..n, so v belongs at
 * index v. In problems stated as 1..n it is index v - 1. Restating the range
 * out loud before coding is what stops this being an off-by-one.
 *
 * `nums[i] < n` GUARDS the one value that has no home: with n slots and n+1
 * possible values, the largest value in range cannot be placed. If the scan
 * finds nothing out of place, the missing number is n itself.
 *
 * ALTERNATIVES worth naming: XOR everything with every index (O(1) space, very
 * neat, but does not extend to duplicates); Gauss's `n(n+1)/2` minus the actual
 * sum (elegant, but overflows for large n and cannot handle duplicates).
 */
export function findMissingNumber(nums: number[]): number {
  const n = nums.length;
  let i = 0;

  while (i < n) {
    const home = nums[i]!; // values are 0..n, so v belongs at index v
    if (home < n && nums[i] !== nums[home]) {
      [nums[i], nums[home]] = [nums[home]!, nums[i]!];
    } else {
      i += 1;
    }
  }

  for (let j = 0; j < n; j += 1) if (nums[j] !== j) return j;
  return n; // everything 0..n-1 is present, so n is the one missing
}

/**
 * PROBLEM 2 — All duplicates and all missing (range 1..n)
 *
 * COMPLEXITY: O(n) time, O(1) auxiliary space.
 *
 * THE SETTLE CONDITION IS `nums[i] === nums[home]`, comparing VALUES. When two
 * copies of the same number both want one slot, the second comparison finds the
 * value already there and advances instead of swapping forever. Comparing
 * indices (`nums[i] === home + 1`) looks equivalent and hangs on duplicates.
 *
 * AFTER SORTING, one scan reads out both answers at once: at any index where
 * `nums[i] !== i + 1`, the value squatting there is a duplicate and `i + 1` is
 * missing.
 *
 * TWO DETAILS THE SCAN ALONE DOES NOT GIVE YOU, both worth catching in framing:
 *   - `missing` comes out ascending for free (it is `j + 1` over increasing j),
 *     but `duplicates` does NOT — it is whatever value happens to sit at each
 *     wrong index, in no particular order. It needs a sort.
 *   - A value appearing three or more times is pushed once per wrong index, so
 *     `[2,2,2]` would yield `[2, 2]`. Deduplicate, unless the prompt actually
 *     wants multiplicity — which is a good clarifying question.
 * The dedupe-and-sort is O(k log k) on the number of duplicates, which does not
 * change the overall O(n).
 */
export interface DuplicatesAndMissing {
  duplicates: number[];
  missing: number[];
}

export function findDuplicatesAndMissing(nums: number[]): DuplicatesAndMissing {
  const n = nums.length;
  let i = 0;

  while (i < n) {
    const home = nums[i]! - 1; // values 1..n → index v - 1
    if (home >= 0 && home < n && nums[i] !== nums[home]) {
      [nums[i], nums[home]] = [nums[home]!, nums[i]!];
    } else {
      i += 1;
    }
  }

  const duplicateSet = new Set<number>();
  const missing: number[] = [];

  for (let j = 0; j < n; j += 1) {
    if (nums[j] !== j + 1) {
      duplicateSet.add(nums[j]!); // the value squatting here appears >1 time
      missing.push(j + 1); // and the value that belongs here is absent
    }
  }

  // `missing` is already ascending; `duplicates` is not, and may repeat.
  return { duplicates: [...duplicateSet].sort((a, b) => a - b), missing };
}

/**
 * PROBLEM 3 — First missing positive
 *
 * THE BOUND IS THE WHOLE PROBLEM — say it before writing anything:
 *   "With n slots, the array can contain at most the numbers 1..n. So the
 *    answer is somewhere in 1..n+1. Every value outside that range is
 *    irrelevant — I can leave it where it is. That bound is what lets me solve
 *    it in O(1) space."
 *
 * COMPLEXITY: O(n) time, O(1) space (mutating the input, which the prompt
 *             permits — always confirm that).
 *
 * THE GUARD `home >= 0 && home < n` is what skips negatives, zeroes and huge
 * values without a separate filtering pass. They stay where they are and simply
 * never settle anywhere meaningful, which is fine: the scan only asks whether
 * index j holds j + 1.
 *
 * IF THE SCAN FINDS NOTHING, the array is exactly 1..n, so the answer is n + 1.
 * That is the `[1,2,3] → 4` case and the empty-array case, both of which fall
 * out of the same return.
 *
 * IF MUTATION WERE FORBIDDEN, the answer is a hash set — O(n) space — and you
 * should say that the space bound is what forces the in-place trick.
 */
export function firstMissingPositive(nums: number[]): number {
  const n = nums.length;
  let i = 0;

  while (i < n) {
    const home = nums[i]! - 1;
    // Only place values that are in 1..n; everything else is irrelevant.
    if (home >= 0 && home < n && nums[i] !== nums[home]) {
      [nums[i], nums[home]] = [nums[home]!, nums[i]!];
    } else {
      i += 1;
    }
  }

  for (let j = 0; j < n; j += 1) if (nums[j] !== j + 1) return j + 1;
  return n + 1; // the array is exactly 1..n
}
