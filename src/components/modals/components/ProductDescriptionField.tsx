import React from 'react';

interface ProductDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProductDescriptionField({ value, onChange, error }: ProductDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Description *</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Décrivez le produit..."
        className={`w-full p-2 border rounded-lg h-20 ${error ? 'border-red-500' : 'border-border'}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}