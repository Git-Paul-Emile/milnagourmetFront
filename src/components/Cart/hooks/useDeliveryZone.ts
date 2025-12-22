import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/useApp';
import { deliveryZoneService } from '@/services/deliveryZone';
import { DeliveryZone } from '@/types';

export function useDeliveryZone() {
  const { state } = useApp();
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone | null>(null);

  useEffect(() => {
    const fetchDeliveryZone = async () => {
      if (state.user?.zoneLivraisonId) {
        try {
          // Récupérer la zone par ID
          const zone = await deliveryZoneService.getDeliveryZoneById(state.user.zoneLivraisonId);
          setDeliveryZone(zone as DeliveryZone);
        } catch (error) {
          console.error('Erreur lors de la récupération de la zone de livraison:', error);
          setDeliveryZone(null);
        }
      } else {
        setDeliveryZone(null);
      }
    };

    fetchDeliveryZone();
  }, [state.user?.zoneLivraisonId]);

  return deliveryZone;
}