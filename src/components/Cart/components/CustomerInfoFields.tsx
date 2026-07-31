import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
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
          className="w-full"
        />
      </div>

      {/* Email — facultatif */}
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center space-x-2">
          <Mail className="h-4 w-4" />
          <span>Email (facultatif)</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          value={customerInfo.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Pour recevoir la confirmation et le suivi de votre commande.
        </p>
      </div>
    </>
  );
}