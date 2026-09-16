/**
 * SOLUTIONS — Binary search
 *
 * Every function here uses the same half-open boundary loop. That is
 * deliberate: one loop shape, memorised, removes the whole class of
 * off-by-one and infinite-loop bugs that this pattern is famous for.
 */

/** Smallest i in [0, n] with predicate(i) true, assuming false…false,true…true. */
function lowerBound(n: number, predicate: (i: number) => boolean): number {
  let lo = 0;
  let hi = n; // exclusive
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (predicate(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * EXAM 1 — First and last position of a value
 *
 * COMPLEXITY: two O(log n) searches, O(1) space.
 *
 * NARRATION:
 *   "Rather than find any occurrence and walk outwards — O(n) when the array
 *    is all one value — I run two boundary searches. `nums[i] >= target` is
 *    false then true, and its boundary is the first occurrence.
 *    `nums[i] > target` is false then true, and its boundary is one past the
 *    last."
 *
 * BOTH ARE THE SAME LOOP with a different predicate. Writing an "upper bound"
 * variant with different bounds is how people get lost; converting the
 * question into a monotone predicate keeps one implementation.
 *
 * THE ABSENCE CHECK happens once: if `first` is past the end or does not hold
 * the target, the value is missing. Deriving `last` as `upper - 1` only makes
 * sense once you know the value is present.
 */
export function searchRange(nums: number[], target: number): [number, number] {
  const first = lowerBound(nums.length, (i) => nums[i]! >= target);
  if (first === nums.length || nums[first]! !== target) return [-1, -1];

  const upper = lowerBound(nums.length, (i) => nums[i]! > target);
  return [first, upper - 1];
}

/**
 * EXAM 2 — Search in a rotated sorted array
 *
 * COMPLEXITY: O(log n) time, O(1) space.
 *
 * NARRATION:
 *   "A rotation splits the array into two sorted runs, so at any midpoint at
 *    least one side is sorted. I detect which by comparing nums[lo] with
 *    nums[mid], then ask whether the target lies within that sorted side's
 *    value range. If it does I keep that side; if it doesn't the answer can
 *    only be in the other one."
 *
 * USE `<=` WHEN TESTING THE LEFT HALF (`nums[lo] <= nums[mid]`): when lo and
 * mid coincide — a two-element window — the left run is trivially sorted, and
 * a strict `<` sends that case down the wrong branch.
 *
 * THE RANGE TESTS ARE HALF-OPEN ON PURPOSE: `nums[lo] <= target < nums[mid]`
 * excludes mid, which has already been checked and would otherwise be
 * re-examined forever.
 *
 * WITH DUPLICATES (LeetCode 81) `nums[lo] === nums[mid]` is uninformative; you
 * advance lo by one and the worst case becomes O(n). Volunteer that — it is
 * the standard follow-up.
 */
export function searchRotated(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid]! === target) return mid;

    if (nums[lo]! <= nums[mid]!) {
      // left half is sorted
      if (nums[lo]! <= target && target < nums[mid]!) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half is sorted
      if (nums[mid]! < target && target <= nums[hi]!) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  return -1;
}

/**
 * EXAM 3 — Find a peak element
 *
 * COMPLEXITY: O(log n) time, O(1) space.
 *
 * NARRATION:
 *   "The array isn't sorted, and it doesn't need to be — what I need is a
 *    monotone EXISTENCE argument. If nums[mid] < nums[mid + 1] the sequence is
 *    rising at mid, so either it keeps rising to the end (the last element is
 *    a peak) or it turns over somewhere to the right. Either way a peak exists
 *    on the right, so I can discard the left half."
 *
 * THIS IS THE EXAM'S POINT: binary search needs monotonicity of a PREDICATE,
 * not a sorted array. Candidates who say "not sorted, so linear scan" have
 * learnt the tell and not the condition.
 *
 * THE BOUNDARY IS SAFE: mid is computed from a half-open range where
 * hi = n - 1, so mid + 1 is always in bounds, and the out-of-bounds neighbours
 * behave like -Infinity automatically because they are never consulted.
 */
export function findPeakElement(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid]! < nums[mid + 1]!) lo = mid + 1; // rising: a peak is to the right
    else hi = mid; // falling (or flat-topped): mid could be it
  }

  return lo;
}

/**
 * EXAM 4 — Koko eating bananas
 *
 * COMPLEXITY: O(n log(max pile)) — each feasibility check is one pass.
 *
 * NARRATION:
 *   "The answer is an integer speed between 1 and the largest pile. Hours
 *    needed is non-increasing in speed — eating faster never takes longer —
 *    so 'finishes in time' is false…false,true…true over the speed axis, and I
 *    binary search that boundary. Each check is O(n), and there are
 *    log(max pile) of them."
 *
 * WRITE THE FEASIBILITY FUNCTION FIRST and state its monotonicity out loud
 * before touching the loop. Interviewers score this problem on whether the
 * search is justified, not on whether the loop compiles.
 *
 * ceil(p / k) — one pile per hour is the rule, so leftovers still cost a whole
 * hour. `Math.ceil` is fine; `(p + k - 1) / k | 0` is the integer form if
 * floats are a concern.
 *
 * UPPER BOUND: max(piles) always works, because every pile then takes exactly
 * one hour and `hours >= piles.length` is given. Justifying the bounds is part
 * of the answer.
 */
export function minEatingSpeed(piles: number[], hours: number): number {
  const hoursNeeded = (speed: number) =>
    piles.reduce((total, pile) => total + Math.ceil(pile / speed), 0);

  let lo = 1;
  let hi = Math.max(...piles); // always feasible

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hoursNeeded(mid) <= hours) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}

/**
 * EXAM 5 — Split array largest sum
 *
 * COMPLEXITY: O(n log(sum)) time, O(1) space. The DP is O(k · n²) time and
 * O(k · n) space — give it first, then improve.
 *
 * NARRATION:
 *   "'Minimise the maximum' is the signature of binary search on the answer.
 *    Fix a cap and ask how many chunks a greedy left-to-right pass needs: add
 *    to the current chunk while it fits, otherwise start a new one. Greedy is
 *    optimal here because cutting later is never worse — a chunk that fits can
 *    always absorb more. If the count is at most k, the cap is feasible, and
 *    feasibility is monotone in the cap."
 *
 * THE BOUNDS ARE THE OTHER HALF OF THE ANSWER:
 *   · lower = max(nums) — no split can make the largest element smaller
 *   · upper = sum(nums) — one chunk, always achievable
 * Anything outside that is wasted search, and stating why the bounds hold is
 * what separates this from guessing.
 *
 * FEWER THAN k CHUNKS IS STILL FEASIBLE: with non-negative values you can
 * always cut a chunk further (empty chunks are not allowed, but n >= k is
 * implied by the problem), and cutting never raises the maximum.
 */
export function splitArrayLargestSum(nums: number[], k: number): number {
  const chunksNeeded = (cap: number) => {
    let chunks = 1;
    let running = 0;
    for (const x of nums) {
      if (running + x > cap) {
        chunks += 1;
        running = x;
      } else {
        running += x;
      }
    }
    return chunks;
  };

  let lo = Math.max(...nums); // no cap below this is achievable
  let hi = nums.reduce((a, b) => a + b, 0); // one chunk always fits

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (chunksNeeded(mid) <= k) hi = mid;
    else lo = mid + 1;
  }

  return lo;
}
