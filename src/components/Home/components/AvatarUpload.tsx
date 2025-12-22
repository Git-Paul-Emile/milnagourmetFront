import React from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AvatarUploadProps {
  avatarPreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}

export function AvatarUpload({ avatarPreview, fileInputRef, onFileSelect, onRemoveAvatar }: AvatarUploadProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <Camera className="h-4 w-4" />
        <span>Photo de profil (optionnel)</span>
      </Label>

      {/* Preview */}
      {avatarPreview && (
        <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
          <img
            src={avatarPreview}
            alt="Preview"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Image sélectionnée</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemoveAvatar}
            className="text-xs"
          >
            Supprimer
          </Button>
        </div>
      )}

      {/* File input */}
      <div className="flex items-center space-x-3">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
          id="avatar-file"
        />
        <Label
          htmlFor="avatar-file"
          className="flex items-center space-x-2 px-4 py-2 border border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span className="text-sm">
            {avatarPreview ? 'Changer l\'image' : 'Sélectionner une image'}
          </span>
        </Label>
      </div>
      <p className="text-xs text-muted-foreground">
        Formats acceptés: JPG, PNG, GIF. Taille max: 2MB (sera compressée automatiquement)
      </p>
    </div>
  );
}