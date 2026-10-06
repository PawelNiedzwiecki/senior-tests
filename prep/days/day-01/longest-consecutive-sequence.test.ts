import { longestConsecutive } from './longest-consecutive-sequence.ts';
import { describe, expect, it } from "vitest";



describe("longestConsecutive", () => {
	it("handles the prompt examples", () => {
		expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
		expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
	});

	it("handles an empty array", () => {
		expect(longestConsecutive([])).toBe(0);
	});

	it("handles a single element", () => {
		expect(longestConsecutive([5])).toBe(1);
	});

	it("collapses duplicates", () => {
		expect(longestConsecutive([1, 1, 1, 1])).toBe(1);
		expect(longestConsecutive([1, 2, 2, 3])).toBe(3);
	});

	it("handles negatives and a run crossing zero", () => {
		expect(longestConsecutive([-3, -2, -1, 0, 1])).toBe(5);
	});

	it("picks the longest of several runs", () => {
		expect(longestConsecutive([10, 11, 1, 2, 3, 50])).toBe(3);
	});

	it("stays fast on a fully consecutive input (catches the O(n^2) version)", () => {
		const nums = Array.from({ length: 20_000 }, (_, i) => i);
		const started = Date.now();
		expect(longestConsecutive(nums)).toBe(20_000);
		expect(Date.now() - started).toBeLessThan(1000);
	});
});