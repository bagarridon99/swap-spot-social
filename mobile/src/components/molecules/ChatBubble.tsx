import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, Radius } from '../../constants/layout';

interface ChatBubbleProps {
  text: string;
  time: string;
  isOwn: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, time, isOwn }) => {
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
          {text}
        </Text>
        <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 3,
    paddingHorizontal: Spacing.base,
  },
  wrapperOwn: {
    alignItems: 'flex-end',
  },
  wrapperOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.xl,
  },
  bubbleOwn: {
    backgroundColor: Colors.chatBubbleOwn,
    borderBottomRightRadius: Radius.xs,
  },
  bubbleOther: {
    backgroundColor: Colors.chatBubbleOther,
    borderBottomLeftRadius: Radius.xs,
  },
  text: {
    fontSize: FontSize.base,
    lineHeight: 20,
  },
  textOwn: {
    color: Colors.chatBubbleOwnText,
  },
  textOther: {
    color: Colors.chatBubbleOtherText,
  },
  time: {
    fontSize: FontSize.xs - 2,
    marginTop: 4,
  },
  timeOwn: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  timeOther: {
    color: Colors.textMuted,
  },
});

export default ChatBubble;
