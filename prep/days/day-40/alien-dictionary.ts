/**
 * PATTERN 14 — Topological sort                          [LeetCode 210, 269]
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 45 min      Catalogue: ../patterns/CATALOGUE.md § 14
 *
 * THE PATTERN
 * Order the nodes of a DIRECTED ACYCLIC graph so that every edge points
 * forwards. If no such order exists, the graph has a cycle — and detecting that
 * is usually half of what the problem is actually asking.
 *
 * THE TELL
 *   "order that satisfies dependencies"  ·  "course schedule / prerequisites"
 *   "build order"  ·  "is this possible at all?"  ·  "derive the alphabet /
 *   ranking implied by this data"
 *
 * KAHN'S ALGORITHM (BFS on in-degrees) — the version to write, because cycle
 * detection is free:
 *   1. count the in-degree of every node
 *   2. queue every node with in-degree 0
 *   3. pop one, append it to the order, and decrement its neighbours'
 *      in-degrees; any that reach 0 join the queue
 *   4. if the order does not contain every node, THE REST ARE IN A CYCLE
 *
 * Step 4 is the payoff: no separate cycle check, no colour-marking DFS, no
 * recursion depth to worry about. The count comparison IS the cycle detector.
 *
 * THE DFS ALTERNATIVE — post-order, then reverse — needs three colours (white /
 * grey / black) to detect back edges, because "already visited" and "currently
 * on the stack" are different things. Correct, but more to get wrong under
 * pressure. Know it exists; reach for Kahn's.
 *
 * EDGE DIRECTION IS THE BUG THAT COSTS THE QUESTION. "a depends on b" means the
 * edge runs b → a, because b must come FIRST. Write one concrete example in the
 * margin before coding and check your adjacency list against it. Half of all
 * failed attempts at this pattern are a reversed edge.
 *
 * COST — O(V + E) time and space.
 *
 * NOT UNIQUE: several valid orders usually exist. If the problem demands a
 * specific one (lexicographically smallest, say), swap the queue for a
 * min-heap — the structure is otherwise unchanged.
 */

/**
 * PROBLEM 2 — Alien dictionary                                  [LeetCode 269]
 * ────────────────────────────────────────────────────────────────────────────
 * You are given words from an alien language, SORTED according to that
 * language's unknown letter order. Derive any letter order consistent with the
 * data, as a string. Return '' if the input is contradictory.
 *
 *   alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt'])  → 'wertf'
 *   alienOrder(['z', 'x'])                           → 'zx'
 *   alienOrder(['z', 'x', 'z'])                      → ''      (contradiction)
 *   alienOrder(['abc', 'ab'])                        → ''      (invalid input)
 *
 * TARGET: O(total characters) time and space.
 *
 * THE HARD PART IS EXTRACTING THE EDGES, not the sort. Compare each ADJACENT
 *       pair of words and find their FIRST DIFFERING character: that single
 *       comparison yields exactly one edge. Everything after that position
 *       tells you nothing, and non-adjacent pairs add no information that the
 *       adjacent ones do not already imply.
 *
 * THE TRAP EVERYONE FALLS INTO: if one word is a PREFIX of the previous one
 *       ('abc' then 'ab'), the input is invalid — a proper prefix must sort
 *       first in any letter order — so return ''. There is no edge to add and
 *       no way to satisfy it. Tests always include this case.
 *
 * EVERY LETTER THAT APPEARS must be in the output, including letters with no
 *       ordering constraints at all. Seed the in-degree map from all the
 *       characters before adding any edges.
 *
 * ANY VALID ORDER IS ACCEPTABLE when the data underdetermines it, so the tests
 *       below check the CONSTRAINTS rather than one exact string. Real
 *       interviews work the same way — be ready to argue your answer is valid
 *       rather than matching a memorised output.
 *
 * DUPLICATE EDGES: the same pair can be derived twice; counting it twice
 *       corrupts the in-degrees and the sort silently stalls. Deduplicate with
 *       a Set of successors per node.
 */
export function alienOrder(_words: string[]): string {
  throw new Error('Not implemented');
}
