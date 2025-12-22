import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';
import { productService } from '@/services';

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
          { value: '/uploads/produits/yogurt-nature.jpg', label: 'Yaourt Nature', isUsed: false },
          { value: '/uploads/produits/yogurt-liquid.jpg', label: 'Yaourt Liquide', isUsed: false },
          { value: '/uploads/creation/yogurt-creation.jpg', label: 'Création Personnalisée', isUsed: false },
          { value: '/uploads/banners/hero-banner.jpg', label: 'Bannière Héro', isUsed: false }
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