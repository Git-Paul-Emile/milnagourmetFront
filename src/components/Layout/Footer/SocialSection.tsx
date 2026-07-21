import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { SocialMedia } from '@/types';
import { cn } from '@/lib/utils';

interface SocialSectionProps {
  socialMedia: SocialMedia | null;
}

export function SocialSection({ socialMedia }: SocialSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center gap-4">
        {socialMedia?.instagram && (
          <a
            href={socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 transition-colors hover:text-white"
          >
            <Instagram className="h-5 w-5" />
          </a>
        )}
        {socialMedia?.facebook && (
          <a
            href={socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 transition-colors hover:text-white"
          >
            <Facebook className="h-5 w-5" />
          </a>
        )}
        {socialMedia?.tiktok && (
          <a
            href={socialMedia.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
}