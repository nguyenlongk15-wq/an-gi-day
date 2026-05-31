import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';

import { colors, maxContentWidth, radius, shadow, spacing, typography } from '../theme';
import type { Food } from '../types';
import { getFavorites, removeFavorite } from '../utils/storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Food[]>([]);

  useEffect(() => {
    void getFavorites().then(setFavorites);
  }, []);

  const handleRemove = async (foodId: string) => {
    const nextFavorites = await removeFavorite(foodId);
    setFavorites(nextFavorites);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Heart color={colors.primary} size={22} fill="rgba(255,107,74,0.24)" />
          </View>
          <Text style={styles.title}>Yêu thích</Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>♡</Text>
            <Text style={styles.emptyTitle}>Chưa lưu món nào</Text>
            <Text style={styles.emptyText}>Món hợp gu sẽ nằm ở đây sau khi bạn bấm lưu yêu thích.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {favorites.map((food) => (
              <View key={food.id} style={styles.item}>
                <View style={styles.emojiWrap}>
                  <Text style={styles.emoji}>{food.emoji}</Text>
                </View>
                <View style={styles.itemText}>
                  <Text style={styles.name}>{food.name}</Text>
                  <Text numberOfLines={2} style={styles.description}>
                    {food.description}
                  </Text>
                  <Text style={styles.meta}>{food.fullness}</Text>
                </View>
                <DeleteButton onPress={() => handleRemove(food.id)} />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function DeleteButton({ onPress }: { onPress: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.deleteButton, hovered && styles.deleteHover, pressed && styles.pressed]}
    >
      <Trash2 color={colors.ink} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cardGlass,
    borderWidth: 1,
    borderColor: colors.line,
  },
  title: {
    color: colors.ink,
    ...typography.screenTitle,
  },
  emptyCard: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  emptyEmoji: {
    color: colors.primary,
    fontSize: 44,
    lineHeight: 52,
    fontFamily: typography.screenTitle.fontFamily,
  },
  emptyTitle: {
    color: colors.ink,
    ...typography.button,
    fontSize: 19,
    lineHeight: 25,
  },
  emptyText: {
    color: colors.muted,
    ...typography.description,
    textAlign: 'center',
    maxWidth: 360,
  },
  list: {
    gap: spacing.sm,
  },
  item: {
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadow,
  },
  emojiWrap: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  emoji: {
    fontSize: 34,
    lineHeight: 42,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  name: {
    color: colors.ink,
    ...typography.button,
    fontSize: 18,
    lineHeight: 24,
  },
  description: {
    color: colors.muted,
    ...typography.description,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    color: colors.yellow,
    ...typography.label,
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteHover: {
    opacity: 0.92,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.98 }],
  },
});
