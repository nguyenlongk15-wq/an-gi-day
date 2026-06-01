import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, RotateCcw, Shuffle, Sparkles, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { Food } from '../types';
import { colors, primaryShadow, radius, shadow, spacing, typography } from '../theme';

const useHeartNativeDriver = Platform.OS !== 'web';

type FoodResultCardProps = {
  food: Food;
  reason: string;
  isFavorite?: boolean;
  isSkip?: boolean;
  onAlternative?: () => void;
  onToggleFavorite?: () => void;
  onRestart: () => void;
};

const tagLabels: Record<string, string> = {
  chicken: 'Gà',
  beef: 'Bò',
  pork: 'Heo',
  fish: 'Cá',
  egg: 'Trứng',
  tofu: 'Đậu hũ',
  squid: 'Mực',
  shrimp: 'Tôm',
  seafood: 'Hải sản',
  rice: 'Cơm',
  noodle: 'Mì/Bún',
  spicy: 'Cay',
  mild: 'Dịu vị',
  filling: 'No lâu',
  light: 'Nhẹ bụng',
  crispy: 'Giòn',
  rich: 'Đậm vị',
  quick: 'Nhanh gọn',
};

function getDisplayTags(food: Food): string[] {
  return food.tags
    .map((tag) => tagLabels[tag])
    .filter((label): label is string => Boolean(label))
    .filter((label, index, items) => items.indexOf(label) === index)
    .slice(0, 4);
}

export default function FoodResultCard({
  food,
  reason,
  isFavorite = false,
  isSkip = false,
  onAlternative,
  onToggleFavorite,
  onRestart,
}: FoodResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const displayTags = useMemo(() => getDisplayTags(food), [food]);

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 90,
        friction: 13,
      }),
    ]).start();
  }, [food.id, opacity, translateY]);

  useEffect(() => {
    if (!isFavorite) {
      return;
    }

    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.14,
        duration: 120,
        useNativeDriver: useHeartNativeDriver,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: useHeartNativeDriver,
        friction: 4,
      }),
    ]).start();
  }, [heartScale, isFavorite]);

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{food.emoji}</Text>
      </View>
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.description}>{food.description}</Text>

      {displayTags.length > 0 && !isSkip ? (
        <View style={styles.tagRow}>
          {displayTags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.reasonBox}>
        <Sparkles color={colors.yellow} size={18} />
        <Text style={styles.reason}>{reason}</Text>
      </View>

      {!isSkip ? (
        <View style={styles.metaGrid}>
          <Meta icon={<Sparkles color={colors.yellow} size={18} />} label="Độ no" value={food.fullness} />
        </View>
      ) : null}

      <View style={styles.actions}>
        {onAlternative && !isSkip ? (
          <ActionButton variant="primary" label="Món khác" icon={<Shuffle color={colors.ink} size={18} />} onPress={onAlternative} />
        ) : null}
        {onToggleFavorite && !isSkip ? (
          <ActionButton
            variant="secondary"
            label={isFavorite ? 'Bỏ lưu' : 'Lưu yêu thích'}
            icon={
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                {isFavorite ? (
                  <Trash2 color={colors.ink} size={18} />
                ) : (
                  <Heart color={colors.ink} size={18} fill="rgba(255,255,255,0.18)" />
                )}
              </Animated.View>
            }
            onPress={onToggleFavorite}
          />
        ) : null}
        <ActionButton variant="secondary" label="Chọn lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={onRestart} />
      </View>
    </Animated.View>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      {icon}
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  variant,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.actionButtonBase, pressed && styles.pressed]}
    >
      {variant === 'primary' ? (
        <LinearGradient colors={[colors.primary, '#FF8A5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.actionInner, styles.primaryAction, hovered && styles.primaryHover]}>
          {icon}
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.actionText}>
            {label}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.actionInner, styles.secondaryAction, hovered && styles.secondaryHover]}>
          {icon}
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.actionText}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  emojiWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  emoji: {
    fontSize: 58,
    lineHeight: 70,
  },
  name: {
    color: colors.ink,
    ...typography.screenTitle,
    fontSize: 34,
    lineHeight: 42,
  },
  description: {
    color: colors.muted,
    ...typography.description,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tagPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  tagText: {
    color: colors.ink,
    ...typography.label,
    fontSize: 12,
    lineHeight: 17,
  },
  reasonBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,184,77,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.24)',
  },
  reason: {
    flex: 1,
    color: colors.ink,
    ...typography.label,
    fontSize: 14,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaItem: {
    flexGrow: 1,
    minWidth: 150,
    gap: spacing.xxs,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.cardGlass,
    borderWidth: 1,
    borderColor: colors.line,
  },
  metaLabel: {
    color: colors.textMuted,
    ...typography.label,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.ink,
    ...typography.button,
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionButtonBase: {
    minHeight: 54,
    flexGrow: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  actionInner: {
    minHeight: 54,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  primaryAction: {
    ...primaryShadow,
  },
  primaryHover: {
    opacity: 0.96,
  },
  secondaryAction: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryHover: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: colors.lineStrong,
  },
  actionText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 15,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
