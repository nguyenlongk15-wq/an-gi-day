import type { CravingType, FoodTypeCraving, Question, VegetableCraving, VegetableGroup } from '../types';

type FoodTypeConfig = {
  type: FoodTypeCraving;
  icon: string;
  question: string;
};

type VegetableConfig = {
  type: VegetableCraving;
  group: VegetableGroup;
  icon: string;
  question: string;
};

export const homeWetFoodTypeConfigs: Record<FoodTypeCraving, FoodTypeConfig> = {
  soup_like: {
    type: 'soup_like',
    icon: '🍲',
    question: 'Bạn có thèm canh không?',
  },
  porridge_like: {
    type: 'porridge_like',
    icon: '🥣',
    question: 'Bạn có thèm cháo không?',
  },
  noodle_like: {
    type: 'noodle_like',
    icon: '🍜',
    question: 'Bạn có thèm mì không?',
  },
};

export const homeWetFoodTypeOrder: FoodTypeCraving[] = ['soup_like', 'porridge_like', 'noodle_like'];

const homeWetProteinQuestions: Partial<Record<CravingType, { icon: string; question: string }>> = {
  fish: { icon: '🐟', question: 'Bạn có thèm cá không?' },
  pork: { icon: '🐷', question: 'Bạn có thèm thịt heo không?' },
  beef: { icon: '🥩', question: 'Bạn có thèm thịt bò không?' },
  chicken: { icon: '🍗', question: 'Bạn có thèm thịt gà không?' },
  shrimp: { icon: '🦐', question: 'Bạn có thèm tôm không?' },
  squid: { icon: '🦑', question: 'Bạn có thèm mực không?' },
  egg: { icon: '🥚', question: 'Bạn có thèm trứng không?' },
  tofu: { icon: '◻️', question: 'Bạn có thèm đậu hũ không?' },
};

export const homeWetProteinCravingTypes: CravingType[] = ['fish', 'pork', 'beef', 'chicken', 'shrimp', 'squid', 'egg', 'tofu'];

export const homeWetVegetableConfigs: Record<VegetableCraving, VegetableConfig> = {
  malabar_spinach: { type: 'malabar_spinach', group: 'leafy', icon: '🥬', question: 'Bạn có thèm rau mồng tơi không?' },
  amaranth: { type: 'amaranth', group: 'leafy', icon: '🌿', question: 'Bạn có thèm rau dền không?' },
  mustard_greens: { type: 'mustard_greens', group: 'leafy', icon: '🥬', question: 'Bạn có thèm cải xanh/cải bẹ không?' },
  water_spinach: { type: 'water_spinach', group: 'leafy', icon: '🌱', question: 'Bạn có thèm rau muống không?' },
  moringa: { type: 'moringa', group: 'leafy', icon: '🌿', question: 'Bạn có thèm rau ngót không?' },
  watercress: { type: 'watercress', group: 'leafy', icon: '🌿', question: 'Bạn có thèm cải xoong không?' },
  spinach: { type: 'spinach', group: 'leafy', icon: '🥬', question: 'Bạn có thèm rau chân vịt không?' },
  seaweed: { type: 'seaweed', group: 'leafy', icon: '🌊', question: 'Bạn có thèm rong biển không?' },
  garlic_chives: { type: 'garlic_chives', group: 'leafy', icon: '🌱', question: 'Bạn có thèm hẹ không?' },
  napa_cabbage: { type: 'napa_cabbage', group: 'leafy', icon: '🥬', question: 'Bạn có thèm cải thảo không?' },
  pumpkin: { type: 'pumpkin', group: 'root', icon: '🎃', question: 'Bạn có thèm bí đỏ không?' },
  winter_melon: { type: 'winter_melon', group: 'root', icon: '🥒', question: 'Bạn có thèm bí xanh/bí đao không?' },
  gourd: { type: 'gourd', group: 'root', icon: '🍈', question: 'Bạn có thèm bầu không?' },
  bitter_melon: { type: 'bitter_melon', group: 'root', icon: '🥒', question: 'Bạn có thèm khổ qua không?' },
  carrot_potato: { type: 'carrot_potato', group: 'root', icon: '🥔', question: 'Bạn có thèm khoai tây/cà rốt không?' },
  taro: { type: 'taro', group: 'root', icon: '🍠', question: 'Bạn có thèm khoai môn không?' },
  chayote: { type: 'chayote', group: 'root', icon: '🥒', question: 'Bạn có thèm su su không?' },
  tomato: { type: 'tomato', group: 'root', icon: '🍅', question: 'Bạn có thèm cà chua không?' },
  mushroom: { type: 'mushroom', group: 'root', icon: '🍄', question: 'Bạn có thèm nấm không?' },
  okra: { type: 'okra', group: 'root', icon: '🌱', question: 'Bạn có thèm đậu bắp không?' },
};

export function createHomeWetFoodTypeQuestion(type: FoodTypeCraving): Question {
  const config = homeWetFoodTypeConfigs[type];

  return {
    id: `home_wet_food_type_${type}`,
    kind: 'food_type_craving',
    foodType: type,
    icon: config.icon,
    text: config.question,
    options: [
      { id: 'yes', label: 'Có', icon: '✅', tags: [type] },
      { id: 'no', label: 'Không', icon: '❌', tags: [] },
    ],
  };
}

export function createHomeWetProteinQuestion(type: CravingType): Question {
  const config = homeWetProteinQuestions[type];

  if (!config) {
    throw new Error(`Unsupported home_wet protein craving: ${type}`);
  }

  const tags = type === 'squid' || type === 'shrimp' ? [type, 'seafood'] : [type];

  return {
    id: `home_wet_protein_${type}`,
    kind: 'craving',
    cravingType: type,
    icon: config.icon,
    text: config.question,
    options: [
      { id: 'yes', label: 'Có', icon: '✅', tags },
      { id: 'no', label: 'Không', icon: '❌', tags: [] },
    ],
  };
}

export function createHomeWetVegetableGroupQuestion(): Question {
  return {
    id: 'home_wet_vegetable_group',
    kind: 'vegetable_group',
    icon: '🥬',
    text: 'Bạn đang thèm rau lá hay rau củ?',
    options: [
      { id: 'leafy', label: 'Rau lá', icon: '🥬', tags: ['leafy'] },
      { id: 'root', label: 'Rau củ', icon: '🥕', tags: ['root'] },
    ],
  };
}

export function createHomeWetVegetableQuestion(type: VegetableCraving): Question {
  const config = homeWetVegetableConfigs[type];

  return {
    id: `home_wet_vegetable_${type}`,
    kind: 'vegetable_craving',
    vegetableCraving: type,
    vegetableGroup: config.group,
    icon: config.icon,
    text: config.question,
    options: [
      { id: 'yes', label: 'Có', icon: '✅', tags: [type] },
      { id: 'no', label: 'Không', icon: '❌', tags: [] },
    ],
  };
}
