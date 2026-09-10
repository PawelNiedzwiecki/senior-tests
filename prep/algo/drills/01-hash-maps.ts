/**
 * MODULE 01 — Hash maps and counting
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min for all three      DIFFICULTY: ●●○○○
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
export function twoSum(_nums: number[], _target: number): [number, number] | null {
  throw new Error('Not implemented');
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
export function groupAnagrams(_words: string[]): string[][] {
  throw new Error('Not implemented');
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
export function firstUniqueChar(_s: string): number {
  throw new Error('Not implemented');
}
