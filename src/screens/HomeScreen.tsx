import type { ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Heart, Play, Sparkles } from 'lucide-react-native';

import { colors, maxContentWidth, shadow } from '../theme';
import type { RouteName } from '../types';

const heroImage = require('../../assets/food-hero.png');

type HomeScreenProps = {
  onStart: () => void;
  onNavigate: (route: RouteName) => void;
};

export default function HomeScreen({ onStart, onNavigate }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={styles.topActions}>
          <IconButton label="Yêu thích" icon={<Heart color={colors.ink} size={18} />} onPress={() => onNavigate('favorites')} />
        </View>

        <View style={styles.hero}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <View style={styles.badge}>
              <Sparkles color={colors.yellow} size={16} />
              <Text style={styles.badgeText}>Mini game chọn món</Text>
            </View>
            <Text style={styles.title}>Ăn Gì Đây?</Text>
            <Text style={styles.slogan}>Trả lời vài câu, khỏi nghĩ hôm nay ăn gì.</Text>
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={onStart} style={({ pressed }) => [styles.startButton, pressed && styles.pressed]}>
          <Play color={colors.ink} size={22} fill={colors.ink} />
          <Text style={styles.startText}>Bắt đầu</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function IconButton({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      {icon}
      <Text style={styles.iconButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 18,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: 18,
  },
  compactContent: {
    gap: 14,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  iconButton: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButtonText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 14,
  },
  hero: {
    minHeight: 420,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.panel,
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
    backgroundColor: 'rgba(2, 8, 12, 0.48)',
  },
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.36)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  badgeText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 13,
  },
  title: {
    color: colors.ink,
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '900',
  },
  slogan: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 27,
    fontWeight: '700',
    maxWidth: 480,
  },
  startButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  startText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
