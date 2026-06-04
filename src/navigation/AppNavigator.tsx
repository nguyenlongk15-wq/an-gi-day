import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Heart, Home } from 'lucide-react-native';

import AppBackground from '../components/AppBackground';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import { colors, maxContentWidth, radius, spacing, typography } from '../theme';
import type { ResultPayload, RouteName } from '../types';
import { clearLegacyHistoryStorage } from '../utils/storage';

export default function AppNavigator() {
  const [route, setRoute] = useState<RouteName>('home');
  const [result, setResult] = useState<ResultPayload | null>(null);

  useEffect(() => {
    void clearLegacyHistoryStorage();
  }, []);

  const startQuiz = () => {
    setResult(null);
    setRoute('quiz');
  };

  const completeQuiz = (nextResult: ResultPayload) => {
    setResult(nextResult);
    setRoute('result');
  };

  const renderScreen = () => {
    if (route === 'quiz') {
      return <QuizScreen onComplete={completeQuiz} onExit={() => setRoute('home')} />;
    }

    if (route === 'result' && result) {
      return <ResultScreen result={result} onRestart={startQuiz} />;
    }

    if (route === 'favorites') {
      return <FavoritesScreen />;
    }

    return <HomeScreen onStart={startQuiz} onNavigate={setRoute} />;
  };

  const showTabs = route === 'home' || route === 'favorites';

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screen}>{renderScreen()}</View>
        {showTabs ? <TabBar route={route} onNavigate={setRoute} /> : null}
      </SafeAreaView>
    </AppBackground>
  );
}

function TabBar({ route, onNavigate }: { route: RouteName; onNavigate: (route: RouteName) => void }) {
  return (
    <View style={styles.tabBar}>
      <TabButton
        active={route === 'home'}
        label="Trang chủ"
        icon={<Home color={route === 'home' ? colors.ink : colors.muted} size={18} />}
        onPress={() => onNavigate('home')}
      />
      <TabButton
        active={route === 'favorites'}
        label="Yêu thích"
        icon={<Heart color={route === 'favorites' ? colors.ink : colors.muted} size={18} />}
        onPress={() => onNavigate('favorites')}
      />
    </View>
  );
}

function TabButton({ active, icon, label, onPress }: { active: boolean; icon: ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.tabButton, active && styles.tabButtonActive, pressed && styles.pressed]}>
      {icon}
      <Text style={[styles.tabText, active && styles.tabTextActive]} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    minHeight: 0,
  },
  tabBar: {
    width: '90%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
    minHeight: 52,
    borderRadius: 20,
    padding: 5,
    marginBottom: spacing.xs,
    backgroundColor: 'rgba(5, 18, 24, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    gap: 6,
    boxShadow: '0px 8px 14px rgba(0, 0, 0, 0.22)',
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 107, 74, 0.94)',
  },
  tabText: {
    color: colors.muted,
    ...typography.label,
    fontSize: 11,
    lineHeight: 14,
  },
  tabTextActive: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
});
