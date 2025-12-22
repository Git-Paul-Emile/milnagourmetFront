import React from 'react';

interface ProductPriceFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function ProductPriceField({ value, onChange }: ProductPriceFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder="ex: 2500"
        className="w-full p-2 border border-border rounded-lg"
        min="0"
        required
      />
    </div>
  );
}