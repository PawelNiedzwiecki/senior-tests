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
 * PROBLEM 1 — Course schedule II                                [LeetCode 210]
 * ────────────────────────────────────────────────────────────────────────────
 * `numCourses` courses are labelled 0..numCourses-1. Each pair [a, b] means
 * "to take a you must first take b". Return ANY valid order in which all
 * courses can be taken, or an empty array if it is impossible.
 *
 *   findOrder(2, [[1, 0]])                    → [0, 1]
 *   findOrder(4, [[1,0], [2,0], [3,1], [3,2]]) → [0, 1, 2, 3] or [0, 2, 1, 3]
 *   findOrder(2, [[1, 0], [0, 1]])            → []    (a cycle)
 *   findOrder(1, [])                          → [0]
 *
 * TARGET: O(V + E) time and space.
 *
 * THE EDGE DIRECTION, spelled out because it is the whole problem: the pair
 *       [a, b] means b → a. b's in-degree is unaffected; a's goes up by one.
 *       Build the adjacency list as `graph[b].push(a)`. Getting this backwards
 *       produces a reversed order that passes the simplest test case and fails
 *       everything else.
 *
 * THE CYCLE CHECK: if the produced order is shorter than `numCourses`, the
 *       remaining courses each still depend on something, which can only happen
 *       inside a cycle. Return [].
 *
 * THE DEGENERATE CASES matter here: no prerequisites at all means every order
 *       is valid, and a course with no edges must still appear in the output.
 *
 * USE A HEAD INDEX, not `queue.shift()` — shift is O(n) on a JavaScript array
 *       and turns an O(V + E) algorithm into O(V²).
 */
export function findOrder(_numCourses: number, _prerequisites: Array<[number, number]>): number[] {
  throw new Error('Not implemented');
}

