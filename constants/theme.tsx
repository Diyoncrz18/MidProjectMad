import { StyleSheet, Platform } from 'react-native';

// --- 🎨 COLOR PALETTE ---
export const COLORS = {
  // Primary Brand Colors
  cream: '#FFF8F0',
  white: '#FFFFFF',
  brown: '#3E2723',
  brownLight: '#5D4037',
  green: '#1B5E20',
  greenLight: '#4CAF50',
  
  // Neutral Colors
  gray: '#9E9E9E',
  grayLight: '#F5F5F5',
  grayDark: '#616161',
  black: '#1A1A1A',
  
  // Semantic / Status Colors
  success: '#4CAF50',
  warning: '#FFA726',
  error: '#E53935',
  info: '#29B6F6',
  
  // Transparent Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  greenTransparent: 'rgba(27, 94, 32, 0.1)',
};

// --- 📏 SPACING SYSTEM ---
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// --- 🔘 BORDER RADIUS ---
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// --- 🔤 TYPOGRAPHY ---
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// --- 🎨 GLOBAL STYLES (StyleSheet) ---
export const globalStyles = StyleSheet.create({
  // Layouts
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Cards - Shadow ditulis inline agar kompatibel
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    // iOS shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 4,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: FONT_SIZES.md,
    color: COLORS.brown,
    height: 56,
  },
  inputFocused: {
    borderColor: COLORS.green,
    borderWidth: 2,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },
  
  // Text Utilities
  textH1: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold as any,
    color: COLORS.brown,
  },
  textH2: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.semibold as any,
    color: COLORS.brown,
  },
  textBody: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular as any,
    color: COLORS.brownLight,
    lineHeight: 20,
  },
  textCaption: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  textLink: {
    color: COLORS.green,
    fontWeight: FONT_WEIGHTS.semibold as any,
  },
  
  // Buttons
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 56,
  },
  buttonPrimary: {
    backgroundColor: COLORS.brown,
  },
  buttonSecondary: {
    backgroundColor: COLORS.green,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold as any,
    color: COLORS.white,
  },
  buttonTextOutline: {
    color: COLORS.green,
  },
  
  // Navigation / TabBar
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    height: 60,
    paddingBottom: 10,
    paddingTop: 10,
  },
  
  // Utilities
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: SPACING.md,
  },
  spacerSm: { height: SPACING.sm },
  spacerMd: { height: SPACING.md },
  spacerLg: { height: SPACING.lg },
});

// --- 🔄 DEFAULT EXPORT ---
export default {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  globalStyles,
};