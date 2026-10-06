// Given a sorted array of positive integers and a target value, count the number of pairs (i, j) where i < j and array[i] + array[j] <= target.

// Example

// Input:

const prices = [1, 2, 3, 4, 5];
const budget = 7;
// Output:

// 8
// Explanation:

// We need pairs (i, j) with i < j and prices[i] + prices[j] ≤ 7. List all pairs:

// (1, 2) = 3 ≤ 7
// (1, 3) = 4 ≤ 7
// (1, 4) = 5 ≤ 7
// (1, 5) = 6 ≤ 7
// (2, 3) = 5 ≤ 7
// (2, 4) = 6 ≤ 7
// (2, 5) = 7 ≤ 7
// (3, 4) = 7 ≤ 7
// Pairs like (3,5)=8, (4,5)=9 exceed the budget. Total valid pairs = 8.

function countAffordablePairs(prices: number[], budget: number): number {
	let left = 0;
	let right = prices.length - 1;
	let pairsFound = 0;

	do {
		if (prices[left] + prices[right] <= budget) {
			pairsFound += right - left;
			left = left + 1;
		} else {
			right = right - 1;
		}
	} while (left < right);

	return pairsFound;
}

console.log(countAffordablePairs(prices, budget));
