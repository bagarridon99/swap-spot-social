export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  wantsInReturn: string;
  acceptableItems: string[];
  condition: string;
  category: string;
  createdAt: string;
  userId: string;
  userName: string;
  userInitials: string;
  location: string;
  region: string;
  boosted?: boolean;
}

export type ProductCondition =
  | 'Nuevo'
  | 'Como nuevo'
  | 'Buen estado'
  | 'Usado'
  | 'Para reparar';

export const PRODUCT_CONDITIONS: ProductCondition[] = [
  'Nuevo',
  'Como nuevo',
  'Buen estado',
  'Usado',
  'Para reparar',
];
