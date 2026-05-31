import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';

import type { SkipMessage } from '../types';
import { colors, shadow } from '../theme';

type SkipResultCardProps = {
  message: SkipMessage;
  onRestart: () => void;
};

export default function SkipResultCard({ message, onRestart }: SkipResultCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{message.icon}</Text>
      </View>
      <Text style={styles.title}>{message.title}</Text>
      {message.description ? <Text style={styles.description}>{message.description}</Text> : null}
      <View style={styles.actions}>
        <ActionButton label="Chọn lại" icon={<RotateCcw color={colors.ink} size={18} />} onPress={onRestart} />
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
      {icon}
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.actionText}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 20,
    gap: 16,
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow,
  },
  iconWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  icon: {
    fontSize: 58,
    lineHeight: 70,
  },
  title: {
    color: colors.ink,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
  },
  actionButton: {
    minHeight: 50,
    flexGrow: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
