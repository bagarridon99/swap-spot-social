import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontWeight } from '../../constants/typography';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  verified?: boolean;
  online?: boolean;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, { container: number; font: number; badge: number; badgeIcon: number }> = {
  sm: { container: 32, font: 11, badge: 14, badgeIcon: 8 },
  md: { container: 44, font: 15, badge: 16, badgeIcon: 10 },
  lg: { container: 60, font: 20, badge: 20, badgeIcon: 12 },
  xl: { container: 80, font: 26, badge: 24, badgeIcon: 14 },
};

const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 'md',
  verified = false,
  online,
  style,
}) => {
  const dimensions = sizeMap[size];

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          {
            width: dimensions.container,
            height: dimensions.container,
            borderRadius: dimensions.container / 2,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            { fontSize: dimensions.font },
          ]}
        >
          {initials}
        </Text>
      </View>

      {verified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: dimensions.badge,
              height: dimensions.badge,
              borderRadius: dimensions.badge / 2,
              bottom: -1,
              right: -1,
            },
          ]}
        >
          <Ionicons name="checkmark" size={dimensions.badgeIcon} color={Colors.textInverse} />
        </View>
      )}

      {online !== undefined && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: dimensions.badge * 0.7,
              height: dimensions.badge * 0.7,
              borderRadius: (dimensions.badge * 0.7) / 2,
              backgroundColor: online ? Colors.online : Colors.offline,
              top: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: Colors.textInverse,
    fontWeight: FontWeight.bold,
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: Colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.card,
  },
  onlineIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.card,
  },
});

export default Avatar;
