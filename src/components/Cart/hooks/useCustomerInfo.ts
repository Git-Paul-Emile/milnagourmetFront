import { useState } from 'react';

export interface CustomerInfo {
  name: string;
  phone: string;
}

export function useCustomerInfo() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: ''
  });

  const updateField = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setCustomerInfo({ name: '', phone: '' });
  };

  const isValid = () => {
    return customerInfo.name.trim() !== '' && customerInfo.phone.trim() !== '';
  };

  return {
    customerInfo,
    updateField,
    reset,
    isValid
  };
}