import React from 'react';
import { DashboardStats } from './types';
import { StatCard } from './StatCard';
import { ShoppingCart, Clock, ChefHat, Truck, CheckCircle } from 'lucide-react';

interface OrderStatusStatsProps {
  stats: DashboardStats;
}

function OrderStatusStats({ stats }: OrderStatusStatsProps) {
  // Trouver les comptes pour chaque statut (les labels sont en français)
  const totalOrders = stats.totalOrders;
  const recuCount = stats.orderStatusData.find(s => s.status === 'Reçue')?.count || 0;
  const preparationCount = stats.orderStatusData.find(s => s.status === 'En préparation')?.count || 0;
  const livraisonCount = stats.orderStatusData.find(s => s.status === 'En livraison')?.count || 0;
  const livreeCount = stats.orderStatusData.find(s => s.status === 'Livrée')?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
        title="En préparation"
        value={preparationCount}
        icon={ChefHat}
        color="hover:shadow-orange-500/10"
        valueColor="text-[#460618]"
      />
      <StatCard
        title="En livraison"
        value={livraisonCount}
        icon={Truck}
        color="hover:shadow-yellow-500/10"
        valueColor="text-[#460618]"
      />
      <StatCard
        title="Livrées"
        value={livreeCount}
        icon={CheckCircle}
        color="hover:shadow-green-500/10"
        valueColor="text-[#460618]"
      />
    </div>
  );
}

export default OrderStatusStats;