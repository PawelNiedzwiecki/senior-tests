// Given an array of numbers and a max budget, find the minimum number of batches to split into.
// For a candidate batchSize, each value's per-batch share is ceil(n / batchSize) (worst case if
// that value's share all lands in one batch). Try batchSize = 1, 2, 3, ... and return the first
// one where the sum of shares fits within the budget.

// Example 1

const nums1 = [2, 5, 7, 10];
const maxBudget1 = 10;
// Output: 3
// batchSize 1: [2, 5, 7, 10] = 24 > 10
// batchSize 2: [1, 3, 4, 5]  = 13 > 10   (ceil(n / 2))
// batchSize 3: [1, 2, 3, 4]  = 10 <= 10  (ceil(n / 3)) -> answer 3

// Example 2

const nums2 = [2, 3, 4, 6];
const maxBudget2 = 10;
// Output: 2
// batchSize 1: [2, 3, 4, 6] = 15 > 10
// batchSize 2: [1, 2, 2, 3] = 8 <= 10    (ceil(n / 2)) -> answer 2

function sum(values: number[]): number {
	return values.reduce((total, value) => total + value, 0);
}

function minBatches(nums: number[], maxBudget: number): number {
	if (maxBudget < nums.length) {
		throw new Error("maxBudget below array length never converges (values floor out at 1 each)");
	}

	let batchSize = 1;

	while (sum(nums.map((n) => Math.ceil(n / batchSize))) > maxBudget) {
		batchSize = batchSize + 1;
	}

	return batchSize;
}

console.log(minBatches(nums1, maxBudget1));
console.log(minBatches(nums2, maxBudget2));

// Binary search version: feasibility is monotonic in batchSize (bigger batchSize never
// increases the sum of shares), so search the range instead of scanning it linearly.

function fits(nums: number[], batchSize: number, maxBudget: number): boolean {
	return sum(nums.map((n) => Math.ceil(n / batchSize))) <= maxBudget;
}

function minBatchesBinarySearch(nums: number[], maxBudget: number): number {
	if (maxBudget < nums.length) {
		throw new Error("maxBudget below array length never converges (values floor out at 1 each)");
	}

	let low = 1;
	let high = Math.max(...nums);

	while (low < high) {
		const mid = Math.floor((low + high) / 2);

		if (fits(nums, mid, maxBudget)) {
			high = mid;
		} else {
			low = mid + 1;
		}
	}

	return low;
}

console.log(minBatchesBinarySearch(nums1, maxBudget1));
console.log(minBatchesBinarySearch(nums2, maxBudget2));
