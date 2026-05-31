import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { SkipMessage } from '../types';
import { colors, primaryShadow, radius, shadow, spacing, typography } from '../theme';

type SkipResultCardProps = {
  message: SkipMessage;
  onRestart: () => void;
};

export default function SkipResultCard({ message, onRestart }: SkipResultCardProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
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
        friction: 13,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{message.icon}</Text>
      </View>
      <Text style={styles.title}>{message.title}</Text>
      {message.description ? <Text style={styles.description}>{message.description}</Text> : null}
      <View style={styles.actions}>
        <ActionButton label="Chọn lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={onRestart} />
      </View>
    </Animated.View>
  );
}

function ActionButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.actionButton, hovered && styles.actionHover, pressed && styles.pressed]}
    >
      <LinearGradient colors={[colors.primary, '#FF8A5B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionGradient}>
        {icon}
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.actionText}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  iconWrap: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: colors.line,
  },
  icon: {
    fontSize: 62,
    lineHeight: 74,
  },
  title: {
    color: colors.ink,
    ...typography.screenTitle,
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    ...typography.description,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  actionButton: {
    minHeight: 56,
    flexGrow: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...primaryShadow,
  },
  actionHover: {
    opacity: 0.96,
  },
  actionGradient: {
    minHeight: 56,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  actionText: {
    color: colors.ink,
    ...typography.button,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
