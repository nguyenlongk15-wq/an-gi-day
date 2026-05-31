export type Branch = 'home_dry' | 'home_wet' | 'outside_dry' | 'outside_wet';

export type ResultBranch = Branch | 'skip';

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

export type Question = {
  id: string;
  text: string;
  icon: string;
  options: AnswerOption[];
};

export type QuizAnswer = {
  questionId: string;
  questionText: string;
  answerId: string;
  answerLabel: string;
  answerIcon?: string;
  tags: string[];
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
