/**
 * SOLUTIONS 08 — Binary trees
 */

import { TreeNode } from '../support/tree.ts';

/**
 * PROBLEM 1 — In-order traversal
 *
 * COMPLEXITY: O(n) time, O(h) space (call stack or explicit stack).
 *
 * THE ITERATIVE VERSION is worth being fluent in — "now without recursion" is
 * one of the most common follow-ups in the whole subject. The shape:
 *   1. Walk left as far as possible, stacking every node you pass.
 *   2. Pop — that node is next in order, because everything left of it is done.
 *   3. Move to its right child and repeat.
 * Say "the explicit stack is doing exactly what the call stack did" while you
 * write it; that is the insight, not the code.
 */
export function inorderTraversal(root: TreeNode | null): number[] {
  const out: number[] = [];

  function walk(node: TreeNode | null): void {
    if (node === null) return; // base case AND null guard
    walk(node.left);
    out.push(node.val);
    walk(node.right);
  }

  walk(root);
  return out;
}

export function inorderTraversalIterative(root: TreeNode | null): number[] {
  const out: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;

  while (current !== null || stack.length > 0) {
    // Descend the left spine, remembering the way back.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    const node = stack.pop()!;
    out.push(node.val);
    current = node.right;
  }

  return out;
}

/**
 * PROBLEM 2 — Maximum Depth
 *
 * NARRATION: "The depth of a node is one plus the deeper of its two children.
 * That's the recursion; the empty tree is the base case at zero."
 *
 * COMPLEXITY: O(n) time. O(h) space — O(log n) balanced, O(n) degenerate.
 * Say it as "O(h), and h can be n" rather than "O(log n)": the second is only
 * true for a balanced tree and the interviewer may be checking.
 */
export function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/**
 * PROBLEM 3 — Validate BST
 *
 * WHY THE RANGE — this is the entire question:
 *   "Checking each node against its immediate children is not enough. A node
 *    deep in the right subtree still has to be greater than every ancestor it
 *    hangs off to the right of. So I carry a permitted range down: going left
 *    tightens the upper bound to the current value, going right tightens the
 *    lower bound."
 *
 * COMPLEXITY: O(n) time, O(h) space.
 *
 * BOUNDS AS `null` rather than ±Infinity: works for any comparable type and
 * sidesteps the question of whether a value could legitimately be Infinity.
 * Using `-Infinity`/`Infinity` is fine for numbers — say which you chose and why.
 *
 * STRICT COMPARISONS: duplicates are invalid under this definition. Some
 * variants allow duplicates on one side; that is a clarifying question worth
 * asking, and the `[2, 2]` test pins the choice made here.
 *
 * THE ALTERNATIVE: in-order traversal must be strictly increasing. Same O(n),
 * and it can early-exit. Both are good; being able to name both is better.
 */
export function isValidBST(root: TreeNode | null): boolean {
  function check(node: TreeNode | null, low: number | null, high: number | null): boolean {
    if (node === null) return true;
    if (low !== null && node.val <= low) return false;
    if (high !== null && node.val >= high) return false;

    // Going left caps the maximum; going right raises the minimum.
    return check(node.left, low, node.val) && check(node.right, node.val, high);
  }

  return check(root, null, null);
}

/**
 * PROBLEM 4 — Level Order Traversal
 *
 * THE ONE LINE THAT MATTERS: `const levelSize = queue.length;` taken BEFORE the
 * inner loop. It snapshots how many nodes belong to the current level. Read
 * `queue.length` inside the loop instead and it grows as you enqueue children,
 * so every level runs together into one.
 *
 * COMPLEXITY: O(n) time, O(w) space where w is the widest level — which is
 * about n/2 for a full tree, so O(n) in the worst case.
 *
 * `shift()` IS O(n) in JavaScript because it re-indexes the array, making this
 * O(n²) in theory. At interview sizes it does not matter, but SAY IT and offer
 * the fix: keep a `head` index and advance it instead of shifting, or swap in a
 * linked list. Volunteering a known weakness with its remedy reads far better
 * than being caught by it.
 */
export function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];

  const levels: number[][] = [];
  const queue: TreeNode[] = [root];
  let head = 0; // index-based queue: avoids O(n) shift()

  while (head < queue.length) {
    // Snapshot BEFORE enqueuing children — this is what separates the levels.
    const levelSize = queue.length - head;
    const level: number[] = [];

    for (let i = 0; i < levelSize; i += 1) {
      const node = queue[head]!;
      head += 1;

      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    levels.push(level);
  }

  return levels;
}
