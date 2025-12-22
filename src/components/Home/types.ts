export interface TestimonialFormData {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

export interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EmojiClickData {
  emoji: string;
}