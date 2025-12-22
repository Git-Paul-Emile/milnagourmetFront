import { useState, useEffect } from 'react';
import { siteService } from '@/services';
import { ContactSectionData } from '@/types';

export function useContactData() {
  const [contactData, setContactData] = useState<ContactSectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const data = await siteService.getContactSectionData();
        setContactData(data.data as ContactSectionData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des données de contact:', err);
        setContactData(null);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  return { contactData, loading, error };
}