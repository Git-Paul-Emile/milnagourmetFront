import { useState, useEffect } from 'react';
import { StoreHours } from '@/types';
import { siteService } from '@/services/siteService';

export interface CompanyInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
  whatsapp: string;
  logo: string;
}

export interface AvatarInfo {
  toast: string;
}

export interface HeroInfo {
  title: string;
  subtitle: string;
  badge: string;
  banner: string;
}

export interface CatalogInfo {
  title: string;
  description: string;
  creationTitle: string;
  creationDescription: string;
  creationButtonText: string;
  creationImage: string;
  emptyMessage: string;
  emptySubMessage: string;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  tiktok: string;
}

interface ContactApiResponse {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: Record<string, unknown>;
}

interface BrandingApiResponse {
  logo: string;
}

export interface ImageOption {
  value: string;
  label: string;
  isUsed?: boolean;
}

interface SocialMediaApiResponse {
  [key: string]: string;
}

interface UseSettingsStateProps {
  initialStoreHours: StoreHours[];
  refreshBranding?: () => void;
}

export function useSettingsState({ initialStoreHours, refreshBranding }: UseSettingsStateProps) {
  const [editingHours, setEditingHours] = useState<StoreHours[]>(initialStoreHours);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    phone: '',
    address: '',
    email: '',
    whatsapp: '',
    logo: ''
  });
  const [socialMedia, setSocialMedia] = useState<SocialMedia>({
    facebook: '',
    instagram: '',
    tiktok: ''
  });
  const [heroInfo, setHeroInfo] = useState<HeroInfo>({
    title: '',
    subtitle: '',
    badge: '',
    banner: ''
  });
  const [catalogInfo, setCatalogInfo] = useState<CatalogInfo>({
    title: '',
    description: '',
    creationTitle: '',
    creationDescription: '',
    creationButtonText: '',
    creationImage: '',
    emptyMessage: '',
    emptySubMessage: ''
  });
  const [avatarInfo, setAvatarInfo] = useState<AvatarInfo>({
    toast: ''
  });
  const [availableImages, setAvailableImages] = useState<ImageOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchroniser editingHours avec initialStoreHours quand ils changent
  useEffect(() => {
    if (initialStoreHours.length > 0) {
      setEditingHours(initialStoreHours);
    }
  }, [initialStoreHours]);

  // Charger les données depuis l'API
  useEffect(() => {
    const loadSettingsData = async () => {
      try {
        setIsLoading(true);

        // Charger les informations de contact
        const contactResponse = await siteService.getContactInfo();
        if (contactResponse.status === 'success' && contactResponse.data) {
          const contactData = contactResponse.data as ContactApiResponse;
          setCompanyInfo(prev => ({
            ...prev,
            name: contactData.companyName || '',
            phone: contactData.phone || '',
            address: contactData.address || '',
            email: contactData.email || '',
            whatsapp: contactData.whatsapp || ''
          }));
        }

        // Charger le branding (logo)
        const brandingResponse = await siteService.getBranding();
        if (brandingResponse.status === 'success' && brandingResponse.data) {
          const brandingData = brandingResponse.data as BrandingApiResponse;
          setCompanyInfo(prev => ({
            ...prev,
            logo: brandingData.logo || ''
          }));
        }

        // Charger les réseaux sociaux
        const socialResponse = await siteService.getSocialMedia();
        if (socialResponse.status === 'success' && socialResponse.data) {
          const socialData = socialResponse.data as SocialMediaApiResponse;
          setSocialMedia({
            facebook: socialData.facebook || '',
            instagram: socialData.instagram || '',
            tiktok: socialData.tiktok || ''
          });
        }

        // Charger les données Hero
        const heroResponse = await siteService.getHeroData();
        if (heroResponse.status === 'success' && heroResponse.data) {
          const heroData = heroResponse.data as HeroInfo;
          setHeroInfo({
            title: heroData.title || '',
            subtitle: heroData.subtitle || '',
            badge: heroData.badge || '',
            banner: heroData.banner || ''
          });
        }

        // Charger les données du catalogue
        const catalogResponse = await siteService.getCatalogSectionData();
        if (catalogResponse.status === 'success' && catalogResponse.data) {
          const catalogData = catalogResponse.data as CatalogInfo;
          setCatalogInfo({
            title: catalogData.title || '',
            description: catalogData.description || '',
            creationTitle: catalogData.creationTitle || '',
            creationDescription: catalogData.creationDescription || '',
            creationButtonText: catalogData.creationButtonText || '',
            creationImage: catalogData.creationImage || '',
            emptyMessage: catalogData.emptyMessage || '',
            emptySubMessage: catalogData.emptySubMessage || ''
          });
        }

        // Charger l'avatar pour les toasts
        const avatarResponse = await siteService.getAvatarToast();
        if (avatarResponse.status === 'success' && avatarResponse.data) {
          const avatarData = avatarResponse.data as { image: string };
          setAvatarInfo({
            toast: avatarData.image || ''
          });
        }

        // Charger les images disponibles
        const imagesResponse = await siteService.listImages();
        if (imagesResponse.status === 'success' && imagesResponse.data) {
          const imagesData = imagesResponse.data as ImageOption[];
          setAvailableImages(imagesData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettingsData();
  }, []);
  const [isSaving, setIsSaving] = useState(false);

  const handleHourChange = (dayIndex: number, field: 'open' | 'close', value: string) => {
    const updatedHours = [...editingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
    setEditingHours(updatedHours);
  };

  const handleClosedChange = (dayIndex: number, closed: boolean) => {
    const updatedHours = [...editingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], closed };
    setEditingHours(updatedHours);
  };

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (field: keyof SocialMedia, value: string) => {
    setSocialMedia(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await siteService.uploadImage(file);
        if (response.status === 'success' && response.data) {
          const data = response.data as { path: string; filename: string };
          setCompanyInfo(prev => ({ ...prev, logo: data.path }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload du logo:', error);
        // TODO: Afficher un message d'erreur
      }
    }
  };

  const handleLogoSelect = (logoPath: string) => {
    setCompanyInfo(prev => ({ ...prev, logo: logoPath }));
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await siteService.uploadBannerImage(file);
        if (response.status === 'success' && response.data) {
          const data = response.data as { path: string; filename: string };
          setHeroInfo(prev => ({ ...prev, banner: data.path }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de la bannière:', error);
        // TODO: Afficher un message d'erreur
      }
    }
  };

  const handleBannerSelect = (bannerPath: string) => {
    setHeroInfo(prev => ({ ...prev, banner: bannerPath }));
  };

  const handleCreationImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Use the specific creation image upload endpoint
        const response = await siteService.uploadCreationImage(file);
        if (response.status === 'success' && response.data) {
          const data = response.data as { path: string; filename: string };
          setCatalogInfo(prev => ({ ...prev, creationImage: data.path }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image de création:', error);
        // TODO: Afficher un message d'erreur
      }
    }
  };

  const handleCreationImageSelect = (creationImagePath: string) => {
    setCatalogInfo(prev => ({ ...prev, creationImage: creationImagePath }));
  };

  const handleAvatarToastUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const response = await siteService.uploadAvatarToastImage(file);
        if (response.status === 'success' && response.data) {
          const data = response.data as { path: string; filename: string };
          setAvatarInfo(prev => ({ ...prev, toast: data.path }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload de l\'avatar toast:', error);
        // TODO: Afficher un message d'erreur
      }
    }
  };

  const handleAvatarToastSelect = (avatarPath: string) => {
    setAvatarInfo(prev => ({ ...prev, toast: avatarPath }));
  };

  return {
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
  };
}