// Find First Occurrence
// Given a sorted array of integers that may contain duplicates, return the index of the first occurrence of a target value or -1 if not found.

// Example

// Input:

const arr = [1, 2, 2, 4, 5];
const aim = 2;
// Output:

// 2

function findFirstOccurrence(nums: number[], target: number): number {
	let low = 0;
	let high = nums.length - 1;
	let indexFound = -1;

	do {
		const mid = Math.floor((low + high) / 2);
		if (nums[mid] === target) {
			indexFound = mid;
			high = mid - 1;
		} else if (target > nums[mid]) {
			low = mid + 1;
		} else {
			high = mid - 1;
		}
	} while (low <= high);

	return indexFound;
}

console.log(findFirstOccurrence(arr, aim));
