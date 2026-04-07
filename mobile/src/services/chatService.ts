/**
 * Chat Service — Supabase
 */
import { supabase } from './supabase';

export interface ChatConversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantInitials: Record<string, string>;
  lastMessage: string;
  lastMessageAt: string;
  unreadBy: string[];
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export const getOrCreateConversation = async (
  currentUserId: string,
  currentUserName: string,
  currentUserInitials: string,
  targetUserId: string,
  targetUserName: string,
  targetUserInitials: string
): Promise<string> => {
  // Try to find existing chat
  const { data: chats } = await supabase
    .from('chats')
    .select('*')
    .contains('participants', [currentUserId, targetUserId]);

  if (chats && chats.length > 0) return chats[0].id;

  const names: Record<string, string> = {};
  names[currentUserId] = currentUserName;
  names[targetUserId] = targetUserName;

  const initials: Record<string, string> = {};
  initials[currentUserId] = currentUserInitials;
  initials[targetUserId] = targetUserInitials;

  const { data, error } = await supabase.from('chats').insert({
    participants: [currentUserId, targetUserId],
    participant_names: names,
    participant_initials: initials,
    last_message: '',
    unread_by: [],
  }).select('id').single();

  if (error) throw error;
  return data.id;
};

export const subscribeToConversations = (
  userId: string,
  onUpdate: (convs: ChatConversation[]) => void
) => {
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .contains('participants', [userId])
      .order('updated_at', { ascending: false });

    if (error || !data) return;

    const mapped: ChatConversation[] = data.map((c: any) => ({
      id: c.id,
      participants: c.participants,
      participantNames: c.participant_names || {},
      participantInitials: c.participant_initials || {},
      lastMessage: c.last_message || '',
      lastMessageAt: c.updated_at || c.created_at,
      unreadBy: c.unread_by || [],
    }));

    onUpdate(mapped);
  };

  fetchChats();

  const channel = supabase
    .channel(`chats:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
      fetchChats();
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const subscribeToMessages = (
  chatId: string,
  onUpdate: (msgs: ChatMessage[]) => void
) => {
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error || !data) return;

    const mapped: ChatMessage[] = data.map((m: any) => ({
      id: m.id,
      chatId: m.chat_id,
      senderId: m.sender_id,
      text: m.text,
      createdAt: m.created_at,
    }));

    onUpdate(mapped);
  };

  fetchMessages();

  const channel = supabase
    .channel(`messages:${chatId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `chat_id=eq.${chatId}`,
    }, () => {
      fetchMessages();
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  otherUserId: string
) => {
  await supabase.from('messages').insert({
    chat_id: chatId,
    sender_id: senderId,
    text,
  });

  // Update chat metadata
  const { data: chatData } = await supabase
    .from('chats')
    .select('unread_by')
    .eq('id', chatId)
    .single();

  const currentUnread: string[] = chatData?.unread_by || [];
  if (!currentUnread.includes(otherUserId)) {
    currentUnread.push(otherUserId);
  }

  await supabase.from('chats').update({
    last_message: text,
    unread_by: currentUnread,
  }).eq('id', chatId);
};

export const markChatAsRead = async (chatId: string, userId: string) => {
  const { data } = await supabase
    .from('chats')
    .select('unread_by')
    .eq('id', chatId)
    .single();

  if (data?.unread_by) {
    const updated = (data.unread_by as string[]).filter((id: string) => id !== userId);
    await supabase.from('chats').update({ unread_by: updated }).eq('id', chatId);
  }
};
