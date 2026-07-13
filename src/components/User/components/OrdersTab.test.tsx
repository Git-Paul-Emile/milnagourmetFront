import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrdersTab } from './OrdersTab';
import { Order } from '@/types';

// Régression : les statuts de commande renvoyés par le backend sont en français
// ('recu' | 'livree' | 'annulee'). Le badge doit s'afficher pour ces valeurs exactes.

const baseOrder: Order = {
  id: '1',
  items: [{ id: 'i1', name: 'Yaourt Nature', quantity: 2, price: 500 }],
  total: 1000,
  status: 'livree',
  date: new Date().toISOString(),
  notes: '',
};

describe('OrdersTab', () => {
  it('affiche le badge "Livrée" pour une commande au statut livree', () => {
    render(<OrdersTab orders={[baseOrder]} />);

    expect(screen.getByText('Livrée')).toBeInTheDocument();
  });

  it('affiche le badge "En cours" pour une commande au statut recu', () => {
    render(<OrdersTab orders={[{ ...baseOrder, status: 'recu' }]} />);

    expect(screen.getByText('En cours')).toBeInTheDocument();
  });

  it('affiche le badge "Annulée" pour une commande au statut annulee', () => {
    render(<OrdersTab orders={[{ ...baseOrder, status: 'annulee' }]} />);

    expect(screen.getByText('Annulée')).toBeInTheDocument();
  });

  it("affiche un message quand il n'y a aucune commande", () => {
    render(<OrdersTab orders={[]} />);

    expect(screen.getByText('Aucune commande')).toBeInTheDocument();
  });
});
