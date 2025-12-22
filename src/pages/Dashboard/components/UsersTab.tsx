import React, { useState } from 'react';
import { User as UserType, Order, DeliveryZone } from '@/types';
import { useUsers } from './useUsers';
import { useUserFilters } from './useUserFilters';
import { UserFilters } from './UserFilters';
import { UserStats } from './UserStats';
import { UserList } from './UserList';
import { UserOrdersModal } from './UserOrdersModal';

interface UsersTabProps {
  users: UserType[];
  orders: Order[];
  deliveryZones: DeliveryZone[];
  loadDashboardData: () => Promise<void>;
  displaySuccessToast: (message: string) => void;
  setDeleteModal: (open: React.SetStateAction<{ isOpen: boolean; item?: import("@/types").Product | UserType; type: "product" | "user"; }>) => void;
}

export function UsersTab({ users, orders, deliveryZones, loadDashboardData, displaySuccessToast, setDeleteModal }: UsersTabProps) {
  const { allUsers, handleToggleBlock, handleDeleteUser } = useUsers();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredAndSortedUsers,
    resetFilters,
  } = useUserFilters(allUsers);

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userOrdersModal, setUserOrdersModal] = useState(false);

  const handleViewOrders = (user: UserType) => {
    setSelectedUser(user);
    setUserOrdersModal(true);
  };

  const handleCloseModal = () => {
    setUserOrdersModal(false);
    setSelectedUser(null);
  };

  const handleToggleBlockWrapper = (userId: string, currentStatus: boolean) => {
    handleToggleBlock(userId, currentStatus, displaySuccessToast);
  };

  const handleDeleteUserWrapper = (user: UserType) => {
    handleDeleteUser(user, setDeleteModal);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des clients</h2>

      </div>
      <UserStats
        filteredUsers={filteredAndSortedUsers}
        allUsers={allUsers}
      />

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />


      <UserList
        filteredUsers={filteredAndSortedUsers}
        onToggleBlock={handleToggleBlockWrapper}
        onDeleteUser={handleDeleteUserWrapper}
        onViewOrders={handleViewOrders}
      />

      <UserOrdersModal
        selectedUser={selectedUser}
        orders={orders}
        deliveryZones={deliveryZones}
        isOpen={userOrdersModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}