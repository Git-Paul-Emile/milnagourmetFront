import { StoreHours } from '@/types';
import { httpClient, ApiResponse } from './httpClient';

// Service pour les données du site
export const siteService = {
  async getStoreHours(): Promise<ApiResponse<StoreHours[]>> {
    return httpClient.get<StoreHours[]>('/api/site/store-hours');
  },

  async updateStoreHours(hours: StoreHours[]): Promise<ApiResponse<void>> {
    return httpClient.put<void>('/api/site/store-hours', { hours });
  },

  async getNavigation() {
    return httpClient.get('/api/site/navigation');
  },

  async getHeroData() {
    return httpClient.get('/api/site/hero');
  },

  async updateHeroData(heroData: { title?: string; subtitle?: string; badge?: string; banner?: string }) {
    return httpClient.put('/api/site/hero', heroData);
  },

  async getCatalogSectionData() {
    return httpClient.get('/api/site/catalog-section');
  },

  async updateCatalogSectionData(catalogData: {
    title?: string;
    description?: string;
    creationTitle?: string;
    creationDescription?: string;
    creationButtonText?: string;
    creationImage?: string;
    emptyMessage?: string;
    emptySubMessage?: string;
  }) {
    return httpClient.put('/api/site/catalog-section', catalogData);
  },

  async getTestimonials() {
    return httpClient.get('/api/site/testimonials');
  },

  async getAllTestimonials() {
    return httpClient.get('/api/site/testimonials/all');
  },

  async createTestimonial(testimonialData: unknown) {
    return httpClient.post('/api/site/testimonials', testimonialData);
  },

  async updateTestimonial(id: number, testimonialData: unknown) {
    return httpClient.put(`/api/site/testimonials/${id}`, testimonialData);
  },

  async deleteTestimonial(id: number) {
    return httpClient.delete(`/api/site/testimonials/${id}`);
  },

  async getContactSectionData() {
    return httpClient.get('/api/site/contact-section');
  },

  async getContactInfo() {
    return httpClient.get('/api/site/contact');
  },

  async updateContactInfo(contactData: {
    companyName?: string;
    address?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
  }) {
    return httpClient.put('/api/site/contact', contactData);
  },

  async getSocialMedia() {
    return httpClient.get('/api/site/social-media');
  },

  async updateSocialMedia(socialMedia: Array<{ plateforme: string; url: string; active: boolean }>) {
    return httpClient.put('/api/site/social-media', socialMedia);
  },

  async getBranding() {
    return httpClient.get('/api/site/branding');
  },

  async updateBranding(logo: string) {
    return httpClient.put('/api/site/branding', { logo });
  },

  async getAvatarToast() {
    return httpClient.get('/api/site/avatar-toast');
  },

  async updateAvatarToast(image: string) {
    return httpClient.put('/api/site/avatar-toast', { image });
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.request('/api/upload/logo-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadBannerImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.request('/api/upload/banner-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadTestimonialImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.request('/api/upload/testimonial-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadCreationImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.request('/api/upload/creation-image', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadAvatarToastImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.request('/api/upload/avatar-toast-image', {
      method: 'POST',
      body: formData,
    });
  },

  async listImages() {
    return httpClient.get('/api/upload/images');
  },

  async getUsedImages(): Promise<ApiResponse<string[]>> {
    return httpClient.get<string[]>('/api/upload/used-images');
  },

  async deleteImage(imagePath: string) {
    // imagePath is like '/uploads/folder/filename.jpg'
    console.log('deleteImage called with:', imagePath);
    const pathParts = imagePath.replace(/^\/uploads\//, '').split('/');
    if (pathParts.length !== 2) {
      throw new Error('Invalid image path format');
    }
    const [folder, filename] = pathParts;
    console.log('Parsed folder:', folder, 'filename:', filename);
    return httpClient.delete(`/api/upload/images/${folder}/${filename}`);
  },
};