import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Product } from '@/types';
import { generateShareText, generateShareUrl, shareToWhatsApp, shareToTwitter } from './utils';

export interface ShareOption {
  name: string;
  icon: IconDefinition;
  color: string;
  action: () => void;
}

export const createShareOptions = (product: Product): ShareOption[] => {
  const shareUrl = generateShareUrl();
  const shareText = generateShareText(product);

  return [
    {
      name: 'WhatsApp',
      icon: faWhatsapp,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => shareToWhatsApp(shareText),
    },
    {
      name: 'X (Twitter)',
      icon: faXTwitter,
      color: 'bg-black hover:bg-gray-800',
      action: () => shareToTwitter(shareText, shareUrl),
    },
  ];
};