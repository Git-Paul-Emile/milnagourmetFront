import React from 'react';

interface ProductAvailableFieldProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ProductAvailableField({ value, onChange }: ProductAvailableFieldProps) {
  return (
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm">Produit activé immédiatement</span>
      </label>
    </div>
  );
}