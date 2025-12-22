import { OptionType } from '../types/OptionsModal.types';

export function processBulkText(bulkText: string, existingItems: string[]): string[] {
  return bulkText
    .split('\n')
    .map(item => item.trim())
    .filter(item => item.length > 0 && !existingItems.includes(item));
}

export function getBulkAddMessage(type: OptionType, optionName: string, newItemsCount: number): string {
  if (newItemsCount === 0) {
    const genderPrefix = type === 'cereales' ? 'Aucun' : '';
    const genderSuffix = type === 'cereales' ? '' : type === 'sauces' ? 'e' : '';
    return `${genderPrefix}${genderSuffix} nouveau${genderSuffix} ${optionName.toLowerCase()} à ajouter ou tous existent déjà`;
  }
  return '';
}

export function getDuplicateEditMessage(type: OptionType, optionName: string): string {
  const genderPrefix = type === 'cereales' ? 'Ce' : type === 'sauces' ? 'Cett' : 'Ce';
  const genderSuffix = type === 'cereales' ? '' : type === 'sauces' ? 'e' : '';
  return `${genderPrefix}${genderSuffix} ${optionName.toLowerCase().slice(0, -1)} existe déjà`;
}

export function getGenderedArticle(type: OptionType): string {
  return type === 'cereales' ? 'e' : type === 'sauces' ? 'e' : '';
}

export function getPluralSuffix(type: OptionType): string {
  return type === 'cereales' ? 'es' : type === 'sauces' ? 'es' : 's';
}

export function getAddButtonColorClass(type: OptionType): string {
  switch (type) {
    case 'fruits':
      return 'bg-orange-500 text-white hover:bg-orange-600';
    case 'sauces':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'cereales':
      return 'bg-purple-500 text-white hover:bg-purple-600';
    default:
      return 'bg-gray-500 text-white hover:bg-gray-600';
  }
}