import React from 'react';
import { useAdminLoginForm } from '@/hooks/useAdminLoginForm';
import { AdminLoginHeader, AdminLoginForm, AdminLoginFooter } from '@/components/AdminLogin';

export function AdminLogin() {
  const {
    formData,
    error,
    showPassword,
    isLoading,
    handleSubmit,
    handleInputChange,
    toggleShowPassword,
  } = useAdminLoginForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminLoginHeader />

        <AdminLoginForm
          formData={formData}
          error={error}
          showPassword={showPassword}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onToggleShowPassword={toggleShowPassword}
        />

        <AdminLoginFooter />
      </div>
    </div>
  );
}