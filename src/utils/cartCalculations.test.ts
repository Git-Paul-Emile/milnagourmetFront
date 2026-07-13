import { describe, it, expect } from 'vitest';
import { calculateCartTotals } from './cartCalculations';
import { CartItem } from '@/types';

const item = (price: number, quantity: number): CartItem => ({
  id: `${price}-${quantity}`,
  name: 'Yaourt',
  price,
  quantity,
});

describe('calculateCartTotals', () => {
  it('calcule le sous-total et le nombre d\'articles', () => {
    const totals = calculateCartTotals([item(500, 2), item(1000, 1)]);

    expect(totals.total).toBe(2000);
    expect(totals.itemCount).toBe(3);
  });

  it('ajoute les frais de livraison au total', () => {
    const totals = calculateCartTotals([item(500, 2)], 300);

    expect(totals.total).toBe(1000);
    expect(totals.totalWithDelivery).toBe(1300);
  });

  it('déduit la réduction fidélité du total avec livraison', () => {
    const totals = calculateCartTotals([item(1000, 1)], 300, 200);

    expect(totals.totalWithDelivery).toBe(1300);
    expect(totals.totalWithDiscount).toBe(1100);
  });

  it('gère un panier vide', () => {
    const totals = calculateCartTotals([]);

    expect(totals.total).toBe(0);
    expect(totals.itemCount).toBe(0);
    expect(totals.totalWithDiscount).toBe(0);
  });
});
