import { Apple, Cookie, Wheat } from 'lucide-react';
import { OptionItem, OptionType } from '../types/OptionsModal.types';

export const optionTypes: Record<OptionType, OptionItem> = {
  fruits: {
    name: 'Fruits',
    icon: Apple,
    color: 'text-pink-800',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
    hoverBgColor: 'hover:bg-pink-100',
    buttonColor: 'text-pink-600 hover:text-pink-800',
    buttonHoverColor: 'hover:bg-pink-100'
  },
  sauces: {
    name: 'Sauces',
    icon: Cookie,
    color: 'text-blue-800',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    hoverBgColor: 'hover:bg-blue-100',
    buttonColor: 'text-blue-600 hover:text-blue-800',
    buttonHoverColor: 'hover:bg-blue-100'
  },
  cereales: {
    name: 'Céréales',
    icon: Wheat,
    color: 'text-purple-800',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    hoverBgColor: 'hover:bg-purple-100',
    buttonColor: 'text-purple-600 hover:text-purple-800',
    buttonHoverColor: 'hover:bg-purple-100'
  }
};