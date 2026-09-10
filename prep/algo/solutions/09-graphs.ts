/**
 * SOLUTIONS 09 — Graphs
 */

const DIRECTIONS: Array<[number, number]> = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

/**
 * PROBLEM 1 — Number of Islands
 *
 * NARRATION:
 *   "This is a connected-components problem on an implicit graph — each land
 *    cell is a node, adjacent land cells are edges. Scan every cell; the first
 *    time I hit unvisited land I've found a new island, so I increment and then
 *    flood fill the whole component so it's never counted again."
 *
 * COMPLEXITY: O(rows × cols) time — every cell is visited at most twice (once
 *             by the scan, once by a fill). O(rows × cols) space for `visited`,
 *             plus the stack.
 *
 * ITERATIVE FILL, DELIBERATELY. A recursive flood fill on a 1000×1000 all-land
 * grid recurses a million deep and blows the stack — a genuine crash, not a
 * theoretical one. Say that: "I'll use an explicit stack because the recursion
 * depth here is bounded by the grid size, not by log of it."
 *
 * NON-DESTRUCTIVE. Sinking the island by writing '0' is the popular trick and
 * costs O(1) extra space, but it destroys the caller's grid. Unless the problem
 * says you may, use a `visited` array and mention the trade-off.
 */
export function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return 0;

  const visited = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));
  let islands = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r]![c] !== '1' || visited[r]![c]) continue;

      islands += 1;

      // Explicit stack — recursion would overflow on a large all-land grid.
      const stack: Array<[number, number]> = [[r, c]];
      visited[r]![c] = true;

      while (stack.length > 0) {
        const [row, col] = stack.pop()!;

        for (const [dr, dc] of DIRECTIONS) {
          const nr = row + dr;
          const nc = col + dc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (visited[nr]![nc] || grid[nr]![nc] !== '1') continue;

          visited[nr]![nc] = true; // mark on PUSH, not on pop
          stack.push([nr, nc]);
        }
      }
    }
  }

  return islands;
}

/**
 * PROBLEM 2 — Course Schedule (Kahn's algorithm)
 *
 * THE TRANSLATION, said first:
 *   "'Can I finish every course' is 'is this directed graph acyclic'. I'll do a
 *    topological sort with Kahn's algorithm: repeatedly remove a course with no
 *    outstanding prerequisites. If I can place all of them, there's no cycle."
 *
 * COMPLEXITY: O(V + E) time, O(V + E) space.
 *
 * WHY KAHN'S OVER DFS here: it is harder to get wrong under time pressure (no
 * three-colour bookkeeping), and it hands you the actual course ORDER for free
 * — which is the standard follow-up ("now return a valid schedule"). Mention
 * that as your reason for choosing it.
 *
 * THE DFS ALTERNATIVE needs THREE states, not two: unvisited, in-progress, done.
 * Encountering an IN-PROGRESS node means a back edge and therefore a cycle;
 * encountering a DONE node is fine (a diamond, not a cycle). Using a plain
 * two-state `visited` set reports false cycles on any diamond — that is the
 * classic bug, and the "diamond" test above is there to catch it.
 *
 * EDGE DIRECTION: `[a, b]` means b → a ("b unlocks a"). Getting this backwards
 * still detects cycles correctly by symmetry, but produces a reversed order on
 * the follow-up. Restate the direction to the interviewer before coding.
 */
export function canFinish(
  numCourses: number,
  prerequisites: Array<[number, number]>,
): boolean {
  const unlocks: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array<number>(numCourses).fill(0);

  for (const [course, prerequisite] of prerequisites) {
    unlocks[prerequisite]!.push(course); // prerequisite → course
    inDegree[course]! += 1;
  }

  // Everything with nothing blocking it can be taken now.
  const queue: number[] = [];
  for (let course = 0; course < numCourses; course += 1) {
    if (inDegree[course] === 0) queue.push(course);
  }

  let head = 0;
  let placed = 0;

  while (head < queue.length) {
    const course = queue[head]!;
    head += 1;
    placed += 1;

    for (const next of unlocks[course]!) {
      inDegree[next]! -= 1;
      if (inDegree[next] === 0) queue.push(next);
    }
  }

  // Anything left has a permanent unmet prerequisite: a cycle.
  return placed === numCourses;
}

/**
 * PROBLEM 3 — Shortest Path in a Binary Grid
 *
 * WHY BFS AND NOT DFS — this is the point of the problem:
 *   "Every move costs the same, so BFS explores in order of distance. The first
 *    time it reaches a cell, it has reached it by a shortest path. DFS would
 *    find *a* path, but it could be arbitrarily long."
 *
 * COMPLEXITY: O(rows × cols) time and space.
 *
 * MARK VISITED ON ENQUEUE. If you mark on dequeue, the same cell can be
 * enqueued by several neighbours before it is ever processed, and the queue
 * blows up. This is the most common BFS performance bug.
 *
 * DISTANCE TRACKING: carrying the distance in the queue entry is simplest. The
 * level-by-level alternative (snapshot `queue.length`, increment after each
 * level — module 08) is equivalent; either is fine, but do not mix them.
 *
 * EDGE CASES worth naming before coding: a blocked START (check first — easy to
 * miss), a 1×1 grid, and an empty grid.
 *
 * IF THEY MAKE THE EDGES WEIGHTED, BFS is no longer correct and the answer is
 * Dijkstra with a priority queue — which in JavaScript means writing the heap
 * yourself (module 10). Knowing where BFS stops being valid is worth saying.
 */
export function shortestPath(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return -1;
  if (grid[0]![0] !== 0) return -1; // blocked start

  const target = { r: rows - 1, c: cols - 1 };
  const visited = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));

  const queue: Array<[row: number, col: number, distance: number]> = [[0, 0, 1]];
  visited[0]![0] = true;
  let head = 0;

  while (head < queue.length) {
    const [row, col, distance] = queue[head]!;
    head += 1;

    if (row === target.r && col === target.c) return distance;

    for (const [dr, dc] of DIRECTIONS) {
      const nr = row + dr;
      const nc = col + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr]![nc] || grid[nr]![nc] !== 0) continue;

      visited[nr]![nc] = true; // on enqueue
      queue.push([nr, nc, distance + 1]);
    }
  }

  return -1;
}
