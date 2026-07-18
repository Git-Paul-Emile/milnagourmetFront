import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminLoginForm } from '@/hooks/useAdminLoginForm';
import { AdminLoginHeader, AdminLoginForm, AdminLoginFooter } from '@/components/AdminLogin';
import { useSEO } from '@/hooks/useSEO';
import { useAuth } from '@/hooks/useAuth';

export function AdminLogin() {
  useSEO({ title: 'Connexion Admin - Milna Gourmet', noIndex: true });

  const { isAuthenticated, user } = useAuth();

  const {
    formData,
    fieldErrors,
    showPassword,
    isLoading,
    handleSubmit,
    handleInputChange,
    toggleShowPassword,
  } = useAdminLoginForm();

  if (isAuthenticated && user?.role === 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AdminLoginHeader />

        <AdminLoginForm
          formData={formData}
          fieldErrors={fieldErrors}
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