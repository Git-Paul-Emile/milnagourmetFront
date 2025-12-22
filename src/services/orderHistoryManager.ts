import { User, Cart } from '@/types';

export function addOrderToUserHistory(user: User, cart: Cart): void {
  const order = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    items: cart.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: cart.total,
    status: 'pending' as const
  };

  // Mettre à jour l'utilisateur dans localStorage
  const existingUsers = JSON.parse(localStorage.getItem('milna-users') || '[]');
  const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);

  if (userIndex !== -1) {
    if (!existingUsers[userIndex].orders) {
      existingUsers[userIndex].orders = [];
    }
    existingUsers[userIndex].orders.unshift(order); // Ajouter en premier
    localStorage.setItem('milna-users', JSON.stringify(existingUsers));

    // Mettre à jour l'utilisateur connecté
    const currentUser = JSON.parse(localStorage.getItem('milna-user') || 'null');
    if (currentUser && currentUser.id === user.id) {
      currentUser.orders = existingUsers[userIndex].orders;
      localStorage.setItem('milna-user', JSON.stringify(currentUser));
    }
  }
}