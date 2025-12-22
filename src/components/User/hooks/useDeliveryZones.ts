import { useState, useEffect } from 'react';
import { DeliveryZone } from '@/types';
import { deliveryZoneService } from '@/services/deliveryZone';

export const useDeliveryZones = () => {
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  useEffect(() => {
    const fetchDeliveryZones = async () => {
      try {
        const zones = await deliveryZoneService.getAllActive();
        setDeliveryZones(zones);
      } catch (error) {
        console.error('Erreur lors du chargement des zones de livraison:', error);
        setDeliveryZones([]);
      }
    };

    fetchDeliveryZones();
  }, []);

  return deliveryZones;
};