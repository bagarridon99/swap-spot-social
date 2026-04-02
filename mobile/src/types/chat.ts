export interface Conversation {
  id: string;
  participantIds: string[];
  participant: {
    id: string;
    name: string;
    initials: string;
    avatarUrl?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageAt: string;
  timeAgo: string;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  time: string;
  read: boolean;
  type: 'text' | 'image' | 'proposal';
}
