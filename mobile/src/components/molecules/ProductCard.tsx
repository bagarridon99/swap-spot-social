import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Radius, Spacing, Shadow } from '../../constants/layout';
import { Product } from '../../types';
import Avatar from '../atoms/Avatar';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  width?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  saved,
  onToggleSave,
  width,
}) => {
  const { imageUrl, title, wantsInReturn, condition, userName, userInitials, location, createdAt, boosted } = product;
  const cardWidth = width || (Dimensions.get('window').width - Spacing.base * 3) / 2;
  const timeAgo = createdAt ? getTimeAgo(createdAt) : '';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        Shadow.md,
        { width: cardWidth },
        boosted && styles.cardBoosted,
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: cardWidth, height: cardWidth }]}
          resizeMode="cover"
        />

        {/* Top-left badges */}
        <View style={styles.topLeftBadges}>
          {boosted ? (
            <View style={styles.boostedBadge}>
              <Ionicons name="flash" size={10} color={Colors.textInverse} />
              <Text style={styles.boostedText}>Destacado</Text>
            </View>
          ) : (
            <View style={styles.swapBadge}>
              <Ionicons name="swap-horizontal" size={10} color={Colors.primary} />
              <Text style={styles.swapBadgeText}>Trueque</Text>
            </View>
          )}
        </View>

        {/* Top-right badges */}
        <View style={styles.topRightBadges}>
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{condition}</Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation?.();
              onToggleSave?.();
            }}
            style={styles.saveButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={16}
              color={saved ? Colors.error : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.wantsRow}>
          <Ionicons name="swap-horizontal" size={13} color={Colors.primary} />
          <Text style={styles.wantsText} numberOfLines={1}>
            Busca: {wantsInReturn}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.userInfo}>
            <Avatar initials={userInitials} size="sm" />
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={11} color={Colors.textMuted} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardBoosted: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    backgroundColor: Colors.backgroundSecondary,
  },
  topLeftBadges: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    gap: 4,
  },
  boostedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  boostedText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
  swapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  swapBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  topRightBadges: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conditionBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  conditionText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  saveButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  wantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  wantsText: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    flex: 1,
  },
  userName: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

export default ProductCard;

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}
