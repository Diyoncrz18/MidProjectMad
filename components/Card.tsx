import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shadow?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  shadow = 'md'
}) => {
  const shadowStyles = {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
  };

  return (
    <View 
      style={[
        {
          backgroundColor: COLORS.white,
          borderRadius: 16,
          padding: 20,
        },
        shadowStyles[shadow],
        style
      ]}
    >
      {children}
    </View>
  );
};

export default Card;