import React from 'react';
import { useApp } from '@/contexts/useApp';
import { useNavigate } from 'react-router-dom';
import { Cart } from '@/components/Cart/Cart';
import { AuthModal } from '@/components/Auth/AuthModal';
import { UserProfile } from '@/components/User/UserProfile';
import { OrderManagement } from '@/components/Admin/OrderManagement';
import { useAuth } from '@/hooks/useAuth';
import { contactMilnaWhatsApp, callMilna } from '@/services/whatsapp';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { StoreStatusBar } from './Header/StoreStatusBar';
import { Logo } from './Header/Logo';
import { NavigationLinks } from './Header/NavigationLinks';
import { CartButton } from './Header/CartButton';
import { AuthSection } from './Header/AuthSection';
import { ContactButtons } from './Header/ContactButtons';
import { MobileMenuToggle } from './Header/MobileMenuToggle';
import { MobileMenu } from './Header/MobileMenu';
import { useNavigation } from './Header/useNavigation';
import { useHeaderModals } from './Header/useHeaderModals';

export function Header() {
  const { state, dispatch } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { navigation } = useNavigation();
  const { theme } = useTheme();
  const isChristmasTheme = theme?.name === 'Noël';
  const {
    isCartOpen,
    setIsCartOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileOpen,
    setIsProfileOpen,
    isOrderManagementOpen,
    setIsOrderManagementOpen,
    authMode,
    setAuthMode,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useHeaderModals();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({
      type: 'ADD_TOAST',
      payload: {
        id: Date.now().toString(),
        type: 'success',
        message: 'Déconnexion. À bientôt !'
      }
    });
  };

  return (
    <>
      <StoreStatusBar isChristmasTheme={isChristmasTheme} />
      <header className={cn(
        "fixed top-8 left-0 right-0 z-40 backdrop-blur-sm border-b",
        "bg-background/95 border-border"
      )}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <Logo isChristmasTheme={isChristmasTheme} />
            <NavigationLinks navigation={navigation} isChristmasTheme={isChristmasTheme} />
            <div className="flex items-center space-x-4">
              <CartButton itemCount={state.cart.itemCount} onClick={() => setIsCartOpen(true)} isChristmasTheme={isChristmasTheme} />
              <AuthSection
                user={state.user}
                onLoginClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                onRegisterClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                onLogout={handleLogout}
                onProfileClick={() => navigate('/profile')}
                isChristmasTheme={isChristmasTheme}
              />
              <ContactButtons isChristmasTheme={isChristmasTheme} />
              <MobileMenuToggle isOpen={isMobileMenuOpen} onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isChristmasTheme={isChristmasTheme} />
            </div>
          </nav>
        </div>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          navigation={navigation}
          user={state.user}
          onClose={() => setIsMobileMenuOpen(false)}
          onLoginClick={() => {
            setAuthMode('login');
            setIsAuthModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          onRegisterClick={() => {
            setAuthMode('register');
            setIsAuthModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          onLogout={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          onProfileClick={() => {
            navigate('/profile');
            setIsMobileMenuOpen(false);
          }}
          onWhatsAppClick={async () => {
            await contactMilnaWhatsApp();
            setIsMobileMenuOpen(false);
          }}
          onCallClick={async () => {
            await callMilna();
            setIsMobileMenuOpen(false);
          }}
        />
      </header>
      <div className="h-40" />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <OrderManagement
        isOpen={isOrderManagementOpen}
        onClose={() => setIsOrderManagementOpen(false)}
      />
    </>
  );
}
