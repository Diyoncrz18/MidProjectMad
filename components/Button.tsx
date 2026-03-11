import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  StyleProp, 
  ViewStyle, 
  ActivityIndicator 
} from 'react-native';
import { COLORS } from '../constants/theme';

interface ButtonProps { 
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
}) => {
  const getButtonStyles = () => {
    const baseStyles: any[] = [styles.button];
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.btnPrimary);
        break;
      case 'outline':
        baseStyles.push(styles.btnOutline);
        break;
      case 'ghost':
        baseStyles.push(styles.btnGhost);
        break;
    }
    
    // Size styles
    switch (size) {
      case 'sm':
        baseStyles.push(styles.btnSm);
        break;
      case 'lg':
        baseStyles.push(styles.btnLg);
        break;
      default:
        baseStyles.push(styles.btnMd);
    }
    
    // Disabled state
    if (disabled) {
      baseStyles.push(styles.btnDisabled);
    }
    
    return baseStyles;
  };

  const getTextStyles = () => {
    const textStyles: any[] = [styles.btnText];
    
    switch (variant) {
      case 'primary':
        textStyles.push(styles.btnTextPrimary);
        break;
      case 'outline':
        textStyles.push(styles.btnTextOutline);
        break;
      case 'ghost':
        textStyles.push(styles.btnTextGhost);
        break;
    }
    
    if (disabled) {
      textStyles.push(styles.btnTextDisabled);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? COLORS.white : COLORS.green} 
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>
          {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
          {title}
          {rightIcon && <Text style={styles.icon}>{rightIcon}</Text>}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnPrimary: {
    backgroundColor: COLORS.brown,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnMd: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  btnLg: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  btnDisabled: {
    backgroundColor: COLORS.gray,
    borderColor: COLORS.gray,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnTextPrimary: {
    color: COLORS.white,
  },
  btnTextOutline: {
    color: COLORS.green,
  },
  btnTextGhost: {
    color: COLORS.brown,
  },
  btnTextDisabled: {
    color: COLORS.gray,
  },
  icon: {
    marginHorizontal: 4,
  },
});

export default Button;