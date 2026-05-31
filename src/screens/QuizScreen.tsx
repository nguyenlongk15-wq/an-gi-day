import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';

import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import { getRandomSkipMessage } from '../data/skipMessages';
import { getCravingBadgeText } from '../data/cravings';
import { colors, maxContentWidth } from '../theme';
import type { AnswerOption, Question, QuizState, ResultPayload } from '../types';
import { getBestResults } from '../utils/getBestResults';
import { getLastShownResultIds, rememberResult } from '../utils/storage';
import {
  advanceQuizState,
  createInitialQuizState,
  FIXED_QUESTION_COUNT,
  getNextQuestion,
  isQuizComplete,
  toQuizAnswer,
} from '../utils/quizEngine';

type QuizScreenProps = {
  onComplete: (result: ResultPayload) => void;
  onExit: () => void;
};

type QuizProgressView = {
  label: string;
  detail?: string;
  progress: number;
  kicker: string;
};

function getQuizProgressView(state: QuizState, question: Question): QuizProgressView {
  if (state.phase === 'fixed') {
    const step = Math.min(state.answers.length + 1, FIXED_QUESTION_COUNT);
    return {
      label: `Bước ${step}`,
      progress: step / FIXED_QUESTION_COUNT,
      kicker: `Bước ${step}`,
    };
  }

  if (state.phase === 'profiling') {
    const currentProfileQuestion = Math.min(state.profileQuestionsAnswered + 1, state.targetProfileQuestionCount);
    return {
      label: 'Đang chọn món hợp gu...',
      detail: `Câu gu vị ${currentProfileQuestion}/${state.targetProfileQuestionCount}`,
      progress: Math.min((state.profileQuestionsAnswered + 0.25) / state.targetProfileQuestionCount, 1),
      kicker: `Câu gu vị ${currentProfileQuestion}/${state.targetProfileQuestionCount}`,
    };
  }

  const cravingProgress = Math.min(0.92, 0.25 + state.askedCravings.length * 0.06 + state.generalSinceLastCraving * 0.05);
  return {
    label: 'Đang dò cơn thèm...',
    progress: cravingProgress,
    kicker: question.kind === 'craving' ? 'Câu hỏi nguyên liệu' : 'Câu gu vị nhanh',
  };
}

export default function QuizScreen({ onComplete, onExit }: QuizScreenProps) {
  const [quizState, setQuizState] = useState<QuizState>(() => createInitialQuizState());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() => getNextQuestion(createInitialQuizState()));
  const [history, setHistory] = useState<Array<{ state: QuizState; question: Question | null }>>([]);
  const [busy, setBusy] = useState(false);

  const resetQuiz = () => {
    const initialState = createInitialQuizState();
    setQuizState(initialState);
    setCurrentQuestion(getNextQuestion(initialState));
    setHistory([]);
    setBusy(false);
  };

  const completeWithSkip = async (nextAnswers: ResultPayload['answers']) => {
    onComplete({
      type: 'skip',
      branch: 'skip',
      answers: nextAnswers,
      skipMessage: getRandomSkipMessage(),
      isSkip: true,
    });
  };

  const completeWithFood = async (nextState: QuizState) => {
    if (!nextState.branch) {
      resetQuiz();
      return;
    }

    const recentIds = await getLastShownResultIds();
    const bestResult = getBestResults(nextState.answers, nextState.branch, recentIds, nextState.preferredCraving);
    await rememberResult(bestResult.selected.id);

    onComplete({
      type: 'food',
      food: bestResult.selected,
      branch: nextState.branch,
      answers: nextState.answers,
      preferredCraving: nextState.preferredCraving,
      reason: bestResult.reason,
      topResults: bestResult.topResults,
    });
  };

  const handleAnswer = async (answer: AnswerOption) => {
    if (!currentQuestion || busy) {
      return;
    }

    setBusy(true);

    try {
      if (currentQuestion.id === 'q1_eat_or_skip' && answer.id === 'skip') {
        const quizAnswer = toQuizAnswer(currentQuestion, answer);
        const nextAnswers = [...quizState.answers, quizAnswer];
        await completeWithSkip(nextAnswers);
        return;
      }

      const nextState = advanceQuizState(quizState, currentQuestion, answer);

      const nextQuestion = getNextQuestion(nextState);

      if (isQuizComplete(nextState) || !nextQuestion) {
        await completeWithFood(nextState);
        return;
      }

      setHistory((items) => [...items, { state: quizState, question: currentQuestion }]);
      setQuizState(nextState);
      setCurrentQuestion(nextQuestion);
    } finally {
      setBusy(false);
    }
  };

  const goBack = () => {
    if (busy) {
      return;
    }

    if (history.length === 0) {
      onExit();
      return;
    }

    const previous = history[history.length - 1];
    setQuizState(previous.state);
    setCurrentQuestion(previous.question);
    setHistory((items) => items.slice(0, -1));
  };

  if (!currentQuestion) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Không tìm thấy câu hỏi.</Text>
        <HeaderButton label="Chọn lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={resetQuiz} />
      </View>
    );
  }

  const progressView = getQuizProgressView(quizState, currentQuestion);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.content}>
        <View style={styles.header}>
          <HeaderButton label="Quay lại" icon={<ArrowLeft color={colors.ink} size={18} />} onPress={goBack} />
          <HeaderButton label="Làm lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={resetQuiz} />
        </View>
        <ProgressBar progress={progressView.progress} label={progressView.label} detail={progressView.detail} />
        {quizState.preferredCraving ? (
          <View style={styles.cravingBadge}>
            <Text style={styles.cravingBadgeText}>{getCravingBadgeText(quizState.preferredCraving)}</Text>
          </View>
        ) : null}
        <QuestionCard
          question={currentQuestion}
          kicker={progressView.kicker}
          onAnswer={handleAnswer}
        />
      </View>
    </ScrollView>
  );
}

function HeaderButton({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
      {icon}
      <Text style={styles.headerButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerButton: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButtonText: {
    color: colors.ink,
    fontWeight: '800',
    fontSize: 14,
  },
  cravingBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(248,196,79,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(248,196,79,0.34)',
  },
  cravingBadgeText: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 18,
  },
  error: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
