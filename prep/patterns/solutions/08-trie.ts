/**
 * SOLUTIONS — Trie
 */

export interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

const makeNode = (): TrieNode => ({ children: new Map(), isWord: false });

/**
 * NARRATION for the whole structure:
 *   "A hash set answers 'is this a word' in O(1), but can't answer 'does any
 *    word start with this' without scanning every entry. A trie shares prefixes
 *    structurally, so both queries are O(L) in the query length, independent of
 *    how many words are stored. The trade is space — one node per distinct
 *    prefix."
 *
 * COMPLEXITY: insert O(L), search O(L), startsWith O(L).
 *             wordsWithPrefix O(L + total characters under the prefix).
 *             searchPattern O(L) with no wildcards, but up to O(26^w · L) with
 *             w wildcards, since each '.' branches across every child.
 *
 * `Map` vs A 26-SLOT ARRAY: an array is marginally faster and bounded, but
 * assumes lowercase ASCII — wrong for any real text, and especially wrong at a
 * translation company. A Map handles any alphabet and only allocates the
 * children that exist. Say which you chose and why.
 */
export class Trie {
  private readonly root: TrieNode = makeNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      let next = node.children.get(char);
      if (next === undefined) {
        next = makeNode();
        node.children.set(char, next);
      }
      node = next;
    }
    node.isWord = true; // mark the END — this is the flag everything depends on
  }

  /** Walk to the node for `text`, or null if the path does not exist. */
  private nodeFor(text: string): TrieNode | null {
    let node: TrieNode = this.root;
    for (const char of text) {
      const next = node.children.get(char);
      if (next === undefined) return null;
      node = next;
    }
    return node;
  }

  search(word: string): boolean {
    // The `isWord` check is what separates "apple" from "app".
    return this.nodeFor(word)?.isWord ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.nodeFor(prefix) !== null;
  }

  /**
   * WHY THE SORT: a `Map` iterates in INSERTION order, not lexicographic order.
   * Sorting the keys at each level is what produces sorted output, and it is
   * the detail people miss — inserting 'apply' before 'apple' would otherwise
   * emit them in that order. (A 26-slot array would iterate sorted for free;
   * that is one genuine argument in its favour.)
   */
  wordsWithPrefix(prefix: string): string[] {
    const start = this.nodeFor(prefix);
    if (start === null) return [];

    const out: string[] = [];

    const collect = (node: TrieNode, path: string): void => {
      if (node.isWord) out.push(path);
      for (const char of [...node.children.keys()].sort()) {
        collect(node.children.get(char)!, path + char);
      }
    };

    collect(start, prefix);
    return out;
  }

  /**
   * WILDCARD SEARCH — this is backtracking over the trie, two patterns stacked.
   *
   * On an ordinary character there is one branch to try. On a '.', every child
   * is a candidate and the search succeeds if ANY of them does — so it needs a
   * loop with an early return, not a single descent.
   *
   * THE BASE CASE checks `isWord`, not merely "we ran out of pattern". Reaching
   * a node that is only a prefix means no word of that exact length exists, so
   * `searchPattern('app')` on a trie holding only 'apple' is correctly false.
   */
  searchPattern(pattern: string): boolean {
    const walk = (node: TrieNode, index: number): boolean => {
      if (index === pattern.length) return node.isWord;

      const char = pattern[index]!;

      if (char === '.') {
        for (const child of node.children.values()) {
          if (walk(child, index + 1)) return true; // any branch will do
        }
        return false;
      }

      const next = node.children.get(char);
      return next !== undefined && walk(next, index + 1);
    };

    return walk(this.root, 0);
  }
}
