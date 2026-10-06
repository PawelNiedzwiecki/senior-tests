/**
 * PRACTICE — Number of islands                                  [LeetCode 200]
 * ────────────────────────────────────────────────────────────────────────────
 * Warm-up for pattern 07 (BFS/DFS). Not part of the numbered drill set.
 *
 * You're given a grid of '1' (land) and '0' (water). Two land cells belong to
 * the same island if they're connected horizontally or vertically (not
 * diagonally). Count how many separate islands exist.
 *
 *   numIslands([
 *     ['1','1','0','0'],
 *     ['1','1','0','0'],
 *     ['0','0','1','0'],
 *     ['0','0','0','1'],
 *   ])  → 3
 *
 * TARGET: O(rows × cols) time and space.
 */
export function numIslands(grid: string[][]): number {
	let count = 0;

	function dfs(row: number, col: number): void {
		if (
			row < 0 ||
			row >= grid.length ||
			col < 0 ||
			col >= grid[row].length ||
			grid[row][col] !== "1"
		) {
			return;
		}

		grid[row][col] = "0";

		dfs(row + 1, col);
		dfs(row - 1, col);
		dfs(row, col + 1);
		dfs(row, col - 1);
	}

	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i]?.length; j++) {
			if (grid[i][j] === "1") {
				count += 1;
				dfs(i, j);
			}
		}
	}

	return count;
}
