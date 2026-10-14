import React from 'react';
import { X, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddTestimonialModalProps } from './types';
import { useTestimonialForm } from './useTestimonialForm';
import { useEmojiPicker } from './useEmojiPicker';
import { AvatarUpload, RatingStars, CommentField } from './components';

export function AddTestimonialModal({ isOpen, onClose, onSuccess }: AddTestimonialModalProps) {
  const {
    formData,
    avatarPreview,
    isSubmitting,
    fileInputRef,
    handleInputChange,
    handleFileSelect,
    removeAvatar,
    handleSubmit,
  } = useTestimonialForm(onSuccess, onClose);

  const { showEmojiPicker, emojiPickerRef, onEmojiClick, toggleEmojiPicker } =
    useEmojiPicker(formData.comment, (comment) => handleInputChange('comment', comment));

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-md w-full border border-border shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">Soumettre un témoignage</h2>
              <p className="text-sm text-muted-foreground">
                Partagez votre expérience. Votre témoignage sera visible après validation.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Votre nom *</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre prénom et nom"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Ville */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Votre ville *</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Votre ville ou quartier"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full"
                />
              </div>

              <RatingStars
                rating={formData.rating}
                onRatingChange={(rating) => handleInputChange('rating', rating)}
              />

              <CommentField
                comment={formData.comment}
                onCommentChange={(comment) => handleInputChange('comment', comment)}
                showEmojiPicker={showEmojiPicker}
                emojiPickerRef={emojiPickerRef}
                onToggleEmojiPicker={toggleEmojiPicker}
                onEmojiClick={onEmojiClick}
              />

              <AvatarUpload
                avatarPreview={avatarPreview}
                fileInputRef={fileInputRef}
                onFileSelect={handleFileSelect}
                onRemoveAvatar={removeAvatar}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 p-6 border-t border-border">
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
                Annuler
              </Button>
              <Button
                type="submit"
                form="testimonial-form"
                className="flex-1 bg-button text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground hover:shadow-lg"
                loading={isSubmitting}
              >
                Soumettre
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}