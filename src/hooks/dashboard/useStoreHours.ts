import { useState, useEffect } from 'react';
import { StoreHours } from '@/types';
import { siteService } from '@/services/siteService';
import { ApiResponse } from '@/services/httpClient';

export interface UseStoreHoursReturn {
  storeHours: StoreHours[];
  editingHours: StoreHours[];
  setStoreHours: React.Dispatch<React.SetStateAction<StoreHours[]>>;
  setEditingHours: React.Dispatch<React.SetStateAction<StoreHours[]>>;
  handleUpdateStoreHours: (hours: StoreHours[]) => Promise<void>;
  handleHourChange: (dayIndex: number, field: 'open' | 'close', value: string) => void;
  handleClosedChange: (dayIndex: number, closed: boolean) => void;
  handleInitializeHours: () => void;
  loading: boolean;
}

export const useStoreHours = (): UseStoreHoursReturn => {
  const [storeHours, setStoreHours] = useState<StoreHours[]>([]);
  const [editingHours, setEditingHours] = useState<StoreHours[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les horaires depuis l'API
  useEffect(() => {
    const loadStoreHours = async () => {
      try {
        setLoading(true);
        const response = await siteService.getStoreHours();
        const hoursFromAPI: StoreHours[] = (response as ApiResponse<StoreHours[]>).data || [];
        setStoreHours(hoursFromAPI);
      } catch (error) {
        console.error('Erreur lors du chargement des horaires:', error);
        // En cas d'erreur, laisser storeHours vide
        setStoreHours([]);
      } finally {
        setLoading(false);
      }
    };

    loadStoreHours();
  }, []);

  // Synchroniser editingHours avec storeHours quand ils changent
  useEffect(() => {
    if (storeHours.length > 0) {
      setEditingHours(storeHours);
    }
  }, [storeHours]);

  const handleUpdateStoreHours = async (hours: StoreHours[]) => {
    try {
      await siteService.updateStoreHours(hours);
      // Recharger les données depuis l'API pour s'assurer qu'elles sont à jour
      const response = await siteService.getStoreHours();
      const hoursFromAPI: StoreHours[] = (response as ApiResponse<StoreHours[]>).data || [];
      setStoreHours(hoursFromAPI);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des horaires:', error);
      throw error; // Re-throw pour que le composant puisse gérer l'erreur
    }
  };

  const handleHourChange = (dayIndex: number, field: 'open' | 'close', value: string) => {
    const updatedHours = [...editingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
    setEditingHours(updatedHours);
  };

  const handleClosedChange = (dayIndex: number, closed: boolean) => {
    const updatedHours = [...editingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], closed };
    setEditingHours(updatedHours);
  };

  const handleInitializeHours = () => {
    const initialHours: StoreHours[] = [
      { day: 'lundi', open: '08:00', close: '18:00', closed: false },
      { day: 'mardi', open: '08:00', close: '18:00', closed: false },
      { day: 'mercredi', open: '08:00', close: '18:00', closed: false },
      { day: 'jeudi', open: '08:00', close: '18:00', closed: false },
      { day: 'vendredi', open: '08:00', close: '18:00', closed: false },
      { day: 'samedi', open: '08:00', close: '18:00', closed: false },
      { day: 'dimanche', open: '00:00', close: '00:00', closed: true },
    ];
    setEditingHours(initialHours);
  };

  return {
    storeHours,
    editingHours,
    setStoreHours,
    setEditingHours,
    handleUpdateStoreHours,
    handleHourChange,
    handleClosedChange,
    handleInitializeHours,
    loading
  };
};