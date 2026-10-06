/**
 * SOLUTIONS — Trie
 */

/**
 * PROBLEM 1 — Replace words
 *
 * COMPLEXITY: O(D) to build where D is the total dictionary length, then O(S)
 * over the sentence. Space O(D).
 *
 * NARRATION:
 *   "A trie over the roots. For each word in the sentence I walk down one
 *    letter at a time and stop at the first node marked as a complete root —
 *    which is necessarily the SHORTEST matching root, because I meet shorter
 *    prefixes first on the way down. So 'shortest' needs no comparison logic.
 *    If I fall off the trie, the word has no root and passes through unchanged."
 *
 * THE `isWord` FLAG is what distinguishes a stored root from an incidental
 * prefix. Without it, 'a' being on the path to 'aa' is indistinguishable from
 * 'a' being a root in its own right — and that is the bug the ['a','aa','aaa']
 * example exists to catch.
 *
 * THE EARLY RETURN inside the walk is the optimisation and the correctness
 * argument at once: stopping at the first `isWord` gives the shortest match for
 * free.
 *
 * WHY NOT A SET OF ROOTS: you would generate every prefix of every word and
 * test each, O(L²) per word for the string slicing alone. The trie is O(L) and
 * shares storage across roots with common prefixes.
 *
 * MAP VS 26-SLOT ARRAY: the array is faster and locks you to one alphabet; the
 * Map costs a little more per step and handles anything. Say which trade you
 * made — for lowercase-only input the array is defensible.
 */
interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
}

const makeNode = (): TrieNode => ({ children: new Map(), isWord: false });

export function replaceWords(dictionary: string[], sentence: string): string {
  const root = makeNode();

  for (const word of dictionary) {
    let node = root;
    for (const letter of word) {
      let next = node.children.get(letter);
      if (next === undefined) {
        next = makeNode();
        node.children.set(letter, next);
      }
      node = next;
    }
    node.isWord = true;
  }

  const shortestRoot = (word: string): string => {
    let node = root;
    for (let i = 0; i < word.length; i += 1) {
      const next = node.children.get(word[i]!);
      if (next === undefined) return word; // fell off the trie — no root
      node = next;
      if (node.isWord) return word.slice(0, i + 1); // first hit is the shortest
    }
    return word;
  };

  // The problem guarantees single spaces and lowercase letters, so a split is
  // enough — no tokeniser needed.
  return sentence.split(' ').map(shortestRoot).join(' ');
}

