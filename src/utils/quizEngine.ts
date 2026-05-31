import { branchQuestionPools, fixedQuestions } from '../data/questionPools';
import type { AnswerOption, Branch, Question, QuizAnswer } from '../types';
import { shuffle } from './random';

export const TOTAL_QUESTIONS = 13;
const RANDOM_QUESTION_COUNT = TOTAL_QUESTIONS - fixedQuestions.length;

export function getInitialQuestions(): Question[] {
  return [...fixedQuestions];
}

export function buildGameQuestions(branch: Branch): Question[] {
  const randomQuestions = shuffle(branchQuestionPools[branch]).slice(0, RANDOM_QUESTION_COUNT);
  return [...fixedQuestions, ...randomQuestions];
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

export function toQuizAnswer(question: Question, answer: AnswerOption): QuizAnswer {
  return {
    questionId: question.id,
    questionText: question.text,
    answerId: answer.id,
    answerLabel: answer.label,
    answerIcon: answer.icon,
    tags: answer.tags,
  };
}

export function questionPoolHealth(): Record<Branch, number> {
  return {
    home_dry: branchQuestionPools.home_dry.length,
    home_wet: branchQuestionPools.home_wet.length,
    outside_dry: branchQuestionPools.outside_dry.length,
    outside_wet: branchQuestionPools.outside_wet.length,
  };
}
