import React from 'react';
import { User } from 'lucide-react';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

interface InputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputField({ value, onChange }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{ADMIN_LOGIN_CONSTANTS.TELEPHONE_LABEL}</label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
          placeholder={ADMIN_LOGIN_CONSTANTS.TELEPHONE_PLACEHOLDER}
          required
        />
      </div>
    </div>
  );
}