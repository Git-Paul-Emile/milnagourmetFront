import React, { useState } from 'react';
import { User as UserType } from '@/types';
import { Eye, Ban, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserListProps {
  filteredUsers: UserType[];
  onToggleBlock: (userId: string, currentStatus: boolean) => Promise<void>;
  onDeleteUser: (user: UserType) => void;
  onViewOrders: (user: UserType) => void;
}

export function UserList({ filteredUsers, onToggleBlock, onDeleteUser, onViewOrders }: UserListProps) {
  const [loadingUsers, setLoadingUsers] = useState<Set<string>>(new Set());

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    setLoadingUsers(prev => new Set(prev).add(userId));
    try {
      await onToggleBlock(userId, currentStatus);
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Fonction pour déterminer si un client est actif
  const isActiveCustomer = (user: UserType) => {
    if (user.role === 'admin' || user.blocked || !user.orders || user.orders.length === 0) {
      return false;
    }
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    return user.orders.some(order => {
      const orderDate = new Date(order.date || order.createdAt || '');
      return orderDate >= sixtyDaysAgo;
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Mes clients</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className={`bg-background rounded-lg p-4 border border-border hover:shadow-md transition-shadow ${user.blocked ? 'opacity-75 bg-red-50/30' : ''}`}>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-lg">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                  {user.blocked ? (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mt-2">
                      Bloqué
                    </span>
                  ) : isActiveCustomer(user) ? (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-2">
                      Actif
                    </span>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {user.orders?.length || 0} commande{user.orders?.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Inscrit le {new Date(user.createdAt || '').toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => onViewOrders(user)}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded text-xs hover:bg-blue-200 transition-colors w-full flex items-center justify-center"
                  >
                    <Eye className="mr-1 w-4 h-4" />
                    Voir commandes
                  </button>
                  <Button
                    onClick={() => handleToggleBlock(user.id, user.blocked || false)}
                    loading={loadingUsers.has(user.id)}
                    className={`px-3 py-2 rounded text-xs transition-colors w-full flex items-center justify-center ${
                      user.blocked
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    <Ban className="mr-1 w-4 h-4" />
                    {user.blocked ? 'Débloquer' : 'Bloquer'}
                  </Button>
                  <button
                    onClick={() => onDeleteUser(user)}
                    className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-xs hover:bg-gray-200 transition-colors w-full flex items-center justify-center"
                  >
                    <Trash2 className="mr-1 w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}