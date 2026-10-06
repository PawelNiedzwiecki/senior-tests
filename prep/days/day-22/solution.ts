/**
 * SOLUTIONS — Greedy
 */

/**
 * PROBLEM 1 — Jump game II
 *
 * COMPLEXITY: O(n) time, O(1) space. The DP formulation is O(n²), so this is a
 * real improvement rather than a stylistic one.
 *
 * NARRATION:
 *   "I think of it as BFS over levels: level k is everything reachable in k
 *    jumps. I sweep the array tracking the end of the current level and the
 *    furthest index anything in it can reach. When I reach the end of a level I
 *    take a jump and the furthest becomes the new boundary. It's optimal by a
 *    'greedy stays ahead' argument — after k jumps I'm at the furthest index
 *    any k jumps could reach, so nothing can beat it."
 *
 * THE LOOP ENDS AT n - 2. Arriving at the final index does not require another
 * jump, and including it makes `currentEnd` advance one time too many. This is
 * the single off-by-one that decides the problem.
 *
 * `farthest` IS COMPUTED ACROSS THE WHOLE LEVEL before it is used. That is why
 * the update comes before the boundary check: every index in the level gets to
 * contribute its reach before the jump is taken.
 *
 * NO QUEUE IS NEEDED even though the reasoning is BFS, because the levels are
 * contiguous index ranges. Recognising when a BFS collapses into two pointers
 * is a genuinely transferable observation.
 *
 * THE EDGE CASE: a single-element array returns 0 without entering the loop —
 * you are already at the end.
 */
export function jump(nums: number[]): number {
  let jumps = 0;
  let currentEnd = 0; // last index of the current BFS level
  let farthest = 0; // furthest index reachable from this level

  for (let i = 0; i < nums.length - 1; i += 1) {
    farthest = Math.max(farthest, i + nums[i]!);

    if (i === currentEnd) {
      jumps += 1; // the level is exhausted — take a jump
      currentEnd = farthest;
    }
  }

  return jumps;
}

