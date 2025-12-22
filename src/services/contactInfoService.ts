import { ContactInfo } from '@/types';
import { siteService } from './index';

// Cache pour les informations de contact
let contactInfoCache: { whatsapp?: string; phone?: string } | null = null;

export async function getContactInfo(): Promise<{ whatsapp?: string; phone?: string }> {
  if (!contactInfoCache) {
    try {
      const contactResponse = await siteService.getContactInfo();
      const contact = contactResponse.data as ContactInfo;
      contactInfoCache = {
        whatsapp: contact?.whatsapp || '+24106610304',
        phone: contact?.phone || '+24106610304'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de contact:', error);
      // Valeurs de fallback
      contactInfoCache = {
        whatsapp: '+24106610304',
        phone: '+24106610304'
      };
    }
  }
  return contactInfoCache;
}