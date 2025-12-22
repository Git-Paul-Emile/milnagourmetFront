import { Order, Product } from '@/types';

export function calculateBestSellingProducts(orders: Order[]) {
  const productSales = new Map<string, { product: Product; totalSold: number; revenue: number }>();

  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        if (item.product) {
          const productId = item.product.id;
          const existing = productSales.get(productId);
          if (existing) {
            existing.totalSold += item.quantity;
            existing.revenue += item.price * item.quantity;
          } else {
            productSales.set(productId, {
              product: item.product,
              totalSold: item.quantity,
              revenue: item.price * item.quantity
            });
          }
        }
      });
    }
  });

  const bestSellingProducts = Array.from(productSales.values())
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5); // Top 5 produits

  return bestSellingProducts;
}

export function calculateTopIngredients(orders: Order[]) {
  const fruitCount = new Map<string, number>();
  const sauceCount = new Map<string, number>();
  const cerealeCount = new Map<string, number>();

  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        if (item.product?.category === 'creation' && item.customCreation) {
          // Compter les fruits
          item.customCreation.selectedFruits?.forEach(fruit => {
            fruitCount.set(fruit, (fruitCount.get(fruit) || 0) + item.quantity);
          });
          // Compter les sauces
          item.customCreation.selectedSauces?.forEach(sauce => {
            sauceCount.set(sauce, (sauceCount.get(sauce) || 0) + item.quantity);
          });
          // Compter les céréales
          item.customCreation.selectedCereales?.forEach(cereale => {
            cerealeCount.set(cereale, (cerealeCount.get(cereale) || 0) + item.quantity);
          });
        }
      });
    }
  });

  const topFruits = Array.from(fruitCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSauces = Array.from(sauceCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCereales = Array.from(cerealeCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return { topFruits, topSauces, topCereales };
}

export function calculateRecentOrders(orders: Order[]) {
  return orders
    .sort((a, b) => new Date(b.date || b.createdAt || '').getTime() - new Date(a.date || a.createdAt || '').getTime())
    .slice(0, 5);
}