import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/useApp';
import { deliveryZoneService } from '@/services/deliveryZone';
import { DeliveryZone } from '@/types';
import { AuthMode, FormData, FieldErrors } from '../types/authTypes';
import { validateForm } from '../utils/authValidation';

interface UseAuthFormProps {
  initialMode: AuthMode;
  onClose: () => void;
}

export const useAuthForm = ({ initialMode, onClose }: UseAuthFormProps) => {
  const { login, register } = useAuth();
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
    nomComplet: '',
    telephone: '',
    zoneLivraison: ''
  });

  useEffect(() => {
    setMode(initialMode);
    resetForm();
  }, [initialMode]);

  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        const zones = await deliveryZoneService.getAllActive();
        setDeliveryZones(zones as DeliveryZone[]);
      } catch (error) {
        console.error('Erreur lors du chargement des zones de livraison:', error);
        setDeliveryZones([]);
      }
    };

    fetchDeliveryZones();
  }, []);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
    // Effacer l'erreur globale si elle était affichée pour ce champ
    if (field === 'telephone' && globalError) {
      setGlobalError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(mode, formData);
    setFieldErrors(errors);
    setGlobalError('');
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    setGlobalError('');

    try {
      // Récupérer le panier guest depuis useLocalCart (utile pour l'inscription et la connexion)
      const { getLocalCartItems, clearLocalCart: clearCart } = await import('@/hooks/useLocalCart');
      const clearLocalCart = clearCart;
      const guestCartItems = getLocalCartItems();
      const parsedGuestCart = guestCartItems.length > 0 ? guestCartItems : undefined;

      let response;
      if (mode === 'register') {
        response = await register({
          telephone: formData.telephone,
          nomComplet: formData.nomComplet,
          zoneLivraisonId: formData.zoneLivraison, // Le formulaire stocke maintenant l'ID
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          guestCart: parsedGuestCart
        });
      } else {
        response = await login({
          telephone: formData.telephone,
          password: formData.password,
          guestCart: parsedGuestCart
        });
      }

      // Mettre à jour l'AppContext avec les informations utilisateur
      if (response?.data?.user) {
        dispatch({
          type: 'SET_USER',
          payload: response.data.user
        });

        // Charger le panier fusionné (invité + existant) depuis le backend
        try {
          const { cartService } = await import('@/services/cart');
          const backendCart = await cartService.getCart();

          if (backendCart) {
            // Convertir le panier backend au format frontend
            const frontendCartItems = backendCart.items.map(item => ({
              id: item.id.includes('creation') ? item.id : `${item.id}-${Date.now()}`, // Ajouter timestamp pour les produits réguliers
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              description: item.description,
              product: item.product,
              customCreation: item.customCreation
            }));

            // Calculer les totaux
            const { calculateCartTotals, calculateDeliveryFee } = await import('@/contexts/appContextHelpers');
            const deliveryFee = await calculateDeliveryFee(response.data.user);

            // Remplacer le panier actuel par le panier fusionné
            dispatch({ type: 'SET_CART_ITEMS', payload: frontendCartItems });
            // Mettre à jour les frais de livraison
            dispatch({ type: 'UPDATE_DELIVERY_FEE', payload: deliveryFee });
          }

          // Le panier guest a été fusionné côté backend, on peut vider le localStorage
          clearLocalCart();
        } catch (cartError) {
          console.error('Erreur lors du chargement du panier fusionné:', cartError);
          // En cas d'erreur, vider quand même le panier guest
          clearLocalCart();
        }
      }

      onClose();
      resetForm();

      if (mode === 'login' && response?.data?.user?.role === 'ADMIN') {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Erreur lors de la connexion:', error);
      const message = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';

      // Vérifier si l'erreur concerne un numéro de téléphone déjà existant
      if (message.includes('téléphone')) {
        setFieldErrors({ telephone: message });
        setGlobalError('');
      } else {
        setGlobalError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      password: '',
      confirmPassword: '',
      nomComplet: '',
      telephone: '',
      zoneLivraison: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFieldErrors({});
    setGlobalError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  return {
    mode,
    formData,
    showPassword,
    showConfirmPassword,
    isLoading,
    deliveryZones,
    fieldErrors,
    globalError,
    handleInputChange,
    handleSubmit,
    resetForm,
    switchMode,
    setShowPassword,
    setShowConfirmPassword
  };
};