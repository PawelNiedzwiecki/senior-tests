/**
 * SOLUTIONS — Union-Find
 */

/**
 * The structure itself, written the way it should come out under pressure:
 * path halving inside `find`, union by size, and a `union` that reports whether
 * it actually merged anything.
 */
class DisjointSet {
  private readonly parent: number[];
  private readonly size: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array<number>(n).fill(1);
  }

  find(x: number): number {
    let current = x;
    while (this.parent[current] !== current) {
      this.parent[current] = this.parent[this.parent[current]!]!; // path halving
      current = this.parent[current]!;
    }
    return current;
  }

  /** Returns false if the two were ALREADY in the same set — often the answer. */
  union(a: number, b: number): boolean {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;

    if (this.size[rootA]! < this.size[rootB]!) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    this.size[rootA]! += this.size[rootB]!;
    return true;
  }
}

/**
 * PROBLEM 1 — Satisfiability of equality equations
 *
 * COMPLEXITY: O(n α(26)) time, O(1) space — there are only 26 variables.
 *
 * NARRATION:
 *   "Equality is an equivalence relation, which is exactly what Union-Find
 *    models. So: merge every '==' pair first, then check the '!=' pairs. If any
 *    two variables forced apart turn out to share a root, the system is
 *    contradictory."
 *
 * THE ORDERING IS THE ALGORITHM. All equalities must be processed before any
 * inequality is checked, because an equality arriving later can invalidate an
 * inequality that looked fine at the time. A single interleaved pass answers
 * ['a!=b', 'a==b'] incorrectly. Expect to be asked why two passes; the answer
 * is that the union structure is only complete after the first one.
 *
 * INDEXING BY CHARACTER CODE — `charCodeAt(0) - 97` — keeps the whole thing in a
 * fixed 26-element array with no Map and no allocation.
 *
 * 'a!=a' NEEDS NO SPECIAL CASE: a variable always shares a root with itself, so
 * the second pass rejects it naturally.
 */
export function equationsPossible(equations: string[]): boolean {
  const sets = new DisjointSet(26);
  const index = (variable: string) => variable.charCodeAt(0) - 97;

  // Pass 1 — every equality, so the groups are complete before anything is checked.
  for (const equation of equations) {
    if (equation[1] === '=') sets.union(index(equation[0]!), index(equation[3]!));
  }

  // Pass 2 — every inequality: sharing a root is a contradiction.
  for (const equation of equations) {
    if (equation[1] === '!' && sets.find(index(equation[0]!)) === sets.find(index(equation[3]!))) {
      return false;
    }
  }

  return true;
}

/**
 * PROBLEM 2 — Accounts merge
 *
 * COMPLEXITY: O(E α(E)) for the unions plus O(E log E) for the sorting, where E
 * is the total number of emails. Space O(E).
 *
 * NARRATION:
 *   "The accounts are not the natural nodes — the EMAILS are. I give every
 *    distinct email an index, then union each account's emails onto its first
 *    email. Two accounts sharing any email end up with a common root
 *    automatically, and transitive chains merge for free. Finally I group the
 *    emails by root, sort each group, and attach the owner's name."
 *
 * WHY EMAILS AS NODES: with accounts as nodes you have to discover which
 * accounts overlap, which is a search. With emails as nodes the overlap IS the
 * shared node, so there is nothing to search for. This modelling choice is the
 * whole difficulty of the problem and is worth stating before writing code.
 *
 * THE NAME MAP: a name is not an identity — two different people can both be
 * 'John' — so names are carried along as a label on each email and never used
 * for merging. Getting this wrong merges strangers, and the tests check it.
 *
 * SORTING WITH THE DEFAULT COMPARATOR is correct here: `Array.prototype.sort`
 * on strings is lexicographic by UTF-16 code unit, which is what the problem
 * wants. `localeCompare` would be locale-dependent and is the wrong tool.
 *
 * THE ALTERNATIVE — build a graph of email → email and run DFS per component —
 * is the same complexity and equally acceptable. Union-Find wins if accounts
 * arrive incrementally; offer the comparison.
 */
export function accountsMerge(accounts: string[][]): string[][] {
  const indexOfEmail = new Map<string, number>();
  const nameOfEmail = new Map<string, string>();

  for (const account of accounts) {
    const name = account[0]!;
    for (let i = 1; i < account.length; i += 1) {
      const email = account[i]!;
      if (!indexOfEmail.has(email)) indexOfEmail.set(email, indexOfEmail.size);
      nameOfEmail.set(email, name); // a label, never a merge key
    }
  }

  const sets = new DisjointSet(indexOfEmail.size);

  for (const account of accounts) {
    for (let i = 2; i < account.length; i += 1) {
      sets.union(indexOfEmail.get(account[1]!)!, indexOfEmail.get(account[i]!)!);
    }
  }

  const groups = new Map<number, string[]>();
  for (const [email, index] of indexOfEmail) {
    const root = sets.find(index);
    const group = groups.get(root);
    if (group === undefined) groups.set(root, [email]);
    else group.push(email);
  }

  return [...groups.values()].map((emails) => {
    emails.sort(); // lexicographic by code unit — not localeCompare
    return [nameOfEmail.get(emails[0]!)!, ...emails];
  });
}
