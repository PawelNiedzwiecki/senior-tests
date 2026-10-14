/**
 * KATA 04 — Supermarket checkout with offers
 * ════════════════════════════════════════════════════════════════════════════
 * TIME BOX: 40 min        Guide: ../README.md
 *
 * THE TASK
 * `createCheckout(rules)` returns a checkout you can `scan(sku)`,
 * `remove(sku)` and ask for `total()`. Prices are INTEGER PENCE.
 *
 * THE OFFERS (at most one per SKU — a discriminated union)
 *   multiBuy      { quantity: 3, price: 130 }  every 3 cost 130, rest full price
 *   buyXGetYFree  { buy: 2, free: 1 }          in each group of 3, pay for 2
 *   bulkPrice     { minQuantity: 5, unitPrice: 80 }
 *                                               5 or more → EVERY unit is 80
 *
 * EXAMPLE PRICE LIST (used in the tests)
 *   A  50   multiBuy 3 for 130
 *   B  30   multiBuy 2 for 45
 *   C  20
 *   D  15
 *   E  40   buy 2 get 1 free
 *   F 100   bulk: 5+ at 80 each
 *
 *   scan A,A,A,B,B,C  → 130 + 45 + 20 = 195
 *   scan B,A,B        → 50 + 45       =  95   (order doesn't matter)
 *
 * DECISIONS ALREADY MADE FOR YOU
 *   - Unknown SKU on scan → throws. Duplicate SKU in rules → createCheckout
 *     throws. `remove` of an item not in the basket → throws.
 *   - Offers apply to the WHOLE basket on every `total()` call, so removing
 *     an item can un-trigger a deal.
 *   - buyXGetYFree with a partial group: pay for min(leftover, buy) items.
 *     (buy 2 get 1 free, 5 items → one full group pays 2, leftover 2 pays 2.)
 *
 * CLARIFYING QUESTIONS WORTH ASKING
 *   - Money as floats or integer minor units? (Always integers. Say why.)
 *   - Can offers stack or overlap across SKUs ("meal deal")?
 *   - Does the total recalculate on every scan, or once at the end?
 *
 * HINT
 *   Keep the basket as `Map<sku, count>` — never a list of prices. Pricing is
 *   then ONE function per offer kind: `(count, unitPrice, offer) → pence`,
 *   chosen with a `switch` on `offer.kind`. Adding a new offer type should
 *   touch the union and one `case`, nothing else.
 *
 * FOLLOW-UPS
 *   - Itemised receipt showing the saving per offer.
 *   - Cross-SKU offers (any 3 from a group for £X) — how does the model change?
 *   - Pricing rules loaded from JSON: where do you validate them?
 */

export type Offer =
  | { kind: 'multiBuy'; quantity: number; price: number }
  | { kind: 'buyXGetYFree'; buy: number; free: number }
  | { kind: 'bulkPrice'; minQuantity: number; unitPrice: number };

export interface PricingRule {
  sku: string;
  unitPrice: number;
  offer?: Offer;
}

export interface Checkout {
  scan(sku: string): void;
  remove(sku: string): void;
  total(): number;
}

export function createCheckout(_rules: readonly PricingRule[]): Checkout {
  throw new Error('Not implemented');
}
