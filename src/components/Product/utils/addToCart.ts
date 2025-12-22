import { CreationSize } from '@/types';
import { AppAction } from '@/contexts/appContextHelpers';
import { LocalCreationOptions, CreationConfig } from '../hooks/useCustomCreation';
import { siteService } from '@/services';

const AVATAR_TOAST_FALLBACK = `${import.meta.env.VITE_API_URL}/uploads/avatarToast/milna-owner.jpg`;

const getAvatarToast = async (): Promise<string> => {
  try {
    const response = await siteService.getAvatarToast();
    return `${import.meta.env.VITE_API_URL}${(response.data as { image: string }).image}`;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'avatar toast:', error);
    return AVATAR_TOAST_FALLBACK;
  }
};

export async function addCustomCreationToCart(
  creation: LocalCreationOptions,
  config: CreationConfig,
  creationSizes: CreationSize[],
  dispatch: React.Dispatch<AppAction>
) {
  try {
    // Trouver la taille sélectionnée pour obtenir son ID
    const selectedSize = creationSizes.find(size => size.nom === creation.size);
    if (!selectedSize) {
      throw new Error('Taille non trouvée');
    }

    // Créer l'élément pour le state local
    const name = `Gourmet Création ${creation.size.charAt(0).toUpperCase() + creation.size.slice(1)}`;
    const description = [
      `Fruits: ${creation.fruits.join(', ') || 'Aucun'}`,
      `Sauces: ${creation.sauces.join(', ') || 'Aucune'}`,
      `Céréales: ${creation.cereales.join(', ') || 'Aucune'}`
    ].join(' • ');

    const cartItem = {
      id: `creation-temp-${Date.now()}`, // ID temporaire, sera remplacé lors du refresh du panier
      name,
      description,
      price: config.price,
      quantity: creation.quantity,
      image: '/src/assets/creation/yogurt-creation.jpg',
      customCreation: {
        size: selectedSize,
        selectedFruits: creation.fruits,
        selectedSauces: creation.sauces,
        selectedCereales: creation.cereales,
        totalPrice: config.price * creation.quantity
      }
    };

    // Vérifier si l'utilisateur est connecté
    const { httpClient } = await import('@/services/httpClient');
    const isLoggedIn = httpClient.hasToken();

    if (isLoggedIn) {
      // Utilisateur connecté : ajouter via l'API backend
      const { cartService } = await import('@/services/cart');
      await cartService.addCustomCreation({
        tailleId: selectedSize.id,
        quantity: creation.quantity,
        price: config.price,
        fruits: creation.fruits.length > 0 ? creation.fruits : undefined,
        sauces: creation.sauces.length > 0 ? creation.sauces : undefined,
        cereales: creation.cereales.length > 0 ? creation.cereales : undefined
      });
    }
    // Pour les invités, l'ajout au localStorage est géré par le cartReducer

    // Ajouter au state local
    dispatch({
      type: 'ADD_TO_CART',
      payload: cartItem
    });

    const avatarUrl = await getAvatarToast();
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        message: `Gourmet Création ajouté au panier.`,
        avatar: avatarUrl
      }
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la création personnalisée:', error);
    const avatarUrl = await getAvatarToast();
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'error',
        message: 'Erreur lors de l\'ajout au panier. Veuillez réessayer.',
        avatar: avatarUrl
      }
    });
    return false;
  }
}