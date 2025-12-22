import React from 'react';
import { AuthModalProps } from './types/authTypes';
import { useAuthForm } from './hooks/useAuthForm';
import { AuthHeader } from './components/AuthHeader';
import { AuthForm } from './components/AuthForm';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const {
    mode,
    formData,
    showPassword,
    showConfirmPassword,
    isLoading,
    deliveryZones,
    fieldErrors,
    globalError,
    handleInputChange,
    handleSubmit,
    switchMode,
    setShowPassword,
    setShowConfirmPassword
  } = useAuthForm({ initialMode, onClose });

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border">
          <AuthHeader mode={mode} globalError={globalError} onClose={onClose} />
          <AuthForm
            mode={mode}
            formData={formData}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isLoading={isLoading}
            deliveryZones={deliveryZones}
            fieldErrors={fieldErrors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onSwitchMode={switchMode}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
          />
        </div>
      </div>
    </>
  );
}

