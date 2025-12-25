import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { SocialMedia } from '@/types';
import { cn } from '@/lib/utils';

interface SocialSectionProps {
  socialMedia: SocialMedia | null;
  isChristmasTheme?: boolean;
}

export function SocialSection({ socialMedia, isChristmasTheme = false }: SocialSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className={cn(
        "text-lg font-semibold",
        "text-foreground"
      )}>Suivez-nous</h3>
      <div className="flex space-x-4">
        {socialMedia?.instagram && (
          <a
            href={socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              "text-muted-foreground hover:text-primary"
            )}
          >
            <Instagram className="h-5 w-5" />
          </a>
        )}
        {socialMedia?.facebook && (
          <a
            href={socialMedia.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              "text-muted-foreground hover:text-primary"
            )}
          >
            <Facebook className="h-5 w-5" />
          </a>
        )}
        {socialMedia?.tiktok && (
          <a
            href={socialMedia.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "transition-colors",
              "text-muted-foreground hover:text-primary"
            )}
          >
            <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  );
}