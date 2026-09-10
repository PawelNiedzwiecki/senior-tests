/**
 * SOLUTIONS 02 — Two pointers
 */

/**
 * PROBLEM 1 — Valid Palindrome
 *
 * NARRATION:
 *   "Simplest version: strip non-alphanumerics, lowercase, compare with the
 *    reverse. That's O(n) time but O(n) space for the two copies. I can avoid
 *    the copies with converging pointers that skip junk in place: O(1) space."
 *
 * COMPLEXITY: O(n) time — each index is passed at most once by one pointer.
 *             O(1) space.
 *
 * THE INNER `while` LOOPS need the `left < right` guard, or a string of pure
 * punctuation runs the pointer off the end. That is what the '.,!?' test
 * catches, and it is the single most common bug here.
 *
 * FOLLOW-UP: "what about Unicode?" — `toLowerCase()` is locale-sensitive in
 * ways that bite (Turkish dotless ı is the standard example), and this
 * character check is ASCII-only. For real text you want
 * `String.prototype.normalize('NFD')` plus a Unicode property escape like
 * `/\p{Letter}|\p{Number}/u`. Worth mentioning at a translation company.
 */
function isAlphanumeric(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) || // 0-9
    (code >= 65 && code <= 90) || // A-Z
    (code >= 97 && code <= 122) // a-z
  );
}

export function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // The `left < right` guards stop us running off the end on junk-only input.
    while (left < right && !isAlphanumeric(s[left]!)) left += 1;
    while (left < right && !isAlphanumeric(s[right]!)) right -= 1;

    if (s[left]!.toLowerCase() !== s[right]!.toLowerCase()) return false;

    left += 1;
    right -= 1;
  }

  return true;
}

/**
 * PROBLEM 2 — Two Sum on a sorted array
 *
 * WHY IT IS CORRECT — rehearse this, it is the actual question:
 *   "Suppose sum < target. Every pair using `left` with something at or below
 *    `right` is at most this sum, so `left` cannot be part of any solution
 *    within the current window — I can discard it safely. Symmetrically for
 *    sum > target. So each step eliminates exactly one candidate and never
 *    eliminates the answer."
 *
 * COMPLEXITY: O(n) time, O(1) space. Strictly better on space than the hash
 * map version — but only because the input is already sorted. If you had to
 * sort it yourself that is O(n log n), and the Map version wins.
 */
export function twoSumSorted(nums: number[], target: number): [number, number] | null {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left]! + nums[right]!;
    if (sum === target) return [left, right];
    if (sum < target) left += 1;
    else right -= 1;
  }

  return null;
}

/**
 * PROBLEM 3 — Container With Most Water
 *
 * WHY IT IS CORRECT — the whole point of the problem:
 *   "Start at the widest possible pair. Any move inward loses width, so it can
 *    only pay off by gaining height. The area is capped by the SHORTER line,
 *    so moving the taller pointer keeps that cap and loses width — it can never
 *    improve. Therefore moving the shorter pointer is the only move that can
 *    help, and discarding it discards no better solution."
 *
 * COMPLEXITY: O(n) time — pointers only move inward, n steps total.
 *             O(1) space.
 *
 * BRUTE FORCE for contrast: all pairs, O(n²). Mention it, then improve it.
 *
 * EDGE CASE: fewer than two lines has no container at all — return 0. The loop
 * below handles it naturally because `left < right` is false immediately.
 */
export function maxArea(heights: number[]): number {
  let left = 0;
  let right = heights.length - 1;
  let best = 0;

  while (left < right) {
    const height = Math.min(heights[left]!, heights[right]!);
    best = Math.max(best, (right - left) * height);

    // Only moving the shorter line can possibly improve the area.
    if (heights[left]! < heights[right]!) left += 1;
    else right -= 1;
  }

  return best;
}

/**
 * PROBLEM 4 — Move Zeroes
 *
 * NARRATION:
 *   "Two pointers, both moving forward. `read` scans; `write` marks where the
 *    next non-zero belongs. Copy forward as I go, then fill the tail with
 *    zeroes. One pass plus the fill, O(n), no extra allocation."
 *
 * COMPLEXITY: O(n) time, O(1) space.
 *
 * THIS SHAPE GENERALISES — it is the same loop as:
 *   - remove all instances of a value
 *   - remove duplicates from a sorted array
 *   - partition around a pivot
 * Learn it once as "compaction: write trails read".
 *
 * FOLLOW-UP: "minimise writes" → swap only when `read !== write`, so an array
 * with no zeroes performs zero writes instead of n. Cheap, and shows you read
 * the constraint.
 */
export function moveZeroes(nums: number[]): number[] {
  let write = 0;

  for (let read = 0; read < nums.length; read += 1) {
    if (nums[read] !== 0) {
      // Only write when it actually moves something.
      if (read !== write) nums[write] = nums[read]!;
      write += 1;
    }
  }

  for (let i = write; i < nums.length; i += 1) nums[i] = 0;

  return nums;
}
