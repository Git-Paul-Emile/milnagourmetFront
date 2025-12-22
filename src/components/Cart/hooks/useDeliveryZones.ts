import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { deliveryZoneService } from '@/services/deliveryZone';
import { DeliveryZone } from '@/types';
import { useAvatarToast } from '@/hooks/useAvatarToast';

export function useDeliveryZones(isOpen: boolean) {
  const { dispatch } = useApp();
  const avatarToast = useAvatarToast();
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchDeliveryZones = async () => {
        setIsLoading(true);
        try {
          const zones = await deliveryZoneService.getAllActive();
          setDeliveryZones(zones);
        } catch (error) {
          console.error('Erreur lors du chargement des zones de livraison:', error);
          dispatch({
            type: 'ADD_TOAST',
            payload: {
              id: Date.now().toString(),
              type: 'error',
              message: 'Impossible de charger les zones de livraison.',
              avatar: avatarToast
            }
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchDeliveryZones();
    }
  }, [isOpen, dispatch, avatarToast]);

  const selectedZone = deliveryZones.find(zone => zone.id === selectedZoneId);

  const reset = () => {
    setSelectedZoneId('');
  };

  return {
    deliveryZones,
    selectedZoneId,
    selectedZone,
    isLoading,
    setSelectedZoneId,
    reset
  };
}