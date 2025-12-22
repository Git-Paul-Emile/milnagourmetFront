import React from 'react';
import { Product } from '@/types';
import { ProductBasicFields } from './ProductBasicFields';
import { ProductImageSection } from './ProductImageSection';
import { ProductAvailabilitySection } from './ProductAvailabilitySection';
import { AddProductModalActions } from './AddProductModalActions';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  imageUploadMode: 'dropdown' | 'upload';
  setImageUploadMode: (mode: 'dropdown' | 'upload') => void;
  uploadedImageFile: File | null;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableImages: Array<{ value: string; label: string }>;
  productCategories: Array<{ id: string; name: string; active: boolean }>;
  onAddProduct: () => void;
}

export function AddProductModal({
  isOpen,
  onClose,
  newProduct,
  setNewProduct,
  imageUploadMode,
  setImageUploadMode,
  uploadedImageFile,
  handleImageFileChange,
  availableImages,
  productCategories,
  onAddProduct
}: AddProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau produit</h3>

        <div className="space-y-4">
          <ProductBasicFields
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            productCategories={productCategories}
          />

          <ProductImageSection
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            imageUploadMode={imageUploadMode}
            setImageUploadMode={setImageUploadMode}
            uploadedImageFile={uploadedImageFile}
            handleImageFileChange={handleImageFileChange}
            availableImages={availableImages}
          />

          <ProductAvailabilitySection
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />
        </div>

        <AddProductModalActions
          onClose={onClose}
          onAddProduct={onAddProduct}
          newProduct={newProduct}
        />
      </div>
    </div>
  );
}