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

/**
 * PROBLEM 2 — Alien dictionary
 *
 * COMPLEXITY: O(total characters) time and space — building the edges scans
 * each word once, and the sort is O(V + E) over at most 26 nodes.
 *
 * NARRATION:
 *   "The sorted word list encodes pairwise letter constraints: for two adjacent
 *    words, the first position where they differ tells me one letter precedes
 *    another, and nothing after that position tells me anything. Collect those
 *    edges and it is a topological sort, with a contradiction showing up as a
 *    cycle."
 *
 * THE PREFIX CASE is the one interviewers check for: if the earlier word is
 * longer and the later one is its prefix ('abc' then 'ab'), no letter order can
 * make that sorted, so the input is invalid. It must be detected in the same
 * loop that extracts edges, because there is no differing character to find.
 *
 * SEED ALL THE LETTERS FIRST. A letter with no constraints still has to appear
 * in the output; initialising the in-degree map from every character of every
 * word, before any edges, is what guarantees that.
 *
 * DEDUPLICATE THE EDGES. The same constraint can be derived from several word
 * pairs; counting it twice inflates the in-degree so that node never reaches
 * zero and the sort silently returns a short string that looks like a cycle.
 * A Set of successors per letter is the fix.
 *
 * THE OUTPUT IS NOT UNIQUE when the data underdetermines the order — say so,
 * and be ready to defend your answer as consistent rather than identical to
 * some expected string.
 */
export function alienOrder(words: string[]): string {
  const successors = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  // Every letter that appears must end up in the output, constrained or not.
  for (const word of words) {
    for (const letter of word) {
      if (!successors.has(letter)) successors.set(letter, new Set());
      if (!inDegree.has(letter)) inDegree.set(letter, 0);
    }
  }

  for (let i = 0; i + 1 < words.length; i += 1) {
    const a = words[i]!;
    const b = words[i + 1]!;
    const shared = Math.min(a.length, b.length);

    let differed = false;
    for (let j = 0; j < shared; j += 1) {
      if (a[j] === b[j]) continue;

      const from = a[j]!;
      const to = b[j]!;
      if (!successors.get(from)!.has(to)) {
        successors.get(from)!.add(to); // dedupe: never count an edge twice
        inDegree.set(to, inDegree.get(to)! + 1);
      }
      differed = true;
      break; // only the FIRST difference carries information
    }

    // 'abc' then 'ab' cannot be sorted under any letter order.
    if (!differed && a.length > b.length) return '';
  }

  const queue: string[] = [];
  for (const [letter, degree] of inDegree) {
    if (degree === 0) queue.push(letter);
  }

  let head = 0;
  const order: string[] = [];

  while (head < queue.length) {
    const letter = queue[head]!;
    head += 1;
    order.push(letter);

    for (const next of successors.get(letter)!) {
      inDegree.set(next, inDegree.get(next)! - 1);
      if (inDegree.get(next) === 0) queue.push(next);
    }
  }

  return order.length === inDegree.size ? order.join('') : ''; // short ⇒ a cycle
}
