import { describe, it, expect } from 'vitest';
import {
  inorderTraversal,
  inorderTraversalIterative,
  maxDepth,
  isValidBST,
  levelOrder,
} from '@algo/08-trees.ts';
import { buildTree, TreeNode } from '../support/tree.ts';

describe.each([
  ['recursive', inorderTraversal],
  ['iterative', inorderTraversalIterative],
])('inorderTraversal (%s)', (_name, traverse) => {
  it('handles the prompt example', () => {
    expect(traverse(buildTree([1, null, 2, 3]))).toEqual([1, 3, 2]);
  });

  it('handles an empty tree', () => {
    expect(traverse(null)).toEqual([]);
  });

  it('handles a single node', () => {
    expect(traverse(buildTree([1]))).toEqual([1]);
  });

  it('yields sorted values for a BST', () => {
    expect(traverse(buildTree([4, 2, 6, 1, 3, 5, 7]))).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('handles a left-skewed tree', () => {
    const root = new TreeNode(3, new TreeNode(2, new TreeNode(1)));
    expect(traverse(root)).toEqual([1, 2, 3]);
  });

  it('handles a right-skewed tree', () => {
    const root = new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3)));
    expect(traverse(root)).toEqual([1, 2, 3]);
  });
});

describe('maxDepth', () => {
  it('handles the prompt example', () => {
    expect(maxDepth(buildTree([3, 9, 20, null, null, 15, 7]))).toBe(3);
  });

  it('returns 0 for an empty tree', () => {
    expect(maxDepth(null)).toBe(0);
  });

  it('returns 1 for a single node', () => {
    expect(maxDepth(buildTree([1]))).toBe(1);
  });

  it('handles a degenerate tree', () => {
    const root = new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3)));
    expect(maxDepth(root)).toBe(3);
  });

  it('takes the deeper branch', () => {
    expect(maxDepth(buildTree([1, 2, 3, 4, null, null, null, 5]))).toBe(4);
  });
});

describe('isValidBST', () => {
  it('accepts a valid BST', () => {
    expect(isValidBST(buildTree([2, 1, 3]))).toBe(true);
    expect(isValidBST(buildTree([4, 2, 6, 1, 3, 5, 7]))).toBe(true);
  });

  it('rejects the classic deep violation', () => {
    // 3 is in 5's right subtree but is less than 5. Comparing only with direct
    // children wrongly accepts this.
    expect(isValidBST(buildTree([5, 1, 4, null, null, 3, 6]))).toBe(false);
  });

  it('rejects a violation buried several levels down', () => {
    expect(isValidBST(buildTree([10, 5, 15, null, null, 6, 20]))).toBe(false);
  });

  it('accepts an empty tree and a single node', () => {
    expect(isValidBST(null)).toBe(true);
    expect(isValidBST(buildTree([1]))).toBe(true);
  });

  it('rejects equal values (strictly less / greater)', () => {
    expect(isValidBST(buildTree([2, 2]))).toBe(false);
    expect(isValidBST(buildTree([2, null, 2]))).toBe(false);
  });

  it('handles negative values', () => {
    expect(isValidBST(buildTree([0, -1, 1]))).toBe(true);
    expect(isValidBST(buildTree([0, 1, -1]))).toBe(false);
  });
});

describe('levelOrder', () => {
  it('handles the prompt example', () => {
    expect(levelOrder(buildTree([3, 9, 20, null, null, 15, 7]))).toEqual([
      [3],
      [9, 20],
      [15, 7],
    ]);
  });

  it('handles an empty tree', () => {
    expect(levelOrder(null)).toEqual([]);
  });

  it('handles a single node', () => {
    expect(levelOrder(buildTree([1]))).toEqual([[1]]);
  });

  it('keeps levels separate in a skewed tree', () => {
    const root = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
    expect(levelOrder(root)).toEqual([[1], [2], [3]]);
  });

  it('preserves left-to-right order within a level', () => {
    expect(levelOrder(buildTree([1, 2, 3, 4, 5, 6, 7]))).toEqual([
      [1],
      [2, 3],
      [4, 5, 6, 7],
    ]);
  });

  it('handles a sparse level', () => {
    expect(levelOrder(buildTree([1, 2, 3, null, 5, null, 7]))).toEqual([[1], [2, 3], [5, 7]]);
  });
});
