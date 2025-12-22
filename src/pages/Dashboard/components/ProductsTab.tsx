import React from 'react';
import { Plus } from 'lucide-react';
import {
  ProductStats,
  ProductFilters,
  CategoryManagement,
  CreationOptionsManagement,
  ProductList,
  ProductEditModal,
  useProductFilters,
  useProductOperations
} from './ProductsTab/index';
import { useProductCategories } from '@/hooks/dashboard/useProductCategories';
import { CategoryModal } from '@/components/Dashboard/CategoryModal';
import { Modal } from '@/components/Modal';
import { Product, ProductCategoryItem, CreationSize, CreationOptions } from '@/types';

interface ProductsTabProps {
  allProductsForTab: Product[];
  creationSizes: CreationSize[];
  creationOptions: CreationOptions;
  loadDashboardData: () => Promise<void>;
  displaySuccessToast: (message: string) => void;
  setAddProductModal: (open: boolean) => void;
  setDeleteModal: (open: React.SetStateAction<{ isOpen: boolean; item?: Product | import("@/types").User; type: "product" | "user"; }>) => void;
  setAddSizeModal: (open: boolean) => void;
  onEditSize: (size: CreationSize) => void;
  onDeleteSize: (sizeName: string) => void;
  setFruitsModal: (open: boolean) => void;
  setSaucesModal: (open: boolean) => void;
  setCerealesModal: (open: boolean) => void;
}

export function ProductsTab({
  allProductsForTab,
  creationSizes,
  creationOptions,
  loadDashboardData,
  displaySuccessToast,
  setAddProductModal,
  setDeleteModal,
  setAddSizeModal,
  onEditSize,
  onDeleteSize,
  setFruitsModal,
  setSaucesModal,
  setCerealesModal
}: ProductsTabProps) {
  const productCategoriesHook = useProductCategories();
  // Utilisation des hooks personnalisés
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    sortBy,
    setSortBy,
    filteredAndSortedProducts,
    resetFilters
  } = useProductFilters(allProductsForTab);

  const {
    productCategories,
    addCategoryModal,
    setAddCategoryModal,
    editingCategory,
    setEditingCategory,
    deleteCategoryModal,
    handleAddCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleConfirmDeleteCategory,
    handleCancelDeleteCategory,
    handleToggleCategoryStatus
  } = useProductCategories(displaySuccessToast);

  const {
    editingProduct,
    setEditingProduct,
    handleToggleAvailability,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct
  } = useProductOperations(loadDashboardData, displaySuccessToast);

  const handleDeleteProductClick = (product: Product) => {
    setDeleteModal({ isOpen: true, item: product, type: 'product' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Gestion des produits</h2>

      {/* Statistiques produits */}
      <ProductStats
        allProducts={allProductsForTab}
        productCategories={productCategories}
      />

      <div className="space-y-4">

        {/* Filtres avancés */}
        <ProductFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          productCount={filteredAndSortedProducts.length}
          productCategories={productCategories}
          onReset={resetFilters}
        />
      </div>

      {/* Gestion des catégories */}
      <CategoryManagement
        productCategories={productCategories}
        onAddCategory={() => setAddCategoryModal(true)}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onToggleCategoryStatus={handleToggleCategoryStatus}
      />

      {/* Modal de suppression de catégorie */}
      <Modal isOpen={deleteCategoryModal.isOpen} onClose={handleCancelDeleteCategory}>
        <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
          <p className="text-muted-foreground mb-6">
            Êtes-vous sûr de vouloir supprimer la catégorie "{deleteCategoryModal.category?.name}" ?
            Cette action est irréversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancelDeleteCategory}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmDeleteCategory}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>

      {/* Gestion des options de création */}
      <CreationOptionsManagement
        creationSizes={creationSizes}
        creationOptions={creationOptions}
        onAddSize={() => setAddSizeModal(true)}
        onEditSize={onEditSize}
        onDeleteSize={onDeleteSize}
        onFruitsModal={() => setFruitsModal(true)}
        onSaucesModal={() => setSaucesModal(true)}
        onCerealesModal={() => setCerealesModal(true)}
      />

      {/* Bouton ajouter un produit */}
      <div className="flex sm:justify-start md:justify-end">
        <button
          onClick={() => setAddProductModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Liste des produits */}
      <ProductList
        products={filteredAndSortedProducts}
        productCategories={productCategories}
        creationOptions={creationOptions}
        onEditProduct={handleEditProduct}
        onToggleAvailability={handleToggleAvailability}
        onDeleteProduct={handleDeleteProductClick}
      />

      {/* Modal d'édition */}
      <ProductEditModal
        editingProduct={editingProduct}
        productCategories={productCategories}
        onSave={handleSaveProduct}
        onCancel={() => setEditingProduct(null)}
      />

      {/* Modal d'ajout/modification de catégorie */}
      <CategoryModal
        isOpen={addCategoryModal}
        onClose={() => setAddCategoryModal(false)}
        onSave={handleAddCategory}
        mode="add"
      />

      <CategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        mode="edit"
      />
    </div>
  );
}