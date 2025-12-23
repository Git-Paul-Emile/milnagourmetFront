import React from 'react';
import { User as UserIcon, Upload, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageOption } from './useSettingsState';
import { getFullImageUrl } from '@/utils/imageUtils';

interface AvatarsSectionProps {
  avatarToast: string;
  availableImages: ImageOption[];
  onAvatarToastUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarToastSelect: (avatarPath: string) => void;
}

export function AvatarsSection({ avatarToast, availableImages, onAvatarToastUpload, onAvatarToastSelect }: AvatarsSectionProps) {
  const [showGallery, setShowGallery] = React.useState(false);

  // Filtrer uniquement les images d'avatars de toast
  const avatarToastImages = availableImages.filter(image => image.value.includes('/uploads/avatarToast/'));

  return (
    <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
      <div className="flex items-center space-x-3 mb-4">
        <UserIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold">Avatars</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 sm:mb-3">Avatar pour les toasts</label>
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <img
              src={getFullImageUrl(avatarToast)}
              alt="Avatar toast actuel"
              className="w-16 h-16 object-cover border border-border rounded-full flex-shrink-0"
            />
            <div className="flex-1 space-y-4">
             <div className="flex flex-col space-y-4">
               {/* Bouton pour afficher/masquer la galerie */}
              {availableImages.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowGallery(!showGallery)}
                    className="flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Avatars existants ({avatarToastImages.length})</span>
                    {showGallery ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              )}

              {/* Mini-galerie des avatars existants */}
              {showGallery && avatarToastImages.length > 0 && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {avatarToastImages.map((image) => (
                      <button
                        key={image.value}
                        type="button"
                        onClick={() => onAvatarToastSelect(image.value)}
                        className={`relative p-2 border-2 rounded-lg transition-all hover:scale-105 ${
                          avatarToast === image.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={getFullImageUrl(image.value)}
                          alt={image.label}
                          className="w-full h-10 sm:h-12 object-cover rounded-full"
                        />
                        {avatarToast === image.value && (
                          <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

             </div>
              {/* Séparateur */}
              {avatarToastImages.length > 0 && (
                <div className="flex items-center space-x-2 py-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
              )}

              {/* Upload d'un nouvel avatar */}
              <div className='flex flex-col space-y-2'>
                <label className="block text-sm font-medium">
                  {avatarToastImages.length > 0 ? 'Télécharger un nouvel avatar' : 'Télécharger un avatar'}
                </label>
                <div>
                  <label className="cursor-pointer px-3 sm:px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center text-sm">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Choisir un fichier</span>
                  <span className="sm:hidden">Fichier</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onAvatarToastUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Formats acceptés: PNG, JPG, GIF, WebP (max 5MB)
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}