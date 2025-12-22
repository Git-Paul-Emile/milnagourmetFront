import { useState } from 'react';
import { Product, User as UserType, DeliveryZone, DeliveryPerson, ProductCategoryItem, CreationSize } from '@/types';
import { productService, userService } from '@/services';
import { deliveryPersonService } from '@/services/deliveryPerson';
import { siteService } from '@/services/siteService';

interface ImageItem {
  value: string;
  label: string;
}

export interface DashboardModalsState {
  // États pour les modals et messages
  deleteModal: { isOpen: boolean; item?: Product | UserType | DeliveryPerson | ImageItem; type: 'product' | 'user' | 'deliveryPerson' | 'image' };
  addProductModal: boolean;
  addSizeModal: boolean;
  fruitsModal: boolean;
  saucesModal: boolean;
  cerealesModal: boolean;

  // États pour les modals de zones et livreurs
  addZoneModal: boolean;
  editingZone: DeliveryZone | null;
  addDeliveryPersonModal: boolean;
  editingDeliveryPerson: DeliveryPerson | null;
  deliveryPersonZonesInput: string[];

  // États pour les modals de tailles
  editingSize: CreationSize | null;

  // États pour les nouveaux produits
  newProduct: Partial<Product>;
  imageUploadMode: 'dropdown' | 'upload';
  uploadedImageFile: File | null;
  editImageUploadMode: 'dropdown' | 'upload';
  editUploadedImageFile: File | null;
  successMessage: string;
  isSuccessToastVisible: boolean;
}

export interface DashboardModalsActions {
  // Actions pour les modals
  setDeleteModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; item?: Product | UserType | DeliveryPerson | ImageItem; type: 'product' | 'user' | 'deliveryPerson' | 'image' }>>;
  setAddProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAddSizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setFruitsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSaucesModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCerealesModal: React.Dispatch<React.SetStateAction<boolean>>;

  // Actions pour les zones et livreurs
  setAddZoneModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingZone: React.Dispatch<React.SetStateAction<DeliveryZone | null>>;
  setAddDeliveryPersonModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingDeliveryPerson: React.Dispatch<React.SetStateAction<DeliveryPerson | null>>;
  setDeliveryPersonZonesInput: React.Dispatch<React.SetStateAction<string[]>>;

  // Actions pour les tailles
  setEditingSize: React.Dispatch<React.SetStateAction<CreationSize | null>>;

  // Actions pour les produits
  setNewProduct: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  setImageUploadMode: React.Dispatch<React.SetStateAction<'dropdown' | 'upload'>>;
  setUploadedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setEditImageUploadMode: React.Dispatch<React.SetStateAction<'dropdown' | 'upload'>>;
  setEditUploadedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsSuccessToastVisible: React.Dispatch<React.SetStateAction<boolean>>;

  // Fonctions utilitaires
  displaySuccessToast: (message: string) => void;
  confirmDelete: () => Promise<void>;
  handleAddProduct: (product: Partial<Product>, imageFile?: File, productCategories?: ProductCategoryItem[]) => Promise<void>;
}

export const useDashboardModals = (loadDashboardData?: () => Promise<void>, reloadGallery?: () => Promise<void>): DashboardModalsState & DashboardModalsActions => {
  // États pour les modals et messages
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item?: Product | UserType | DeliveryPerson | ImageItem; type: 'product' | 'user' | 'deliveryPerson' | 'image' }>({ isOpen: false, type: 'product' });
  const [addProductModal, setAddProductModal] = useState(false);
  const [addSizeModal, setAddSizeModal] = useState(false);
  const [fruitsModal, setFruitsModal] = useState(false);
  const [saucesModal, setSaucesModal] = useState(false);
  const [cerealesModal, setCerealesModal] = useState(false);

  // États pour les modals de zones et livreurs
  const [addZoneModal, setAddZoneModal] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [addDeliveryPersonModal, setAddDeliveryPersonModal] = useState(false);
  const [editingDeliveryPerson, setEditingDeliveryPerson] = useState<DeliveryPerson | null>(null);
  const [deliveryPersonZonesInput, setDeliveryPersonZonesInput] = useState<string[]>([]);

  // États pour les modals de tailles
  const [editingSize, setEditingSize] = useState<CreationSize | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'cremeux',
    available: true,
    image: ''
  });
  const [imageUploadMode, setImageUploadMode] = useState<'dropdown' | 'upload'>('dropdown');
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [editImageUploadMode, setEditImageUploadMode] = useState<'dropdown' | 'upload'>('dropdown');
  const [editUploadedImageFile, setEditUploadedImageFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSuccessToastVisible, setIsSuccessToastVisible] = useState(false);

  // Fonctions utilitaires
  const displaySuccessToast = (message: string) => {
    setSuccessMessage(message);
    setIsSuccessToastVisible(true);
    setTimeout(() => setIsSuccessToastVisible(false), 3000);
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      if (deleteModal.type === 'product') {
        await productService.deleteProduct((deleteModal.item as Product).id);
        displaySuccessToast('Produit supprimé avec succès');
      } else if (deleteModal.type === 'user') {
        await userService.deleteUser((deleteModal.item as UserType).id);
        displaySuccessToast('Client supprimé avec succès');
      } else if (deleteModal.type === 'deliveryPerson') {
        await deliveryPersonService.delete((deleteModal.item as DeliveryPerson).id);
        displaySuccessToast('Livreur supprimé avec succès');
      } else if (deleteModal.type === 'image') {
        const filename = (deleteModal.item as ImageItem).value;
        if (filename) {
          await siteService.deleteImage(filename);
          displaySuccessToast('Image supprimée avec succès');
          // Reload gallery after image deletion
          if (reloadGallery) {
            await reloadGallery();
          }
        }
      }

      setDeleteModal({ isOpen: false, type: 'product' });

      // Reload dashboard data after deletion
      if (loadDashboardData) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      // You might want to show an error toast here
    }
  };

  const handleAddProduct = async (product: Partial<Product>, imageFile?: File, productCategories?: ProductCategoryItem[]) => {
    try {
      // Convertir l'ID de catégorie (string) en nombre pour categorieId
      const categoryId = product.category ? parseInt(product.category, 10) : undefined;
      
      // Mapping des IDs de catégorie vers les valeurs enum du backend (fallback)
      const categoryMapping: { [key: string]: string } = {
        '1': 'CREMEUX',  // Crèmeux
        '2': 'LIQUIDE',  // Liquide
        '3': 'CREATION'  // Création
      };

      // Déterminer la valeur enum de la catégorie
      const categoryValue = product.category ? categoryMapping[product.category] || 'CREMEUX' : 'CREMEUX';

      // Traiter l'image si un fichier est uploadé
      let imagePath = product.image || '';
      if (imageFile) {
        try {
          // Uploader l'image via l'endpoint backend
          const uploadResult = await productService.uploadImage(imageFile);
          imagePath = uploadResult.path; // Le backend retourne le chemin /src/assets/nom_image
          console.log('Image uploadée avec succès:', imagePath);
        } catch (error) {
          console.error('Erreur lors de l\'upload de l\'image:', error);
          // En cas d'erreur, on continue avec le chemin existant ou vide
        }
      }

      const productData = {
        nom: product.name || '',
        description: product.description || '',
        prix: product.price || 0,
        categorie: categoryValue,
        categorieId: categoryId && !isNaN(categoryId) ? categoryId : undefined,
        disponible: product.available ?? true,
        image: imagePath
      };

      console.log('Données du produit à créer:', productData);

      await productService.createProduct(productData);
      displaySuccessToast('Produit ajouté avec succès');
      setAddProductModal(false);
      if (loadDashboardData) {
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      // You might want to show an error toast here
    }
  };

  return {
    // États
    deleteModal,
    addProductModal,
    addSizeModal,
    fruitsModal,
    saucesModal,
    cerealesModal,
    addZoneModal,
    editingZone,
    addDeliveryPersonModal,
    editingDeliveryPerson,
    deliveryPersonZonesInput,
    editingSize,
    newProduct,
    imageUploadMode,
    uploadedImageFile,
    editImageUploadMode,
    editUploadedImageFile,
    successMessage,
    isSuccessToastVisible,

    // Actions
    setDeleteModal,
    setAddProductModal,
    setAddSizeModal,
    setFruitsModal,
    setSaucesModal,
    setCerealesModal,
    setAddZoneModal,
    setEditingZone,
    setAddDeliveryPersonModal,
    setEditingDeliveryPerson,
    setDeliveryPersonZonesInput,
    setEditingSize,
    setNewProduct,
    setImageUploadMode,
    setUploadedImageFile,
    setEditImageUploadMode,
    setEditUploadedImageFile,
    setSuccessMessage,
    setIsSuccessToastVisible,

    // Fonctions utilitaires
    displaySuccessToast,
    confirmDelete,
    handleAddProduct
  };
};