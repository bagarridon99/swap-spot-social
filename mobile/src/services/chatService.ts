/**
 * Chat Service
 * Handles Firestore real-time messaging.
 */

import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';
import { Conversation, Message } from '../types';

const CONVERSATIONS = 'conversations';
const MESSAGES = 'messages';

export const getOrCreateConversation = async (
  currentUserId: string,
  targetUserId: string,
  targetUserParams: { name: string, initials: string },
  productId?: string,
  productTitle?: string
): Promise<string> => {
  const convsRef = collection(db, CONVERSATIONS);
  
  // Try to find existing conversation
  const q = query(
    convsRef, 
    where('participantIds', 'array-contains', currentUserId)
  );
  
  const snapshot = await getDocs(q);
  const existing = snapshot.docs.find(d => {
    const data = d.data();
    return data.participantIds.includes(targetUserId);
  });

  if (existing) return existing.id;

  // Create new
  const newConv = {
    participantIds: [currentUserId, targetUserId],
    participant: {
      id: targetUserId,
      ...targetUserParams,
      online: true
    },
    lastMessage: '...',
    lastMessageAt: new Date().toISOString(),
    timeAgo: 'Justo ahora',
    unreadCount: 0,
    productId,
    productTitle
  };

  const newDoc = await addDoc(convsRef, newConv);
  return newDoc.id;
};

export const subscribeToConversations = (userId: string, onUpdate: (convs: Conversation[]) => void) => {
  const q = query(
    collection(db, CONVERSATIONS),
    where('participantIds', 'array-contains', userId)
  );

  return onSnapshot(q, (snapshot) => {
    const convs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Conversation[];
    
    convs.sort((a,b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    onUpdate(convs);
  });
};

export const subscribeToMessages = (conversationId: string, onUpdate: (msgs: Message[]) => void) => {
  const q = query(
    collection(db, `${CONVERSATIONS}/${conversationId}/${MESSAGES}`),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    onUpdate(msgs);
  });
};

export const sendMessage = async (conversationId: string, senderId: string, text: string) => {
  const now = new Date();
  
  const msgData = {
    conversationId,
    senderId,
    text,
    timestamp: now.toISOString(),
    time: now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    type: 'text'
  };

  await addDoc(collection(db, `${CONVERSATIONS}/${conversationId}/${MESSAGES}`), msgData);

  // Update conversation lastMessage
  await updateDoc(doc(db, CONVERSATIONS, conversationId), {
    lastMessage: text,
    lastMessageAt: now.toISOString(),
    timeAgo: 'Justo ahora'
  });
};
