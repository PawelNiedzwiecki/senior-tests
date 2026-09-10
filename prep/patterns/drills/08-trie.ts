/**
 * PATTERN 17 — Trie (prefix tree)
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: CATALOGUE.md § 17
 *
 * THE TELL: "prefix", "autocomplete", "dictionary", "starts with", "word
 * search on a board", or many lookups over a fixed word set.
 *
 * WHY NOT A HASH SET: a Set answers "is this exactly a word" in O(1), but it
 * cannot answer "does ANY word start with this" without scanning everything.
 * A trie answers both in O(L), independent of how many words are stored. That
 * contrast is the reason the structure exists — lead with it.
 *
 * THE `isWord` FLAG IS NOT OPTIONAL. Without it you cannot distinguish a stored
 * word from a prefix of one: "app" vs "apple". Every trie bug traces back to
 * this flag being missing, set on the wrong node, or checked in the wrong place.
 *
 * COST: insert and search O(L) in the word length. Space O(total characters),
 * which is the trade you are making for prefix queries.
 */

export interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

export class Trie {
  /** Add a word. Inserting the same word twice is a no-op. */
  insert(_word: string): void {
    throw new Error('Not implemented');
  }

  /** Is this EXACTLY a stored word? */
  search(_word: string): boolean {
    throw new Error('Not implemented');
  }

  /** Does any stored word begin with this prefix? */
  startsWith(_prefix: string): boolean {
    throw new Error('Not implemented');
  }

  /**
   * Every stored word beginning with `prefix`, in ascending lexicographic
   * order. The prefix itself counts if it is a stored word.
   *
   *   insert('app'); insert('apple'); insert('apply'); insert('banana');
   *   wordsWithPrefix('app') → ['app', 'apple', 'apply']
   *   wordsWithPrefix('b')   → ['banana']
   *   wordsWithPrefix('xyz') → []
   *
   * HINT: walk down to the prefix node, then DFS collecting whole words. Sort
   *       the children keys at each level for lexicographic order — a Map
   *       iterates in INSERTION order, not sorted order, which is easy to
   *       forget.
   */
  wordsWithPrefix(_prefix: string): string[] {
    throw new Error('Not implemented');
  }

  /**
   * Search where `.` matches any single character.
   *
   *   insert('bad'); insert('dad'); insert('mad');
   *   searchPattern('.ad')  → true
   *   searchPattern('b..')  → true
   *   searchPattern('b.')   → false      (length must match)
   *
   * HINT: recursion. On a normal character, descend if that child exists. On a
   *       '.', try EVERY child and succeed if any branch does. This is
   *       backtracking over the trie — two patterns stacked.
   */
  searchPattern(_pattern: string): boolean {
    throw new Error('Not implemented');
  }
}
