import React from 'react';
import { Product } from '@/types';

interface ProductImageSectionProps {
  imageUploadMode: 'dropdown' | 'upload';
  setImageUploadMode: (mode: 'dropdown' | 'upload') => void;
  image: string;
  updateProduct: (updates: Partial<Product>) => void;
  uploadedImageFile: File | null;
  availableImages: { value: string; label: string }[];
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProductImageSection({
  imageUploadMode,
  setImageUploadMode,
  image,
  updateProduct,
  uploadedImageFile,
  availableImages,
  handleImageFileChange
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

      {/* Galerie d'images existantes */}
      {imageUploadMode === 'dropdown' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
          {availableImages.map((img) => (
            <div
              key={img.value}
              onClick={() => updateProduct({ image: img.value })}
              className={
                image === img.value
                  ? 'cursor-pointer border-2 rounded-lg p-2 transition-colors border-primary'
                  : 'cursor-pointer border-2 rounded-lg p-2 transition-colors border-border hover:border-primary/50'
              }
            >
              <img
                src={img.value}
                alt={img.label}
                className="w-full h-20 object-cover rounded"
              />
              <p className="text-xs text-center mt-1 truncate">{img.label}</p>
            </div>
          ))}
        </div>
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
      {image && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-2">Aperçu:</p>
          <img
            src={image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
        </div>
      )}
    </div>
  );
}