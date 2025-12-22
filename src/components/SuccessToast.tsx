import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function SuccessToast({ message, isVisible, onClose }: SuccessToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3">
      <CheckCircle className="h-5 w-5" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-green-700 rounded-full p-1"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}