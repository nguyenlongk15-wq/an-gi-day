import { foods } from '../data/foods';
import type { Branch, Food, PreferredCraving, PreferredFoodType, PreferredVegetableCraving, QuizAnswer } from '../types';
import { pickRandom, shuffle, uniqueStrings } from './random';

export type BestResult = {
  selected: Food;
  topResults: Food[];
  reason: string;
};

type ScoredFood = {
  food: Food;
  score: number;
};

type ResultPreferences = {
  preferredFoodType?: PreferredFoodType;
  preferredVegetableCraving?: PreferredVegetableCraving;
};

function getAnswerTags(answers: readonly QuizAnswer[]): string[] {
  return uniqueStrings(answers.flatMap((answer) => answer.tags));
}

function scoreFood(
  food: Food,
  answerTags: readonly string[],
  preferredCraving: PreferredCraving | null,
  preferences: ResultPreferences = {},
): ScoredFood {
  let score = food.tags.filter((tag) => answerTags.includes(tag)).length;
  const { preferredFoodType = null, preferredVegetableCraving = null } = preferences;

  if (preferredCraving) {
    score += food.tags.includes(preferredCraving) ? 100 : -40;
  }

  if (preferredFoodType) {
    score += food.tags.includes(preferredFoodType) ? 120 : -55;
  }

  if (preferredVegetableCraving) {
    score += food.tags.includes(preferredVegetableCraving) ? 85 : -20;
  }

  if (preferredCraving === 'shrimp' && preferredVegetableCraving === 'winter_melon') {
    score += food.name.includes('bí xanh') || food.name.includes('bí đao') ? 90 : 0;
  }

  if (preferredCraving === 'fish' && preferredVegetableCraving === 'mustard_greens') {
    score += food.name.includes('cải') ? 90 : 0;
  }

  return {
    food,
    score,
  };
}

function getBranchFoods(branch: Branch): Food[] {
  const branchFoods = foods.filter((food) => food.branch === branch);
  return branchFoods.length > 0 ? branchFoods : foods;
}

function buildReason(food: Food): string {
  return `${food.name} có thể là món bạn đang thèm lúc này đúng không?`;
}

function getPreferredBranchFoods(
  branchFoods: readonly Food[],
  preferredCraving: PreferredCraving | null,
  preferences: ResultPreferences = {},
): Food[] {
  const { preferredFoodType = null, preferredVegetableCraving = null } = preferences;
  let preferredFoods = [...branchFoods];

  if (preferredFoodType) {
    const foodTypeFoods = preferredFoods.filter((food) => food.tags.includes(preferredFoodType));
    if (foodTypeFoods.length > 0) {
      preferredFoods = foodTypeFoods;
    }
  }

  if (preferredCraving) {
    const proteinFoods = preferredFoods.filter((food) => food.tags.includes(preferredCraving));
    if (proteinFoods.length > 0) {
      preferredFoods = proteinFoods;
    }
  }

  if (preferredVegetableCraving) {
    const vegetableFoods = preferredFoods.filter((food) => food.tags.includes(preferredVegetableCraving));
    if (vegetableFoods.length > 0) {
      preferredFoods = vegetableFoods;
    }
  }

  return preferredFoods.length > 0 ? preferredFoods : [...branchFoods];
}

function chooseFromTop(topResults: readonly Food[], recentIds: readonly string[], avoidFoodId?: string): Food {
  const withoutCurrent = topResults.filter((food) => food.id !== avoidFoodId);
  const freshPool = withoutCurrent.filter((food) => !recentIds.includes(food.id));
  return pickRandom(freshPool) ?? pickRandom(withoutCurrent) ?? topResults[0];
}

export function getBestResults(
  answers: readonly QuizAnswer[],
  branch: Branch,
  recentIds: readonly string[] = [],
  preferredCraving: PreferredCraving | null = null,
  preferences: ResultPreferences = {},
): BestResult {
  const answerTags = getAnswerTags(answers);
  const branchFoods = getBranchFoods(branch);
  const candidateFoods = getPreferredBranchFoods(branchFoods, preferredCraving, preferences);
  const scoredFoods = shuffle(candidateFoods.map((food) => scoreFood(food, answerTags, preferredCraving, preferences))).sort((a, b) => b.score - a.score);
  const positiveMatches = scoredFoods.filter((item) => item.score > 0);
  const topScored = (positiveMatches.length > 0 ? positiveMatches : scoredFoods).slice(0, 10);
  const topResults = topScored.map((item) => item.food);
  const selected = chooseFromTop(topResults, recentIds);

  return {
    selected,
    topResults,
    reason: buildReason(selected),
  };
}

export function getAlternativeResult(
  currentFoodId: string,
  topResults: readonly Food[],
  branch: Branch,
  recentIds: readonly string[] = [],
  preferredCraving: PreferredCraving | null = null,
  preferences: ResultPreferences = {},
): Food {
  const topChoice = chooseFromTop(topResults, recentIds, currentFoodId);

  if (topChoice.id !== currentFoodId) {
    return topChoice;
  }

  const branchFoods = getBranchFoods(branch);
  const preferredFallbackPool = getPreferredBranchFoods(branchFoods, preferredCraving, preferences).filter((food) => food.id !== currentFoodId);
  const fallbackPool = preferredFallbackPool.length > 0 ? preferredFallbackPool : branchFoods.filter((food) => food.id !== currentFoodId);
  return pickRandom(fallbackPool) ?? topChoice;
}
