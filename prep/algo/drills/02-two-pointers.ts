/**
 * MODULE 02 — Two pointers
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 50 min for all four      DIFFICULTY: ●●○○○
 *
 * THE PATTERN
 * Two indices walking the array, usually reducing an O(n²) search to O(n) with
 * O(1) extra space. Three shapes:
 *
 *   CONVERGING   left=0, right=n-1, move inward     — palindromes, sorted pairs
 *   FAST/SLOW    both start left, move at different rates — in-place filtering,
 *                                                     cycle detection
 *   PARALLEL     one pointer per array              — merging sorted inputs
 *
 * RECOGNITION CUES
 *   - The input is SORTED, or sorting it is free/allowed → converging pointers.
 *   - "in place", "O(1) extra space", "without allocating" → fast/slow.
 *   - "compare from both ends" → converging.
 *
 * WHY THE INTERVIEWER LIKES IT: the correctness argument is not obvious. Being
 * able to say WHY it is safe to discard a candidate (see maxArea) is the thing
 * being tested, more than the code.
 *
 * SAY THIS OUT LOUD:
 *   "Brute force is all pairs, O(n²). Because the array is sorted I can decide
 *    which pointer to move from the comparison alone, so each element is
 *    visited once: O(n) time, O(1) space."
 */

/**
 * PROBLEM 1 — Valid Palindrome
 * Ignore everything that is not a letter or digit; ignore case.
 *
 *   isPalindrome('A man, a plan, a canal: Panama') → true
 *   isPalindrome('race a car')                     → false
 *   isPalindrome('')                               → true
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: do NOT build a cleaned copy first — that is O(n) space and the
 *       interviewer will ask you to remove it. Skip non-alphanumerics as you go.
 */
export function isPalindrome(s: string): boolean {
	const isAlphaNum = (c: string) => /[a-z0-9]/i.test(c);
	let left = 0,
		right = s.length - 1;

	while (left < right) {
		if (!isAlphaNum(s.charAt(left))) {
			left++;
			continue;
		}
		if (!isAlphaNum(s.charAt(right))) {
			right--;
			continue;
		}
		if (s.charAt(left).toLowerCase() !== s.charAt(right).toLowerCase()) {
			return false;
		}
		left++;
		right--;
	}

	return true;
}

/**
 * PROBLEM 2 — Two Sum on a SORTED array
 * Return the two indices that sum to target, or null.
 *
 *   twoSumSorted([2, 7, 11, 15], 9)  → [0, 1]
 *   twoSumSorted([2, 3, 4], 6)       → [0, 2]
 *
 * TARGET: O(n) time, O(1) space — beating module 01's O(n) space.
 * HINT: sum too small → the only way to grow it is to move `left` right.
 *       Sum too big → move `right` left. Be ready to justify why that never
 *       skips the answer.
 */
export function twoSumSorted(
	nums: number[],
	target: number,
): [number, number] | null {
	let left = 0;
	let right = nums.length - 1;

	while (left < right) {
		const sum = nums[left]! + nums[right]!;
		if (sum === target) {
			return [left, right];
		} else if (sum < target) {
			left++;
		} else {
			right--;
		}
	}

	return null;
}

/**
 * PROBLEM 3 — Container With Most Water
 * `heights[i]` is a vertical line at x = i. Pick two lines that, with the
 * x-axis, hold the most water. Return that area.
 *
 *   maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) → 49
 *   maxArea([1, 1])                      → 1
 *
 * TARGET: O(n) time, O(1) space.
 * HINT: area = (right - left) * min(heights[left], heights[right]).
 *       Start at the widest pair. Moving the TALLER pointer inward can never
 *       help — width shrinks and the height is still capped by the shorter
 *       line. So always move the shorter one.
 *       ↑ That sentence is the answer to "why is this correct?". Rehearse it.
 */
export function maxArea(_heights: number[]): number {
	throw new Error("Not implemented");
}

/**
 * PROBLEM 4 — Move Zeroes
 * Move every 0 to the end, IN PLACE, keeping the relative order of the rest.
 * Return the same array reference.
 *
 *   moveZeroes([0, 1, 0, 3, 12]) → [1, 3, 12, 0, 0]
 *
 * TARGET: O(n) time, O(1) space, and minimise writes.
 * HINT: a `write` pointer trailing a `read` pointer. This "compaction" shape
 *       also solves remove-duplicates and remove-element — learn it once.
 */
export function moveZeroes(nums: number[]): number[] {
	let write = 0;

	for (let read = 0; read < nums.length; read++) {
		if (nums[read] !== 0) {
			[nums[write], nums[read]] = [nums[read]!, nums[write]!];
			write++;
		}
	}

	return nums;
}
