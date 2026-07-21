// Médias par défaut LOCAUX : bundlés par Vite dans le front.
// Le hero et l'avatar ne dépendent plus d'aucun CDN externe (Cloudinary) — demande du 13/07/2026.
import heroBannerLocal from '../assets/banners/hero-banner.jpg';
import avatarOwnerLocal from '../assets/avatarToast/milna-owner.jpg';

export const DEFAULT_AVATAR_TOAST_IMAGE = avatarOwnerLocal;
export const DEFAULT_TESTIMONIAL_AVATAR = avatarOwnerLocal;
export const DEFAULT_BANNER_IMAGE = heroBannerLocal;

// Base des médias encore hébergés sur Cloudinary (cloud name public, sans risque à exposer côté client)
const CLOUDINARY_CLOUD_NAME = 'iujorfq3';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/milnagourmet`;

export const DEFAULT_CREATION_IMAGE = `${CLOUDINARY_BASE_URL}/creation/image-creation-panier.png`;
export const DEFAULT_PRODUCT_NATURE_IMAGE = `${CLOUDINARY_BASE_URL}/produits/yogurt-nature.jpg`;
export const DEFAULT_PRODUCT_LIQUID_IMAGE = `${CLOUDINARY_BASE_URL}/produits/yogurt-liquid.jpg`;
