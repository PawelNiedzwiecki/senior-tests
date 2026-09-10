/**
 * SOLUTIONS 04 — Binary search
 *
 * Every loop here uses INCLUSIVE bounds [lo, hi]. State the convention out loud
 * before you write the loop; it is what stops the off-by-one.
 */

/**
 * PROBLEM 1 — Classic binary search
 *
 * COMPLEXITY: O(log n) time, O(1) space.
 *
 * THE THREE LINES THAT MUST AGREE:
 *   `while (lo <= hi)`   because lo === hi is still a live single-element range
 *   `hi = mid - 1`       because mid has been ruled out
 *   `lo = mid + 1`       likewise
 * Change any one of them without the others and you get an infinite loop or a
 * missed element. If you ever find yourself unsure, test the two-element array
 * by hand — that is where it breaks first.
 *
 * SAY: "In JS `(lo + hi) / 2` is safe up to 2^53. In a 32-bit language I'd
 * write `lo + ((hi - lo) >> 1)` to avoid overflow."
 */
export function binarySearch(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = nums[mid]!;

    if (value === target) return mid;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}

/**
 * PROBLEM 2 — First and Last Position
 *
 * NARRATION:
 *   "Find one match then walk outwards is O(n) when every element is the
 *    target — and that is the input they'll hand me. Instead, two binary
 *    searches: on a match, record the index but keep going in the direction of
 *    the boundary I want."
 *
 * COMPLEXITY: O(log n) time (two searches), O(1) space.
 *
 * THE ONLY DIFFERENCE between the two searches is which way you continue after
 * a match: left for the first occurrence, right for the last. A `first: boolean`
 * parameter keeps it to one function — nice, but be ready to inline both if the
 * interviewer finds the flag harder to read. Either is defensible; having a view
 * is what matters.
 */
function findBoundary(nums: number[], target: number, first: boolean): number {
  let lo = 0;
  let hi = nums.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = nums[mid]!;

    if (value === target) {
      found = mid;
      // Keep hunting towards the boundary we want.
      if (first) hi = mid - 1;
      else lo = mid + 1;
    } else if (value < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return found;
}

export function searchRange(nums: number[], target: number): [number, number] {
  const first = findBoundary(nums, target, true);
  if (first === -1) return [-1, -1];
  return [first, findBoundary(nums, target, false)];
}

/**
 * PROBLEM 3 — Search in a Rotated Sorted Array
 *
 * THE INSIGHT — say it before coding:
 *   "Rotating a sorted array leaves it in two sorted runs. Wherever I put mid,
 *    at least one side of it is a clean sorted range. I can test which side
 *    that is in O(1), check whether the target falls inside that range, and
 *    discard half either way. Still O(log n)."
 *
 * COMPLEXITY: O(log n) time, O(1) space.
 *
 * THE `<=` IS LOAD-BEARING: `nums[lo] <= nums[mid]`. With a two-element range
 * lo === mid, so `<` would classify the left half as unsorted and send the
 * search the wrong way. The [3,1] and [1,3] tests exist to catch exactly that.
 *
 * FOLLOW-UP THEY ASK: "what if there are duplicates?" — worst case degrades to
 * O(n), because `nums[lo] === nums[mid] === nums[hi]` tells you nothing and you
 * can only step one end inward. Knowing that the guarantee breaks is the answer
 * they want.
 */
export function searchRotated(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;

    // `<=` matters: when lo === mid the left half is trivially sorted.
    if (nums[lo]! <= nums[mid]!) {
      // Left half [lo, mid] is sorted.
      if (nums[lo]! <= target && target < nums[mid]!) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // Right half [mid, hi] is sorted.
      if (nums[mid]! < target && target <= nums[hi]!) lo = mid + 1;
      else hi = mid - 1;
    }
  }

  return -1;
}

/**
 * PROBLEM 4 — Binary search the ANSWER
 *
 * THE FRAMING THAT SCORES:
 *   "I'm not searching the array — it isn't sorted and sorting wouldn't help.
 *    I'm searching the answer space, k from 1 to max(piles). The property that
 *    licenses binary search is monotonicity: if speed k finishes in time, then
 *    so does every speed above it. So `canFinish` looks like
 *    false…false,true…true and I'm looking for the first true."
 *
 * COMPLEXITY: O(n log m) time where m = max(piles) — each `canFinish` is O(n),
 *             and there are log m iterations. O(1) space.
 *
 * WHY THE BOUNDS: k = 1 is the slowest meaningful speed; k = max(piles) always
 * works when h >= piles.length, because each pile then takes exactly one hour.
 * (If h < piles.length the task is impossible at any speed — worth naming as a
 * clarifying question rather than silently returning max.)
 *
 * THE `ceil` IS THE PROBLEM'S ACTUAL RULE: leftovers still consume a whole
 * hour, and you may not move to another pile within the hour. Restating that
 * back to the interviewer is how you show you read the constraints.
 *
 * HOW TO SPOT THIS PATTERN LATER: "minimum capacity to ship in D days",
 * "smallest divisor under a threshold", "minimum days to make m bouquets" —
 * all the same shape. Write `isOk(x)`, check it is monotonic, binary search it.
 */
export function minEatingSpeed(piles: number[], h: number): number {
  const hoursNeeded = (speed: number): number => {
    let hours = 0;
    for (const pile of piles) hours += Math.ceil(pile / speed);
    return hours;
  };

  let lo = 1;
  let hi = Math.max(...piles);
  let answer = hi;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (hoursNeeded(mid) <= h) {
      // Feasible — record it and try to do better (slower).
      answer = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  return answer;
}
