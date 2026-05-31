export type Branch = 'home_dry' | 'home_wet' | 'outside_dry' | 'outside_wet';

export type ResultBranch = Branch | 'skip';

export type CravingType = 'chicken' | 'beef' | 'pork' | 'fish' | 'egg' | 'tofu' | 'seafood' | 'squid' | 'shrimp';

export type PreferredCraving = Exclude<CravingType, 'seafood'>;

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

export type QuestionKind = 'fixed' | 'general' | 'craving';

export type Question = {
  id: string;
  text: string;
  icon: string;
  options: AnswerOption[];
  kind?: QuestionKind;
  cravingType?: CravingType;
};

export type QuizAnswer = {
  questionId: string;
  questionText: string;
  answerId: string;
  answerLabel: string;
  answerIcon?: string;
  cravingType?: CravingType;
  tags: string[];
};

export type QuizState = {
  branch: Branch | null;
  phase: QuizPhase;
  answers: QuizAnswer[];
  askedQuestionIds: string[];
  askedCravings: CravingType[];
  preferredCraving: PreferredCraving | null;
  seafoodFollowUpMode: boolean;
  pendingSeafoodOptions: ('squid' | 'shrimp')[];
  generalSinceLastCraving: number;
  profileQuestionsAnswered: number;
  targetProfileQuestionCount: number;
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
