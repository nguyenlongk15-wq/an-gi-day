import { foods } from '../data/foods';
import type { Branch, Food, PreferredCraving, QuizAnswer } from '../types';
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

function getAnswerTags(answers: readonly QuizAnswer[]): string[] {
  return uniqueStrings(answers.flatMap((answer) => answer.tags));
}

function scoreFood(food: Food, answerTags: readonly string[], preferredCraving: PreferredCraving | null): ScoredFood {
  let score = food.tags.filter((tag) => answerTags.includes(tag)).length;

  if (preferredCraving) {
    score += food.tags.includes(preferredCraving) ? 100 : -40;
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

function getPreferredBranchFoods(branchFoods: readonly Food[], preferredCraving: PreferredCraving | null): Food[] {
  if (!preferredCraving) {
    return [...branchFoods];
  }

  const preferredFoods = branchFoods.filter((food) => food.tags.includes(preferredCraving));
  return preferredFoods.length >= 8 ? preferredFoods : [...branchFoods];
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
): BestResult {
  const answerTags = getAnswerTags(answers);
  const branchFoods = getBranchFoods(branch);
  const candidateFoods = getPreferredBranchFoods(branchFoods, preferredCraving);
  const scoredFoods = shuffle(candidateFoods.map((food) => scoreFood(food, answerTags, preferredCraving))).sort((a, b) => b.score - a.score);
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
): Food {
  const topChoice = chooseFromTop(topResults, recentIds, currentFoodId);

  if (topChoice.id !== currentFoodId) {
    return topChoice;
  }

  const branchFoods = getBranchFoods(branch);
  const preferredFallbackPool = preferredCraving
    ? branchFoods.filter((food) => food.tags.includes(preferredCraving) && food.id !== currentFoodId)
    : [];
  const fallbackPool = preferredFallbackPool.length > 0 ? preferredFallbackPool : branchFoods.filter((food) => food.id !== currentFoodId);
  return pickRandom(fallbackPool) ?? topChoice;
}
