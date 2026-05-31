import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Heart, Home } from 'lucide-react-native';

import AppBackground from '../components/AppBackground';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import { colors } from '../theme';
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
        icon={<Home color={route === 'home' ? colors.ink : colors.muted} size={20} />}
        onPress={() => onNavigate('home')}
      />
      <TabButton
        active={route === 'favorites'}
        label="Yêu thích"
        icon={<Heart color={route === 'favorites' ? colors.ink : colors.muted} size={20} />}
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
  },
  tabBar: {
    minHeight: 64,
    borderRadius: 18,
    padding: 8,
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: colors.panelStrong,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 7,
  },
  tabButtonActive: {
    backgroundColor: colors.red,
  },
  tabText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    color: colors.ink,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
