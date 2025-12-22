import { useState, useEffect } from 'react';
import { siteService } from '@/services';
import { ContactInfo, SocialMedia } from '@/types';

export function useFooterData() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const [contact, social] = await Promise.all([
          siteService.getContactInfo(),
          siteService.getSocialMedia()
        ]);
        setContactInfo(contact.data as ContactInfo ?? null);
        setSocialMedia(social.data as SocialMedia ?? null);
      } catch (error) {
        console.error('Erreur lors du chargement des données du footer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFooterData();
  }, []);

  return { contactInfo, socialMedia, loading };
}