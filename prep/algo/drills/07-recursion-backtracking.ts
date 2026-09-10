/**
 * MODULE 07 — Recursion and backtracking
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 55 min      DIFFICULTY: ●●●●○
 *
 * THE PATTERN
 * Backtracking is exhaustive search with pruning: build a candidate one choice
 * at a time, abandon a branch the moment it cannot lead anywhere, undo the
 * choice, try the next. Every backtracking solution is the same five lines:
 *
 *   function backtrack(path, choicesRemaining) {
 *     if (isComplete(path)) { results.push([...path]); return; }   // ← COPY
 *     for (const choice of validChoices(choicesRemaining)) {
 *       path.push(choice);          // choose
 *       backtrack(path, next);      // explore
 *       path.pop();                 // UNCHOOSE — this is the "backtracking"
 *     }
 *   }
 *
 * THE TWO BUGS EVERYONE WRITES
 *   1. `results.push(path)` instead of `results.push([...path])`. You pushed a
 *      REFERENCE to the array you are about to mutate, so every result ends up
 *      identical (usually empty). Say "I'm copying here because path is
 *      mutated as we unwind" while you type it.
 *   2. Forgetting the `pop()`. The path grows forever and results are garbage.
 *
 * COMPLEXITY: usually exponential, and that is fine — it is the nature of
 * "enumerate everything". State it precisely:
 *   subsets      → O(n · 2ⁿ)     2ⁿ subsets, O(n) to copy each
 *   permutations → O(n · n!)
 * The interviewer wants to hear that you KNOW it is exponential and can say
 * why, not that you found a polynomial trick that does not exist.
 *
 * RECURSION DEPTH: JavaScript has no tail-call optimisation in practice, and
 * the stack is roughly 10k frames. For n ≤ 20 (which is where these problems
 * live, because 2²⁰ is already a million) it is a non-issue — but if the
 * interviewer asks about a deep recursion on a linked list or a skewed tree,
 * "I'd convert it to an explicit stack" is the answer.
 */

/**
 * PROBLEM 1 — Subsets (power set)
 * Every possible subset of a distinct-valued array, in any order.
 *
 *   subsets([1, 2, 3]) → [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]
 *
 * TARGET: O(n · 2ⁿ) time and space — there are 2ⁿ subsets and each costs O(n)
 * to copy. That is optimal: you cannot beat the size of the output.
 * HINT: at each index the choice is binary — include this element or don't.
 *       Recurse on both. (There is also a neat iterative version: start with
 *       [[]] and, for each number, append copies of everything so far with that
 *       number added. Know it; it is often easier to explain.)
 */
export function subsets(_nums: number[]): number[][] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Permutations
 * Every ordering of a distinct-valued array, in any order.
 *
 *   permutations([1, 2, 3])
 *     → [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
 *
 * TARGET: O(n · n!) time.
 * HINT: track which indices are already used — a boolean array is clearest, and
 *       cheaper than the `Set` most people reach for.
 * FOLLOW-UP THEY ASK: "what if there are duplicates?" — sort first, then skip
 *       a candidate when it equals its predecessor AND the predecessor is not
 *       currently used. Be ready to explain why that condition, and not just
 *       "skip equal values", is the correct one.
 */
export function permutations(_nums: number[]): number[][] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Combination Sum
 * All UNIQUE combinations of `candidates` (distinct positive integers) summing
 * to `target`. The same candidate may be reused unlimited times. Combinations
 * are unordered, so [2,2,3] and [2,3,2] are the same and only one is returned.
 *
 *   combinationSum([2, 3, 6, 7], 7) → [[2, 2, 3], [7]]
 *   combinationSum([2], 1)          → []
 *
 * TARGET: exponential; bounded by target/min(candidates) depth.
 * HINT: the "unique combinations" requirement is the whole problem. Pass a
 *       START INDEX down and never look at earlier candidates — that enforces
 *       non-decreasing order, which makes each combination reachable exactly
 *       one way. Because reuse is allowed, recurse with `i`, not `i + 1`.
 * PRUNE: if the remaining target goes negative, stop. Sorting first lets you
 *       `break` out of the loop instead of `continue`, which is a real speedup
 *       and a good thing to mention.
 */
export function combinationSum(_candidates: number[], _target: number): number[][] {
  throw new Error('Not implemented');
}
