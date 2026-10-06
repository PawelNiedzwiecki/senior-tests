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
