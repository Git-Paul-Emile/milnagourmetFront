import React from 'react';

export interface OptionItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  hoverBgColor: string;
  buttonColor: string;
  buttonHoverColor: string;
}

export type OptionType = 'fruits' | 'sauces' | 'cereales';

export interface OptionsModalProps {
  isOpen: boolean;
  type: OptionType;
  items: string[];
  onClose: () => void;
  onAddBulk: (newItems: string[]) => void;
  onRemove: (item: string) => void;
  onEdit: (oldItem: string, newItem: string) => void;
}