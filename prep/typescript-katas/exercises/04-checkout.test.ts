import { describe, it, expect } from 'vitest';
import { createCheckout, type PricingRule } from '@tskata/04-checkout.ts';

const RULES: PricingRule[] = [
  { sku: 'A', unitPrice: 50, offer: { kind: 'multiBuy', quantity: 3, price: 130 } },
  { sku: 'B', unitPrice: 30, offer: { kind: 'multiBuy', quantity: 2, price: 45 } },
  { sku: 'C', unitPrice: 20 },
  { sku: 'D', unitPrice: 15 },
  { sku: 'E', unitPrice: 40, offer: { kind: 'buyXGetYFree', buy: 2, free: 1 } },
  { sku: 'F', unitPrice: 100, offer: { kind: 'bulkPrice', minQuantity: 5, unitPrice: 80 } },
];

function totalOf(items: string): number {
  const co = createCheckout(RULES);
  for (const sku of items) co.scan(sku);
  return co.total();
}

describe('kata 04 — checkout', () => {
  it('is 0 for an empty basket', () => {
    expect(totalOf('')).toBe(0);
  });

  it('sums unit prices', () => {
    expect(totalOf('A')).toBe(50);
    expect(totalOf('ABCD')).toBe(115);
    expect(totalOf('CC')).toBe(40);
  });

  it('applies multi-buy offers', () => {
    expect(totalOf('AAA')).toBe(130);
    expect(totalOf('AAAA')).toBe(180);
    expect(totalOf('AAAAAA')).toBe(260);
    expect(totalOf('BB')).toBe(45);
    expect(totalOf('AAABBC')).toBe(195);
  });

  it('does not depend on scan order', () => {
    expect(totalOf('BAB')).toBe(95);
    expect(totalOf('DABABA')).toBe(190);
  });

  it('applies buy-X-get-Y-free', () => {
    expect(totalOf('EE')).toBe(80);
    expect(totalOf('EEE')).toBe(80);
    expect(totalOf('EEEE')).toBe(120);
    expect(totalOf('EEEEE')).toBe(160);
    expect(totalOf('EEEEEE')).toBe(160);
  });

  it('applies bulk pricing to every unit at the threshold', () => {
    expect(totalOf('FFFF')).toBe(400);
    expect(totalOf('FFFFF')).toBe(400);
    expect(totalOf('FFFFFF')).toBe(480);
  });

  it('keeps a running total between scans', () => {
    const co = createCheckout(RULES);
    co.scan('A');
    expect(co.total()).toBe(50);
    co.scan('A');
    expect(co.total()).toBe(100);
    co.scan('A');
    expect(co.total()).toBe(130);
  });

  it('re-prices when an item is removed', () => {
    const co = createCheckout(RULES);
    for (const sku of 'AAA') co.scan(sku);
    co.remove('A');
    expect(co.total()).toBe(100);
  });

  it('throws on unknown SKUs, bad removals and duplicate rules', () => {
    const co = createCheckout(RULES);
    expect(() => co.scan('Z')).toThrow();
    expect(() => co.remove('A')).toThrow();
    expect(() => createCheckout([...RULES, { sku: 'A', unitPrice: 1 }])).toThrow();
  });
});
