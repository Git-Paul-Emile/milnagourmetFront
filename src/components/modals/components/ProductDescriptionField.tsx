import React from 'react';

interface ProductDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductDescriptionField({ value, onChange }: ProductDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Description *</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Décrivez le produit..."
        className="w-full p-2 border border-border rounded-lg h-20"
        required
      />
    </div>
  );
}