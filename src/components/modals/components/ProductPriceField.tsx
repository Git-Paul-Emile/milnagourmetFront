import React from 'react';

interface ProductPriceFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function ProductPriceField({ value, onChange, error }: ProductPriceFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Prix (FCFA) *</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        placeholder="ex: 2500"
        className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-border'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}