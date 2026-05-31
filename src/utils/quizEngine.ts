import { createCravingQuestion, mainCravingTypes, seafoodCravingTypes } from '../data/cravings';
import { branchQuestionPools, fixedQuestions } from '../data/questionPools';
import type { AnswerOption, Branch, CravingType, PreferredCraving, Question, QuizAnswer, QuizState } from '../types';
import { shuffle } from './random';

export const FIXED_QUESTION_COUNT = fixedQuestions.length;
export const TARGET_PROFILE_QUESTION_COUNT = 10;

const FALLBACK_PROFILE_QUESTION_COUNT = 6;
const GENERAL_QUESTIONS_BETWEEN_CRAVINGS = 2;
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
    seafoodFollowUpMode: false,
    pendingSeafoodOptions: [],
    generalSinceLastCraving: 0,
    profileQuestionsAnswered: 0,
    targetProfileQuestionCount: TARGET_PROFILE_QUESTION_COUNT,
  };
}

export function getInitialQuestions(): Question[] {
  return [...fixedQuestions];
}

export function buildGameQuestions(branch: Branch): Question[] {
  return [...fixedQuestions, ...shuffle(getGeneralQuestions(branch)).slice(0, TARGET_PROFILE_QUESTION_COUNT)];
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

export function getNextQuestion(state: QuizState): Question | null {
  if (state.phase === 'complete') {
    return null;
  }

  if (state.phase === 'fixed') {
    return fixedQuestions[state.answers.length] ?? null;
  }

  if (state.phase === 'profiling') {
    if (state.profileQuestionsAnswered >= state.targetProfileQuestionCount) {
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

function removePendingSeafood(items: readonly ('squid' | 'shrimp')[], type: CravingType): ('squid' | 'shrimp')[] {
  if (type !== 'squid' && type !== 'shrimp') {
    return [...items];
  }

  return items.filter((item) => item !== type);
}

function hasUnaskedMainCravings(askedCravings: readonly CravingType[]): boolean {
  return mainCravingTypes.some((type) => !askedCravings.includes(type));
}

function enterProfilingPhase(preferredCraving: PreferredCraving | null): Pick<
  QuizState,
  'phase' | 'preferredCraving' | 'seafoodFollowUpMode' | 'pendingSeafoodOptions' | 'profileQuestionsAnswered' | 'targetProfileQuestionCount'
> {
  return {
    phase: 'profiling',
    preferredCraving,
    seafoodFollowUpMode: false,
    pendingSeafoodOptions: [],
    profileQuestionsAnswered: 0,
    targetProfileQuestionCount: preferredCraving ? TARGET_PROFILE_QUESTION_COUNT : FALLBACK_PROFILE_QUESTION_COUNT,
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
  let seafoodFollowUpMode = state.seafoodFollowUpMode;
  let pendingSeafoodOptions = state.pendingSeafoodOptions;
  let generalSinceLastCraving = state.generalSinceLastCraving;
  let profileQuestionsAnswered = state.profileQuestionsAnswered;
  let targetProfileQuestionCount = state.targetProfileQuestionCount;

  if (question.id === 'q3_texture') {
    branch = getBranchFromAnswers(answers);
    phase = 'finding_craving';
    generalSinceLastCraving = GENERAL_QUESTIONS_BETWEEN_CRAVINGS;
  }

  if (question.kind === 'craving' && question.cravingType) {
    const cravingType = question.cravingType;
    askedCravings = addUniqueCraving(askedCravings, cravingType);
    generalSinceLastCraving = 0;

    if (answer.id === 'yes') {
      if (cravingType === 'seafood') {
        phase = 'finding_craving';
        seafoodFollowUpMode = true;
        pendingSeafoodOptions = shuffle(seafoodCravingTypes.filter((type) => !askedCravings.includes(type)));
      } else {
        const profiling = enterProfilingPhase(getPreferredFromCraving(cravingType));
        phase = profiling.phase;
        preferredCraving = profiling.preferredCraving;
        seafoodFollowUpMode = profiling.seafoodFollowUpMode;
        pendingSeafoodOptions = profiling.pendingSeafoodOptions;
        profileQuestionsAnswered = profiling.profileQuestionsAnswered;
        targetProfileQuestionCount = profiling.targetProfileQuestionCount;
      }
    } else if (cravingType === 'squid' || cravingType === 'shrimp') {
      pendingSeafoodOptions = removePendingSeafood(pendingSeafoodOptions, cravingType);
      seafoodFollowUpMode = pendingSeafoodOptions.length > 0;
    } else if (cravingType === 'seafood') {
      seafoodFollowUpMode = false;
      pendingSeafoodOptions = [];
    }

    if (!preferredCraving && !seafoodFollowUpMode && !hasUnaskedMainCravings(askedCravings)) {
      const profiling = enterProfilingPhase(null);
      phase = profiling.phase;
      preferredCraving = profiling.preferredCraving;
      seafoodFollowUpMode = profiling.seafoodFollowUpMode;
      pendingSeafoodOptions = profiling.pendingSeafoodOptions;
      profileQuestionsAnswered = profiling.profileQuestionsAnswered;
      targetProfileQuestionCount = profiling.targetProfileQuestionCount;
    }
  } else if (phase === 'profiling' && question.kind === 'general') {
    profileQuestionsAnswered += 1;
    if (profileQuestionsAnswered >= targetProfileQuestionCount) {
      phase = 'complete';
    }
  } else if (phase === 'finding_craving' && question.kind === 'general') {
    generalSinceLastCraving += 1;
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
    seafoodFollowUpMode,
    pendingSeafoodOptions,
    generalSinceLastCraving,
    profileQuestionsAnswered,
    targetProfileQuestionCount,
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
