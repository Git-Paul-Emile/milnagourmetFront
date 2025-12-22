// Types pour les produits

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  description: string;
  image: string;
  available: boolean;
  archived?: boolean;
}

export interface CremeuxProduct extends Product {
  category: 'cremeux';
  type: 'nature' | 'simple' | 'cereales';
}

export interface LiquideProduct extends Product {
  category: 'liquide';
  flavor: 'vanille' | 'bissap' | 'couscous' | 'coco';
}

export type ProductCategory = string;

export interface ProductCategoryItem {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
}
