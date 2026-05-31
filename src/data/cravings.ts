import type { CravingType, PreferredCraving, Question } from '../types';

type CravingConfig = {
  type: CravingType;
  label: string;
  icon: string;
  question: string;
};

export const cravingConfigs: Record<CravingType, CravingConfig> = {
  chicken: {
    type: 'chicken',
    label: 'Thịt gà',
    icon: '🍗',
    question: 'Bạn có thèm thịt gà không?',
  },
  beef: {
    type: 'beef',
    label: 'Thịt bò',
    icon: '🥩',
    question: 'Bạn có thèm thịt bò không?',
  },
  pork: {
    type: 'pork',
    label: 'Thịt heo',
    icon: '🐷',
    question: 'Bạn có thèm thịt heo không?',
  },
  fish: {
    type: 'fish',
    label: 'Cá',
    icon: '🐟',
    question: 'Bạn có thèm cá không?',
  },
  egg: {
    type: 'egg',
    label: 'Trứng',
    icon: '🥚',
    question: 'Bạn có thèm trứng gà/trứng vịt không?',
  },
  tofu: {
    type: 'tofu',
    label: 'Đậu hũ',
    icon: '◻️',
    question: 'Bạn có thèm đậu hũ không?',
  },
  seafood: {
    type: 'seafood',
    label: 'Hải sản',
    icon: '🦞',
    question: 'Bạn có thèm hải sản không?',
  },
  squid: {
    type: 'squid',
    label: 'Mực',
    icon: '🦑',
    question: 'Bạn có thèm mực không?',
  },
  shrimp: {
    type: 'shrimp',
    label: 'Tôm',
    icon: '🦐',
    question: 'Bạn có thèm tôm không?',
  },
};

export const mainCravingTypes: CravingType[] = ['chicken', 'beef', 'pork', 'fish', 'egg', 'tofu', 'seafood'];
export const seafoodCravingTypes: ('squid' | 'shrimp')[] = ['squid', 'shrimp'];

export function createCravingQuestion(type: CravingType): Question {
  const config = cravingConfigs[type];
  const yesTags = type === 'seafood' ? ['seafood_interest'] : type === 'squid' || type === 'shrimp' ? [type, 'seafood'] : [type];

  return {
    id: `craving_${type}`,
    kind: 'craving',
    cravingType: type,
    icon: config.icon,
    text: config.question,
    options: [
      { id: 'yes', label: 'Có', icon: '✅', tags: yesTags.filter(Boolean) },
      { id: 'no', label: 'Không', icon: '❌', tags: [] },
    ],
  };
}

export function getCravingBadgeText(type: PreferredCraving): string {
  const config = cravingConfigs[type];
  return `Đang ưu tiên: ${config.label} ${config.icon}`;
}
