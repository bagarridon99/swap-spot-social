import { UserProfile } from './user';

export interface Product {
  id: string;
  images: string[];
  title: string;
  description: string;
  wantsInReturn: string;
  acceptableItems: string[];
  condition: ProductCondition;
  category: string;
  createdAt: string;
  timeAgo: string;
  user: UserProfile;
  saved?: boolean;
  views?: number;
  boosted?: boolean;
  premium?: boolean;
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
