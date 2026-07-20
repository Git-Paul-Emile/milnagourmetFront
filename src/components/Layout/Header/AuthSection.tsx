import React from 'react';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { AuthUser } from '@/types';

interface AuthSectionProps {
  user: AuthUser | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
}

export function AuthSection({ user, onLoginClick, onRegisterClick, onLogout, onProfileClick, onDashboardClick }: AuthSectionProps) {
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
        {user.role === 'ADMIN' && (
          <button
            onClick={onDashboardClick}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-md",
              "text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground"
            )}
            title="Tableau de bord"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
        )}
        <button
          onClick={onProfileClick}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-md",
            "text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground"
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
          "text-button-foreground hover:bg-[#43A2F2] hover:text-white"
        )}
      >
        Connexion
      </button>
      <button
        onClick={onRegisterClick}
        className={cn(
          "px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all text-sm font-medium",
          "bg-button hover:bg-[#43A2F2] text-white"
        )}
      >
        S'inscrire
      </button>
    </div>
  );
}