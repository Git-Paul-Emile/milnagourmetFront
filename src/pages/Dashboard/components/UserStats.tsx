import React from 'react';
import { User as UserType } from '@/types';
import { Users, CheckCircle, XCircle } from 'lucide-react';

interface UserStatsProps {
  filteredUsers: UserType[];
  allUsers: UserType[];
}

export function UserStats({ filteredUsers, allUsers }: UserStatsProps) {
  // Statistiques basées sur l'ensemble des clients
  const totalUsers = allUsers.length;

  // Règle unique : client actif = non bloqué, non admin,
  // avec au moins une commande dans les 60 derniers jours
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const isActiveCustomerLast60Days = (user: UserType) => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }

    return user.orders.some(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= sixtyDaysAgo;
    });
  };

  const activeUsers = allUsers.filter(isActiveCustomerLast60Days);
  const blockedUsers = allUsers.filter(user => user.blocked);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg p-4 border border-border">
        <Users className="mb-2 w-8 h-8 text-muted-foreground" />
        <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
        <div className="text-sm text-muted-foreground">Nombre de clients</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <CheckCircle className="mb-2 w-8 h-8 text-muted-foreground" />
        <div className="text-2xl font-bold text-foreground">{activeUsers.length}</div>
        <div className="text-sm text-muted-foreground">Clients actifs</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <XCircle className="mb-2 w-8 h-8 text-muted-foreground" />
        <div className="text-2xl font-bold text-foreground">{blockedUsers.length}</div>
        <div className="text-sm text-muted-foreground">Clients bloqués</div>
      </div>
    </div>
  );
}