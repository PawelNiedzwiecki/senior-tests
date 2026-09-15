/**
 * SOLUTIONS — Line sweep / event-based
 */

/**
 * PROBLEM 1 — Corporate flight bookings
 *
 * COMPLEXITY: O(bookings + n) time, O(n) space. The naive version — looping
 * over every flight of every booking — is O(bookings × n).
 *
 * NARRATION:
 *   "Rather than writing `seats` into every flight of the range, I record only
 *    where the running total changes: plus seats where the range begins, minus
 *    seats just past where it ends. A single prefix-sum pass then reconstructs
 *    every flight's total. It's a difference array, which is the inverse of a
 *    prefix sum — prefix sums make range QUERIES cheap, difference arrays make
 *    range UPDATES cheap."
 *
 * THE INDEXING, spelled out because it is the only hard part: flights are
 * 1-indexed, the array is 0-indexed, so flight `first` lives at `first - 1`.
 * The subtraction goes one past the end, which in 0-indexed terms is exactly
 * `last`. Write [1, 2, 10] on n = 5 by hand once and the shift stops being
 * error-prone.
 *
 * THE EXTRA SLOT (`n + 1` entries) lets a booking that ends at the final flight
 * subtract past the end with no bounds check. Slicing it off at the end is
 * cheaper than branching inside the loop.
 *
 * ACCUMULATING IN PLACE avoids a second array: each entry becomes the running
 * sum of everything before it, which is the answer for that flight.
 *
 * WHEN THIS BREAKS: if queries were interleaved with updates, the O(n)
 * reconstruction would run on every query. That is the point at which you name
 * a Fenwick tree — O(log n) per update and per query.
 */
export function corpFlightBookings(
  bookings: Array<[number, number, number]>,
  n: number,
): number[] {
  const delta = new Array<number>(n + 1).fill(0); // one spare slot: no bounds check

  for (const [first, last, seats] of bookings) {
    delta[first - 1]! += seats; // from here on, add seats
    delta[last]! -= seats; // from just past the end, stop adding
  }

  for (let i = 1; i < n; i += 1) delta[i]! += delta[i - 1]!; // prefix sum in place

  return delta.slice(0, n);
}

/**
 * A max-heap over [height, endX], used for the active buildings. The same
 * minimal binary heap as everywhere else, with the comparator inverted.
 */
class MaxHeapByHeight {
  private readonly items: Array<[number, number]> = [];

  get size(): number {
    return this.items.length;
  }

  peek(): [number, number] | undefined {
    return this.items[0];
  }

  push(value: [number, number]): void {
    this.items.push(value);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.items[i]![0] <= this.items[parent]![0]) break;
      [this.items[i], this.items[parent]] = [this.items[parent]!, this.items[i]!];
      i = parent;
    }
  }

  pop(): void {
    const last = this.items.pop()!;
    if (this.items.length === 0) return;

    this.items[0] = last;
    let i = 0;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < this.items.length && this.items[left]![0] > this.items[largest]![0]) largest = left;
      if (right < this.items.length && this.items[right]![0] > this.items[largest]![0])
        largest = right;
      if (largest === i) break;
      [this.items[i], this.items[largest]] = [this.items[largest]!, this.items[i]!];
      i = largest;
    }
  }
}

/**
 * PROBLEM 2 — The skyline problem
 *
 * COMPLEXITY: O(n log n) time — the sort, plus each building pushed and popped
 * once — and O(n) space.
 *
 * NARRATION:
 *   "The outline can only change at a building's left or right edge, and at any
 *    x the visible height is the maximum over the buildings currently active.
 *    So I sweep the edges in order, keep the active heights in a max-heap, and
 *    emit a key point whenever the maximum differs from the last one I emitted."
 *
 * THE TIE-BREAKS LIVE IN THE SORT KEY, not in the loop. Encoding a start's
 * height as NEGATIVE means that, at a shared x, starts sort before ends (a
 * negative before a zero) and taller starts before shorter ones. Both are
 * exactly the behaviour needed: touching buildings must not produce a spurious
 * drop to 0, and the tallest start must register before any point is emitted.
 * Getting these two rules out of one comparator is the elegance of the standard
 * solution.
 *
 * LAZY DELETION: heaps cannot remove an arbitrary element, so ended buildings
 * are discarded only once they surface at the top — `while (top.endX <= x) pop`.
 * Stale entries deeper in the heap cost nothing, because they cannot affect the
 * maximum until they reach the top, at which point they are removed.
 *
 * THE GROUND SENTINEL `[0, Infinity]` means the heap is never empty, so "the
 * current height" needs no empty check and the final drop to 0 falls out
 * naturally at the last building's right edge.
 *
 * EMIT ONLY ON CHANGE is the last rule, and it is what guarantees no two
 * consecutive points share a height — including the case where one building
 * ends exactly where an equally tall one begins.
 */
export function getSkyline(buildings: Array<[number, number, number]>): Array<[number, number]> {
  // [x, heightKey, endX] — a start carries -height, an end carries 0.
  const events: Array<[number, number, number]> = [];
  for (const [left, right, height] of buildings) {
    events.push([left, -height, right]);
    events.push([right, 0, 0]);
  }

  // At equal x: starts before ends, and taller starts first. Both from one key.
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const active = new MaxHeapByHeight();
  active.push([0, Infinity]); // the ground: the heap is never empty

  const skyline: Array<[number, number]> = [];

  for (const [x, heightKey, endX] of events) {
    while (active.peek()![1] <= x) active.pop(); // lazy deletion of ended buildings
    if (heightKey < 0) active.push([-heightKey, endX]);

    const currentHeight = active.peek()![0];
    const lastHeight = skyline.length === 0 ? -1 : skyline[skyline.length - 1]![1];
    if (currentHeight !== lastHeight) skyline.push([x, currentHeight]); // emit ON CHANGE
  }

  return skyline;
}
