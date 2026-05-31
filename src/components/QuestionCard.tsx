import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import type { AnswerOption, Question } from '../types';
import { colors, shadow } from '../theme';
import OptionButton from './OptionButton';

type QuestionCardProps = {
  question: Question;
  onAnswer: (answer: AnswerOption) => void;
};

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
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
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.titleRow}>
        <View style={[styles.questionIcon, question.kind === 'craving' && styles.cravingQuestionIcon]}>
          <Text style={[styles.questionIconText, question.kind === 'craving' && styles.cravingQuestionIconText]}>
            {question.icon || '🍽️'}
          </Text>
        </View>
        <Text style={styles.title}>{question.text}</Text>
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
    borderRadius: 8,
    padding: 20,
    gap: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  title: {
    flex: 1,
    color: colors.ink,
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  questionIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  questionIconText: {
    fontSize: 28,
    lineHeight: 34,
  },
  cravingQuestionIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(248,196,79,0.16)',
  },
  cravingQuestionIconText: {
    fontSize: 36,
    lineHeight: 42,
  },
  options: {
    gap: 12,
  },
});
