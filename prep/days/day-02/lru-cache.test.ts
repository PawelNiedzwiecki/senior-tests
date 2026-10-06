import { createLRUCache } from './lru-cache.ts';
import { describe, expect, it } from "vitest";





describe("createLRUCache", () => {
	it("gets what it put", () => {
		const cache = createLRUCache(2);
		cache.put(1, 100);
		expect(cache.get(1)).toBe(100);
	});

	it("returns undefined for a missing key", () => {
		expect(createLRUCache(2).get(42)).toBeUndefined();
	});

	it("evicts the least recently used key", () => {
		const cache = createLRUCache(2);
		cache.put(1, 1);
		cache.put(2, 2);
		cache.put(3, 3); // evicts 1
		expect(cache.get(1)).toBeUndefined();
		expect(cache.get(2)).toBe(2);
		expect(cache.get(3)).toBe(3);
	});

	it("counts a get as a use", () => {
		const cache = createLRUCache(2);
		cache.put(1, 1);
		cache.put(2, 2);
		cache.get(1); // 2 is now the least recent
		cache.put(3, 3);
		expect(cache.get(2)).toBeUndefined();
		expect(cache.get(1)).toBe(1);
	});

	it("counts overwriting a key as a use and does not evict for it", () => {
		const cache = createLRUCache(2);
		cache.put(1, 1);
		cache.put(2, 2);
		cache.put(1, 99); // update, not insert — nothing should be evicted
		expect(cache.size).toBe(2);
		cache.put(3, 3); // now 2 is the least recent
		expect(cache.get(2)).toBeUndefined();
		expect(cache.get(1)).toBe(99);
	});

	it("never exceeds capacity", () => {
		const cache = createLRUCache(3);
		for (let i = 0; i < 50; i += 1) {
			cache.put(i, i);
			expect(cache.size).toBeLessThanOrEqual(3);
		}
		expect(cache.get(49)).toBe(49);
		expect(cache.get(0)).toBeUndefined();
	});

	it("handles a capacity of one", () => {
		const cache = createLRUCache(1);
		cache.put(1, 1);
		cache.put(2, 2);
		expect(cache.get(1)).toBeUndefined();
		expect(cache.get(2)).toBe(2);
	});
});
