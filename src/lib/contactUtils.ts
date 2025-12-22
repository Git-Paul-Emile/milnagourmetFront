import { faWhatsapp, faTiktok, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { contactMilnaWhatsApp, callMilna } from '@/services/whatsapp';
import { ContactSectionData } from '@/types';

export interface ContactMethod {
  faIcon?: IconDefinition;
  title: string;
  description: string;
  action: () => Promise<void>;
  primary: boolean;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  faIcon?: IconDefinition;
}

export function transformContactMethods(methods: ContactSectionData['methods']): ContactMethod[] {
  return methods.map(method => {
    const isPrimary = method.primary || method.title.toLowerCase().includes('whatsapp');
    let faIcon: IconDefinition | undefined;
    if (method.title.toLowerCase().includes('whatsapp')) {
      faIcon = faWhatsapp;
    } else if (method.title.toLowerCase().includes('appeler')) {
      faIcon = faPhone;
    }
    return {
      faIcon,
      title: method.title,
      description: method.description,
      action: method.title.toLowerCase().includes('whatsapp')
        ? async () => await contactMilnaWhatsApp('Bonjour Milna Gourmet ! Je souhaiterais commander directement.')
        : async () => await callMilna(),
      primary: isPrimary
    };
  });
}

export function transformSocialLinks(socialLinks: ContactSectionData['socialLinks']): SocialLink[] {
  return socialLinks.map(link => {
    let faIcon: IconDefinition | undefined;
    switch (link.name.toLowerCase()) {
      case 'instagram':
        faIcon = faInstagram;
        break;
      case 'tiktok':
        faIcon = faTiktok;
        break;
      case 'facebook':
        faIcon = faFacebook;
        break;
      case 'twitter':
        faIcon = faTwitter;
        break;
    }
    return {
      ...link,
      faIcon: faIcon
    };
  });
}