import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

type ProgressBarProps = {
  progress: number;
  label: string;
  detail?: string;
};

export default function ProgressBar({ progress, label, detail }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clampedProgress * 100}%` }]} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.text}>{label}</Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.yellow,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  detail: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'right',
  },
});
