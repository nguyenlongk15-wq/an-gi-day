import type { ReactNode } from 'react';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { TextStyle } from 'react-native';
import { Heart, Play, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, maxContentWidth, primaryShadow, radius, shadow, spacing, typography } from '../theme';
import type { RouteName } from '../types';

const heroImage = require('../../assets/food-hero.png');

const titleGlow = {
  eat: { textShadow: '0px 5px 14px rgba(255, 122, 79, 0.24)' } as unknown as TextStyle,
  connector: { textShadow: '0px 2px 8px rgba(0, 0, 0, 0.38)' } as unknown as TextStyle,
  skip: { textShadow: '0px 5px 14px rgba(75, 227, 209, 0.22)' } as unknown as TextStyle,
};

type HomeScreenProps = {
  onStart: () => void;
  onNavigate: (route: RouteName) => void;
};

export default function HomeScreen({ onStart, onNavigate }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const tight = width < 380;
  const [startHovered, setStartHovered] = useState(false);

  return (
    <ScrollView contentContainerStyle={[styles.scroll, compact && styles.compactScroll]}>
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={[styles.hero, compact && styles.compactHero]}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(2,8,12,0.08)', 'rgba(2,8,12,0.28)', 'rgba(2,8,12,0.78)', 'rgba(2,8,12,0.94)']}
            locations={[0, 0.42, 0.72, 1]}
            style={[styles.heroOverlay, styles.noPointerEvents]}
          />

          <View style={styles.favoriteAction}>
            <IconButton label="Yêu thích" icon={<Heart color={colors.ink} size={18} />} onPress={() => onNavigate('favorites')} />
          </View>

          <View style={[styles.heroText, compact && styles.compactHeroText]}>
            <View style={styles.badge}>
              <Sparkles color={colors.yellow} size={16} />
              <Text style={styles.badgeText}>Mini game chọn món</Text>
            </View>

            <View style={[styles.titleBlock, tight && styles.tightTitleBlock]}>
              <View style={styles.titleTopLine}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.86}
                  style={[styles.titleEat, titleGlow.eat, compact && styles.compactTitleEat, tight && styles.tightTitleEat]}
                >
                  Ăn
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.9}
                  style={[styles.titleConnector, titleGlow.connector, compact && styles.compactTitleConnector, tight && styles.tightTitleConnector]}
                >
                  hay
                </Text>
              </View>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.82}
                style={[styles.titleSkip, titleGlow.skip, compact && styles.compactTitleSkip, tight && styles.tightTitleSkip]}
              >
                Nhịn?
              </Text>
            </View>

            <Text style={[styles.slogan, compact && styles.compactSlogan]}>
              Trả lời vài câu, khỏi nghĩ hôm nay <Text style={styles.sloganHighlight}>ăn gì</Text>.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onStart}
          onHoverIn={() => setStartHovered(true)}
          onHoverOut={() => setStartHovered(false)}
          style={({ pressed }) => [styles.startButton, compact && styles.compactStartButton, startHovered && styles.startHovered, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={['#FF563F', '#FF7758', '#FF9A4A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.startGradient, compact && styles.compactStartGradient]}
          >
            <Play color={colors.ink} size={24} fill={colors.ink} />
            <Text style={styles.startText}>Bắt đầu</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function IconButton({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.iconButton, hovered && styles.iconButtonHover, pressed && styles.pressed]}
    >
      {icon}
      <Text style={styles.iconButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactScroll: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: spacing.lg,
  },
  compactContent: {
    gap: spacing.md,
  },
  iconButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(3, 13, 18, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButtonHover: {
    borderColor: 'rgba(255,184,77,0.46)',
    backgroundColor: 'rgba(6, 20, 27, 0.86)',
  },
  iconButtonText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
  },
  hero: {
    minHeight: 430,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    ...shadow,
  },
  compactHero: {
    minHeight: 440,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  favoriteAction: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 3,
  },
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xxl,
    gap: spacing.sm,
    zIndex: 2,
  },
  compactHeroText: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(2, 10, 14, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.32)',
    boxShadow: '0px 0px 10px rgba(255, 184, 77, 0.18)',
  },
  badgeText: {
    color: colors.ink,
    ...typography.label,
  },
  titleBlock: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 0,
    minWidth: 0,
  },
  tightTitleBlock: {
    gap: 1,
  },
  titleTopLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: spacing.xs,
    minWidth: 0,
  },
  titleEat: {
    color: '#FF7A4F',
    fontFamily: typography.hero.fontFamily,
    fontSize: 56,
    lineHeight: 62,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  compactTitleEat: {
    fontSize: 48,
    lineHeight: 53,
  },
  tightTitleEat: {
    fontSize: 42,
    lineHeight: 47,
  },
  titleConnector: {
    color: 'rgba(255,255,255,0.74)',
    fontFamily: typography.button.fontFamily,
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  compactTitleConnector: {
    fontSize: 20,
    lineHeight: 27,
  },
  tightTitleConnector: {
    fontSize: 18,
    lineHeight: 24,
  },
  titleSkip: {
    color: '#4BE3D1',
    fontFamily: typography.hero.fontFamily,
    fontSize: 62,
    lineHeight: 68,
    fontWeight: '800',
    letterSpacing: 0.15,
  },
  compactTitleSkip: {
    fontSize: 52,
    lineHeight: 58,
  },
  tightTitleSkip: {
    fontSize: 45,
    lineHeight: 50,
  },
  slogan: {
    color: 'rgba(255,255,255,0.82)',
    ...typography.description,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 560,
    textAlign: 'center',
    alignSelf: 'center',
  },
  compactSlogan: {
    fontSize: 15,
    lineHeight: 23,
  },
  sloganHighlight: {
    color: colors.yellow,
    fontFamily: typography.button.fontFamily,
    fontWeight: '900',
    textDecorationLine: 'underline',
    textDecorationColor: colors.yellow,
  },
  startButton: {
    minHeight: 68,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...primaryShadow,
    boxShadow: '0px 18px 36px rgba(255, 86, 63, 0.38)',
  },
  compactStartButton: {
    minHeight: 64,
    borderRadius: radius.lg,
  },
  startHovered: {
    opacity: 0.97,
  },
  startGradient: {
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  compactStartGradient: {
    minHeight: 64,
  },
  startText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 22,
    lineHeight: 28,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
