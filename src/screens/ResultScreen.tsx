import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import FoodResultCard from '../components/FoodResultCard';
import SkipResultCard from '../components/SkipResultCard';
import { maxContentWidth, spacing } from '../theme';
import type { FoodResultPayload, ResultPayload } from '../types';
import { getAlternativeResult } from '../utils/getBestResults';
import { addFavorite, getFavorites, getLastShownResultIds, rememberResult, removeFavorite } from '../utils/storage';

type ResultScreenProps = {
  result: ResultPayload;
  onRestart: () => void;
};

export default function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.content}>
        {result.type === 'skip' ? (
          <SkipResultCard message={result.skipMessage} onRestart={onRestart} />
        ) : (
          <FoodResultContent result={result} onRestart={onRestart} />
        )}
      </View>
    </ScrollView>
  );
}

function FoodResultContent({ result, onRestart }: { result: FoodResultPayload; onRestart: () => void }) {
  const [food, setFood] = useState(result.food);
  const [reason, setReason] = useState(result.reason);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFood(result.food);
    setReason(result.reason);
  }, [result]);

  useEffect(() => {
    void getFavorites().then((items) => setFavoriteIds(items.map((item) => item.id)));
  }, [food.id]);

  const isFavorite = useMemo(() => favoriteIds.includes(food.id), [favoriteIds, food.id]);

  const handleAlternative = async () => {
    const recentIds = await getLastShownResultIds();
    const nextFood = getAlternativeResult(food.id, result.topResults, result.branch, recentIds, result.preferredCraving, {
      preferredFoodType: result.preferredFoodType,
      preferredVegetableCraving: result.preferredVegetableCraving,
    });
    setFood(nextFood);
    setReason(`${nextFood.name} có thể là món bạn đang thèm lúc này đúng không?`);
    await rememberResult(nextFood.id);
  };

  const handleToggleFavorite = async () => {
    const nextFavorites = isFavorite ? await removeFavorite(food.id) : await addFavorite(food);
    setFavoriteIds(nextFavorites.map((item) => item.id));
  };

  return (
    <FoodResultCard
      food={food}
      reason={reason}
      isFavorite={isFavorite}
      onAlternative={handleAlternative}
      onToggleFavorite={handleToggleFavorite}
      onRestart={onRestart}
    />
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
  },
});
