import { describe, it, expect } from 'vitest';
import { calculateBestSellingProducts, calculateTopIngredients } from './productStatsCalculator';
import { Order, Product } from '@/types';

// Régression : le backend renvoie les statuts en français/minuscules
// ('recu' | 'livree' | 'annulee'), pas en anglais ('pending' | 'delivered' | 'cancelled').
// Ce test garantit que les commandes annulées sont bien exclues des statistiques.

const product: Product = {
  id: 'p1',
  name: 'Yaourt Nature',
  category: 'cremeux',
  price: 500,
  description: '',
  image: '',
  available: true,
};

const makeOrder = (status: Order['status'], quantity = 1): Order => ({
  id: `order-${status}-${quantity}`,
  items: [{ id: 'item-1', product, quantity, price: 500, name: product.name }],
  total: 500 * quantity,
  status,
  date: new Date().toISOString(),
  notes: '',
});

describe('calculateBestSellingProducts', () => {
  it('inclut les commandes reçues et livrées', () => {
    const result = calculateBestSellingProducts([makeOrder('recu', 2), makeOrder('livree', 3)]);

    expect(result[0]?.totalSold).toBe(5);
  });

  it('exclut les commandes annulées', () => {
    const result = calculateBestSellingProducts([makeOrder('recu', 2), makeOrder('annulee', 10)]);

    expect(result[0]?.totalSold).toBe(2);
  });
});

describe('calculateTopIngredients', () => {
  it('exclut les créations personnalisées des commandes annulées', () => {
    const creationProduct: Product = { ...product, id: 'creation', category: 'creation' };
    const annulee: Order = {
      ...makeOrder('annulee'),
      items: [{
        id: 'item-creation',
        product: creationProduct,
        quantity: 1,
        price: 1000,
        name: 'Création',
        customCreation: {
          size: { id: 1, nom: 'Moyen', prix: 1000, maxFruits: 3, maxSauces: 2, cerealesAutorise: true, active: true, ordreAffichage: 1 },
          selectedFruits: ['Mangue'],
          selectedSauces: [],
          selectedCereales: [],
          totalPrice: 1000
        }
      }]
    };

    const { topFruits } = calculateTopIngredients([annulee]);

    expect(topFruits).toHaveLength(0);
  });
});
