import { createCravingQuestion, mainCravingTypes, seafoodCravingTypes } from '../data/cravings';
import { branchQuestionPools, fixedQuestions } from '../data/questionPools';
import type { AnswerOption, Branch, CravingType, PreferredCraving, Question, QuizAnswer, QuizState } from '../types';
import { shuffle } from './random';

export const TOTAL_QUESTIONS = 10;

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
    answers: [],
    askedQuestionIds: [],
    askedCravings: [],
    preferredCraving: null,
    seafoodFollowUpMode: false,
    pendingSeafoodOptions: [],
    generalSinceLastCraving: 0,
    currentQuestionIndex: 0,
  };
}

export function getInitialQuestions(): Question[] {
  return [...fixedQuestions];
}

export function buildGameQuestions(branch: Branch): Question[] {
  return [...fixedQuestions, ...shuffle(getGeneralQuestions(branch)).slice(0, TOTAL_QUESTIONS - fixedQuestions.length)];
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

  return getGeneralQuestions(state.branch).filter((question) => !state.askedQuestionIds.includes(question.id));
}

function getAvailableMainCravings(state: QuizState): CravingType[] {
  return mainCravingTypes.filter((type) => !state.askedCravings.includes(type));
}

function getPendingSeafoodCravings(state: QuizState): PreferredCraving[] {
  return state.pendingSeafoodOptions.filter((type) => !state.askedCravings.includes(type));
}

function shouldAskCravingQuestion(state: QuizState): boolean {
  if (state.preferredCraving) {
    return false;
  }

  const availableCravings = getAvailableMainCravings(state);
  if (availableCravings.length === 0) {
    return false;
  }

  const lastAnswer = state.answers[state.answers.length - 1];
  if (lastAnswer?.questionId.startsWith('craving_')) {
    return false;
  }

  const hasAskedCravingAfterBranch = state.askedCravings.length > 0;
  if (!hasAskedCravingAfterBranch && state.currentQuestionIndex >= fixedQuestions.length) {
    return true;
  }

  return state.generalSinceLastCraving >= 3;
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

export function getNextQuestion(state: QuizState): Question | null {
  if (state.currentQuestionIndex >= TOTAL_QUESTIONS) {
    return null;
  }

  if (state.currentQuestionIndex < fixedQuestions.length) {
    return fixedQuestions[state.currentQuestionIndex];
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

function removePendingSeafood(items: readonly ('squid' | 'shrimp')[], type: CravingType): ('squid' | 'shrimp')[] {
  if (type !== 'squid' && type !== 'shrimp') {
    return [...items];
  }

  return items.filter((item) => item !== type);
}

export function toQuizAnswer(question: Question, answer: AnswerOption): QuizAnswer {
  return {
    questionId: question.id,
    questionText: question.text,
    answerId: answer.id,
    answerLabel: answer.label,
    answerIcon: answer.icon,
    cravingType: question.cravingType,
    tags: answer.tags,
  };
}

export function advanceQuizState(state: QuizState, question: Question, answer: AnswerOption): QuizState {
  const quizAnswer = toQuizAnswer(question, answer);
  const answers = [...state.answers, quizAnswer];
  let branch = state.branch;
  let askedCravings = state.askedCravings;
  let preferredCraving = state.preferredCraving;
  let seafoodFollowUpMode = state.seafoodFollowUpMode;
  let pendingSeafoodOptions = state.pendingSeafoodOptions;
  let generalSinceLastCraving = state.generalSinceLastCraving;

  if (question.id === 'q3_texture') {
    branch = getBranchFromAnswers(answers);
  }

  if (question.kind === 'craving' && question.cravingType) {
    const cravingType = question.cravingType;
    askedCravings = addUniqueCraving(askedCravings, cravingType);
    generalSinceLastCraving = 0;

    if (answer.id === 'yes') {
      if (cravingType === 'seafood') {
        seafoodFollowUpMode = true;
        pendingSeafoodOptions = shuffle(seafoodCravingTypes);
      } else {
        preferredCraving = getPreferredFromCraving(cravingType);
        seafoodFollowUpMode = false;
        pendingSeafoodOptions = [];
      }
    } else if (cravingType === 'squid' || cravingType === 'shrimp') {
      pendingSeafoodOptions = removePendingSeafood(pendingSeafoodOptions, cravingType);
      seafoodFollowUpMode = pendingSeafoodOptions.length > 0;
    } else if (cravingType === 'seafood') {
      seafoodFollowUpMode = false;
      pendingSeafoodOptions = [];
    }
  } else if (state.currentQuestionIndex >= fixedQuestions.length) {
    generalSinceLastCraving += 1;
  }

  return {
    ...state,
    branch,
    answers,
    askedQuestionIds: state.askedQuestionIds.includes(question.id)
      ? state.askedQuestionIds
      : [...state.askedQuestionIds, question.id],
    askedCravings,
    preferredCraving,
    seafoodFollowUpMode,
    pendingSeafoodOptions,
    generalSinceLastCraving,
    currentQuestionIndex: state.currentQuestionIndex + 1,
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
