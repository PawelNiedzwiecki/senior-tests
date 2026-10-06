/**
 * MODULE 01 — Hash maps and counting
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 80 min for all six      DIFFICULTY: ●●○○○
 *
 * THE PATTERN
 * A hash map trades memory for time. Any time you catch yourself writing a
 * nested loop that asks "is there another element such that…", stop: you are
 * about to write O(n²), and a Map almost certainly makes it O(n).
 *
 * RECOGNITION CUES — reach for a Map when you see:
 *   - "have I seen this before?"           → Set
 *   - "how many times does X appear?"      → Map<T, number>
 *   - "group things that share a property" → Map<key, T[]>
 *   - "find a pair that sums to / differs by" → Map of complements
 *
 * TYPESCRIPT NOTES THAT MATTER IN AN INTERVIEW
 *   - `Map` beats a plain object: any key type, real `.size`, ordered iteration,
 *     no prototype keys (`{}['constructor']` is not undefined — a real bug).
 *   - `map.get()` returns `T | undefined`. Under `strict` you must handle that.
 *     `map.get(k) ?? 0` is the idiom for counting.
 *   - `nums[i]` is `number | undefined` under `noUncheckedIndexedAccess`. In
 *     HackerRank it usually is not enabled, but writing `nums[i]!` costs nothing
 *     and shows you know why.
 *
 * SAY THIS OUT LOUD before coding any of these:
 *   "The brute force is two nested loops, O(n²). I can trade space for time
 *    with a hash map and get O(n) time, O(n) space. Is that trade acceptable?"
 */

import type { lengthOfLongestSubstring } from "./03-sliding-window";

/**
 * PROBLEM 1 — Two Sum
 * Return the INDICES of the two numbers that add up to `target`, or null.
 * Exactly one solution at most; you may not use the same element twice.
 *
 *   twoSum([2, 7, 11, 15], 9) → [0, 1]
 *   twoSum([3, 2, 4], 6)      → [1, 2]
 *   twoSum([1, 2], 99)        → null
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: as you walk the array, ask "have I already seen the number I need?"
 *       Store value → index. Check BEFORE you insert, or [3,3] breaks.
 */
export function twoSum(
	nums: number[],
	target: number,
): [number, number] | null {
	const mapIndexes = new Map<number, number>();
	let complement: number;

	for (let i = 0; i < nums.length; i++) {
		complement = target - nums[i]!;
		if (mapIndexes.has(complement)) {
			return [mapIndexes.get(complement)!, i];
		} else {
			mapIndexes.set(nums[i]!, i);
		}
	}

	return null;
}

/**
 * PROBLEM 2 — Group Anagrams
 * Group words that are anagrams of each other. Order of groups and of words
 * within a group does not matter.
 *
 *   groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])
 *     → [['eat','tea','ate'], ['tan','nat'], ['bat']]
 *
 * TARGET: O(n · k log k) with a sorted-letters key, where k is word length.
 * HINT: two words are anagrams iff some canonical form of them is equal.
 *       Sorting the letters is the obvious canonical form.
 * FOLLOW-UP THEY WILL ASK: can you avoid the sort? (Yes — a 26-slot count
 *       vector joined into a string. That is O(n · k). Know why it is better
 *       and when it is worse.)
 */
export function groupAnagrams(words: string[]): string[][] {
	const sortLetters = (word: string) => word.split("").sort().join("");

	const anagrams = new Map<string, string[]>();

	for (let i = 0; i < words.length; i++) {
		const sorted = sortLetters(words[i]!);

		if (anagrams.has(sorted)) {
			anagrams.get(sorted)?.push(words[i]!);
		} else {
			anagrams.set(sorted, [words[i]!]);
		}
	}

	return [...anagrams.values()];
}

/**
 * PROBLEM 3 — First Unique Character
 * Return the index of the first character that appears exactly once, or -1.
 *
 *   firstUniqueChar('leetcode')   → 0
 *   firstUniqueChar('loveleetcode') → 2
 *   firstUniqueChar('aabb')       → -1
 *
 * TARGET: O(n) time, O(1) space if you argue the alphabet is bounded.
 * HINT: two passes. Count, then scan for the first count of 1. Trying to do it
 *       in one pass is where people tie themselves in knots — say "two passes,
 *       still O(n)" and move on.
 */
export function firstUniqueChar(s: string): number {
	const letters = new Map<string, number>();

	for (let i = 0; i < s.length; i++) {
		if (letters.get(s[i]!)) {
			letters.set(s[i]!, letters.get(s[i]!) + 1);
		} else {
			letters.set(s[i]!, 1);
		}
	}

	for (let j = 0; j < s.length; j++) {
		if (letters.get(s[j]!) === 1) {
			return j;
		}
	}

	return -1;
}

/**
 * PROBLEM 4 — Contains Duplicate II
 * Return true if there are two indices i, j with nums[i] === nums[j] and
 * |i - j| <= k.
 *
 *   containsNearbyDuplicate([1,2,3,1], 3)       → true
 *   containsNearbyDuplicate([1,0,1,1], 1)       → true
 *   containsNearbyDuplicate([1,2,3,1,2,3], 2)   → false
 *
 * TARGET: O(n) time, O(min(n, k)) space.
 * HINT: store value → LAST SEEN INDEX. On each element, check if it was seen
 *       before AND the distance is within k, then update the stored index
 *       regardless — you only ever care about the nearest previous occurrence.
 */
export function containsNearbyDuplicate(nums: number[], k: number): boolean {
	const indicies = new Map<number, number>();
	for (let i = 0; i < nums.length; i++) {
		if (indicies.has(nums[i]!)) {
			if (i - indicies.get(nums[i]!)! <= k) {
				return true;
			}
		}
		indicies.set(nums[i]!, i);
	}

	return false;
}

/**
 * PROBLEM 5 — Subarray Sum Equals K
 * Count the number of CONTIGUOUS subarrays whose elements sum to k.
 *
 *   subarraySum([1,1,1], 2)     → 2
 *   subarraySum([1,2,3], 3)     → 2   ([1,2] and [3])
 *   subarraySum([1,-1,0], 0)    → 3
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: prefix sums. If prefixSum[j] - prefixSum[i] === k for some i < j, the
 *       subarray between them sums to k. Reframe as: at each j, how many earlier
 *       prefix sums equal (prefixSum[j] - k)? Store prefix-sum → count of times
 *       seen, seeded with {0: 1} for subarrays starting at index 0.
 */
export function subarraySum(_nums: number[], _k: number): number {
	throw new Error("Not implemented");
}

/**
 * PROBLEM 6 — Longest Consecutive Sequence
 * Return the length of the longest run of consecutive integers, in any order,
 * using each number once. Must run in O(n) — sorting is the trap here.
 *
 *   longestConsecutive([100,4,200,1,3,2]) → 4   (1,2,3,4)
 *   longestConsecutive([0,3,7,2,5,8,4,6,0,1]) → 9
 *
 * TARGET: O(n) time, O(n) space.
 * HINT: put every number in a Set. A number only STARTS a sequence if
 *       (num - 1) is not in the set — check that before you count forward.
 *       That guard is what keeps the total work O(n) instead of O(n²).
 */
export function longestConsecutive(_nums: number[]): number {
	throw new Error("Not implemented");
}
