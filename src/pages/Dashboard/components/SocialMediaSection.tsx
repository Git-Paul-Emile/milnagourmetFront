import React from 'react';
import { Globe } from 'lucide-react';
import { SocialMedia } from './useSettingsState';

interface SocialMediaSectionProps {
  socialMedia: SocialMedia;
  onSocialMediaChange: (field: keyof SocialMedia, value: string) => void;
}

export function SocialMediaSection({ socialMedia, onSocialMediaChange }: SocialMediaSectionProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Globe className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Réseaux sociaux</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Facebook</label>
          <input
            type="url"
            value={socialMedia.facebook}
            onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
            placeholder="https://facebook.com/votrepage"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Instagram</label>
          <input
            type="url"
            value={socialMedia.instagram}
            onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
            placeholder="https://instagram.com/votrecompte"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">TikTok</label>
          <input
            type="url"
            value={socialMedia.tiktok}
            onChange={(e) => onSocialMediaChange('tiktok', e.target.value)}
            className="w-full p-2 border border-border rounded-lg"
            placeholder="https://tiktok.com/@votrecompte"
          />
        </div>
      </div>
    </div>
  );
}