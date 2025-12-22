import React from 'react';
import { useApp } from '@/contexts/useApp';
import { ToastWithAvatar } from '@/components/ui/toast-with-avatar';

export function ToastContainer() {
  const { state } = useApp();

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {state.toasts.map((toast) => (
        <ToastWithAvatar
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          avatar={toast.avatar}
        />
      ))}
    </div>
  );
}