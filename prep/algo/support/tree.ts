/**
 * Shared binary-tree helpers. Not a drill — this is scaffolding so the tree
 * problems can be tested without you also writing a tree builder.
 *
 * In a real interview the interviewer usually hands you the node shape. If they
 * do not, define it in one line and move on:
 *   class TreeNode { constructor(public val: number,
 *                               public left: TreeNode | null = null,
 *                               public right: TreeNode | null = null) {} }
 * Note: parameter properties like that are NOT allowed under
 * `erasableSyntaxOnly`, which is why this file spells the fields out.
 */

export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Build a tree from LeetCode-style level-order input, where `null` marks a
 * missing child.  [3, 9, 20, null, null, 15, 7] is
 *
 *       3
 *      / \
 *     9   20
 *        /  \
 *       15   7
 */
export function buildTree(values: Array<number | null>): TreeNode | null {
  if (values.length === 0 || values[0] === null || values[0] === undefined) return null;

  const root = new TreeNode(values[0]);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    const leftValue = values[i];
    i += 1;
    if (leftValue !== null && leftValue !== undefined) {
      node.left = new TreeNode(leftValue);
      queue.push(node.left);
    }

    const rightValue = values[i];
    i += 1;
    if (rightValue !== null && rightValue !== undefined) {
      node.right = new TreeNode(rightValue);
      queue.push(node.right);
    }
  }

  return root;
}
