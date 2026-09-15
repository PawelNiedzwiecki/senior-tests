/**
 * PATTERN 15 — Union-Find (disjoint set union)           [LeetCode 990, 721]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 15
 *
 * THE PATTERN
 * A structure that answers "are these two things in the same group?" and
 * "merge these two groups" in effectively constant time. Each set is a tree;
 * the root is the set's identity, and `find` walks to the root.
 *
 * THE TELL
 *   "are these connected"  ·  "how many groups / provinces / components"
 *   "merge these accounts"  ·  MANY interleaved merge and query operations
 *   "add this edge — does it create a cycle?"
 *
 * WHEN TO PREFER IT OVER DFS: DFS finds components in O(V + E) but must be
 * re-run from scratch whenever an edge is added. Union-Find handles merges
 * INCREMENTALLY. If the edges arrive over time, or the problem interleaves
 * merges with queries, Union-Find is the right structure — and saying exactly
 * that is how you justify the choice.
 *
 * THE TWO OPTIMISATIONS, and you need both:
 *   PATH COMPRESSION   during `find`, re-point every node directly at the root
 *   UNION BY RANK/SIZE attach the smaller tree under the larger one
 * Together they give O(α(n)) amortised — the inverse Ackermann function, which
 * is below 5 for any n you will ever see, so "effectively constant". With
 * neither, a chain of unions degrades to an O(n) linked list per find.
 *
 * TEMPLATE
 *   const parent = Array.from({ length: n }, (_, i) => i);
 *   const size = new Array(n).fill(1);
 *
 *   const find = (x) => {
 *     while (parent[x] !== x) {
 *       parent[x] = parent[parent[x]];   // path halving
 *       x = parent[x];
 *     }
 *     return x;
 *   };
 *
 *   const union = (a, b) => {
 *     let ra = find(a), rb = find(b);
 *     if (ra === rb) return false;       // already together — often the answer
 *     if (size[ra] < size[rb]) [ra, rb] = [rb, ra];
 *     parent[rb] = ra;
 *     size[ra] += size[rb];
 *     return true;
 *   };
 *
 * THE RETURN VALUE OF `union` IS FREE INFORMATION: false means "these were
 * already connected", which is exactly a cycle detection, a redundant edge, or
 * a duplicate merge. Several problems are solved entirely by counting how often
 * union returns false.
 *
 * NON-INTEGER KEYS (emails, strings) need a Map from key → index, assigned on
 * first sight. That bookkeeping is most of the code in problem 2.
 *
 * COST — O(n α(n)) for n operations; treat it as linear.
 */

/**
 * PROBLEM 1 — Satisfiability of equality equations               [LeetCode 990]
 * ────────────────────────────────────────────────────────────────────────────
 * Each equation is four characters: 'a==b' or 'a!=b', with single lowercase
 * variable names. Return true if some assignment of values satisfies them all.
 *
 *   equationsPossible(['a==b', 'b!=a'])              → false
 *   equationsPossible(['a==b', 'b==c', 'a==c'])      → true
 *   equationsPossible(['a==b', 'b!=c', 'c==a'])      → false
 *   equationsPossible(['a!=a'])                      → false
 *
 * TARGET: O(n α(26)) time, O(1) space — 26 variables, so the structure is a
 *       fixed-size array.
 *
 * THE INSIGHT: equality is an EQUIVALENCE RELATION — reflexive, symmetric,
 *       transitive — and Union-Find is the data structure for exactly that.
 *       Saying the word "equivalence relation" is what tells the interviewer
 *       you have recognised the shape rather than pattern-matched the syntax.
 *
 * THE TWO PASSES, and the ORDER IS THE ALGORITHM:
 *       1. process every '==' equation, merging the variables
 *       2. then check every '!=': if the two sides share a root, the constraints
 *          are contradictory
 *       Interleaving the passes gives wrong answers, because an equality that
 *       arrives later can invalidate an inequality you already approved. Be
 *       ready to explain why two passes are necessary — it is the question.
 *
 * 'a!=a' IS FALSE and falls out of the second pass without a special case,
 *       since a variable always shares a root with itself.
 */
export function equationsPossible(_equations: string[]): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Accounts merge                                     [LeetCode 721]
 * ────────────────────────────────────────────────────────────────────────────
 * Each account is `[name, ...emails]`. Two accounts belong to the same person
 * if they SHARE ANY EMAIL — names alone prove nothing, since different people
 * may share a name. Return the merged accounts, each as `[name, ...emails]`
 * with the emails sorted ascending. Any order of accounts is acceptable.
 *
 *   accountsMerge([
 *     ['John', 'a@x.com', 'b@x.com'],
 *     ['John', 'b@x.com', 'c@x.com'],
 *     ['Mary', 'm@x.com'],
 *   ])
 *   → [['John', 'a@x.com', 'b@x.com', 'c@x.com'], ['Mary', 'm@x.com']]
 *
 * TARGET: O(total emails × α) for the merging, plus O(k log k) to sort each
 *       group's emails.
 *
 * THE MODELLING DECISION, which is the interesting part: what are the NODES?
 *       Making the ACCOUNTS the nodes forces you to hunt for shared emails
 *       pairwise. Making the EMAILS the nodes, and unioning each account's
 *       emails to its first email, is O(total emails) with no searching at all.
 *       Choosing the right thing to be a node is the senior move here.
 *
 * THE THREE MAPS you will need:
 *       · email → index          (assigned on first sight, for Union-Find)
 *       · email → owner name     (any account containing it works)
 *       · root index → emails    (the grouping at the end)
 *
 * TRANSITIVITY IS THE POINT: A shares with B and B shares with C means all
 *       three merge, even though A and C share nothing directly. That is
 *       precisely what Union-Find gives you and what a naive pairwise
 *       comparison misses.
 *
 * SORTING: emails ascending within each account. Note that this is a plain
 *       lexicographic string sort, so it must not use `localeCompare`, whose
 *       result depends on the machine's locale.
 */
export function accountsMerge(_accounts: string[][]): string[][] {
  throw new Error('Not implemented');
}
