import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart, RotateCcw, Shuffle, Sparkles, Trash2 } from 'lucide-react-native';

import type { Food } from '../types';
import { colors, shadow } from '../theme';

type FoodResultCardProps = {
  food: Food;
  reason: string;
  isFavorite?: boolean;
  isSkip?: boolean;
  onAlternative?: () => void;
  onToggleFavorite?: () => void;
  onRestart: () => void;
};

export default function FoodResultCard({
  food,
  reason,
  isFavorite = false,
  isSkip = false,
  onAlternative,
  onToggleFavorite,
  onRestart,
}: FoodResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{food.emoji}</Text>
      </View>
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.description}>{food.description}</Text>
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
          <ActionButton label="Món khác" icon={<Shuffle color={colors.ink} size={18} />} onPress={onAlternative} />
        ) : null}
        {onToggleFavorite && !isSkip ? (
          <ActionButton
            label={isFavorite ? 'Bỏ lưu' : 'Lưu yêu thích'}
            icon={
              isFavorite ? (
                <Trash2 color={colors.ink} size={18} />
              ) : (
                <Heart color={colors.ink} size={18} fill="rgba(255,255,255,0.18)" />
              )
            }
            onPress={onToggleFavorite}
          />
        ) : null}
        <ActionButton label="Chọn lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={onRestart} />
      </View>
    </View>
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

function ActionButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
      {icon}
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.actionText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 20,
    gap: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  emojiWrap: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  emoji: {
    fontSize: 52,
  },
  name: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  reasonBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: 8,
    backgroundColor: 'rgba(248,196,79,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(248,196,79,0.22)',
  },
  reason: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexGrow: 1,
    minWidth: 150,
    gap: 5,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    minHeight: 48,
    flexGrow: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
