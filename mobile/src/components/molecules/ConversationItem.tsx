import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/layout';
import Avatar from '../atoms/Avatar';

interface ConversationItemProps {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  initials,
  lastMessage,
  time,
  unread,
  online,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} style={styles.container}>
      <Avatar initials={initials} size="lg" online={online} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.name, unread > 0 && styles.nameBold]}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={[styles.message, unread > 0 && styles.messageBold]} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>

      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  nameBold: {
    fontWeight: FontWeight.bold,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  message: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  messageBold: {
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
});

export default ConversationItem;
