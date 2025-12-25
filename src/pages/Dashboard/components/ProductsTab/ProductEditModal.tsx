import React, { useState, useEffect } from 'react';
import { Product, ProductCategoryItem } from '@/types';
import { useImageUpload } from '@/components/modals/hooks/useImageUpload';
import { ProductImageSection } from '@/components/modals/components/ProductImageSection';

interface ProductEditModalProps {
  editingProduct: Product | null;
  productCategories: ProductCategoryItem[];
  onSave: (product: Product, imageFile?: File) => void;
  onCancel: () => void;
}

export function ProductEditModal({
  editingProduct,
  productCategories,
  onSave,
  onCancel
}: ProductEditModalProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const { imageUploadMode, setImageUploadMode, uploadedImageFile, availableImages, handleImageFileChange, resetImage } = useImageUpload();

  useEffect(() => {
    if (editingProduct) {
      // Utiliser categoryId si disponible, sinon chercher la catégorie correspondante par son nom
      let categoryId = editingProduct.categoryId || '';
      
      if (!categoryId) {
        // Trouver la catégorie correspondante par son nom
        const categoryName = editingProduct.category?.toLowerCase();
        
        // Chercher la catégorie correspondante dans la liste des catégories
        const matchingCategory = productCategories.find(cat => {
          const catName = cat.name.toLowerCase();
          return catName === categoryName || catName.includes(categoryName) || categoryName?.includes(catName);
        });
        
        if (matchingCategory) {
          categoryId = matchingCategory.id.toString();
        } else {
          // Fallback: utiliser le nom de la catégorie directement
          categoryId = editingProduct.category || '';
        }
      }
      
      setFormData({ 
        ...editingProduct,
        category: categoryId 
      });
      // Réinitialiser l'image seulement quand le produit change
      resetImage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct, productCategories]); // Retirer resetImage des dépendances

  if (!editingProduct || !formData) return null;

  const handleSave = () => {
    if (formData) {
      onSave(formData, uploadedImageFile || undefined);
    }
  };

  const handleCancel = () => {
    resetImage();
    onCancel();
  };

  const updateFormData = (updates: Partial<Product>) => {
    setFormData(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleImageFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageFileChange(e, updateFormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Modifier le produit</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full p-2 border border-border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="w-full p-2 border border-border rounded-lg h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => updateFormData({ price: parseInt(e.target.value) || 0 })}
                className="w-full p-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData({ category: e.target.value })}
                className="w-full p-2 border border-border rounded-lg"
              >
                <option value="">Choisir une catégorie...</option>
                {productCategories.filter(cat => cat.active).map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section Image */}
          <ProductImageSection
            imageUploadMode={imageUploadMode}
            setImageUploadMode={setImageUploadMode}
            image={formData.image || ''}
            updateProduct={updateFormData}
            uploadedImageFile={uploadedImageFile}
            availableImages={availableImages}
            handleImageFileChange={handleImageFileChangeWrapper}
          />

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => updateFormData({ available: e.target.checked })}
              />
              <span className="text-sm">Activé</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}