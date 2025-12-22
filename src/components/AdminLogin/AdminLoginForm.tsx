import React from 'react';
import { InputField } from './InputField';
import { PasswordField } from './PasswordField';
import { ErrorMessage } from './ErrorMessage';
import { SubmitButton } from './SubmitButton';

interface AdminLoginFormProps {
  formData: {
    telephone: string;
    password: string;
  };
  error: string;
  showPassword: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: 'telephone' | 'password', value: string) => void;
  onToggleShowPassword: () => void;
}

export function AdminLoginForm({
  formData,
  error,
  showPassword,
  isLoading,
  onSubmit,
  onInputChange,
  onToggleShowPassword,
}: AdminLoginFormProps) {
  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <InputField
          value={formData.telephone}
          onChange={(value) => onInputChange('telephone', value)}
        />

        <PasswordField
          value={formData.password}
          onChange={(value) => onInputChange('password', value)}
          showPassword={showPassword}
          onToggleShowPassword={onToggleShowPassword}
        />

        <ErrorMessage error={error} />

        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
}