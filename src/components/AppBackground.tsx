import type { ReactNode } from 'react';
import { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { ImageStyle, ViewStyle } from 'react-native';

import { colors } from '../theme';

const foodBackground = require('../../assets/backgrounds/food-bg.png');
const fallbackAbsoluteFill = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} satisfies ViewStyle;
const absoluteFillObject =
  (StyleSheet as typeof StyleSheet & { absoluteFillObject?: ViewStyle }).absoluteFillObject ?? fallbackAbsoluteFill;
const absoluteFillImageObject: ImageStyle = fallbackAbsoluteFill;

type AppBackgroundProps = {
  children: ReactNode;
};

function AppBackground({ children }: AppBackgroundProps) {
  return (
    <View style={styles.root}>
      <View style={styles.backgroundLayer}>
        <Image source={foodBackground} resizeMode="cover" style={styles.backgroundImage} />
        <View style={styles.overlay} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export default memo(AppBackground);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    overflow: 'hidden',
  },
  backgroundLayer: {
    ...absoluteFillObject,
    pointerEvents: 'none',
  },
  backgroundImage: {
    ...absoluteFillImageObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  content: {
    flex: 1,
  },
});
