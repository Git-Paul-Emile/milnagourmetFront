import React from 'react';
import { User, LogOut, Phone, LayoutDashboard } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

interface UserType {
  nomComplet?: string;
  role?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navigation: { name: string; href: string }[];
  user: UserType | null;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
  onDashboardClick: () => void;
  onWhatsAppClick: () => void;
  onCallClick: () => void;
}

export function MobileMenu({ isOpen, navigation, user, onClose, onLoginClick, onRegisterClick, onLogout, onProfileClick, onDashboardClick, onWhatsAppClick, onCallClick }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border animate-slide-up shadow-lg">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Navigation links */}
        <div className="space-y-2">
          {navigation.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-3 px-4 text-[#212121] hover:bg-button-hover rounded-lg transition-all hover:translate-x-2 font-medium"
              onClick={onClose}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Auth buttons for mobile */}
        {!user ? (
          <div className="flex flex-col space-y-3 pt-4 border-t border-border">
            <button
              onClick={onLoginClick}
              className="w-full py-3 px-4 text-button-foreground hover:bg-[#43A2F2] hover:text-white rounded-lg transition-all hover:scale-105 font-medium"
            >
              Connexion
            </button>
            <button
              onClick={onRegisterClick}
              className="w-full py-3 px-4 bg-button border border-button-border hover:bg-[#43A2F2] hover:text-white hover:border-[#43A2F2] text-button-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all font-medium"
            >
              S'inscrire
            </button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 pt-4 border-t border-border">
            <button
              onClick={onProfileClick}
              className="w-full py-3 px-4 text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground rounded-lg transition-all hover:scale-105 font-medium"
            >
              <User className="h-5 w-5 inline mr-2" />
              Mon Profil
            </button>
            {user.role === 'ADMIN' && (
              <button
                onClick={onDashboardClick}
                className="w-full py-3 px-4 text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground rounded-lg transition-all hover:scale-105 font-medium"
              >
                <LayoutDashboard className="h-5 w-5 inline mr-2" />
                Tableau de bord
              </button>
            )}
            <button
              onClick={onLogout}
              className="w-full py-3 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all hover:scale-105 font-medium"
            >
              <LogOut className="h-5 w-5 inline mr-2" />
              Se déconnecter
            </button>
          </div>
        )}

        {/* Contact actions */}
        <div className="flex space-x-4 pt-4 border-t border-border">
          <button
            onClick={onWhatsAppClick}
            className="flex items-center space-x-2 text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 font-medium"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={onCallClick}
            className="flex items-center space-x-2 text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground px-4 py-2 rounded-lg transition-all hover:scale-105 font-medium"
          >
            <Phone className="h-5 w-5" />
            <span>Appeler</span>
          </button>
        </div>
      </div>
    </div>
  );
}