import type { ReactNode } from 'react';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Heart, Play, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, maxContentWidth, primaryShadow, radius, shadow, spacing, typography } from '../theme';
import type { RouteName } from '../types';

const heroImage = require('../../assets/food-hero.png');

type HomeScreenProps = {
  onStart: () => void;
  onNavigate: (route: RouteName) => void;
};

export default function HomeScreen({ onStart, onNavigate }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const [startHovered, setStartHovered] = useState(false);

  return (
    <ScrollView contentContainerStyle={[styles.scroll, compact && styles.compactScroll]}>
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.topActions}>
          <IconButton label="Yêu thích" icon={<Heart color={colors.ink} size={18} />} onPress={() => onNavigate('favorites')} />
        </View>

        <View style={styles.hero}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(2,8,12,0.18)', 'rgba(2,8,12,0.48)', 'rgba(2,8,12,0.82)']}
            locations={[0, 0.48, 1]}
            style={styles.heroOverlay}
          />
          <View style={[styles.heroText, compact && styles.compactHeroText]}>
            <View style={styles.badge}>
              <Sparkles color={colors.yellow} size={16} />
              <Text style={styles.badgeText}>Mini game chọn món</Text>
            </View>
            <Text style={[styles.title, compact && styles.compactTitle]}>Ăn Hay Nhịn?</Text>
            <Text style={styles.slogan}>Trả lời vài câu, khỏi nghĩ hôm nay ăn gì.</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onStart}
          onHoverIn={() => setStartHovered(true)}
          onHoverOut={() => setStartHovered(false)}
          style={({ pressed }) => [styles.startButton, startHovered && styles.startHovered, pressed && styles.pressed]}
        >
          <LinearGradient colors={[colors.primary, '#FF8A5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.startGradient}>
            <Play color={colors.ink} size={22} fill={colors.ink} />
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
    paddingBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactScroll: {
    padding: spacing.md,
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: spacing.lg,
  },
  compactContent: {
    gap: spacing.md,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  iconButton: {
    minHeight: 44,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButtonHover: {
    borderColor: colors.lineStrong,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  iconButtonText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
  },
  hero: {
    minHeight: 420,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
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
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  compactHeroText: {
    padding: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  badgeText: {
    color: colors.ink,
    ...typography.label,
  },
  title: {
    color: colors.ink,
    ...typography.hero,
  },
  compactTitle: {
    fontSize: 40,
    lineHeight: 46,
  },
  slogan: {
    color: colors.muted,
    ...typography.description,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 480,
  },
  startButton: {
    minHeight: 60,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...primaryShadow,
  },
  startHovered: {
    opacity: 0.96,
  },
  startGradient: {
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  startText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 18,
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
