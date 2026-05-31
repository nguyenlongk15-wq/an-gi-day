import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import type { AnswerOption, Question } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';
import OptionButton from './OptionButton';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answer: AnswerOption) => void;
};

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(14);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 90,
        friction: 12,
      }),
    ]).start();
  }, [opacity, question.id, translateY]);

  return (
    <Animated.View style={[styles.card, compact && styles.compactCard, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.titleRow}>
        <View style={[styles.questionIcon, question.kind === 'craving' && styles.cravingQuestionIcon]}>
          <Text style={[styles.questionIconText, question.kind === 'craving' && styles.cravingQuestionIconText]}>
            {question.icon || '🍽️'}
          </Text>
        </View>
        <Text style={[styles.title, compact && styles.compactTitle]}>{question.text}</Text>
      </View>
      <View style={styles.options}>
        {question.options.map((answer, index) => (
          <OptionButton
            key={answer.id}
            label={answer.label}
            icon={answer.icon}
            tone={index === 0 ? 'warm' : 'cool'}
            onPress={() => onAnswer(answer)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.xl,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  compactCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    flex: 1,
    color: colors.ink,
    ...typography.questionTitle,
  },
  compactTitle: {
    fontSize: 25,
    lineHeight: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  questionIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  questionIconText: {
    fontSize: 31,
    lineHeight: 38,
  },
  cravingQuestionIcon: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,184,77,0.16)',
  },
  cravingQuestionIconText: {
    fontSize: 38,
    lineHeight: 44,
  },
  options: {
    gap: spacing.md,
  },
});
