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

