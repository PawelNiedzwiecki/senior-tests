/**
 * SOLUTIONS — BFS and DFS (graphs and grids)
 */

/**
 * EXAM 1 — Number of islands
 *
 * COMPLEXITY: O(rows · cols) time — each cell is visited once and sunk — and
 * O(rows · cols) space in the worst case for the stack (an all-land grid).
 *
 * NARRATION:
 *   "A grid is a graph: each cell has four neighbours. I scan for unvisited
 *    land; every time I have to START a traversal, that's a new component, so
 *    the answer is the number of starts, not anything the traversal returns."
 *
 * SINKING THE LAND ('1' → '0') is the visited set, for free. It mutates the
 * input, so say so — and say the alternative (a parallel boolean grid) for
 * when the caller needs the input intact.
 *
 * ITERATIVE, NOT RECURSIVE, on purpose: a 1000×1000 all-land grid recurses a
 * million deep and blows the stack. Mentioning that unprompted is a
 * production instinct interviewers notice.
 */
export function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  let islands = 0;

  const sink = (startRow: number, startCol: number) => {
    const stack: Array<[number, number]> = [[startRow, startCol]];
    grid[startRow]![startCol] = '0'; // mark on push, not on pop

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const neighbours: Array<[number, number]> = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbours) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr]![nc] !== '1') continue;
        grid[nr]![nc] = '0';
        stack.push([nr, nc]);
      }
    }
  };

  for (let r = 0; r < rows; r += 1)
    for (let c = 0; c < cols; c += 1)
      if (grid[r]![c] === '1') {
        islands += 1;
        sink(r, c);
      }

  return islands;
}

/**
 * EXAM 2 — Number of provinces
 *
 * COMPLEXITY: O(n²) time — the adjacency matrix has n² entries and you must
 * read them — and O(n) space.
 *
 * NARRATION:
 *   "Same problem as counting islands with a different neighbour function: the
 *    neighbours of city i are the j where isConnected[i][j] is 1. I count how
 *    many times I need to start a traversal."
 *
 * SAYING THAT TWO UNRELATED-LOOKING PROMPTS ARE ONE PROBLEM is the pattern
 * working. The interviewer is listening for the reduction, not the code.
 *
 * THE UNION-FIND ALTERNATIVE (CATALOGUE § 15) is the same O(n²) here because
 * reading the matrix dominates. Where it genuinely wins is when edges arrive
 * over time and the component count must be maintained incrementally — a
 * distinction worth drawing rather than reciting "you could also use DSU".
 */
export function numberOfProvinces(isConnected: number[][]): number {
  const n = isConnected.length;
  const seen = new Array<boolean>(n).fill(false);
  let provinces = 0;

  for (let start = 0; start < n; start += 1) {
    if (seen[start]) continue;

    provinces += 1;
    const stack = [start];
    seen[start] = true;

    while (stack.length > 0) {
      const city = stack.pop()!;
      for (let next = 0; next < n; next += 1) {
        if (isConnected[city]![next] !== 1 || seen[next]) continue;
        seen[next] = true;
        stack.push(next);
      }
    }
  }

  return provinces;
}

/**
 * EXAM 3 — Shortest path in a binary matrix
 *
 * COMPLEXITY: O(n²) time and space — every cell enters the queue at most once.
 *
 * NARRATION:
 *   "Unweighted shortest path on a grid with 8-way movement, so BFS: the first
 *    time I reach a cell is along a shortest route. I carry the distance with
 *    each queue entry and mark cells as seen when I enqueue them."
 *
 * THE TWO EDGE CASES this problem is built around:
 *   · the START may be blocked — check before enqueuing anything;
 *   · the answer counts CELLS, so the start cell is already distance 1.
 *
 * A blocked destination needs no special case: BFS simply never reaches it and
 * the loop falls through to -1.
 *
 * MARK ON ENQUEUE. With 8 neighbours a cell can be reached from many frontier
 * cells in the same level; marking on dequeue queues it up to eight times.
 *
 * `shift()` IS O(n) in JavaScript and turns this quadratic on large inputs. It
 * is fine at interview scale — but say "in production I'd use a head index or
 * a ring buffer", which is the one-line fix shown here.
 */
export function shortestPathBinaryMatrix(grid: number[][]): number {
  const n = grid.length;
  if (n === 0 || grid[0]![0] !== 0) return -1;

  const seen = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
  const queue: Array<[number, number, number]> = [[0, 0, 1]]; // row, col, cells so far
  seen[0]![0] = true;

  for (let head = 0; head < queue.length; head += 1) {
    const [r, c, distance] = queue[head]!;
    if (r === n - 1 && c === n - 1) return distance;

    for (let dr = -1; dr <= 1; dr += 1)
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        if (grid[nr]![nc] !== 0 || seen[nr]![nc]) continue;
        seen[nr]![nc] = true; // mark on enqueue
        queue.push([nr, nc, distance + 1]);
      }
  }

  return -1;
}

/**
 * EXAM 4 — Pacific Atlantic water flow
 *
 * COMPLEXITY: O(rows · cols) time and space — two traversals, each visiting
 * every cell at most once.
 *
 * NARRATION:
 *   "Searching downhill from every cell is O((rc)²). Instead I reverse the
 *    relation: start from each ocean's edge cells and walk UPHILL, to
 *    neighbours of equal or greater height. That marks exactly the cells that
 *    can drain into that ocean. Two multi-source floods, then the
 *    intersection."
 *
 * REVERSING THE DIRECTION OF A RELATION is the transferable idea here. Any
 * time "which sources reach this target" is expensive, ask whether "which
 * targets does this source reach" is cheaper from the other end.
 *
 * `>=` IS THE WHOLE RULE: water flows to equal-or-lower, so walking backwards
 * means moving to equal-or-higher. Equal heights flow both ways, which is why
 * flat grids return every cell.
 *
 * MULTI-SOURCE means seeding the stack with an entire edge before the loop —
 * no outer per-cell iteration, which is what keeps it linear.
 */
export function pacificAtlantic(heights: number[][]): Array<[number, number]> {
  const rows = heights.length;
  const cols = heights[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return [];

  const flood = (sources: Array<[number, number]>) => {
    const reached = Array.from({ length: rows }, () => new Array<boolean>(cols).fill(false));
    const stack = [...sources];
    for (const [r, c] of sources) reached[r]![c] = true;

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const neighbours: Array<[number, number]> = [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];

      for (const [nr, nc] of neighbours) {
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (reached[nr]![nc]) continue;
        if (heights[nr]![nc]! < heights[r]![c]!) continue; // uphill only
        reached[nr]![nc] = true;
        stack.push([nr, nc]);
      }
    }

    return reached;
  };

  const pacificEdge: Array<[number, number]> = [];
  const atlanticEdge: Array<[number, number]> = [];
  for (let c = 0; c < cols; c += 1) {
    pacificEdge.push([0, c]);
    atlanticEdge.push([rows - 1, c]);
  }
  for (let r = 0; r < rows; r += 1) {
    pacificEdge.push([r, 0]);
    atlanticEdge.push([r, cols - 1]);
  }

  const pacific = flood(pacificEdge);
  const atlantic = flood(atlanticEdge);

  const out: Array<[number, number]> = [];
  for (let r = 0; r < rows; r += 1)
    for (let c = 0; c < cols; c += 1) if (pacific[r]![c] && atlantic[r]![c]) out.push([r, c]);

  return out;
}

/**
 * EXAM 5 — Open the lock
 *
 * COMPLEXITY: at most 10⁴ states with 8 transitions each, so O(10⁴) — constant
 * in the input, which is worth saying plainly.
 *
 * NARRATION:
 *   "The states are the 10000 wheel positions and the edges are single turns,
 *    so this is an unweighted shortest path on a graph nobody wrote down. BFS
 *    over generated neighbours, with the deadends acting as removed nodes."
 *
 * THE IMPLICIT GRAPH is the thing to recognise. Word ladders, sliding puzzles,
 * jug-pouring, dice rolls — same template, different `neighbours()`.
 *
 * DEADENDS GO IN A SET and are checked at the same moment as `seen` — treat
 * them as already-visited and they need no second branch. The start itself can
 * be a deadend; that early return is the case this problem is famous for.
 *
 * WRAPPING: `(d + 1) % 10` and `(d + 9) % 10`. Using `- 1` and then correcting
 * a negative is the same thing with an extra branch to get wrong.
 *
 * TWO-ENDED BFS is the real follow-up: search from the start and the target
 * simultaneously and stop when the frontiers meet, roughly halving the
 * explored states. Name it; you will rarely be asked to write it.
 */
export function openLock(deadends: string[], target: string): number {
  const blocked = new Set(deadends);
  const start = '0000';
  if (blocked.has(start)) return -1;
  if (target === start) return 0;

  const seen = new Set<string>([start]);
  let frontier = [start];
  let turns = 0;

  while (frontier.length > 0) {
    turns += 1;
    const next: string[] = [];

    for (const state of frontier) {
      for (let wheel = 0; wheel < 4; wheel += 1) {
        const digit = state.charCodeAt(wheel) - 48;

        for (const moved of [(digit + 1) % 10, (digit + 9) % 10]) {
          const candidate = `${state.slice(0, wheel)}${moved}${state.slice(wheel + 1)}`;
          if (seen.has(candidate) || blocked.has(candidate)) continue;
          if (candidate === target) return turns;
          seen.add(candidate);
          next.push(candidate);
        }
      }
    }

    frontier = next;
  }

  return -1;
}
