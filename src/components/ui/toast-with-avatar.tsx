import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/useApp';

interface ToastWithAvatarProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  avatar?: string;
  duration?: number;
}

export function ToastWithAvatar({ 
  id, 
  type, 
  message, 
  avatar, 
  duration = 5000 
}: ToastWithAvatarProps) {
  const { dispatch } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const handleRemove = () => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full',
      'bg-card border border-border rounded-lg shadow-strong',
      'animate-slide-up'
    )}>
      <div className="toast-with-avatar p-4">
        {avatar && (
          <img 
            src={avatar} 
            alt="Milna Gourmet" 
            className="toast-avatar flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <div className={cn(
            'flex items-start justify-between gap-2'
          )}>
            <p className={cn(
              'text-sm font-medium flex-1',
              type === 'success' && 'text-primary',
              type === 'error' && 'text-destructive',
              type === 'info' && 'text-foreground'
            )}>
              {message}
            </p>
            <button
              onClick={handleRemove}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}