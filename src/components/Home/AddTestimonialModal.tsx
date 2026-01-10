import React from 'react';
import { X, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddTestimonialModalProps } from './types';
import { useTestimonialForm } from './useTestimonialForm';
import { useEmojiPicker } from './useEmojiPicker';
import { AvatarUpload, RatingStars, CommentField } from './components';
import { useApp } from '@/contexts/useApp';

export function AddTestimonialModal({ isOpen, onClose, onSuccess }: AddTestimonialModalProps) {
  const { state } = useApp();
  const {
    formData,
    avatarPreview,
    isSubmitting,
    fileInputRef,
    handleInputChange,
    handleFileSelect,
    removeAvatar,
    handleSubmit
  } = useTestimonialForm(onSuccess, onClose);

  const {
    showEmojiPicker,
    emojiPickerRef,
    onEmojiClick,
    toggleEmojiPicker
  } = useEmojiPicker(formData.comment, (comment) => handleInputChange('comment', comment));

  // Fermer le modal si l'utilisateur n'est pas connecté
  if (!isOpen || !state.user) {
    if (isOpen && !state.user) {
      onClose();
    }
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-background rounded-2xl max-w-md w-full border border-border shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold">Soumettre un témoignage</h2>
              <p className="text-sm text-muted-foreground">
                Partagez votre expérience avec Milna Gourmet. Votre témoignage sera visible après validation.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Nom complet *</span>
                  {state.user && (
                    <span className="text-xs text-muted-foreground">(Auto-rempli depuis votre compte)</span>
                  )}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={state.user ? "Votre nom est automatiquement rempli" : "Votre nom et prénom"}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  readOnly={!!state.user}
                  className={`w-full ${state.user ? 'bg-muted cursor-not-allowed' : ''}`}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Lieu *</span>
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

              {/* Rating */}
              <RatingStars
                rating={formData.rating}
                onRatingChange={(rating) => handleInputChange('rating', rating)}
              />

              {/* Comment */}
              <CommentField
                comment={formData.comment}
                onCommentChange={(comment) => handleInputChange('comment', comment)}
                showEmojiPicker={showEmojiPicker}
                emojiPickerRef={emojiPickerRef}
                onToggleEmojiPicker={toggleEmojiPicker}
                onEmojiClick={onEmojiClick}
              />

              {/* Avatar */}
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
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                form="testimonial-form"
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
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