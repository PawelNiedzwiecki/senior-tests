/**
 * SOLUTIONS 01 — Hash maps and counting
 *
 * Read the talking points, not just the code. In this round the interviewer is
 * explicitly assessing how you decompose and communicate, so the narration is
 * a scored deliverable.
 */

/**
 * PROBLEM 1 — Two Sum
 *
 * NARRATION (say this before typing):
 *   "Brute force is every pair — two nested loops, O(n²) time, O(1) space.
 *    The repeated work is re-scanning for the complement. If I remember what
 *    I've seen in a hash map, each lookup is O(1) and I get one pass:
 *    O(n) time, O(n) space. I'll trade the space."
 *
 * COMPLEXITY: O(n) time — one pass, each Map op amortised O(1).
 *             O(n) space — worst case every element is stored.
 *
 * THE BUG TO AVOID: check BEFORE inserting. If you insert first, then
 * `twoSum([3, 3], 6)` finds index 0 as its own partner and returns [0, 0].
 * Checking first is also what enforces "don't reuse the same element".
 *
 * FOLLOW-UPS THEY ASK:
 *   - "What if the array were sorted?" → two pointers, O(n) time and O(1)
 *     space. Better space, but sorting an unsorted input first costs
 *     O(n log n), so the Map still wins on an unsorted array.
 *   - "All pairs, not just one?" → still one pass, but push to a result list
 *     and keep a Map of value → list of indices to handle duplicates.
 *   - "Hash collisions?" → Map ops are amortised O(1), worst case O(n) with
 *     adversarial keys. Fine here; worth naming that you know it.
 */
export function twoSum(nums: number[], target: number): [number, number] | null {
  const seenIndexByValue = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    const value = nums[i]!;
    const complement = target - value;

    // Check first: guarantees we never pair an element with itself.
    const j = seenIndexByValue.get(complement);
    if (j !== undefined) return [j, i];

    seenIndexByValue.set(value, i);
  }

  return null;
}

/**
 * PROBLEM 2 — Group Anagrams
 *
 * NARRATION:
 *   "Two words are anagrams iff they have the same multiset of letters. So I
 *    need a canonical form to use as a map key. Sorting the letters is the
 *    simplest: O(k log k) per word. Then it's one pass, grouping into a Map."
 *
 * COMPLEXITY: O(n · k log k) time where n = word count, k = max word length.
 *             O(n · k) space for the output.
 *
 * THE FOLLOW-UP — avoiding the sort. Use a 26-slot count vector as the key:
 * that is O(k) per word, so O(n · k) overall. See `groupAnagramsCounted` below.
 * When is it WORSE? When the alphabet is large or unbounded — for Unicode text
 * a 26-slot array is wrong and a full count map costs more than sorting a short
 * word. At a translation company that caveat is worth saying out loud.
 *
 * TYPESCRIPT NOTE: `Map<string, string[]>` with the `?? []` + `set` idiom
 * avoids the "get, check undefined, maybe create" dance three times over.
 */
export function groupAnagrams(words: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of words) {
    const key = [...word].sort().join('');
    const group = groups.get(key);
    if (group) {
      group.push(word);
    } else {
      groups.set(key, [word]);
    }
  }

  return [...groups.values()];
}

/** The O(n · k) variant. Know it exists; know why it is not always better. */
export function groupAnagramsCounted(words: string[]): string[][] {
  const groups = new Map<string, string[]>();
  const A = 'a'.charCodeAt(0);

  for (const word of words) {
    const counts = new Array<number>(26).fill(0);
    for (const char of word) counts[char.charCodeAt(0) - A]! += 1;
    // '#' separator so [1,11] and [11,1] cannot collide.
    const key = counts.join('#');

    const group = groups.get(key);
    if (group) group.push(word);
    else groups.set(key, [word]);
  }

  return [...groups.values()];
}

/**
 * PROBLEM 3 — First Unique Character
 *
 * NARRATION:
 *   "I need to know a character's total count before I can judge the first
 *    one, so a single pass can't work in general. Two passes: count, then scan.
 *    Two passes is still O(n) — say that explicitly, because candidates often
 *    contort themselves trying to avoid a second pass for no gain."
 *
 * COMPLEXITY: O(n) time (two passes). O(1) space if the alphabet is bounded —
 * at most 26 entries for lowercase ASCII, or a fixed constant for Unicode
 * codepoints in practice. Saying "O(1) because the alphabet is bounded" is the
 * precise answer; saying "O(n) space" is also defensible if you refuse that
 * assumption. Pick one and justify it.
 *
 * WATCH OUT: iterating a string with `for (const c of s)` walks CODEPOINTS,
 * while `s[i]` and `s.charAt(i)` walk UTF-16 CODE UNITS. They differ for emoji
 * and many non-Latin scripts. Here the returned index must line up with the
 * caller's idea of position, so index-based iteration is the consistent choice.
 * Module 12 covers this properly.
 */
export function firstUniqueChar(s: string): number {
  const counts = new Map<string, number>();

  for (const char of s) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (let i = 0; i < s.length; i += 1) {
    if (counts.get(s[i]!) === 1) return i;
  }

  return -1;
}
