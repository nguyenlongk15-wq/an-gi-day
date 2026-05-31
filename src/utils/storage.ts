import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Food } from '../types';

const FAVORITES_KEY = 'an_gi_day_favorites';
const LEGACY_HISTORY_KEY = 'an_gi_day_history';
const RECENT_RESULTS_KEY = 'an_gi_day_recent_results';
const MAX_RECENT_RESULTS = 8;

async function readList<T>(key: string): Promise<T[]> {
  try {
    const rawValue = await AsyncStorage.getItem(key);

    if (!rawValue) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function writeList<T>(key: string, items: readonly T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function getFavorites(): Promise<Food[]> {
  return readList<Food>(FAVORITES_KEY);
}

export async function addFavorite(food: Food): Promise<Food[]> {
  const favorites = await getFavorites();

  if (favorites.some((item) => item.id === food.id)) {
    return favorites;
  }

  const nextFavorites = [food, ...favorites];
  await writeList(FAVORITES_KEY, nextFavorites);
  return nextFavorites;
}

export async function removeFavorite(foodId: string): Promise<Food[]> {
  const favorites = await getFavorites();
  const nextFavorites = favorites.filter((food) => food.id !== foodId);
  await writeList(FAVORITES_KEY, nextFavorites);
  return nextFavorites;
}

export async function clearLegacyHistoryStorage(): Promise<void> {
  await AsyncStorage.removeItem(LEGACY_HISTORY_KEY);
}

export async function getLastShownResultIds(): Promise<string[]> {
  return readList<string>(RECENT_RESULTS_KEY);
}

export async function rememberResult(foodId: string): Promise<string[]> {
  const recentIds = await getLastShownResultIds();
  const nextRecentIds = [foodId, ...recentIds.filter((id) => id !== foodId)].slice(0, MAX_RECENT_RESULTS);
  await writeList(RECENT_RESULTS_KEY, nextRecentIds);
  return nextRecentIds;
}
