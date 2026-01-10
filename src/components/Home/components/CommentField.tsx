import React from 'react';
import { MessageSquare, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TESTIMONIAL_CONSTANTS } from '../constants';

interface CommentFieldProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  showEmojiPicker: boolean;
  emojiPickerRef: React.RefObject<HTMLDivElement>;
  onToggleEmojiPicker: () => void;
  onEmojiClick: (emojiData: { emoji: string }) => void;
}

export function CommentField({
  comment,
  onCommentChange,
  showEmojiPicker,
  emojiPickerRef,
  onToggleEmojiPicker,
  onEmojiClick
}: CommentFieldProps) {
  return (
    <div className="space-y-2 relative">
      <Label htmlFor="comment" className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>Commentaire *</span>
        </div>
        <button
          type="button"
          onClick={onToggleEmojiPicker}
          className="p-1 hover:bg-muted rounded-full transition-colors"
          title="Ajouter un emoji"
        >
          <Smile className="h-4 w-4 text-muted-foreground" />
        </button>
      </Label>

      {/* Emoji Picker - Position absolue pour ne pas allonger le modal */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-0 right-0 z-50 mb-2 border border-border rounded-lg p-3 bg-background shadow-lg"
        >
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            width="100%"
            height={250}
            previewConfig={{
              showPreview: false
            }}
            skinTonesDisabled
            searchDisabled={false}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Cliquez sur un emoji pour l'ajouter à votre commentaire
          </p>
        </div>
      )}

      <Textarea
        id="comment"
        placeholder="Partagez votre expérience..."
        value={comment}
        onChange={(e) => {
          const value = e.target.value;
          if (value.length <= TESTIMONIAL_CONSTANTS.MAX_COMMENT_LENGTH) {
            onCommentChange(value);
          }
        }}
        className="w-full min-h-[100px] resize-none"
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Maximum 4 lignes recommandées</span>
        <span>{comment.length}/{TESTIMONIAL_CONSTANTS.MAX_COMMENT_LENGTH} caractères</span>
      </div>
    </div>
  );
}