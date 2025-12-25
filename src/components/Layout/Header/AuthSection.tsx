import React from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { AuthUser } from '@/types';

interface AuthSectionProps {
  user: AuthUser | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  isChristmasTheme?: boolean;
}

export function AuthSection({
  user,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onProfileClick,
  isChristmasTheme = false
}: AuthSectionProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    onLogout();
  };

  if (user) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <button
          onClick={onProfileClick}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-md",
            "text-primary hover:bg-primary/10"
          )}
          title="Mon profil"
        >
          <User className="h-5 w-5" />
          <span className="text-sm font-medium">
            {user?.nomComplet?.split(' ')[0] || ''}
          </span>
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            "p-2 rounded-full transition-all hover:scale-110",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          )}
          title="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-2">
      <button
        onClick={onLoginClick}
        className={cn(
          "px-4 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-md text-sm font-medium",
          "text-primary hover:bg-primary/10"
        )}
      >
        Connexion
      </button>
      <button
        onClick={onRegisterClick}
        className={cn(
          "px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all text-sm font-medium",
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
        )}
      >
        S'inscrire
      </button>
    </div>
  );
}