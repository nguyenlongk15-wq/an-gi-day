import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { colors, radius, softShadow, spacing, typography } from '../theme';

const vietnamFlagIcon = require('../../assets/vietnam-flag-icon.png');

type OptionButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  tone?: 'warm' | 'cool';
};

export default function OptionButton({ label, onPress, icon, tone = 'warm' }: OptionButtonProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const shouldUseVietnamFlag = icon === 'vietnam_flag' || icon === '🇻🇳' || icon?.toLowerCase() === 'vn';

  const handlePress = () => {
    void Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.button,
        tone === 'cool' ? styles.coolButton : styles.warmButton,
        hovered && styles.hovered,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <View style={[styles.icon, shouldUseVietnamFlag && !imageFailed ? styles.flagIcon : styles.emojiIcon]}>
          {shouldUseVietnamFlag && !imageFailed ? (
            <Image
              accessibilityLabel="Cờ Việt Nam"
              source={vietnamFlagIcon}
              resizeMode="contain"
              onError={() => setImageFailed(true)}
              style={styles.flagImage}
            />
          ) : (
            <Text style={styles.iconText}>{shouldUseVietnamFlag ? '🇻🇳' : icon || '👉'}</Text>
          )}
        </View>
        <Text numberOfLines={2} adjustsFontSizeToFit style={styles.label}>
          {label}
        </Text>
      </View>
      <ChevronRight color={colors.muted} size={22} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 82,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: spacing.md,
    ...softShadow,
  },
  warmButton: {
    backgroundColor: 'rgba(255, 107, 74, 0.16)',
  },
  coolButton: {
    backgroundColor: 'rgba(45, 212, 168, 0.14)',
  },
  hovered: {
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 0,
  },
  icon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  flagIcon: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  flagImage: {
    width: 50,
    height: 50,
    borderRadius: 24,
  },
  iconText: {
    fontSize: 25,
    lineHeight: 31,
  },
  label: {
    flex: 1,
    color: colors.ink,
    ...typography.option,
  },
});
