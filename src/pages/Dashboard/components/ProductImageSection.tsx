import React from 'react';
import { Product } from '@/types';

interface ProductImageSectionProps {
  newProduct: Partial<Product>;
  setNewProduct: (product: Partial<Product>) => void;
  imageUploadMode: 'dropdown' | 'upload';
  setImageUploadMode: (mode: 'dropdown' | 'upload') => void;
  uploadedImageFile: File | null;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  availableImages: Array<{ value: string; label: string }>;
}

export function ProductImageSection({
  newProduct,
  setNewProduct,
  imageUploadMode,
  setImageUploadMode,
  uploadedImageFile,
  handleImageFileChange,
  availableImages
}: ProductImageSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Image du produit</label>

      {/* Choix du mode d'upload */}
      <div className="flex space-x-4 mb-3">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="imageMode"
            checked={imageUploadMode === 'dropdown'}
            onChange={() => setImageUploadMode('dropdown')}
          />
          <span className="text-sm">Sélectionner une image existante</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="imageMode"
            checked={imageUploadMode === 'upload'}
            onChange={() => setImageUploadMode('upload')}
          />
          <span className="text-sm">Télécharger une nouvelle image</span>
        </label>
      </div>

      {/* Dropdown pour images existantes */}
      {imageUploadMode === 'dropdown' && (
        <select
          value={newProduct.image || ''}
          onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
          className="w-full p-2 border border-border rounded-lg"
        >
          <option value="">Choisir une image...</option>
          {availableImages.map((img) => (
            <option key={img.value} value={img.value}>
              {img.label}
            </option>
          ))}
        </select>
      )}

      {/* Upload d'image */}
      {imageUploadMode === 'upload' && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="w-full p-2 border border-border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {uploadedImageFile && (
            <p className="text-sm text-muted-foreground mt-1">
              Fichier sélectionné: {uploadedImageFile.name}
            </p>
          )}
        </div>
      )}

      {/* Preview de l'image */}
      {newProduct.image && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-2">Aperçu:</p>
          <img
            src={newProduct.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
        </div>
      )}
    </div>
  );
}