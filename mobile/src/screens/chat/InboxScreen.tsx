import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ChatStackParamList } from '../../navigation/types';
import ConversationItem from '../../components/molecules/ConversationItem';
import { Conversation } from '../../types';
import { subscribeToConversations } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/layout';
import { FontSize, FontWeight } from '../../constants/typography';

type InboxNavProp = NativeStackNavigationProp<ChatStackParamList, 'Inbox'>;

const InboxScreen = () => {
  const navigation = useNavigation<InboxNavProp>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [conversations, setConversations] = React.useState<Conversation[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToConversations(user.uid, (data) => {
      setConversations(data);
    });
    return () => unsubscribe();
  }, [user]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mensajes</Text>
          {totalUnread > 0 && (
            <Text style={styles.subtitle}>{totalUnread} mensaje{totalUnread !== 1 ? 's' : ''} sin leer</Text>
          )}
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="create-outline" size={22} color={Colors.primary} />
        </View>
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            id={item.id}
            name={item.participant.name}
            initials={item.participant.initials}
            lastMessage={item.lastMessage}
            time={item.timeAgo}
            unread={item.unreadCount}
            online={item.participant.online}
            onPress={() =>
              navigation.navigate('Chat', {
                conversationId: item.id,
                name: item.participant.name,
                initials: item.participant.initials,
                online: item.participant.online,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Sin conversaciones</Text>
            <Text style={styles.emptySubtitle}>
              Inicia una conversación proponiendo un trueque
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.card,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.massive * 2,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
});

export default InboxScreen;
