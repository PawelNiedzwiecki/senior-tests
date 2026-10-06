// We want the smallest positive missing integer.

// Start with [3, 4, -1, 1]
// - i=0: value 3 ⇒ swap with index 2 ⇒ [-1, 4, 3, 1]
// - i=0: value -1 is out of range ⇒ move on
// - i=1: value 4 ⇒ swap with index 3 ⇒ [-1, 1, 3, 4]
// - i=1: value 1 ⇒ swap with index 0 ⇒ [1, -1, 3, 4]
// - now 1 at index 0, 3 at 2, 4 at 3; -1 remains at index 1

// Scan from index 0:
// index 0 has 1 (correct), index 1 has -1 (not 2) ⇒ missing positive is 2

// Input
const orderNumbers = [3, 4, -1, 1];

// Output
// 2

function findSmallestMissingPositive(orderNumbers: number[]): number {
	for (let i = 0; i <= orderNumbers.length - 1; i++) {
		while (
			orderNumbers[i] >= 1 &&
			orderNumbers[i] <= orderNumbers.length &&
			orderNumbers[i] !== i + 1 &&
			orderNumbers[orderNumbers[i] - 1] !== orderNumbers[i]
		) {
			const targetIndex = orderNumbers[i] - 1;
			[orderNumbers[i], orderNumbers[targetIndex]] = [
				orderNumbers[targetIndex],
				orderNumbers[i],
			];
		}
	}

	for (let j = 0; j < orderNumbers.length; j++) {
		if (orderNumbers[j] !== j + 1) {
			return j + 1;
		}
	}

	return orderNumbers.length + 1;
}

console.log(findSmallestMissingPositive(orderNumbers));
