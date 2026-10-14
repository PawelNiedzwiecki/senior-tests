/**
 * SOLUTION — Supermarket checkout with offers
 *
 * COMPLEXITY: scan/remove O(1); total O(distinct SKUs).
 *
 * NARRATION:
 *   "The basket is a Map from SKU to count — offers depend on counts, not on
 *    scan order, so I never store a running price. total() prices each SKU
 *    independently with one pure function that switches on the offer kind."
 *
 * INTEGER PENCE. Floats give 0.1 + 0.2 !== 0.3; money is always minor units.
 *
 * RULES INDEXED ONCE in a Map at construction — that is also where duplicate
 * SKUs are caught, i.e. validation happens at the boundary, not on every scan.
 *
 * `priceLine` IS PURE AND EXHAUSTIVE. The `never` default means adding a new
 * offer to the union is a compile error until it is priced — the open/closed
 * story interviewers like to hear, without a class hierarchy.
 *
 * FACTORY + CLOSURE rather than a class: the basket is truly private, and the
 * returned object is just the interface. Either is fine — say why you chose.
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

function priceLine(count: number, rule: PricingRule): number {
  const { unitPrice, offer } = rule;
  if (!offer) return count * unitPrice;

  switch (offer.kind) {
    case 'multiBuy': {
      const deals = Math.floor(count / offer.quantity);
      const rest = count % offer.quantity;
      return deals * offer.price + rest * unitPrice;
    }
    case 'buyXGetYFree': {
      const groupSize = offer.buy + offer.free;
      const groups = Math.floor(count / groupSize);
      const leftover = count % groupSize;
      return (groups * offer.buy + Math.min(leftover, offer.buy)) * unitPrice;
    }
    case 'bulkPrice':
      return count * (count >= offer.minQuantity ? offer.unitPrice : unitPrice);
    default: {
      const unreachable: never = offer;
      throw new Error(`Unknown offer: ${JSON.stringify(unreachable)}`);
    }
  }
}

export function createCheckout(rules: readonly PricingRule[]): Checkout {
  const rulesBySku = new Map<string, PricingRule>();
  for (const rule of rules) {
    if (rulesBySku.has(rule.sku)) throw new Error(`Duplicate pricing rule: ${rule.sku}`);
    rulesBySku.set(rule.sku, rule);
  }

  const basket = new Map<string, number>();

  return {
    scan(sku) {
      if (!rulesBySku.has(sku)) throw new Error(`Unknown SKU: ${sku}`);
      basket.set(sku, (basket.get(sku) ?? 0) + 1);
    },

    remove(sku) {
      const count = basket.get(sku);
      if (!count) throw new Error(`Not in basket: ${sku}`);
      if (count === 1) basket.delete(sku);
      else basket.set(sku, count - 1);
    },

    total() {
      let sum = 0;
      for (const [sku, count] of basket) {
        // Safe: scan() only admits SKUs that have a rule.
        sum += priceLine(count, rulesBySku.get(sku)!);
      }
      return sum;
    },
  };
}
