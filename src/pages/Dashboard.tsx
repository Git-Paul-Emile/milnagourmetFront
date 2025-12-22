import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { CreationSize } from '@/types';
import { OrderManagement } from '@/components/Admin/OrderManagement';

// Import des composants de tabs
import { OverviewTab } from './Dashboard/components/OverviewTab';
import { OrdersTab } from './Dashboard/components/OrdersTab';
import { ProductsTab } from './Dashboard/components/ProductsTab';
import { UsersTab } from './Dashboard/components/UsersTab';
import { TestimonialsTab } from './Dashboard/components/TestimonialsTab';
import { GalleryTab } from './Dashboard/components/GalleryTab';
import { AnalyticsTab } from './Dashboard/components/AnalyticsTab';
import { DeliveryTab } from './Dashboard/components/DeliveryTab';
import { SettingsTab } from './Dashboard/components/SettingsTab';
import { DashboardStats } from './Dashboard/components/types';

// Import des nouveaux composants factorisés
import { ZoneModal } from '@/components/Dashboard/ZoneModal';
import { DeliveryPersonModal } from '@/components/Dashboard/DeliveryPersonModal';
import { SizeModal } from '@/components/Dashboard/SizeModal';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { DeleteModal } from '@/components/modals/DeleteModal';
import { OptionsModal } from '@/components/modals/OptionsModal';
import { SuccessToast } from '@/components/SuccessToast';

// Import des hooks personnalisés
import { useDashboardData } from '@/hooks/dashboard/useDashboardData';
import { useDashboardModals } from '@/hooks/dashboard/useDashboardModals';
import { useStoreHours } from '@/hooks/dashboard/useStoreHours';
import { useDeliveryZones } from '@/hooks/dashboard/useDeliveryZones';
import { useDeliveryPersons } from '@/hooks/dashboard/useDeliveryPersons';
import { useProductCategories } from '@/hooks/dashboard/useProductCategories';
import { useCreationOptions } from '@/hooks/dashboard/useCreationOptions';
import { useCreationSizes } from '@/hooks/dashboard/useCreationSizes';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isOrderManagementOpen, setIsOrderManagementOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [galleryReloadTrigger, setGalleryReloadTrigger] = useState(0);

  // Utilisation des hooks personnalisés pour la gestion des données
  const dashboardData = useDashboardData();
  const reloadGallery = async () => setGalleryReloadTrigger(prev => prev + 1);
  const modals = useDashboardModals(dashboardData.loadDashboardData, reloadGallery);
  const storeHoursHook = useStoreHours();

  // Utilisation des hooks existants pour les entités
  const deliveryZonesHook = useDeliveryZones();
  const deliveryPersonsHook = useDeliveryPersons([]);
  const productCategoriesHook = useProductCategories(modals.displaySuccessToast);
  const creationOptionsHook = useCreationOptions(modals.displaySuccessToast);
  const creationSizesHook = useCreationSizes(modals.displaySuccessToast);

  const handleEditSize = (size: CreationSize) => {
    creationSizesHook.setEditingSize(size);
  };

  const handleDeleteSize = (sizeName: string) => {
    creationSizesHook.handleDeleteSize(sizeName);
  };

  const handleLogout = () => {
    localStorage.removeItem('milna-user');
    navigate('/');
    window.location.reload();
  };

  // Les images disponibles sont maintenant chargées depuis l'API dans les composants

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border lg:hidden">
        <div className="flex items-center justify-between py-4 px-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 hover:bg-muted rounded"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingOrdersCount={dashboardData.stats.pendingOrders}
          isMobileOpen={isMobileSidebarOpen}
          onToggleMobile={() => setIsMobileSidebarOpen(false)}
          onLogout={handleLogout}
        />

        <div className="flex-1 pt-24 lg:ml-64 lg:pt-8 p-8">
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewTab stats={dashboardData.stats} setActiveTab={setActiveTab} setIsOrderManagementOpen={setIsOrderManagementOpen} />}
            {activeTab === 'orders' && <OrdersTab orders={dashboardData.orders} stats={dashboardData.stats} setIsOrderManagementOpen={setIsOrderManagementOpen} displaySuccessToast={modals.displaySuccessToast} />}
            {activeTab === 'products' && <ProductsTab allProductsForTab={dashboardData.allProductsForTab} creationSizes={creationSizesHook.creationSizes} creationOptions={creationOptionsHook.creationOptions} loadDashboardData={dashboardData.loadDashboardData} displaySuccessToast={modals.displaySuccessToast} setAddProductModal={modals.setAddProductModal} setDeleteModal={modals.setDeleteModal} setAddSizeModal={modals.setAddSizeModal} onEditSize={handleEditSize} onDeleteSize={handleDeleteSize} setFruitsModal={modals.setFruitsModal} setSaucesModal={modals.setSaucesModal} setCerealesModal={modals.setCerealesModal} />}
            {activeTab === 'users' && <UsersTab users={dashboardData.users} orders={dashboardData.orders} deliveryZones={dashboardData.deliveryZones} loadDashboardData={dashboardData.loadDashboardData} displaySuccessToast={modals.displaySuccessToast} setDeleteModal={modals.setDeleteModal} />}
            {activeTab === 'testimonials' && <TestimonialsTab displaySuccessToast={modals.displaySuccessToast} />}
            {activeTab === 'gallery' && <GalleryTab displaySuccessToast={modals.displaySuccessToast} setDeleteModal={modals.setDeleteModal} reloadTrigger={galleryReloadTrigger} />}
            {activeTab === 'analytics' && <AnalyticsTab stats={dashboardData.stats} loadDashboardData={dashboardData.loadDashboardData} />}
            {activeTab === 'delivery' && <DeliveryTab deliveryZones={dashboardData.deliveryZones} deliveryPersons={dashboardData.deliveryPersons} loadDashboardData={dashboardData.loadDashboardData} displaySuccessToast={modals.displaySuccessToast} />}
            {activeTab === 'settings' && <SettingsTab storeHours={storeHoursHook.storeHours} loadDashboardData={dashboardData.loadDashboardData} displaySuccessToast={modals.displaySuccessToast} onInitializeHours={storeHoursHook.handleInitializeHours} onSaveHours={storeHoursHook.handleUpdateStoreHours} />}
          </div>
        </div>
      </div>

      {/* Order Management Modal */}
      <OrderManagement
        isOpen={isOrderManagementOpen}
        onClose={() => setIsOrderManagementOpen(false)}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={modals.addProductModal}
        onClose={() => modals.setAddProductModal(false)}
        onAdd={modals.handleAddProduct}
        productCategories={productCategoriesHook.productCategories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={modals.deleteModal.isOpen}
        item={modals.deleteModal.item}
        type={modals.deleteModal.type}
        onConfirm={modals.confirmDelete}
        onCancel={() => modals.setDeleteModal({ isOpen: false, type: 'product' })}
      />

      {/* Modal Zone */}
      <ZoneModal
        isOpen={modals.addZoneModal}
        onClose={() => modals.setAddZoneModal(false)}
        onSave={deliveryZonesHook.handleAddZone}
        mode="add"
      />

      <ZoneModal
        isOpen={!!modals.editingZone}
        onClose={() => modals.setEditingZone(null)}
        onSave={deliveryZonesHook.handleSaveZone}
        editingZone={modals.editingZone}
        mode="edit"
      />

      {/* Modal Livreur */}
      <DeliveryPersonModal
        isOpen={modals.addDeliveryPersonModal}
        onClose={() => modals.setAddDeliveryPersonModal(false)}
        onSave={deliveryPersonsHook.handleAddDeliveryPerson}
        mode="add"
      />

      <DeliveryPersonModal
        isOpen={!!modals.editingDeliveryPerson}
        onClose={() => modals.setEditingDeliveryPerson(null)}
        onSave={deliveryPersonsHook.handleSaveDeliveryPerson}
        editingPerson={modals.editingDeliveryPerson}
        mode="edit"
      />


      {/* Modal Taille */}
      <SizeModal
        isOpen={modals.addSizeModal}
        onClose={() => modals.setAddSizeModal(false)}
        onSave={creationSizesHook.handleAddSize}
        mode="add"
        existingSizes={creationSizesHook.creationSizes}
      />

      <SizeModal
        isOpen={!!creationSizesHook.editingSize}
        onClose={() => creationSizesHook.setEditingSize(null)}
        onSave={creationSizesHook.handleSaveSize}
        editingSize={creationSizesHook.editingSize}
        mode="edit"
        existingSizes={creationSizesHook.creationSizes}
      />

      {/* Modal Gestion Fruits */}
      <OptionsModal
        isOpen={modals.fruitsModal}
        type="fruits"
        items={creationOptionsHook.creationOptions.fruits}
        onClose={() => modals.setFruitsModal(false)}
        onAddBulk={creationOptionsHook.handleBulkAddFruits}
        onRemove={creationOptionsHook.handleRemoveFruit}
        onEdit={creationOptionsHook.handleEditFruit}
      />

      {/* Modal Gestion Sauces */}
      <OptionsModal
        isOpen={modals.saucesModal}
        type="sauces"
        items={creationOptionsHook.creationOptions.sauces}
        onClose={() => modals.setSaucesModal(false)}
        onAddBulk={creationOptionsHook.handleBulkAddSauces}
        onRemove={creationOptionsHook.handleRemoveSauce}
        onEdit={creationOptionsHook.handleEditSauce}
      />

      {/* Modal Gestion Céréales */}
      <OptionsModal
        isOpen={modals.cerealesModal}
        type="cereales"
        items={creationOptionsHook.creationOptions.cereales}
        onClose={() => modals.setCerealesModal(false)}
        onAddBulk={creationOptionsHook.handleBulkAddCereales}
        onRemove={creationOptionsHook.handleRemoveCereale}
        onEdit={creationOptionsHook.handleEditCereale}
      />

      {/* Success Toast */}
      <SuccessToast
        message={modals.successMessage}
        isVisible={modals.isSuccessToastVisible}
        onClose={() => modals.setIsSuccessToastVisible(false)}
      />
    </div>
  );
}