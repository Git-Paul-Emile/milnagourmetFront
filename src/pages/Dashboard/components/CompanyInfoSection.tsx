import React from 'react';
import { Building } from 'lucide-react';
import { CompanyInfo } from './useSettingsState';

interface CompanyInfoSectionProps {
  companyInfo: CompanyInfo;
  onCompanyInfoChange: (field: keyof CompanyInfo, value: string) => void;
}

export function CompanyInfoSection({ companyInfo, onCompanyInfoChange }: CompanyInfoSectionProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Building className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Informations de l'entreprise</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nom de l'entreprise</label>
          <input
            type="text"
            value={companyInfo.name}
            onChange={(e) => onCompanyInfoChange('name', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="text"
            value={companyInfo.phone}
            onChange={(e) => onCompanyInfoChange('phone', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={companyInfo.email}
            onChange={(e) => onCompanyInfoChange('email', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">WhatsApp</label>
          <input
            type="text"
            value={companyInfo.whatsapp}
            onChange={(e) => onCompanyInfoChange('whatsapp', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            type="text"
            value={companyInfo.address}
            onChange={(e) => onCompanyInfoChange('address', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}