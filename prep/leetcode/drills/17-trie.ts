/**
 * PATTERN 17 — Trie (prefix tree)                        [LeetCode 648, 421]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 17
 *
 * THE PATTERN
 * A tree where each EDGE is one symbol and each PATH from the root spells a
 * prefix. Shared prefixes are stored once, so a lookup costs O(length of the
 * key) with no dependence on how many keys are stored. That independence from
 * n is the reason a trie beats a hash set here: a hash set can tell you whether
 * a whole word is present, but it cannot enumerate by prefix.
 *
 * THE TELL
 *   "prefix"  ·  "autocomplete"  ·  "dictionary of words"  ·  "starts with"
 *   "shortest root / replacement word"  ·  and — less obviously — anything
 *   about matching BINARY digits of numbers greedily, which is problem 2
 *
 * THE NODE
 *   { children: Map<string, Node>, isWord: boolean }
 * A Map (or a 26-slot array, faster but alphabet-bound) plus an end-of-word
 * flag. Without the flag you cannot distinguish a stored word from a mere
 * prefix of one — the classic trie bug.
 *
 * TEMPLATE — insert and walk are the same three lines
 *   let node = root;
 *   for (const ch of word) {
 *     if (!node.children.has(ch)) node.children.set(ch, makeNode());  // insert
 *     node = node.children.get(ch)!;
 *   }
 *   node.isWord = true;
 *
 * COST — insert and search are O(L). Space is O(total characters) worst case,
 * but far less in practice because prefixes are shared, and that sharing IS the
 * data structure's value proposition.
 *
 * THE UNEXPECTED USE — A BIT TRIE. Store the 32-bit binary representation of
 * numbers, most significant bit first. Then "find the stored number that
 * maximises XOR with x" becomes a greedy walk: at each level, try to take the
 * OPPOSITE bit, because a 1 in a higher position outweighs everything below it.
 * Problem 2 is this, and it is the version of the trie that interviewers use to
 * separate people who have memorised the structure from people who understand
 * what it is for.
 */

/**
 * PROBLEM 1 — Replace words                                     [LeetCode 648]
 * ────────────────────────────────────────────────────────────────────────────
 * Given a dictionary of roots and a sentence, replace every word that has a
 * root prefix with the SHORTEST such root. Words without a root are unchanged.
 *
 *   replaceWords(['cat', 'bat', 'rat'], 'the cattle was rattled by the battery')
 *       → 'the cat was rat by the bat'
 *   replaceWords(['a', 'aa', 'aaa'], 'a aa aaa aaaa')  → 'a a a a'
 *   replaceWords(['cat'], 'dog')                       → 'dog'
 *
 * TARGET: O(total dictionary characters) to build, O(length of the sentence) to
 *       transform.
 *
 * WHY A TRIE AND NOT A SET: with a set you would test every prefix of every
 *       word against it — O(L) lookups of O(L) each. The trie walks each word
 *       ONCE and stops at the first stored root, which is automatically the
 *       shortest one because you meet it first on the way down. "Shortest"
 *       needs no extra logic at all, and noticing that is the point.
 *
 * HINT: walk the word letter by letter; the moment you land on a node with
 *       `isWord` set, emit the prefix so far and stop. If you fall off the trie
 *       or reach the end without hitting a word, emit the original.
 *
 * SPLITTING ON SPACES is fine here — the problem guarantees single spaces and
 *       lowercase letters. Say that you are relying on the guarantee rather
 *       than writing a tokeniser, so it does not look like an oversight.
 */
export function replaceWords(_dictionary: string[], _sentence: string): string {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Maximum XOR of two numbers in an array            [LeetCode 421]
 * ────────────────────────────────────────────────────────────────────────────
 * Return the largest value of `nums[i] ^ nums[j]` over all pairs.
 *
 *   findMaximumXOR([3, 10, 5, 25, 2, 8])  → 28     (5 ^ 25)
 *   findMaximumXOR([0])                   → 0
 *   findMaximumXOR([2, 4])                → 6
 *
 * TARGET: O(32n) time — linear — versus the O(n²) brute force over pairs.
 *
 * THE TWO PATTERNS STACKED: a trie, over BITS rather than letters. Insert every
 *       number as a 32-bit (or 31-bit, since values are non-negative) path,
 *       most significant bit first.
 *
 * THE GREEDY WALK: for each number, walk the trie trying at every level to take
 *       the OPPOSITE bit, since XOR yields 1 exactly when the bits differ. A 1
 *       at a higher position is worth more than every bit below it combined, so
 *       taking it whenever possible is optimal — that is the greedy argument,
 *       and it is what makes one pass sufficient.
 *
 * WHY MOST-SIGNIFICANT-FIRST IS ESSENTIAL: the greedy choice is only valid if
 *       higher bits dominate, which requires inserting and walking from the top.
 *       Least-significant-first gives a structure you cannot walk greedily.
 *
 * HOW MANY BITS: the constraint is values below 2^31, so 31 bits suffice. Using
 *       32 in JavaScript risks the sign bit and its signed-32-bit coercion —
 *       worth mentioning as a deliberate choice rather than an accident.
 *
 * THE PREFIX-SET ALTERNATIVE, worth knowing because it is shorter to write:
 *       build the answer bit by bit from the top, keeping a set of the numbers'
 *       high prefixes and asking at each step whether some pair could produce a
 *       1 there (`candidate ^ prefix` present in the set). Same O(32n), no
 *       structure to define.
 */
export function findMaximumXOR(_nums: number[]): number {
  throw new Error('Not implemented');
}
