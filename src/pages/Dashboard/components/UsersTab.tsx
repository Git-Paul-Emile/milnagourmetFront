import React, { useState } from 'react';
import { User as UserType, Order, DeliveryZone } from '@/types';
import { useUsers } from './useUsers';
import { useUserFilters } from './useUserFilters';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/shared/PaginationControls';
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

  const { page, setPage, totalPages, paginatedItems, total, pageSize } = usePagination(filteredAndSortedUsers, 12);

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

  const handleToggleBlockWrapper = async (userId: string, currentStatus: boolean) => {
    await handleToggleBlock(userId, currentStatus, displaySuccessToast);
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
        filteredUsers={paginatedItems}
        onToggleBlock={handleToggleBlockWrapper}
        onDeleteUser={handleDeleteUserWrapper}
        onViewOrders={handleViewOrders}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        total={total}
        pageSize={pageSize}
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