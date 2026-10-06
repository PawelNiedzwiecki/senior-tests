let passed = 0;
let failed = 0;
export function eq(actual: unknown, expected: unknown, label = ""): void {
	const a = JSON.stringify(actual);
	const b = JSON.stringify(expected);
	if (a === b) {
		passed += 1;
		console.log(`  ok   ${label}`);
	} else {
		failed += 1;
		console.log(
			`FAIL   ${label}\n         expected: ${b}\n         actual:   ${a}`,
		);
	}
}

function twoSum(nums: number[], target: number): [number, number] | null {
	const seen = new Map<number, number>();
	for (let i = 0; i < nums.length; i += 1) {
		const need = target - nums[i]!;
		if (seen.has(need)) return [seen.get(need)!, i];
		seen.set(nums[i]!, i);
	}
	return null;
}

eq(twoSum([2, 7, 11, 15], 9), [0, 1], "example from the prompt");
