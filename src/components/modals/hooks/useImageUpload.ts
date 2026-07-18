import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { productService } from '@/services';
import {
  DEFAULT_CREATION_IMAGE,
  DEFAULT_BANNER_IMAGE,
  DEFAULT_PRODUCT_NATURE_IMAGE,
  DEFAULT_PRODUCT_LIQUID_IMAGE
} from '@/constants/media';

export function useImageUpload() {
  const [imageUploadMode, setImageUploadMode] = useState<'dropdown' | 'upload'>('dropdown');
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [availableImages, setAvailableImages] = useState<{ value: string; label: string; isUsed: boolean }[]>([]);

  // Charger les images disponibles depuis l'API
  useEffect(() => {
    const loadImages = async () => {
      try {
        const images = await productService.getAvailableImages();
        setAvailableImages(images);
      } catch (error) {
        console.error('Erreur lors du chargement des images:', error);
        // Fallback vers une liste par défaut en cas d'erreur
        setAvailableImages([
          { value: DEFAULT_PRODUCT_NATURE_IMAGE, label: 'Yaourt Nature', isUsed: false },
          { value: DEFAULT_PRODUCT_LIQUID_IMAGE, label: 'Yaourt Liquide', isUsed: false },
          { value: DEFAULT_CREATION_IMAGE, label: 'Création Personnalisée', isUsed: false },
          { value: DEFAULT_BANNER_IMAGE, label: 'Bannière Héro', isUsed: false }
        ]);
      }
    };
    loadImages();
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, updateProduct: (updates: Partial<Product>) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      updateProduct({ image: previewUrl });
    }
  };

  const resetImage = useCallback(() => {
    setUploadedImageFile(null);
  }, []);

  return {
    imageUploadMode,
    setImageUploadMode,
    uploadedImageFile,
    availableImages,
    handleImageFileChange,
    resetImage
  };
}