import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Heart, Trash2 } from 'lucide-react-native';

import { colors, maxContentWidth } from '../theme';
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
          <Heart color={colors.red} size={24} fill="rgba(241,91,69,0.22)" />
          <Text style={styles.title}>Yêu thích</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.empty}>Chưa lưu món nào.</Text>
        ) : (
          <View style={styles.list}>
            {favorites.map((food) => (
              <View key={food.id} style={styles.item}>
                <Text style={styles.emoji}>{food.emoji}</Text>
                <View style={styles.itemText}>
                  <Text style={styles.name}>{food.name}</Text>
                  <Text style={styles.description}>{food.description}</Text>
                  <Text style={styles.meta}>{food.fullness}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handleRemove(food.id)}
                  style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
                >
                  <Trash2 color={colors.ink} size={18} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
  },
  empty: {
    borderRadius: 8,
    padding: 18,
    color: colors.muted,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    gap: 10,
  },
  item: {
    borderRadius: 8,
    padding: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 38,
  },
  itemText: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  name: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  meta: {
    color: colors.yellow,
    fontSize: 13,
    fontWeight: '800',
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
