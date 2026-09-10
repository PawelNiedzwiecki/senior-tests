/**
 * MODULE 08 — Binary trees
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 55 min      DIFFICULTY: ●●●○○
 *
 * THE PATTERN
 * Almost every tree problem is one of two traversals, and picking the right one
 * is most of the work:
 *
 *   DFS (recursion)   — "does a path exist?", "what is the depth?", anything
 *                       where a node's answer is built from its children's.
 *                       O(h) space where h is height.
 *   BFS (queue)       — "level by level", "shortest path in an unweighted
 *                       graph", "leftmost node at each depth".
 *                       O(w) space where w is the widest level.
 *
 * THE THREE DFS ORDERS, and when each is right:
 *   PRE-order   node, left, right   — copying a tree, serialising
 *   IN-order    left, node, right   — a BST yields SORTED values ← key fact
 *   POST-order  left, right, node   — deleting, or when a node needs results
 *                                     from both children first
 *
 * COMPLEXITY, said properly: every traversal is O(n) time — each node visited
 * once. Space is O(h) for recursion, which is O(log n) for a balanced tree but
 * O(n) for a degenerate one (a linked list). Saying "O(h), and h is n in the
 * worst case" is much stronger than saying "O(log n)".
 *
 * THE `null` DISCIPLINE: every recursive tree function starts with the null
 * check. Write it first, before the body. It is both the base case and the
 * guard, and forgetting it is the most common crash.
 */

import type { TreeNode } from '../support/tree.ts';

/**
 * PROBLEM 1 — In-order traversal
 * Return the values left-node-right. Implement BOTH versions: interviewers
 * very often ask "now do it without recursion".
 *
 *   buildTree([1, null, 2, 3]) → [1, 3, 2]
 *
 * TARGET: O(n) time, O(h) space.
 * HINT (iterative): push left-spine nodes onto a stack until you run out, pop
 *       one, record it, then move to its right child and repeat. The stack is
 *       doing exactly what the call stack did.
 */
export function inorderTraversal(_root: TreeNode | null): number[] {
  throw new Error('Not implemented');
}

export function inorderTraversalIterative(_root: TreeNode | null): number[] {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 2 — Maximum Depth
 * Number of nodes on the longest root-to-leaf path. Empty tree → 0.
 *
 *   buildTree([3, 9, 20, null, null, 15, 7]) → 3
 *
 * TARGET: O(n) time, O(h) space.
 * HINT: three lines. The depth of a node is 1 + the larger of its children's
 *       depths. This is the archetypal "answer built from children" shape —
 *       if you can write this one fluently, most easy tree problems fall out.
 */
export function maxDepth(_root: TreeNode | null): number {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 3 — Validate Binary Search Tree
 * Every value in the left subtree must be strictly LESS than the node, every
 * value in the right subtree strictly GREATER — and that must hold for the
 * whole subtree, not just the immediate children.
 *
 *   buildTree([2, 1, 3])          → true
 *   buildTree([5, 1, 4, null, null, 3, 6]) → false
 *
 * TARGET: O(n) time, O(h) space.
 * THE CLASSIC WRONG ANSWER — and the reason this problem is asked — is
 * comparing each node only with its direct children. [5, 1, 4, null, null, 3, 6]
 * passes that test and is not a BST: 3 sits in 5's right subtree but is less
 * than 5. You must carry down a permitted (min, max) RANGE that narrows as you
 * descend.
 * ALTERNATIVE: an in-order traversal of a BST is strictly increasing — check
 *       that instead. Equally valid; mention both and pick one.
 */
export function isValidBST(_root: TreeNode | null): boolean {
  throw new Error('Not implemented');
}

/**
 * PROBLEM 4 — Level Order Traversal
 * Values grouped by depth, top to bottom.
 *
 *   buildTree([3, 9, 20, null, null, 15, 7]) → [[3], [9, 20], [15, 7]]
 *
 * TARGET: O(n) time, O(w) space.
 * HINT: BFS with a queue — but capture `queue.length` BEFORE the inner loop.
 *       That snapshot is what separates one level from the next; reading the
 *       length inside the loop sees the children you just enqueued and merges
 *       every level into one.
 * NOTE: `Array.prototype.shift()` is O(n). Fine at interview scale, but say so
 *       and offer the head-index alternative.
 */
export function levelOrder(_root: TreeNode | null): number[][] {
  throw new Error('Not implemented');
}
