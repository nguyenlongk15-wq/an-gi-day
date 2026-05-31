import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { colors } from '../theme';

const vietnamFlagIcon = require('../../assets/vietnam-flag-icon.png');

type OptionButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  tone?: 'warm' | 'cool';
};

export default function OptionButton({ label, onPress, icon, tone = 'warm' }: OptionButtonProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldUseVietnamFlag = icon === 'vietnam_flag' || icon === '🇻🇳' || icon?.toLowerCase() === 'vn';

  const handlePress = () => {
    void Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        tone === 'cool' ? styles.coolButton : styles.warmButton,
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
      <ChevronRight color={colors.ink} size={22} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 78,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 12,
  },
  warmButton: {
    backgroundColor: 'rgba(241, 91, 69, 0.20)',
  },
  coolButton: {
    backgroundColor: 'rgba(103, 211, 145, 0.18)',
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.86,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  flagIcon: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  flagImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconText: {
    fontSize: 22,
    lineHeight: 28,
  },
  label: {
    flex: 1,
    color: colors.ink,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '800',
  },
});
