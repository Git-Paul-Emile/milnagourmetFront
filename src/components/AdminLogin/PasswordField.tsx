import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  error?: string;
}

export function PasswordField({ value, onChange, showPassword, onToggleShowPassword, error }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{ADMIN_LOGIN_CONSTANTS.PASSWORD_LABEL}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background ${error ? 'border-red-500' : 'border-border'}`}
          placeholder={ADMIN_LOGIN_CONSTANTS.PASSWORD_PLACEHOLDER}
        />
        <button
          type="button"
          onClick={onToggleShowPassword}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}