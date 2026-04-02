import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Radius, Spacing } from '../../constants/layout';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles: Record<ButtonSize, { height: number; paddingH: number; fontSize: number; iconSize: number }> = {
    sm: { height: 36, paddingH: Spacing.md, fontSize: 13, iconSize: 16 },
    md: { height: 48, paddingH: Spacing.lg, fontSize: 15, iconSize: 18 },
    lg: { height: 56, paddingH: Spacing.xl, fontSize: 17, iconSize: 20 },
  };

  const currentSize = sizeStyles[size];

  const getTextColor = () => {
    if (isDisabled) return Colors.textMuted;
    switch (variant) {
      case 'primary':
        return Colors.textInverse;
      case 'outline':
        return Colors.primary;
      case 'ghost':
        return Colors.primary;
      case 'danger':
        return Colors.error;
      default:
        return Colors.textInverse;
    }
  };

  const content = (
    <View style={[styles.contentContainer, { height: currentSize.height, paddingHorizontal: currentSize.paddingH }]}>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={currentSize.iconSize} color={getTextColor()} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { fontSize: currentSize.fontSize, color: getTextColor() }]}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={currentSize.iconSize} color={getTextColor()} style={styles.iconRight} />
          )}
        </>
      )}
    </View>
  );

  const containerStyle: ViewStyle[] = [
    styles.base,
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style as ViewStyle,
  ].filter(Boolean) as ViewStyle[];

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={containerStyle}
      >
        <LinearGradient
          colors={isDisabled ? [Colors.border, Colors.border] : [Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: Radius.xl }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        ...containerStyle,
        variant === 'outline' && styles.outlineContainer,
        variant === 'ghost' && styles.ghostContainer,
        variant === 'danger' && styles.dangerContainer,
        { borderRadius: Radius.xl },
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  outlineContainer: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  dangerContainer: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    backgroundColor: 'transparent',
  },
});

export default CustomButton;
