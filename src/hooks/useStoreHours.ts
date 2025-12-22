import { useState, useEffect } from 'react';
import { StoreHours } from '@/types';
import { siteService } from '@/services';

interface StoreStatus {
  isOpen: boolean;
  message: string;
  nextChange: string;
}

export function useStoreHours() {
  const [status, setStatus] = useState<StoreStatus>({
    isOpen: false,
    message: 'Fermé',
    nextChange: ''
  });
  const [storeHours, setStoreHours] = useState<StoreHours[]>([]);

  useEffect(() => {
    const loadStoreHours = async () => {
      try {
        const hours = await siteService.getStoreHours();
        setStoreHours(hours.data ?? []);
      } catch (error) {
        console.error('Erreur lors du chargement des horaires:', error);
        // Utiliser des horaires par défaut en cas d'erreur
        const defaultHours = [
          { day: 'Lundi', open: '08:00', close: '20:00', closed: false },
          { day: 'Mardi', open: '08:00', close: '20:00', closed: false },
          { day: 'Mercredi', open: '08:00', close: '20:00', closed: false },
          { day: 'Jeudi', open: '08:00', close: '20:00', closed: false },
          { day: 'Vendredi', open: '08:00', close: '20:00', closed: false },
          { day: 'Samedi', open: '09:00', close: '18:00', closed: false },
          { day: 'Dimanche', open: '10:00', close: '16:00', closed: false }
        ];
        setStoreHours(defaultHours);
      }
    };

    loadStoreHours();
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
      const currentTime = now.toTimeString().slice(0, 5);

      const todayHours = storeHours.find(h => h.day === currentDay);

      if (!todayHours || todayHours.closed) {
        // Trouver le prochain jour d'ouverture
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let nextOpenDay = '';

        for (let i = 1; i <= 7; i++) {
          const nextDay = new Date(now);
          nextDay.setDate(nextDay.getDate() + i);
          const dayName = nextDay.toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
          const dayHours = storeHours.find(h => h.day === dayName);

          if (dayHours && !dayHours.closed && dayHours.open && dayHours.open !== '00:00') {
            nextOpenDay = `${dayName} à ${dayHours.open}`;
            break;
          }
        }

        setStatus({
          isOpen: false,
          message: `Fermé - ${nextOpenDay ? `Ouvre ${nextOpenDay}` : 'Vérifiez nos horaires d\'ouverture'}`,
          nextChange: ''
        });
        return;
      }
      
      const isCurrentlyOpen = currentTime >= todayHours.open && currentTime < todayHours.close;
      
      if (isCurrentlyOpen) {
        // Calculer le temps jusqu'à la fermeture
        const closeTime = new Date();
        const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
        closeTime.setHours(closeHour, closeMin, 0, 0);
        
        const timeUntilClose = closeTime.getTime() - now.getTime();
        const hoursUntilClose = Math.floor(timeUntilClose / (1000 * 60 * 60));
        const minutesUntilClose = Math.floor((timeUntilClose % (1000 * 60 * 60)) / (1000 * 60));
        
        let closeMessage = '';
        if (hoursUntilClose > 0) {
          closeMessage = `Ferme dans ${hoursUntilClose}h${minutesUntilClose > 0 ? ` ${minutesUntilClose}min` : ''}`;
        } else if (minutesUntilClose > 0) {
          closeMessage = `Ferme dans ${minutesUntilClose} minutes`;
        } else {
          closeMessage = 'Ferme bientôt';
        }
        
        setStatus({
          isOpen: true,
          message: `Ouvert - Ferme à ${todayHours.close}`,
          nextChange: closeMessage
        });
      } else if (currentTime < todayHours.open) {
        // Pas encore ouvert aujourd'hui
        const openTime = new Date();
        const [openHour, openMin] = todayHours.open.split(':').map(Number);
        openTime.setHours(openHour, openMin, 0, 0);
        
        const timeUntilOpen = openTime.getTime() - now.getTime();
        const hoursUntilOpen = Math.floor(timeUntilOpen / (1000 * 60 * 60));
        const minutesUntilOpen = Math.floor((timeUntilOpen % (1000 * 60 * 60)) / (1000 * 60));
        
        let openMessage = '';
        if (hoursUntilOpen > 0) {
          openMessage = `dans ${hoursUntilOpen}h${minutesUntilOpen > 0 ? ` ${minutesUntilOpen}min` : ''}`;
        } else if (minutesUntilOpen > 0) {
          openMessage = `Ouvre dans ${minutesUntilOpen} minutes`;
        } else {
          openMessage = 'Ouvre bientôt';
        }
        
        setStatus({
          isOpen: false,
          message: `Fermé - Ouvre à ${todayHours.open}`,
          nextChange: openMessage
        });
      } else {
        // Fermé pour la journée
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = tomorrow.toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase());
        const tomorrowHours = storeHours.find(h => h.day === tomorrowDay);
        
        let nextOpenMessage = 'Fermé';
        if (tomorrowHours && !tomorrowHours.closed) {
          nextOpenMessage = `Ouvre demain à ${tomorrowHours.open}`;
        }
        
        setStatus({
          isOpen: false,
          message: `Fermé - ${nextOpenMessage}`,
          nextChange: ''
        });
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [storeHours]);

  return status;
}