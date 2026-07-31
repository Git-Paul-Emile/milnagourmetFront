import { useState } from 'react';

export interface CustomerInfo {
  name: string;
  phone: string;
  /**
   * Email facultatif du client invité.
   *
   * Tant que WhatsApp Business n'est pas activé, l'email est le seul
   * moyen de prévenir le client du suivi de sa commande. On le demande
   * donc ici, sans le rendre obligatoire pour ne pas freiner l'achat.
   */
  email: string;
}

export function useCustomerInfo() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: ''
  });

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setCustomerInfo({ name: '', phone: '', email: '' });
  };

  const isValid = () => {
    // L'email n'entre pas dans la validation : il reste facultatif.
    return customerInfo.name.trim() !== '' && customerInfo.phone.trim() !== '';
  };

  return {
    customerInfo,
    updateField,
    reset,
    isValid
  };
}