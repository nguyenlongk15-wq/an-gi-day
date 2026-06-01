export type Branch = 'home_dry' | 'home_wet' | 'outside_dry' | 'outside_wet';

export type ResultBranch = Branch | 'skip';

export type CravingType = 'chicken' | 'beef' | 'pork' | 'fish' | 'egg' | 'tofu' | 'seafood' | 'squid' | 'shrimp';

export type PreferredCraving = Exclude<CravingType, 'seafood'>;

export type FoodTypeCraving = 'soup_like' | 'porridge_like' | 'noodle_like';

export type PreferredFoodType = FoodTypeCraving | null;

export type VegetableGroup = 'leafy' | 'root' | 'any';

export type VegetableCraving =
  | 'malabar_spinach'
  | 'amaranth'
  | 'mustard_greens'
  | 'water_spinach'
  | 'moringa'
  | 'watercress'
  | 'spinach'
  | 'seaweed'
  | 'garlic_chives'
  | 'napa_cabbage'
  | 'pumpkin'
  | 'winter_melon'
  | 'gourd'
  | 'bitter_melon'
  | 'carrot_potato'
  | 'taro'
  | 'chayote'
  | 'tomato'
  | 'mushroom'
  | 'okra';

export type PreferredVegetableCraving = VegetableCraving | null;

export type QuizPhase = 'fixed' | 'finding_craving' | 'profiling' | 'complete';

export type Food = {
  id: string;
  name: string;
  branch: Branch;
  description: string;
  estimatedPrice: string;
  prepTime: string;
  fullness: string;
  emoji: string;
  tags: string[];
};

export type AnswerOption = {
  id: string;
  label: string;
  tags: string[];
  icon: string;
};

export type QuestionKind = 'fixed' | 'general' | 'craving' | 'food_type_craving' | 'vegetable_group' | 'vegetable_craving';

export type Question = {
  id: string;
  text: string;
  icon: string;
  options: AnswerOption[];
  kind?: QuestionKind;
  cravingType?: CravingType;
  foodType?: FoodTypeCraving;
  vegetableCraving?: VegetableCraving;
  vegetableGroup?: VegetableGroup;
};

export type QuizAnswer = {
  questionId: string;
  questionText: string;
  answerId: string;
  answerLabel: string;
  answerIcon?: string;
  cravingType?: CravingType;
  foodType?: FoodTypeCraving;
  vegetableCraving?: VegetableCraving;
  vegetableGroup?: VegetableGroup;
  tags: string[];
};

export type QuizState = {
  branch: Branch | null;
  phase: QuizPhase;
  answers: QuizAnswer[];
  askedQuestionIds: string[];
  askedCravings: CravingType[];
  preferredCraving: PreferredCraving | null;
  askedFoodTypes: FoodTypeCraving[];
  preferredFoodType: PreferredFoodType;
  vegetableGroup: VegetableGroup | null;
  askedVegetableCravings: VegetableCraving[];
  preferredVegetableCraving: PreferredVegetableCraving;
  seafoodFollowUpMode: boolean;
  pendingSeafoodOptions: ('squid' | 'shrimp')[];
  generalAnswerCount: number;
  usefulAnswerCount: number;
  targetUsefulAnswerCount: number;
  generalSinceLastCraving: number;
  generalSinceLastFoodType: number;
  generalSinceLastVegetableCraving: number;
};

export type SkipMessage = {
  id: string;
  title: string;
  description?: string;
  icon: string;
};

export type FoodResultPayload = {
  type: 'food';
  food: Food;
  branch: Branch;
  answers: QuizAnswer[];
  preferredCraving: PreferredCraving | null;
  preferredFoodType: PreferredFoodType;
  preferredVegetableCraving: PreferredVegetableCraving;
  reason: string;
  topResults: Food[];
};

export type SkipResultPayload = {
  type: 'skip';
  branch: 'skip';
  answers: QuizAnswer[];
  skipMessage: SkipMessage;
  isSkip: true;
};

export type ResultPayload = FoodResultPayload | SkipResultPayload;

export type RouteName = 'home' | 'quiz' | 'result' | 'favorites';
