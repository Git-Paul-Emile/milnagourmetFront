import React from 'react';
import { Product, ProductCategoryItem } from '@/types';
import { useProductForm } from './hooks/useProductForm';
import { useImageUpload } from './hooks/useImageUpload';
import { ProductNameField, ProductDescriptionField, ProductPriceField, ProductCategoryField, ProductAvailableField, ProductImageSection } from './components';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Partial<Product>, imageFile?: File, productCategories?: ProductCategoryItem[]) => void;
  productCategories: ProductCategoryItem[];
}

export function AddProductModal({ isOpen, onClose, onAdd, productCategories }: AddProductModalProps) {
  const { newProduct, fieldErrors, updateProduct, validateProduct, resetProduct } = useProductForm();
  const { imageUploadMode, setImageUploadMode, uploadedImageFile, availableImages, handleImageFileChange, resetImage } = useImageUpload();

  const handleSubmit = () => {
    if (!validateProduct()) {
      return;
    }
    onAdd(newProduct, uploadedImageFile || undefined, productCategories);
    resetProduct();
    resetImage();
    onClose();
  };

  const handleClose = () => {
    resetProduct();
    resetImage();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau produit</h3>

        <div className="space-y-4">
          <ProductNameField value={newProduct.name || ''} onChange={(value) => updateProduct({ name: value })} error={fieldErrors.name} />

          <ProductDescriptionField value={newProduct.description || ''} onChange={(value) => updateProduct({ description: value })} error={fieldErrors.description} />

          <div className="grid grid-cols-2 gap-4">
            <ProductPriceField value={newProduct.price || 0} onChange={(value) => updateProduct({ price: value })} error={fieldErrors.price} />

            <ProductCategoryField value={newProduct.category || ''} onChange={(value) => updateProduct({ category: value })} productCategories={productCategories} error={fieldErrors.category} />
          </div>

          <ProductImageSection
            imageUploadMode={imageUploadMode}
            setImageUploadMode={setImageUploadMode}
            image={newProduct.image || ''}
            updateProduct={updateProduct}
            uploadedImageFile={uploadedImageFile}
            availableImages={availableImages}
            handleImageFileChange={(e) => handleImageFileChange(e, updateProduct)}
          />

          <ProductAvailableField value={newProduct.available || false} onChange={(value) => updateProduct({ available: value })} />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ajouter le produit
          </button>
        </div>
      </div>
    </div>
  );
}