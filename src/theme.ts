export const fontFamily = {
  sans: 'PlusJakartaSans_500Medium',
  medium: 'PlusJakartaSans_500Medium',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const colors = {
  ink: '#FFFFFF',
  muted: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.48)',
  panel: 'rgba(5, 18, 24, 0.78)',
  panelStrong: 'rgba(7, 22, 28, 0.92)',
  cardGlass: 'rgba(255,255,255,0.06)',
  line: 'rgba(255,255,255,0.10)',
  lineStrong: 'rgba(255,255,255,0.18)',
  red: '#FF6B4A',
  primary: '#FF6B4A',
  primaryHover: '#FF7A5C',
  primarySoft: 'rgba(255,107,74,0.18)',
  yellow: '#FFB84D',
  accent: '#FFB84D',
  green: '#2DD4A8',
  success: '#2DD4A8',
  teal: '#0B3944',
  cyan: '#6ED7E8',
  danger: '#FF5C7A',
  backgroundDark: '#071A1F',
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 32,
  pill: 999,
};

export const typography = {
  hero: {
    fontFamily: fontFamily.extraBold,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  screenTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  questionTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  option: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  button: {
    fontFamily: fontFamily.extraBold,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800' as const,
    letterSpacing: 0,
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  description: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
};

export const shadow = {
  boxShadow: '0px 18px 44px rgba(0, 0, 0, 0.28)',
  elevation: 10,
};

export const softShadow = {
  boxShadow: '0px 10px 26px rgba(0, 0, 0, 0.22)',
  elevation: 6,
};

export const primaryShadow = {
  boxShadow: '0px 14px 30px rgba(255, 107, 74, 0.28)',
  elevation: 8,
};

export const maxContentWidth = 800;
