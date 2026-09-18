/**
 * SOLUTIONS — Two pointers
 */

/**
 * EXAM 1 — Squares of a sorted array
 *
 * COMPLEXITY: O(n) time, O(n) space for the output (O(1) auxiliary).
 *
 * NARRATION:
 *   "Squaring destroys the sort order only in the middle — the two ends hold
 *    the extremes. The largest square is therefore at one end or the other,
 *    which is exactly the comparison two converging pointers make. I fill the
 *    result from the back so I'm always placing the value I can identify."
 *
 * WHY NOT FRONT-TO-BACK: the smallest square sits wherever the array crosses
 * zero, which you would have to find first. Finding the maximum is a single
 * comparison; that asymmetry is the whole trick.
 *
 * COMPARE SQUARES, NOT VALUES — `-4` beats `3` here, and comparing the raw
 * values gets it backwards.
 */
export function sortedSquares(nums: number[]): number[] {
  const out = new Array<number>(nums.length);
  let lo = 0;
  let hi = nums.length - 1;

  for (let write = nums.length - 1; write >= 0; write -= 1) {
    const left = nums[lo]! * nums[lo]!;
    const right = nums[hi]! * nums[hi]!;
    if (left > right) {
      out[write] = left;
      lo += 1;
    } else {
      out[write] = right;
      hi -= 1;
    }
  }

  return out;
}

/**
 * EXAM 2 — Remove duplicates, keeping at most two
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "A read pointer scans and a write pointer marks the end of the kept
 *    prefix. I decide whether to keep the current value by looking two slots
 *    back in what I've ALREADY KEPT: if it differs, this value has appeared at
 *    most once so far in the output, so it's allowed."
 *
 * WHY LOOK BACKWARDS: the kept prefix is sorted and compacted, so
 * `nums[write - 2]` is precisely "the value two copies ago". Looking forwards
 * into the input means counting runs, which is more code and more off-by-ones.
 *
 * IT GENERALISES FOR FREE: replace the 2 with k and the same three lines solve
 * "at most k" — say this, because it is usually the follow-up.
 *
 * `write < 2` guards the first two slots, which are always keepable.
 */
export function removeDuplicatesAtMostTwice(nums: number[]): number {
  let write = 0;

  for (let read = 0; read < nums.length; read += 1) {
    if (write < 2 || nums[read]! !== nums[write - 2]!) {
      nums[write] = nums[read]!;
      write += 1;
    }
  }

  return write;
}

/**
 * EXAM 3 — Container with most water
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * NARRATION:
 *   "Start at the widest pair, because width is maximal there and can only
 *    shrink. The area is capped by the shorter line, so pairing that shorter
 *    line with anything further in gives less width and no more height — it
 *    can never beat the area I just recorded. So I discard it and move that
 *    pointer. Each index is visited once: O(n)."
 *
 * THAT PARAGRAPH IS THE ANSWER. The code is six lines; the exchange argument
 * is what is being assessed. Candidates who move "the smaller index" or "both"
 * are pattern-matching without it.
 *
 * TIES: when the two heights are equal, either side may move — both are
 * capped identically, so neither can improve.
 */
export function maxArea(heights: number[]): number {
  let lo = 0;
  let hi = heights.length - 1;
  let best = 0;

  while (lo < hi) {
    const height = Math.min(heights[lo]!, heights[hi]!);
    best = Math.max(best, height * (hi - lo));
    if (heights[lo]! < heights[hi]!) lo += 1;
    else hi -= 1;
  }

  return best;
}

/**
 * EXAM 4 — 3Sum closest
 *
 * COMPLEXITY: O(n²) time — n anchors, each with a linear scan — and O(1) space
 * beyond the sort.
 *
 * NARRATION:
 *   "Sorting costs O(n log n) and buys me the discard argument. I fix the
 *    first element, then two-pointer the suffix: if the sum is below target
 *    the only way to increase it is to move the left pointer up, and vice
 *    versa. That's the same monotonicity as sorted two-sum, so the inner scan
 *    is linear and the whole thing is O(n²)."
 *
 * THE EARLY RETURN on an exact hit is not an optimisation for its own sake —
 * it is the observation that no sum can be closer than zero away, which is
 * worth saying rather than just coding.
 *
 * NOTE ON DUPLICATES: unlike 3Sum, this problem does not need them skipped —
 * duplicate triples give duplicate sums, which are harmless. Skipping them is
 * still a reasonable speedup to mention.
 */
export function threeSumClosest(nums: number[], target: number): number {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = sorted[0]! + sorted[1]! + sorted[2]!;

  for (let anchor = 0; anchor < sorted.length - 2; anchor += 1) {
    let lo = anchor + 1;
    let hi = sorted.length - 1;

    while (lo < hi) {
      const sum = sorted[anchor]! + sorted[lo]! + sorted[hi]!;
      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      if (sum === target) return sum;
      if (sum < target) lo += 1;
      else hi -= 1;
    }
  }

  return best;
}

/**
 * EXAM 5 — Merge a sorted array into another, in place
 *
 * COMPLEXITY: O(m + n) time, O(1) space.
 *
 * NARRATION:
 *   "Merging forwards would overwrite entries of `a` I haven't read yet, so I
 *    merge backwards: the padding at the end of `a` is free space, and the
 *    largest remaining value always belongs at the back. Two read pointers at
 *    the ends of the real data, one write pointer at the end of the array."
 *
 * ONLY ONE TAIL NEEDS DRAINING. When `a` runs out, the rest of `b` must still
 * be copied. When `b` runs out, the rest of `a` is already in its final
 * position — copying it would be a no-op. Saying which tail you may skip, and
 * why, is the detail this exam exists for.
 *
 * `a.length === m + n` is the contract; the padding values are meaningless and
 * are all overwritten or already correct when the loop ends.
 */
export function mergeInto(a: number[], m: number, b: number[], n: number): void {
  let i = m - 1; // last real value in a
  let j = n - 1; // last value in b
  let write = m + n - 1;

  while (j >= 0) {
    if (i >= 0 && a[i]! > b[j]!) {
      a[write] = a[i]!;
      i -= 1;
    } else {
      a[write] = b[j]!;
      j -= 1;
    }
    write -= 1;
  }
}
