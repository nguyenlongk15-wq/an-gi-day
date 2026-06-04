import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Heart, Play, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, maxContentWidth, primaryShadow, radius, shadow, spacing, typography } from '../theme';
import type { RouteName } from '../types';

const heroImage = require('../../assets/food-hero.png');
const handTapImage = require('../../assets/hand-tap.png');
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
  const startTapScale = useRef(new Animated.Value(1)).current;
  const handTranslateX = useRef(new Animated.Value(0)).current;
  const handTranslateY = useRef(new Animated.Value(0)).current;
  const handRotate = useRef(new Animated.Value(0)).current;
  const tapRippleOpacity = useRef(new Animated.Value(0)).current;
  const tapRippleScale = useRef(new Animated.Value(0.65)).current;
  const tapSparkOpacity = useRef(new Animated.Value(0)).current;
  const tapSparkScale = useRef(new Animated.Value(0.7)).current;

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
    startTapScale.setValue(1);
    handTranslateX.setValue(0);
    handTranslateY.setValue(0);
    handRotate.setValue(0);
    tapRippleOpacity.setValue(0);
    tapRippleScale.setValue(0.65);
    tapSparkOpacity.setValue(0);
    tapSparkScale.setValue(0.7);

    if (reduceMotion) {
      startScale.setValue(1);
      startTranslateY.setValue(0);
      startOpacity.setValue(1);
      return undefined;
    }

    const createTapMotion = (targetScale: number) =>
      Animated.sequence([
        Animated.parallel([
          Animated.timing(handTranslateX, {
            toValue: -8,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.timing(handTranslateY, {
            toValue: -9,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.timing(handRotate, {
            toValue: 1,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.timing(startTapScale, {
            toValue: targetScale,
            duration: 120,
            easing: Easing.out(Easing.quad),
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.sequence([
            Animated.parallel([
              Animated.timing(tapRippleOpacity, {
                toValue: 0,
                duration: 1,
                useNativeDriver: useTitleNativeDriver,
              }),
              Animated.timing(tapRippleScale, {
                toValue: 0.65,
                duration: 1,
                useNativeDriver: useTitleNativeDriver,
              }),
              Animated.timing(tapSparkOpacity, {
                toValue: 0,
                duration: 1,
                useNativeDriver: useTitleNativeDriver,
              }),
              Animated.timing(tapSparkScale, {
                toValue: 0.7,
                duration: 1,
                useNativeDriver: useTitleNativeDriver,
              }),
            ]),
            Animated.parallel([
              Animated.sequence([
                Animated.timing(tapRippleOpacity, {
                  toValue: 0.68,
                  duration: 80,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: useTitleNativeDriver,
                }),
                Animated.timing(tapRippleOpacity, {
                  toValue: 0,
                  duration: 210,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: useTitleNativeDriver,
                }),
              ]),
              Animated.timing(tapRippleScale, {
                toValue: 1.24,
                duration: 290,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: useTitleNativeDriver,
              }),
              Animated.sequence([
                Animated.timing(tapSparkOpacity, {
                  toValue: 1,
                  duration: 70,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: useTitleNativeDriver,
                }),
                Animated.timing(tapSparkOpacity, {
                  toValue: 0,
                  duration: 220,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: useTitleNativeDriver,
                }),
              ]),
              Animated.timing(tapSparkScale, {
                toValue: 1.16,
                duration: 290,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: useTitleNativeDriver,
              }),
            ]),
          ]),
        ]),
        Animated.parallel([
          Animated.spring(handTranslateX, {
            toValue: 0,
            tension: 130,
            friction: 12,
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.spring(handTranslateY, {
            toValue: 0,
            tension: 130,
            friction: 12,
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.spring(handRotate, {
            toValue: 0,
            tension: 130,
            friction: 12,
            useNativeDriver: useTitleNativeDriver,
          }),
          Animated.spring(startTapScale, {
            toValue: 1,
            tension: 150,
            friction: 9,
            useNativeDriver: useTitleNativeDriver,
          }),
        ]),
      ]);

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

    const doubleTapMotion = Animated.loop(
      Animated.sequence([
        Animated.delay(760),
        createTapMotion(0.965),
        Animated.delay(135),
        createTapMotion(0.94),
        Animated.delay(2500),
      ]),
    );

    entranceMotion.start(({ finished }) => {
      if (finished) {
        doubleTapMotion.start();
      }
    });

    return () => {
      entranceMotion.stop();
      doubleTapMotion.stop();
    };
  }, [
    handRotate,
    handTranslateX,
    handTranslateY,
    reduceMotion,
    startOpacity,
    startScale,
    startTapScale,
    startTranslateY,
    tapRippleOpacity,
    tapRippleScale,
    tapSparkOpacity,
    tapSparkScale,
  ]);

  const handRotation = handRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-6deg'],
  });

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
          <View style={[styles.startTapStage, compact && styles.compactStartTapStage]}>
            <Animated.View
              style={[
                styles.startTapTarget,
                compact && styles.compactStartTapTarget,
                {
                  transform: [{ scale: startTapScale }],
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Bắt đầu"
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
                  colors={startHovered ? ['#FFAA4B', '#FF764A', '#FF4F55'] : ['#FFA64B', '#FF7450', '#FF514F']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.startGradient, compact && styles.compactStartGradient]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.38)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.startGloss, styles.noPointerEvents]}
                  />
                  <View style={[styles.startPlayBadge, compact && styles.compactStartPlayBadge]}>
                    <Play color={colors.ink} size={compact ? 34 : 38} fill={colors.ink} />
                  </View>
                  <Text style={[styles.startText, compact && styles.compactStartText]}>Bắt đầu</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <Animated.View
              style={[
                styles.tapRipple,
                compact && styles.compactTapRipple,
                styles.noPointerEvents,
                {
                  opacity: tapRippleOpacity,
                  transform: [{ scale: tapRippleScale }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.tapSparkles,
                compact && styles.compactTapSparkles,
                styles.noPointerEvents,
                {
                  opacity: tapSparkOpacity,
                  transform: [{ scale: tapSparkScale }],
                },
              ]}
            >
              <Text style={[styles.tapSpark, styles.tapSparkOne]}>✦</Text>
              <Text style={[styles.tapSpark, styles.tapSparkTwo]}>✧</Text>
              <Text style={[styles.tapSpark, styles.tapSparkThree]}>✦</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.handTap,
                compact && styles.compactHandTap,
                styles.noPointerEvents,
                {
                  transform: [{ translateX: handTranslateX }, { translateY: handTranslateY }, { rotate: handRotation }],
                },
              ]}
            >
              <Image source={handTapImage} style={styles.handTapImage} resizeMode="contain" />
            </Animated.View>
          </View>
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
    alignItems: 'center',
    marginTop: -2,
  },
  startTapStage: {
    width: 288,
    height: 224,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  compactStartTapStage: {
    width: 244,
    height: 202,
  },
  startTapTarget: {
    width: 164,
    height: 164,
    borderRadius: 82,
    boxShadow: '0px 18px 26px rgba(255, 86, 63, 0.32), 0px 6px 12px rgba(255, 184, 77, 0.18)',
    elevation: 9,
  },
  compactStartTapTarget: {
    width: 144,
    height: 144,
    borderRadius: 72,
  },
  startButton: {
    width: 164,
    height: 164,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    ...primaryShadow,
  },
  compactStartButton: {
    width: 144,
    height: 144,
  },
  startHovered: {
    opacity: 0.98,
  },
  startGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    position: 'relative',
  },
  compactStartGradient: {
    gap: 6,
  },
  startGloss: {
    position: 'absolute',
    top: 10,
    left: 24,
    right: 24,
    height: 46,
    borderRadius: 999,
  },
  startPlayBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  compactStartPlayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  startText: {
    color: colors.ink,
    ...typography.button,
    fontSize: 28,
    lineHeight: 34,
  },
  compactStartText: {
    fontSize: 24,
    lineHeight: 30,
  },
  startPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.94 }],
  },
  tapRipple: {
    position: 'absolute',
    width: 54,
    height: 54,
    right: 74,
    bottom: 72,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.72)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  compactTapRipple: {
    width: 46,
    height: 46,
    right: 58,
    bottom: 66,
    borderRadius: 23,
  },
  tapSparkles: {
    position: 'absolute',
    width: 86,
    height: 74,
    right: 45,
    bottom: 96,
  },
  compactTapSparkles: {
    right: 34,
    bottom: 86,
    transform: [{ scale: 0.9 }],
  },
  tapSpark: {
    position: 'absolute',
    color: colors.yellow,
    fontFamily: typography.button.fontFamily,
    fontWeight: '800',
  },
  tapSparkOne: {
    top: 4,
    left: 4,
    fontSize: 18,
  },
  tapSparkTwo: {
    top: 0,
    right: 16,
    fontSize: 24,
    color: 'rgba(255,255,255,0.92)',
  },
  tapSparkThree: {
    bottom: 10,
    right: 2,
    fontSize: 16,
  },
  handTap: {
    position: 'absolute',
    width: 118,
    height: 118,
    right: 4,
    bottom: -4,
  },
  compactHandTap: {
    width: 98,
    height: 98,
    right: 0,
    bottom: 2,
  },
  handTapImage: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
