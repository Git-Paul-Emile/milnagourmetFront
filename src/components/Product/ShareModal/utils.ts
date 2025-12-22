import { Product } from '@/types';

export const generateShareUrl = (): string => {
  return window.location.origin + '/';
};

export const generateShareText = (product: Product): string => {
  const shareUrl = generateShareUrl();
  return `Découvre le plaisir à l'état pur !
Notre ${product.name} t'offre un yaourt, doux et irrésistible… parfait pour une pause fraîche et gourmande.

Prix : ${product.price} FCFA
Goûte-le et laisse-toi surprendre !

👉 Commandez votre Gourmet Simple ici : ${shareUrl}`;
};

export const shareToWhatsApp = (shareText: string): void => {
  const message = encodeURIComponent(shareText);
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
};

export const shareToTwitter = (shareText: string, shareUrl: string): void => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  window.open(url, '_blank');
};