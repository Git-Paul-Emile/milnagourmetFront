import React from 'react';

interface ProductNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProductNameField({ value, onChange, error }: ProductNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Nom du produit *</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ex: Gourmet Fraise"
        className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-border'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}