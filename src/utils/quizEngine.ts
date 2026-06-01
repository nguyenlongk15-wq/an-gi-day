import { createCravingQuestion, mainCravingTypes, seafoodCravingTypes } from '../data/cravings';
import {
  createHomeWetFoodTypeQuestion,
  createHomeWetProteinQuestion,
  createHomeWetVegetableGroupQuestion,
  createHomeWetVegetableQuestion,
  homeWetFoodTypeOrder,
  homeWetProteinCravingTypes,
  homeWetVegetableConfigs,
} from '../data/homeWetCravings';
import { branchQuestionPools, fixedQuestions } from '../data/questionPools';
import type { AnswerOption, Branch, CravingType, FoodTypeCraving, PreferredCraving, Question, QuizAnswer, QuizState, VegetableCraving } from '../types';
import { shuffle } from './random';

export const FIXED_QUESTION_COUNT = fixedQuestions.length;
export const TARGET_USEFUL_ANSWER_COUNT = 10;

const GENERAL_QUESTIONS_BETWEEN_CRAVINGS = 2;
const GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS = 2;
const RECENT_GENERAL_AVOID_COUNT = 5;

const EXCLUDED_GENERAL_QUESTION_IDS = new Set([
  'home_dry_main_ingredient',
  'home_wet_main',
  'outside_dry_main',
  'outside_wet_main',
  'outside_wet_meat_seafood_amount',
]);

export function createInitialQuizState(): QuizState {
  return {
    branch: null,
    phase: 'fixed',
    answers: [],
    askedQuestionIds: [],
    askedCravings: [],
    preferredCraving: null,
    askedFoodTypes: [],
    preferredFoodType: null,
    vegetableGroup: null,
    askedVegetableCravings: [],
    preferredVegetableCraving: null,
    seafoodFollowUpMode: false,
    pendingSeafoodOptions: [],
    generalAnswerCount: 0,
    usefulAnswerCount: 0,
    targetUsefulAnswerCount: TARGET_USEFUL_ANSWER_COUNT,
    generalSinceLastCraving: 0,
    generalSinceLastFoodType: 0,
    generalSinceLastVegetableCraving: 0,
  };
}

export function getInitialQuestions(): Question[] {
  return [...fixedQuestions];
}

export function buildGameQuestions(branch: Branch): Question[] {
  return [...fixedQuestions, ...shuffle(getGeneralQuestions(branch)).slice(0, TARGET_USEFUL_ANSWER_COUNT)];
}

export function getGeneralQuestions(branch: Branch): Question[] {
  return branchQuestionPools[branch]
    .filter((question) => !EXCLUDED_GENERAL_QUESTION_IDS.has(question.id))
    .map((question) => ({ ...question, kind: 'general' }));
}

export function getBranchFromAnswers(answers: readonly QuizAnswer[]): Branch | null {
  const tags = answers.flatMap((answer) => answer.tags);
  const place = tags.includes('home') ? 'home' : tags.includes('outside') ? 'outside' : null;
  const texture = tags.includes('dry') ? 'dry' : tags.includes('wet') ? 'wet' : null;

  if (!place || !texture) {
    return null;
  }

  return `${place}_${texture}` as Branch;
}

function getAvailableGeneralQuestions(state: QuizState): Question[] {
  if (!state.branch) {
    return [];
  }

  const questions = getGeneralQuestions(state.branch);
  const unanswered = questions.filter((question) => !state.askedQuestionIds.includes(question.id));

  if (unanswered.length > 0) {
    return unanswered;
  }

  const recentQuestionIds = state.answers.slice(-RECENT_GENERAL_AVOID_COUNT).map((answer) => answer.questionId);
  const notRecent = questions.filter((question) => !recentQuestionIds.includes(question.id));
  return notRecent.length > 0 ? notRecent : questions;
}

function getAvailableMainCravings(state: QuizState): CravingType[] {
  return mainCravingTypes.filter((type) => !state.askedCravings.includes(type));
}

function getPendingSeafoodCravings(state: QuizState): PreferredCraving[] {
  return state.pendingSeafoodOptions.filter((type) => !state.askedCravings.includes(type));
}

function getAvailableHomeWetFoodTypes(state: QuizState): FoodTypeCraving[] {
  if (state.preferredFoodType) {
    return [];
  }

  return homeWetFoodTypeOrder.filter((type) => !state.askedFoodTypes.includes(type));
}

function getAvailableHomeWetProteinCravings(state: QuizState): CravingType[] {
  if (state.preferredCraving) {
    return [];
  }

  return homeWetProteinCravingTypes.filter((type) => !state.askedCravings.includes(type));
}

function getAvailableHomeWetVegetableCravings(state: QuizState): VegetableCraving[] {
  if (state.preferredFoodType !== 'soup_like' || !state.vegetableGroup || state.preferredVegetableCraving) {
    return [];
  }

  return (Object.keys(homeWetVegetableConfigs) as VegetableCraving[]).filter((type) => {
    const config = homeWetVegetableConfigs[type];
    const matchesGroup = state.vegetableGroup === config.group;
    return matchesGroup && !state.askedVegetableCravings.includes(type);
  });
}

function shouldAskHomeWetFoodTypeQuestion(state: QuizState): boolean {
  const available = getAvailableHomeWetFoodTypes(state);
  return available.length > 0 && (state.askedFoodTypes.length === 0 || state.generalSinceLastFoodType >= GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS);
}

function shouldAskHomeWetProteinQuestion(state: QuizState): boolean {
  const available = getAvailableHomeWetProteinCravings(state);
  return available.length > 0 && (state.askedCravings.length === 0 || state.generalSinceLastCraving >= GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS);
}

function shouldAskHomeWetVegetableQuestion(state: QuizState): boolean {
  const available = getAvailableHomeWetVegetableCravings(state);
  return (
    available.length > 0 &&
    (state.askedVegetableCravings.length === 0 || state.generalSinceLastVegetableCraving >= GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS)
  );
}

function shouldUseHomeWetGeneralCooldown(state: QuizState): boolean {
  return (
    (getAvailableHomeWetFoodTypes(state).length > 0 &&
      state.askedFoodTypes.length > 0 &&
      state.generalSinceLastFoodType < GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS) ||
    (getAvailableHomeWetProteinCravings(state).length > 0 &&
      state.askedCravings.length > 0 &&
      state.generalSinceLastCraving < GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS) ||
    (getAvailableHomeWetVegetableCravings(state).length > 0 &&
      state.askedVegetableCravings.length > 0 &&
      state.generalSinceLastVegetableCraving < GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS)
  );
}

function shouldAskCravingQuestion(state: QuizState): boolean {
  if (state.phase !== 'finding_craving' || state.preferredCraving) {
    return false;
  }

  if (getAvailableMainCravings(state).length === 0) {
    return false;
  }

  const lastAnswer = state.answers[state.answers.length - 1];
  if (lastAnswer?.questionId.startsWith('craving_')) {
    return false;
  }

  return state.askedCravings.length === 0 || state.generalSinceLastCraving >= GENERAL_QUESTIONS_BETWEEN_CRAVINGS;
}

function pickNextGeneralQuestion(state: QuizState): Question | null {
  return shuffle(getAvailableGeneralQuestions(state))[0] ?? null;
}

function pickNextMainCravingQuestion(state: QuizState): Question | null {
  const craving = shuffle(getAvailableMainCravings(state))[0];
  return craving ? createCravingQuestion(craving) : null;
}

function pickNextSeafoodQuestion(state: QuizState): Question | null {
  const craving = getPendingSeafoodCravings(state)[0];
  return craving ? createCravingQuestion(craving) : null;
}

function pickNextHomeWetFoodTypeQuestion(state: QuizState): Question | null {
  const foodType = shuffle(getAvailableHomeWetFoodTypes(state))[0];
  return foodType ? createHomeWetFoodTypeQuestion(foodType) : null;
}

function pickNextHomeWetProteinQuestion(state: QuizState): Question | null {
  const craving = shuffle(getAvailableHomeWetProteinCravings(state))[0];
  return craving ? createHomeWetProteinQuestion(craving) : null;
}

function pickNextHomeWetVegetableQuestion(state: QuizState): Question | null {
  const craving = shuffle(getAvailableHomeWetVegetableCravings(state))[0];
  return craving ? createHomeWetVegetableQuestion(craving) : null;
}

function getNextHomeWetQuestion(state: QuizState): Question | null {
  if (state.usefulAnswerCount >= state.targetUsefulAnswerCount) {
    return null;
  }

  if (state.preferredFoodType === 'soup_like' && !state.vegetableGroup) {
    return createHomeWetVegetableGroupQuestion();
  }

  const generalQuestion = pickNextGeneralQuestion(state);

  if (shouldUseHomeWetGeneralCooldown(state) && generalQuestion) {
    return generalQuestion;
  }

  if (shouldAskHomeWetFoodTypeQuestion(state)) {
    return pickNextHomeWetFoodTypeQuestion(state) ?? generalQuestion;
  }

  if (shouldAskHomeWetVegetableQuestion(state)) {
    return pickNextHomeWetVegetableQuestion(state) ?? generalQuestion;
  }

  if (shouldAskHomeWetProteinQuestion(state)) {
    return pickNextHomeWetProteinQuestion(state) ?? generalQuestion;
  }

  return generalQuestion ?? pickNextHomeWetFoodTypeQuestion(state) ?? pickNextHomeWetVegetableQuestion(state) ?? pickNextHomeWetProteinQuestion(state);
}

export function getNextQuestion(state: QuizState): Question | null {
  if (state.phase === 'complete') {
    return null;
  }

  if (state.phase === 'fixed') {
    return fixedQuestions[state.answers.length] ?? null;
  }

  if (state.branch === 'home_wet') {
    return getNextHomeWetQuestion(state);
  }

  if (state.phase === 'profiling') {
    if (state.usefulAnswerCount >= state.targetUsefulAnswerCount) {
      return null;
    }

    return pickNextGeneralQuestion(state);
  }

  if (state.seafoodFollowUpMode && !state.preferredCraving) {
    const seafoodQuestion = pickNextSeafoodQuestion(state);
    if (seafoodQuestion) {
      return seafoodQuestion;
    }
  }

  if (shouldAskCravingQuestion(state)) {
    const cravingQuestion = pickNextMainCravingQuestion(state);
    if (cravingQuestion) {
      return cravingQuestion;
    }
  }

  return pickNextGeneralQuestion(state) ?? pickNextMainCravingQuestion(state);
}

function getPreferredFromCraving(type: CravingType): PreferredCraving | null {
  return type === 'seafood' ? null : type;
}

function addUniqueCraving(items: readonly CravingType[], type: CravingType): CravingType[] {
  return items.includes(type) ? [...items] : [...items, type];
}

function addUniqueFoodType(items: readonly FoodTypeCraving[], type: FoodTypeCraving): FoodTypeCraving[] {
  return items.includes(type) ? [...items] : [...items, type];
}

function addUniqueVegetableCraving(items: readonly VegetableCraving[], type: VegetableCraving): VegetableCraving[] {
  return items.includes(type) ? [...items] : [...items, type];
}

function removePendingSeafood(items: readonly ('squid' | 'shrimp')[], type: CravingType): ('squid' | 'shrimp')[] {
  if (type !== 'squid' && type !== 'shrimp') {
    return [...items];
  }

  return items.filter((item) => item !== type);
}

function hasUnaskedMainCravings(askedCravings: readonly CravingType[]): boolean {
  return mainCravingTypes.some((type) => !askedCravings.includes(type));
}

function getUsefulAnswerCount(
  generalAnswerCount: number,
  preferredCraving: PreferredCraving | null,
  preferredFoodType: QuizState['preferredFoodType'] = null,
  preferredVegetableCraving: QuizState['preferredVegetableCraving'] = null,
): number {
  return generalAnswerCount + (preferredCraving ? 1 : 0) + (preferredFoodType ? 1 : 0) + (preferredVegetableCraving ? 1 : 0);
}

function enterProfilingPhase(
  generalAnswerCount: number,
  preferredCraving: PreferredCraving | null,
): Pick<
  QuizState,
  'phase' | 'preferredCraving' | 'seafoodFollowUpMode' | 'pendingSeafoodOptions' | 'usefulAnswerCount' | 'targetUsefulAnswerCount'
> {
  return {
    phase: 'profiling',
    preferredCraving,
    seafoodFollowUpMode: false,
    pendingSeafoodOptions: [],
    usefulAnswerCount: getUsefulAnswerCount(generalAnswerCount, preferredCraving),
    targetUsefulAnswerCount: TARGET_USEFUL_ANSWER_COUNT,
  };
}

export function isQuizComplete(state: QuizState): boolean {
  return state.phase === 'complete';
}

export function toQuizAnswer(question: Question, answer: AnswerOption): QuizAnswer {
  return {
    questionId: question.id,
    questionText: question.text,
    answerId: answer.id,
    answerLabel: answer.label,
    answerIcon: answer.icon,
    cravingType: question.cravingType,
    foodType: question.foodType,
    vegetableCraving: question.vegetableCraving,
    vegetableGroup: question.kind === 'vegetable_group' && (answer.id === 'leafy' || answer.id === 'root') ? answer.id : question.vegetableGroup,
    tags: answer.tags,
  };
}

export function advanceQuizState(state: QuizState, question: Question, answer: AnswerOption): QuizState {
  const quizAnswer = toQuizAnswer(question, answer);
  const answers = [...state.answers, quizAnswer];
  let branch = state.branch;
  let phase = state.phase;
  let askedCravings = state.askedCravings;
  let preferredCraving = state.preferredCraving;
  let askedFoodTypes = state.askedFoodTypes;
  let preferredFoodType = state.preferredFoodType;
  let vegetableGroup = state.vegetableGroup;
  let askedVegetableCravings = state.askedVegetableCravings;
  let preferredVegetableCraving = state.preferredVegetableCraving;
  let seafoodFollowUpMode = state.seafoodFollowUpMode;
  let pendingSeafoodOptions = state.pendingSeafoodOptions;
  let generalAnswerCount = state.generalAnswerCount;
  let usefulAnswerCount = state.usefulAnswerCount;
  let targetUsefulAnswerCount = state.targetUsefulAnswerCount;
  let generalSinceLastCraving = state.generalSinceLastCraving;
  let generalSinceLastFoodType = state.generalSinceLastFoodType;
  let generalSinceLastVegetableCraving = state.generalSinceLastVegetableCraving;

  if (question.id === 'q3_texture') {
    branch = getBranchFromAnswers(answers);
    phase = 'finding_craving';
    generalSinceLastCraving = GENERAL_QUESTIONS_BETWEEN_CRAVINGS;
    generalSinceLastFoodType = GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS;
    generalSinceLastVegetableCraving = GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS;
  }

  const isHomeWetActive = branch === 'home_wet';

  if (question.kind === 'food_type_craving' && question.foodType) {
    askedFoodTypes = addUniqueFoodType(askedFoodTypes, question.foodType);
    generalSinceLastFoodType = 0;

    if (answer.id === 'yes') {
      preferredFoodType = question.foodType;

      if (question.foodType === 'soup_like') {
        generalSinceLastVegetableCraving = GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS;
      } else {
        vegetableGroup = null;
        askedVegetableCravings = [];
        preferredVegetableCraving = null;
      }
    }
  } else if (question.kind === 'vegetable_group') {
    vegetableGroup = answer.id === 'leafy' || answer.id === 'root' ? answer.id : null;
    generalSinceLastVegetableCraving = GENERAL_QUESTIONS_BETWEEN_HOME_WET_CRAVINGS;
  } else if (question.kind === 'vegetable_craving' && question.vegetableCraving) {
    askedVegetableCravings = addUniqueVegetableCraving(askedVegetableCravings, question.vegetableCraving);
    generalSinceLastVegetableCraving = 0;

    if (answer.id === 'yes') {
      preferredVegetableCraving = question.vegetableCraving;
    }
  } else if (question.kind === 'craving' && question.cravingType) {
    const cravingType = question.cravingType;
    askedCravings = addUniqueCraving(askedCravings, cravingType);
    generalSinceLastCraving = 0;

    if (isHomeWetActive) {
      if (answer.id === 'yes') {
        preferredCraving = getPreferredFromCraving(cravingType);
      }
    } else if (answer.id === 'yes') {
      if (cravingType === 'seafood') {
        phase = 'finding_craving';
        seafoodFollowUpMode = true;
        pendingSeafoodOptions = shuffle(seafoodCravingTypes.filter((type) => !askedCravings.includes(type)));
      } else {
        const profiling = enterProfilingPhase(generalAnswerCount, getPreferredFromCraving(cravingType));
        phase = profiling.phase;
        preferredCraving = profiling.preferredCraving;
        seafoodFollowUpMode = profiling.seafoodFollowUpMode;
        pendingSeafoodOptions = profiling.pendingSeafoodOptions;
        usefulAnswerCount = profiling.usefulAnswerCount;
        targetUsefulAnswerCount = profiling.targetUsefulAnswerCount;
      }
    } else if (cravingType === 'squid' || cravingType === 'shrimp') {
      pendingSeafoodOptions = removePendingSeafood(pendingSeafoodOptions, cravingType);
      seafoodFollowUpMode = pendingSeafoodOptions.length > 0;
    } else if (cravingType === 'seafood') {
      seafoodFollowUpMode = false;
      pendingSeafoodOptions = [];
    }

    if (!isHomeWetActive && !preferredCraving && !seafoodFollowUpMode && !hasUnaskedMainCravings(askedCravings)) {
      const profiling = enterProfilingPhase(generalAnswerCount, null);
      phase = profiling.phase;
      preferredCraving = profiling.preferredCraving;
      seafoodFollowUpMode = profiling.seafoodFollowUpMode;
      pendingSeafoodOptions = profiling.pendingSeafoodOptions;
      usefulAnswerCount = profiling.usefulAnswerCount;
      targetUsefulAnswerCount = profiling.targetUsefulAnswerCount;
    }
  } else if (question.kind === 'general') {
    generalAnswerCount += 1;
    usefulAnswerCount = getUsefulAnswerCount(generalAnswerCount, preferredCraving, preferredFoodType, preferredVegetableCraving);

    if (isHomeWetActive) {
      generalSinceLastCraving += 1;
      generalSinceLastFoodType += 1;
      generalSinceLastVegetableCraving += 1;
    }

    if (phase === 'profiling' && usefulAnswerCount >= targetUsefulAnswerCount) {
      phase = 'complete';
    }

    if (!isHomeWetActive && phase === 'finding_craving') {
      generalSinceLastCraving += 1;
    }
  }

  if (isHomeWetActive && phase !== 'complete') {
    usefulAnswerCount = getUsefulAnswerCount(generalAnswerCount, preferredCraving, preferredFoodType, preferredVegetableCraving);

    if (usefulAnswerCount >= targetUsefulAnswerCount) {
      phase = 'complete';
    } else {
      phase = 'finding_craving';
    }
  }

  return {
    ...state,
    branch,
    phase,
    answers,
    askedQuestionIds: state.askedQuestionIds.includes(question.id)
      ? state.askedQuestionIds
      : [...state.askedQuestionIds, question.id],
    askedCravings,
    preferredCraving,
    askedFoodTypes,
    preferredFoodType,
    vegetableGroup,
    askedVegetableCravings,
    preferredVegetableCraving,
    seafoodFollowUpMode,
    pendingSeafoodOptions,
    generalAnswerCount,
    usefulAnswerCount,
    targetUsefulAnswerCount,
    generalSinceLastCraving,
    generalSinceLastFoodType,
    generalSinceLastVegetableCraving,
  };
}

export function questionPoolHealth(): Record<Branch, number> {
  return {
    home_dry: getGeneralQuestions('home_dry').length,
    home_wet: getGeneralQuestions('home_wet').length,
    outside_dry: getGeneralQuestions('outside_dry').length,
    outside_wet: getGeneralQuestions('outside_wet').length,
  };
}
