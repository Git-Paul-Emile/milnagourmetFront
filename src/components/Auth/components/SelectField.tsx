import React from 'react';
import { MapPin } from 'lucide-react';
import { DeliveryZone } from '@/types';

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DeliveryZone[];
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Sélectionnez une zone de livraison</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name} - {option.deliveryFee} FCFA
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};