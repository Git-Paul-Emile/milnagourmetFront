import { useState, useEffect, useRef } from 'react';
import { EmojiClickData } from './types';
import { TESTIMONIAL_CONSTANTS } from './constants';

export const useEmojiPicker = (comment: string, onCommentChange: (comment: string) => void) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const newComment = comment + emojiData.emoji;
    // Respecter la limite de caractères
    if (newComment.length <= TESTIMONIAL_CONSTANTS.MAX_COMMENT_LENGTH) {
      onCommentChange(newComment);
    }
  };

  // Fermer le sélecteur d'emojis quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return {
    showEmojiPicker,
    emojiPickerRef,
    onEmojiClick,
    toggleEmojiPicker
  };
};