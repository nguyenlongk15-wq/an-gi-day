import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Heart, Play, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, maxContentWidth, primaryShadow, radius, shadow, spacing, typography } from '../theme';
import type { RouteName } from '../types';

const heroImage = require('../../assets/food-hero.png');
const useTitleNativeDriver = Platform.OS !== 'web';

type HomeScreenProps = {
  onStart: () => void;
  onNavigate: (route: RouteName) => void;
};

export default function HomeScreen({ onStart, onNavigate }: HomeScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 520;
  const tight = width < 380;
  const [startHovered, setStartHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const eatScale = useRef(new Animated.Value(0.92)).current;
  const eatTranslateY = useRef(new Animated.Value(12)).current;
  const eatOpacity = useRef(new Animated.Value(0)).current;
  const fastScale = useRef(new Animated.Value(0.92)).current;
  const fastTranslateY = useRef(new Animated.Value(12)).current;
  const fastOpacity = useRef(new Animated.Value(0)).current;
  const connectorOpacity = useRef(new Animated.Value(0)).current;
  const startScale = useRef(new Animated.Value(0.96)).current;
  const startTranslateY = useRef(new Animated.Value(14)).current;
  const startOpacity = useRef(new Animated.Value(0)).current;
  const startBreathScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const resetTitleMotion = (scale: Animated.Value, translateY: Animated.Value, opacity: Animated.Value) => {
      scale.setValue(0.92);
      translateY.setValue(12);
      opacity.setValue(0);
    };

    const createTitleMotion = (scale: Animated.Value, translateY: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1.08,
              duration: 260,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: useTitleNativeDriver,
            }),
            Animated.spring(scale, {
              toValue: 1,
              tension: 92,
              friction: 9,
              useNativeDriver: useTitleNativeDriver,
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: -4,
              duration: 260,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: useTitleNativeDriver,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              tension: 92,
              friction: 9,
              useNativeDriver: useTitleNativeDriver,
            }),
          ]),
        ]),
      ]);

    resetTitleMotion(eatScale, eatTranslateY, eatOpacity);
    resetTitleMotion(fastScale, fastTranslateY, fastOpacity);
    connectorOpacity.setValue(0);

    const titleMotion = Animated.parallel([
      createTitleMotion(eatScale, eatTranslateY, eatOpacity, 0),
      Animated.sequence([
        Animated.delay(70),
        Animated.timing(connectorOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useTitleNativeDriver,
        }),
      ]),
      createTitleMotion(fastScale, fastTranslateY, fastOpacity, 120),
    ]);

    titleMotion.start();

    return () => titleMotion.stop();
  }, [connectorOpacity, eatOpacity, eatScale, eatTranslateY, fastOpacity, fastScale, fastTranslateY]);

  useEffect(() => {
    startScale.setValue(0.96);
    startTranslateY.setValue(14);
    startOpacity.setValue(0);
    startBreathScale.setValue(1);

    if (reduceMotion) {
      startScale.setValue(1);
      startTranslateY.setValue(0);
      startOpacity.setValue(1);
      return undefined;
    }

    const entranceMotion = Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(startOpacity, {
          toValue: 1,
          duration: 240,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useTitleNativeDriver,
        }),
        Animated.timing(startTranslateY, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useTitleNativeDriver,
        }),
        Animated.spring(startScale, {
          toValue: 1,
          tension: 86,
          friction: 11,
          useNativeDriver: useTitleNativeDriver,
        }),
      ]),
    ]);

    const breathMotion = Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        Animated.timing(startBreathScale, {
          toValue: 1.014,
          duration: 520,
          easing: Easing.out(Easing.quad),
          useNativeDriver: useTitleNativeDriver,
        }),
        Animated.timing(startBreathScale, {
          toValue: 1,
          duration: 640,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: useTitleNativeDriver,
        }),
      ]),
    );

    entranceMotion.start(({ finished }) => {
      if (finished) {
        breathMotion.start();
      }
    });

    return () => {
      entranceMotion.stop();
      breathMotion.stop();
    };
  }, [reduceMotion, startBreathScale, startOpacity, startScale, startTranslateY]);

  return (
    <ScrollView contentContainerStyle={[styles.scroll, compact && styles.compactScroll]}>
      <View style={[styles.content, compact && styles.compactContent]}>
        <View style={[styles.hero, compact && styles.compactHero]}>
          <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(2,8,12,0.08)', 'rgba(2,8,12,0.28)', 'rgba(2,8,12,0.78)', 'rgba(2,8,12,0.94)']}
            locations={[0, 0.42, 0.72, 1]}
            style={[styles.heroOverlay, styles.noPointerEvents]}
          />

          <View style={styles.favoriteAction}>
            <IconButton label="Yêu thích" icon={<Heart color={colors.ink} size={18} />} onPress={() => onNavigate('favorites')} />
          </View>

          <View style={[styles.heroText, compact && styles.compactHeroText]}>
            <View style={styles.badge}>
              <Sparkles color={colors.yellow} size={16} />
              <Text style={styles.badgeText}>Mini game chọn món</Text>
            </View>

            <View style={[styles.titleBlock, tight && styles.tightTitleBlock]}>
              <Animated.View
                style={[
                  styles.titleAnimatedWord,
                  {
                    opacity: eatOpacity,
                    transform: [{ translateY: eatTranslateY }, { scale: eatScale }],
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.86}
                  style={[styles.titleEat, compact && styles.compactTitleEat, tight && styles.tightTitleEat]}
                >
                  Ăn
                </Text>
              </Animated.View>
              <Animated.Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.9}
                style={[
                  styles.titleConnector,
                  compact && styles.compactTitleConnector,
                  tight && styles.tightTitleConnector,
                  { opacity: connectorOpacity },
                ]}
              >
                hay
              </Animated.Text>
              <Animated.View
                style={[
                  styles.titleAnimatedWord,
                  {
                    opacity: fastOpacity,
                    transform: [{ translateY: fastTranslateY }, { scale: fastScale }],
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.82}
                  style={[styles.titleSkip, compact && styles.compactTitleSkip, tight && styles.tightTitleSkip]}
                >
                  Nhịn?
                </Text>
              </Animated.View>
            </View>

            <Text style={[styles.slogan, compact && styles.compactSlogan]}>
              Trả lời vài câu, khỏi nghĩ hôm nay <Text style={styles.sloganHighlight}>ăn gì</Text>.
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.startMotionWrap,
            {
              opacity: startOpacity,
              transform: [{ translateY: startTranslateY }, { scale: startScale }],
            },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: startBreathScale }] }}>
            <Pressable
              accessibilityRole="button"
              onPress={onStart}
              onHoverIn={() => setStartHovered(true)}
              onHoverOut={() => setStartHovered(false)}
              style={({ pressed }) => [
                styles.startButton,
                compact && styles.compactStartButton,
                startHovered && styles.startHovered,
                pressed && styles.startPressed,
              ]}
            >
              <LinearGradient
                colors={startHovered ? ['#FF4F3C', '#FF7950', '#FFB14D'] : ['#FF533E', '#FF724F', '#FFA64B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.startGradient, compact && styles.compactStartGradient]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.startGloss, styles.noPointerEvents]}
                />
                <View style={[styles.startPlayBadge, compact && styles.compactStartPlayBadge, startHovered && styles.startPlayBadgeHovered]}>
                  <View style={startHovered && styles.startPlayNudge}>
                    <Play color="#FF6748" size={compact ? 19 : 21} fill="#FF6748" />
                  </View>
                </View>
                <Text style={[styles.startText, compact && styles.compactStartText]}>Bắt đầu</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

function IconButton({ label, icon, onPress }: { label: string; icon: ReactNode; onPress: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [styles.iconButton, hovered && styles.iconButtonHover, pressed && styles.pressed]}
    >
      {icon}
      <Text style={styles.iconButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactScroll: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: maxContentWidth,
    gap: spacing.lg,
  },
  compactContent: {
    gap: spacing.md,
  },
  iconButton: {
    minHeight: 44,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(3, 13, 18, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButtonHover: {
    borderColor: 'rgba(255,184,77,0.46)',
    backgroundColor: 'rgba(6, 20, 27, 0.86)',
  },
  iconButtonText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
  },
  hero: {
    minHeight: 430,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.panel,
    ...shadow,
  },
  compactHero: {
    minHeight: 440,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
  favoriteAction: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    zIndex: 3,
  },
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing.xxl,
    gap: spacing.sm,
    zIndex: 2,
  },
  compactHeroText: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(2, 10, 14, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.32)',
    boxShadow: '0px 0px 10px rgba(255, 184, 77, 0.18)',
  },
  badgeText: {
    color: colors.ink,
    ...typography.label,
  },
  titleBlock: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 2,
    minWidth: 0,
    paddingTop: 8,
    paddingHorizontal: spacing.xs,
    overflow: 'visible',
  },
  tightTitleBlock: {
    gap: 0,
  },
  titleAnimatedWord: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  titleEat: {
    color: '#FF7A4F',
    fontFamily: typography.hero.fontFamily,
    fontSize: 54,
    lineHeight: 62,
    fontWeight: '800',
    letterSpacing: 0.2,
    paddingTop: 4,
  },
  compactTitleEat: {
    fontSize: 46,
    lineHeight: 54,
  },
  tightTitleEat: {
    fontSize: 40,
    lineHeight: 48,
  },
  titleConnector: {
    color: 'rgba(255,255,255,0.74)',
    fontFamily: typography.button.fontFamily,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  compactTitleConnector: {
    fontSize: 18,
    lineHeight: 22,
  },
  tightTitleConnector: {
    fontSize: 16,
    lineHeight: 20,
  },
  titleSkip: {
    color: '#4BE3D1',
    fontFamily: typography.hero.fontFamily,
    fontSize: 60,
    lineHeight: 68,
    fontWeight: '800',
    letterSpacing: 0.15,
    paddingTop: 2,
  },
  compactTitleSkip: {
    fontSize: 50,
    lineHeight: 58,
  },
  tightTitleSkip: {
    fontSize: 43,
    lineHeight: 50,
  },
  slogan: {
    color: 'rgba(255,255,255,0.82)',
    ...typography.description,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 560,
    textAlign: 'center',
    alignSelf: 'center',
  },
  compactSlogan: {
    fontSize: 15,
    lineHeight: 23,
  },
  sloganHighlight: {
    color: colors.yellow,
    fontFamily: typography.button.fontFamily,
    fontWeight: '900',
    textDecorationLine: 'underline',
    textDecorationColor: colors.yellow,
  },
  startMotionWrap: {
    width: '100%',
  },
  startButton: {
    minHeight: 72,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    ...primaryShadow,
    boxShadow: '0px 16px 26px rgba(255, 86, 63, 0.34), 0px 6px 12px rgba(255, 184, 77, 0.20)',
  },
  compactStartButton: {
    minHeight: 66,
    borderRadius: radius.pill,
  },
  startHovered: {
    boxShadow: '0px 18px 30px rgba(255, 99, 66, 0.42), 0px 7px 14px rgba(255, 184, 77, 0.24)',
  },
  startGradient: {
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    position: 'relative',
  },
  compactStartGradient: {
    minHeight: 66,
  },
  startGloss: {
    position: 'absolute',
    top: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 22,
    borderRadius: radius.pill,
  },
  startPlayBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    boxShadow: '0px 5px 10px rgba(112, 28, 14, 0.18)',
  },
  compactStartPlayBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  startPlayBadgeHovered: {
    backgroundColor: 'rgba(255,255,255,0.96)',
  },
  startPlayNudge: {
    transform: [{ translateX: 2 }],
  },
  startText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 23,
    lineHeight: 29,
    textShadowColor: 'rgba(96, 20, 10, 0.26)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  compactStartText: {
    fontSize: 21,
    lineHeight: 27,
  },
  startPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.975 }],
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
