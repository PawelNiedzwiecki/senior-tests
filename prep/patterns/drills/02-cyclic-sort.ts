/**
 * PATTERN 08 — Cyclic sort
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min      Catalogue: CATALOGUE.md § 8
 *
 * THE TELL: "n numbers, each between 1 and n" (or 0 and n-1). The values ARE
 * indices in disguise, so every value has a known home slot. Place them all in
 * O(n) with O(1) space, and whatever is out of place afterwards is the answer.
 *
 * THE LOOP SHAPE — note it does NOT unconditionally advance:
 *
 *   let i = 0;
 *   while (i < nums.length) {
 *     const home = nums[i] - 1;                 // value v belongs at index v-1
 *     if (nums[i] !== nums[home]) swap(i, home);   // compare VALUES
 *     else i += 1;                                  // settled, or a duplicate
 *   }
 *
 * WHY IT IS O(n) DESPITE THAT: every swap puts at least one value permanently
 * into its home slot, and there are only n slots, so there are at most n swaps
 * in total. Say this amortised argument — it is the reason the pattern is asked.
 *
 * THE BUG THAT DEFINES THE PATTERN: comparing `nums[i] !== home` (an index)
 * instead of `nums[i] !== nums[home]` (a value). With duplicates, the index
 * version never settles and loops forever.
 */

/**
 * PROBLEM 1 — Missing number
 * `nums` contains n distinct numbers taken from 0..n (so exactly one of that
 * range is absent). Return the missing one.
 *
 *   findMissingNumber([3, 0, 1])       → 2
 *   findMissingNumber([0, 1])          → 2      (n = 2, range is 0..2)
 *   findMissingNumber([9,6,4,2,3,5,7,0,1]) → 8
 *
 * TARGET: O(n) time, O(1) space.
 * NOTE THE RANGE: values are 0..n here, so value v belongs at index v — no
 *       minus one. Getting the home formula right for the stated range is half
 *       the battle; restate it out loud before coding.
 * ALSO KNOW: XOR (`i ^ nums[i]` over everything) and the Gauss sum both solve
 *       this specific case in O(1) space. Cyclic sort is the one that survives
 *       the follow-ups about duplicates.
 */
export function findMissingNumber(_nums: number[]): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Find all duplicates and all missing numbers
 * `nums` holds n values, each in 1..n. Some appear twice, some not at all.
 * Return both lists, each ascending.
 *
 *   findDuplicatesAndMissing([4,3,2,7,8,2,3,1])
 *     → { duplicates: [2, 3], missing: [5, 6] }
 *   findDuplicatesAndMissing([1, 1])
 *     → { duplicates: [1], missing: [2] }
 *
 * TARGET: O(n) time, O(1) extra space (the output does not count).
 * HINT: cyclic sort, then scan. At every index where `nums[i] !== i + 1`, the
 *       value sitting there is a duplicate and `i + 1` is missing.
 * WATCH: the settle condition `nums[i] === nums[home]` is what stops an
 *       infinite swap loop when two equal values both want the same slot.
 * TWO THINGS THE SCAN DOES NOT HAND YOU: `duplicates` comes out in index order,
 *       not ascending, and a value appearing three times is found at two wrong
 *       indices — so deduplicate and sort it. `missing` is ascending already.
 */
export interface DuplicatesAndMissing {
  duplicates: number[];
  missing: number[];
}

export function findDuplicatesAndMissing(_nums: number[]): DuplicatesAndMissing {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — First missing positive  ★ the hard variation ★
 * Return the smallest POSITIVE integer absent from an arbitrary array. The
 * array may contain negatives, zeroes, and values far outside 1..n.
 *
 *   firstMissingPositive([1, 2, 0])       → 3
 *   firstMissingPositive([3, 4, -1, 1])   → 2
 *   firstMissingPositive([7, 8, 9, 11])   → 1
 *
 * TARGET: O(n) time, O(1) space.
 * THE INSIGHT: with n slots, the answer must lie in 1..n+1. Anything outside
 *       that range is irrelevant and can be ignored where it sits. So: cyclic
 *       sort only the in-range values, then scan for the first index where
 *       `nums[i] !== i + 1`; if there is none, the answer is n + 1.
 * SAY THIS: "the answer is bounded by n + 1, because n slots can hold at most
 *       the numbers 1 through n" — that bound is what makes O(1) space possible
 *       and is the whole point of the problem.
 * You may mutate the input.
 */
export function firstMissingPositive(_nums: number[]): number {
  throw new Error('Not implemented');
}
