/**
 * SOLUTIONS — Topological sort
 */

/**
 * PROBLEM 1 — Course schedule II
 *
 * COMPLEXITY: O(V + E) time and space.
 *
 * NARRATION:
 *   "Prerequisites are a directed graph and the question is a topological
 *    order. I use Kahn's algorithm — repeatedly take a node with no remaining
 *    dependencies — because it gives cycle detection for free: if I can't emit
 *    every node, the ones left over must be in a cycle."
 *
 * EDGE DIRECTION: [a, b] means "b before a", so the edge is b → a and it is a's
 * in-degree that increases. I say this out loud while writing the loop; it is
 * the highest-frequency bug in the pattern and worth the two seconds.
 *
 * THE HEAD INDEX instead of `queue.shift()`: shift re-indexes the whole array,
 * which would make this O(V²). Walking a read pointer keeps it linear.
 *
 * THE LENGTH CHECK IS THE CYCLE CHECK. No colours, no recursion, no separate
 * pass — `order.length !== numCourses` is exactly the condition "something
 * never reached in-degree zero", which is exactly "something is in a cycle".
 *
 * IF A SPECIFIC ORDER WERE REQUIRED — lexicographically smallest, say — the
 * only change is a min-heap in place of the queue, at O(V log V). Worth naming
 * as the natural follow-up.
 */
export function findOrder(numCourses: number, prerequisites: Array<[number, number]>): number[] {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array<number>(numCourses).fill(0);

  for (const [course, requirement] of prerequisites) {
    graph[requirement]!.push(course); // requirement → course: it comes FIRST
    inDegree[course]! += 1;
  }

  const queue: number[] = [];
  for (let course = 0; course < numCourses; course += 1) {
    if (inDegree[course] === 0) queue.push(course);
  }

  const order: number[] = [];
  let head = 0; // read index — `queue.shift()` would make this O(V^2)

  while (head < queue.length) {
    const course = queue[head]!;
    head += 1;
    order.push(course);

    for (const next of graph[course]!) {
      inDegree[next]! -= 1;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  return order.length === numCourses ? order : []; // short output ⇒ a cycle
}

