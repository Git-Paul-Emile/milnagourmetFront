import React from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_LOGIN_CONSTANTS } from '@/constants/adminLogin';

interface SubmitButtonProps {
  isLoading: boolean;
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={cn(
        'group relative w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform-gpu overflow-hidden',
        'bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100',
        'text-primary-foreground hover:shadow-xl hover:shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 active:scale-95',
        isLoading && 'opacity-50 cursor-not-allowed',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700'
      )}
    >
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        )}
        <Shield className="h-4 w-4" />
        <span>{isLoading ? ADMIN_LOGIN_CONSTANTS.SUBMIT_BUTTON_LOADING_TEXT : ADMIN_LOGIN_CONSTANTS.SUBMIT_BUTTON_TEXT}</span>
      </span>
      {!isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}