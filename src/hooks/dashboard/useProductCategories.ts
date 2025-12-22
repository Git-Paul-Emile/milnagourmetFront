import { useState, useEffect } from 'react';
import { ProductCategoryItem } from '../../types';
import { productService } from '../../services';

export function useProductCategories(displaySuccessToast?: (message: string) => void) {
  const [productCategories, setProductCategories] = useState<ProductCategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null>(null);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState<{ isOpen: boolean; category?: ProductCategoryItem }>({ isOpen: false });
  const [newCategory, setNewCategory] = useState<Partial<ProductCategoryItem>>({
    name: '',
    description: '',
    active: true
  });

  // Charger les catégories depuis l'API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductCategories();
      setProductCategories((response.data as ProductCategoryItem[]) || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData: Partial<ProductCategoryItem>) => {
    try {
      const categoryToCreate = {
        name: categoryData.name || '',
        description: categoryData.description || '',
        active: categoryData.active ?? true,
        createdAt: new Date().toISOString()
      };

      const response = await productService.createProductCategory(categoryToCreate);
      setProductCategories(prev => [...prev, response.data as ProductCategoryItem]);

      setNewCategory({
        name: '',
        description: '',
        active: true
      });
      setAddCategoryModal(false);
      
      // Afficher le toast de succès
      if (displaySuccessToast) {
        displaySuccessToast(`Catégorie "${categoryToCreate.name}" créée avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      alert('Erreur lors de la création de la catégorie');
    }
  };

  const handleEditCategory = (category: ProductCategoryItem) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = async (categoryData: Partial<ProductCategoryItem>) => {
    if (!editingCategory) return;

    try {
      const updateData: { nom?: string; description?: string; active?: boolean } = {};
      if (categoryData.name) updateData.nom = categoryData.name;
      if (categoryData.description !== undefined) updateData.description = categoryData.description;
      if (categoryData.active !== undefined) updateData.active = categoryData.active;

      await productService.updateProductCategory(editingCategory.id, updateData);

      // Recharger les catégories
      await loadCategories();
      setEditingCategory(null);

      // Afficher le toast de succès
      if (displaySuccessToast) {
        displaySuccessToast(`Catégorie "${categoryData.name || editingCategory.name}" mise à jour avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      alert('Erreur lors de la mise à jour de la catégorie');
    }
  };

  const handleDeleteCategory = (category: ProductCategoryItem) => {
    setDeleteCategoryModal({ isOpen: true, category });
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryModal.category) return;

    try {
      await productService.deleteProductCategory(deleteCategoryModal.category.id);
      setProductCategories(prev => prev.filter(cat => cat.id !== deleteCategoryModal.category!.id));
      setDeleteCategoryModal({ isOpen: false });
      if (displaySuccessToast) {
        displaySuccessToast(`Catégorie "${deleteCategoryModal.category.name}" supprimée avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      alert('Erreur lors de la suppression de la catégorie');
    }
  };

  const handleCancelDeleteCategory = () => {
    setDeleteCategoryModal({ isOpen: false });
  };

  const handleToggleCategoryStatus = async (categoryId: number, currentStatus: boolean) => {
    try {
      await productService.updateProductCategory(categoryId, { active: !currentStatus });
      setProductCategories(prev => prev.map(cat =>
        cat.id === categoryId ? { ...cat, active: !currentStatus } : cat
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la catégorie:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  return {
    productCategories,
    setProductCategories,
    loading,
    addCategoryModal,
    setAddCategoryModal,
    editingCategory,
    setEditingCategory,
    deleteCategoryModal,
    setDeleteCategoryModal,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleEditCategory,
    handleSaveCategory,
    handleDeleteCategory,
    handleConfirmDeleteCategory,
    handleCancelDeleteCategory,
    handleToggleCategoryStatus,
    loadCategories
  };
}