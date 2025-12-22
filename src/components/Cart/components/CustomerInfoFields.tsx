import React from 'react';
import { User, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomerInfo } from '../hooks/useCustomerInfo';

interface CustomerInfoFieldsProps {
  customerInfo: CustomerInfo;
  onFieldChange: (field: keyof CustomerInfo, value: string) => void;
}

export function CustomerInfoFields({ customerInfo, onFieldChange }: CustomerInfoFieldsProps) {
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Nom complet</span>
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Votre nom et prénom"
          value={customerInfo.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center space-x-2">
          <Phone className="h-4 w-4" />
          <span>Téléphone</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Votre numéro de téléphone"
          value={customerInfo.phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          required
          className="w-full"
        />
      </div>
    </>
  );
}