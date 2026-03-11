import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface BadgeProps {
  status: 'available' | 'used' | 'expired' | 'pending';
  customText?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({ 
  status, 
  customText,
  size = 'md',
  style 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          backgroundColor: COLORS.green,
          textColor: COLORS.white,
          text: customText || 'Tersedia',
          icon: '●',
        };
      case 'used':
        return {
          backgroundColor: COLORS.gray,
          textColor: COLORS.white,
          text: customText || 'Sudah Digunakan',
          icon: '✓',
        };
      case 'expired':
        return {
          backgroundColor: '#E53935',
          textColor: COLORS.white,
          text: customText || 'Kedaluwarsa',
          icon: '✕',
        };
      case 'pending':
        return {
          backgroundColor: '#FFA726',
          textColor: COLORS.white,
          text: customText || 'Menunggu',
          icon: '◐',
        };
      default:
        return {
          backgroundColor: COLORS.gray,
          textColor: COLORS.white,
          text: customText || 'Unknown',
          icon: '•',
        };
    }
  };

  const config = getStatusConfig();

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 2,
          paddingHorizontal: 8,
          fontSize: 10,
          iconSize: 6,
        };
      case 'lg':
        return {
          paddingVertical: 6,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 10,
        };
      default: // md
        return {
          paddingVertical: 4,
          paddingHorizontal: 12,
          fontSize: 12,
          iconSize: 8,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View 
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style
      ]}
    >
      <Text 
        style={[
          styles.badgeIcon,
          { 
            color: config.textColor,
            fontSize: sizeStyles.iconSize,
            marginRight: size === 'sm' ? 2 : 4,
          }
        ]}
      >
        {config.icon}
      </Text>
      <Text 
        style={[
          styles.badgeText,
          { 
            color: config.textColor,
            fontSize: sizeStyles.fontSize,
          }
        ]}
      >
        {config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeIcon: {
    fontWeight: 'bold',
  },
  badgeText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default Badge;