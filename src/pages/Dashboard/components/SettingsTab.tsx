import React from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { StoreHours } from '@/types';
import { useSettingsState } from './useSettingsState';
import { useBranding } from '@/hooks/useBranding';
import { StoreHoursSection } from './StoreHoursSection';
import { CompanyInfoSection } from './CompanyInfoSection';
import { LogoSection } from './LogoSection';
import { BannerSection } from './BannerSection';
import { CreationImageSection } from './CreationImageSection';
import { AvatarsSection } from './AvatarsSection';
import { SocialMediaSection } from './SocialMediaSection';
import { ThemeSection } from './ThemeSection';
import { siteService } from '@/services/siteService';

interface SettingsTabProps {
  storeHours: StoreHours[];
  loadDashboardData: () => Promise<void>;
  displaySuccessToast: (message: string) => void;
  onInitializeHours?: () => void;
  onSaveHours?: (hours: StoreHours[]) => Promise<void>;
}

export function SettingsTab({ storeHours, loadDashboardData, displaySuccessToast, onInitializeHours, onSaveHours }: SettingsTabProps) {
  const { refreshBranding } = useBranding();

  const {
    editingHours,
    companyInfo,
    socialMedia,
    heroInfo,
    catalogInfo,
    avatarInfo,
    availableImages,
    isSaving,
    isLoading,
    setIsSaving,
    handleHourChange,
    handleClosedChange,
    handleCompanyInfoChange,
    handleSocialMediaChange,
    handleLogoUpload,
    handleLogoSelect,
    handleBannerUpload,
    handleBannerSelect,
    handleCreationImageUpload,
    handleCreationImageSelect,
    handleAvatarToastUpload,
    handleAvatarToastSelect
  } = useSettingsState({ initialStoreHours: storeHours, refreshBranding });

  const handleSaveAllSettings = async () => {
    try {
      setIsSaving(true);

      // Sauvegarder les informations de contact
      await siteService.updateContactInfo({
        companyName: companyInfo.name,
        address: companyInfo.address,
        phone: companyInfo.phone,
        email: companyInfo.email,
        whatsapp: companyInfo.whatsapp
      });

      // Sauvegarder le logo
      if (companyInfo.logo) {
        await siteService.updateBranding(companyInfo.logo);
        // Rafraîchir le branding pour mettre à jour l'affichage en temps réel
        refreshBranding();
      }

      // Sauvegarder la bannière
      if (heroInfo.banner) {
        await siteService.updateHeroData({ banner: heroInfo.banner });
      }

      // Sauvegarder l'image de création
      if (catalogInfo.creationImage) {
        await siteService.updateCatalogSectionData({ creationImage: catalogInfo.creationImage });
      }

      // Sauvegarder l'avatar pour les toasts
      if (avatarInfo.toast) {
        await siteService.updateAvatarToast(avatarInfo.toast);
      }

      // Sauvegarder les réseaux sociaux
      const socialMediaArray = [
        { plateforme: 'facebook', url: socialMedia.facebook, active: !!socialMedia.facebook },
        { plateforme: 'instagram', url: socialMedia.instagram, active: !!socialMedia.instagram },
        { plateforme: 'tiktok', url: socialMedia.tiktok, active: !!socialMedia.tiktok }
      ];
      await siteService.updateSocialMedia(socialMediaArray);

      displaySuccessToast('Tous les paramètres ont été sauvegardés');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // TODO: Afficher un message d'erreur
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Paramètres</h2>
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres</h2>

      <StoreHoursSection
        editingHours={editingHours}
        onHourChange={handleHourChange}
        onClosedChange={handleClosedChange}
        onSave={onSaveHours || (async () => {})}
        isSaving={isSaving}
        displaySuccessToast={displaySuccessToast}
        onInitializeHours={onInitializeHours}
      />

      <CompanyInfoSection
        companyInfo={companyInfo}
        onCompanyInfoChange={handleCompanyInfoChange}
      />

      <LogoSection
        logo={companyInfo.logo}
        availableImages={availableImages}
        onLogoUpload={handleLogoUpload}
        onLogoSelect={handleLogoSelect}
      />

      <BannerSection
        banner={heroInfo.banner}
        availableImages={availableImages}
        onBannerUpload={handleBannerUpload}
        onBannerSelect={handleBannerSelect}
      />

      <CreationImageSection
        creationImage={catalogInfo.creationImage}
        availableImages={availableImages}
        onCreationImageUpload={handleCreationImageUpload}
        onCreationImageSelect={handleCreationImageSelect}
      />

      <AvatarsSection
        avatarToast={avatarInfo.toast}
        availableImages={availableImages}
        onAvatarToastUpload={handleAvatarToastUpload}
        onAvatarToastSelect={handleAvatarToastSelect}
      />

      <SocialMediaSection
        socialMedia={socialMedia}
        onSocialMediaChange={handleSocialMediaChange}
      />

      <ThemeSection displaySuccessToast={displaySuccessToast} />

      {/* Bouton de sauvegarde final */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAllSettings}
          disabled={isSaving}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg"
        >
          {isSaving ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          <span>{isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder'}</span>
        </button>
      </div>
    </div>
  );
}