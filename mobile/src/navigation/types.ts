import { Product } from '../types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type FeedStackParamList = {
  FeedHome: undefined;
  ProductDetail: { product: Product };
};

export type ChatStackParamList = {
  Inbox: undefined;
  Chat: {
    conversationId: string;
    name: string;
    initials: string;
    online: boolean;
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
};

export type MainTabParamList = {
  FeedTab: undefined;
  PublishTab: undefined;
  ChatTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
