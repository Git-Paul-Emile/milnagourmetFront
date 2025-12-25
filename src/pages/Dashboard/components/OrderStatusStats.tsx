import React from 'react';
import { DashboardStats } from './types';
import { StatCard } from './StatCard';
import { ShoppingCart, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderStatusStatsProps {
  stats: DashboardStats;
}

function OrderStatusStats({ stats }: OrderStatusStatsProps) {
  // Trouver les comptes pour chaque statut (les labels sont en français)
  const totalOrders = stats.totalOrders;
  const recuCount = stats.orderStatusData.find(s => s.status === 'Reçue')?.count || 0;
  const livreeCount = stats.orderStatusData.find(s => s.status === 'Livrée')?.count || 0;
  const annuleeCount = stats.orderStatusData.find(s => s.status === 'Annulée')?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total commandes"
        value={totalOrders}
        icon={ShoppingCart}
        color="hover:shadow-blue-500/10"
        valueColor="text-[#460618]"
      />
      <StatCard
        title="Reçues"
        value={recuCount}
        icon={Clock}
        color="hover:shadow-blue-500/10"
        valueColor="text-[#460618]"
      />
      <StatCard
        title="Livrées"
        value={livreeCount}
        icon={CheckCircle}
        color="hover:shadow-green-500/10"
        valueColor="text-[#460618]"
      />
      <StatCard
        title="Annulées"
        value={annuleeCount}
        icon={XCircle}
        color="hover:shadow-red-500/10"
        valueColor="text-[#460618]"
      />
    </div>
  );
}

export default OrderStatusStats;