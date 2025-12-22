import React from 'react';

interface ProductNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductNameField({ value, onChange }: ProductNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Nom du produit *</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ex: Gourmet Fraise"
        className="w-full p-2 border border-border rounded-lg"
        required
      />
    </div>
  );
}