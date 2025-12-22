import { useState } from 'react';
import { Product } from '@/types';
import { productService } from '@/services';

export function useProductOperations(
  loadDashboardData: () => Promise<void>,
  displaySuccessToast: (message: string) => void
) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleToggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      formData.append('disponible', (!currentStatus).toString());
      await productService.updateProduct(productId, formData);
      await loadDashboardData();
      displaySuccessToast(`Produit ${!currentStatus ? 'activé' : 'désactivé'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut du produit. Veuillez réessayer.');
    }
  };


  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (updatedProduct: Product, imageFile?: File) => {
    try {
      const formData = new FormData();
      formData.append('nom', updatedProduct.name);
      formData.append('description', updatedProduct.description || '');
      formData.append('prix', updatedProduct.price.toString());
      
      // Convertir l'ID de catégorie (string) en nombre pour categorieId
      const categoryId = updatedProduct.category ? parseInt(updatedProduct.category, 10) : undefined;
      
      // Mapping des IDs de catégorie vers les valeurs enum du backend (fallback)
      const categoryMapping: { [key: string]: string } = {
        '1': 'CREMEUX',  // Crèmeux
        '2': 'LIQUIDE',  // Liquide
        '3': 'CREATION'  // Création
      };

      // Déterminer la valeur enum de la catégorie
      const categoryValue = updatedProduct.category ? categoryMapping[updatedProduct.category] || 'CREMEUX' : 'CREMEUX';
      
      formData.append('categorie', categoryValue);
      if (categoryId && !isNaN(categoryId)) {
        formData.append('categorieId', categoryId.toString());
      }
      formData.append('disponible', updatedProduct.available.toString());
      
      // Traiter l'image si un fichier est uploadé
      if (imageFile) {
        try {
          // Uploader l'image via l'endpoint backend
          const uploadResult = await productService.uploadImage(imageFile);
          formData.append('image', uploadResult.path); // Le backend retourne le chemin /src/assets/nom_image
          console.log('Image uploadée avec succès:', uploadResult.path);
        } catch (error) {
          console.error('Erreur lors de l\'upload de l\'image:', error);
          // En cas d'erreur, on continue avec le chemin existant ou vide
          if (updatedProduct.image) {
            formData.append('image', updatedProduct.image);
          }
        }
      } else if (updatedProduct.image) {
        // Si pas de nouveau fichier, utiliser l'image existante
        formData.append('image', updatedProduct.image);
      }
      
      await productService.updateProduct(updatedProduct.id, formData);
      setEditingProduct(null);
      await loadDashboardData();
      displaySuccessToast(`Produit "${updatedProduct.name}" modifié avec succès`);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDeleteProduct = (product: Product) => {
    // This would typically open a delete confirmation modal
    // For now, we'll just log it
    console.log('Delete product:', product);
  };

  return {
    editingProduct,
    setEditingProduct,
    handleToggleAvailability,
    handleEditProduct,
    handleSaveProduct,
    handleDeleteProduct
  };
}