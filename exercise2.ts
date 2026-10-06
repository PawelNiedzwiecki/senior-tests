// Target Index Search
// Given a sorted array of distinct integers and a target value, return the index of the target or -1 if not found.

// Example 1

// Input:

// nums = [1, 2, 3, 4, 5]
// target = 3
// Output:

// 2
// Explanation:

// Initialize low = 0, high = 4. Compute mid = (0 + 4) // 2 = 2. nums[2] = 3 matches target, so return 2.

// Example 2

// Input:

const nums = [2, 4, 6, 8, 10, 12, 14, 16, 22, 26, 99];
const target = 226;
// Output:

// 7
// Explanation:

// Start with low = 0, high = 7. mid = (0 + 7) // 2 = 3, nums[3] = 8 < 16, so set low = 4.
// Now mid = (4 + 7) // 2 = 5, nums[5] = 12 < 16, so low = 6.
// Next mid = (6 + 7) // 2 = 6, nums[6] = 14 < 16, so low = 7.
// Finally mid = (7 + 7) // 2 = 7, nums[7] = 16 equals target, return 7.

function binarySearch(nums: number[], target: number): number {
	let low = 0;
	let high = nums.length - 1;

	do {
		const mid = Math.floor((low + high) / 2);
		if (nums[mid] === target) {
			return mid;
		} else if (nums[mid] < target) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	} while (low <= high);

	return -1;
}

console.log(binarySearch(nums, target));
