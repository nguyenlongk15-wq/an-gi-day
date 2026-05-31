import type { SkipMessage } from '../types';
import { pickRandom } from '../utils/random';

export const fallbackSkipMessage: SkipMessage = {
  id: 'skip_fallback',
  icon: '😭',
  title: 'Nhịn luôn đi.',
  description: 'Mai ăn bù cũng được, giờ uống nước đi.',
};

export const skipMessages: SkipMessage[] = [
  {
    id: 'skip_really',
    icon: '😳',
    title: 'Nhịn thiệt luôn hả',
  },
  {
    id: 'skip_hospital_regular',
    icon: '🏥',
    title: '+1 khách quen của bệnh viện',
  },
  {
    id: 'skip_please_eat',
    icon: '🥺',
    title: 'Thôi ăn đi mà',
  },
  {
    id: 'skip_stomach_soup',
    icon: '🍲',
    title: 'Sắp có bao tử hầm tiêu ăn rồi',
  },
  {
    id: 'skip_keep_going',
    icon: '😤',
    title: 'Nhịn được nhịn luôn đi nghe',
  },
  {
    id: 'skip_restaurants_close',
    icon: '😂',
    title: 'Ai cũng như mày chắc quán xá dẹp hết quá',
  },
  {
    id: 'skip_stomach_cancer',
    icon: '😵‍💫',
    title: 'Cố lên sắp ung thư bao tử gòi',
  },
  {
    id: 'skip_honeycomb_stomach',
    icon: '🐝',
    title: 'Bao tử chắc như tổ ong gòi',
  },
  {
    id: 'skip_doctor_gets_rich',
    icon: '🩺',
    title: 'Cứ vậy hoài Bác Sĩ mau giàu lắm',
  },
  {
    id: 'skip_lifespan_question',
    icon: '🤨',
    title: 'Tính sống tới năm nhiêu tuổi?',
  },
  {
    id: 'skip_tired_sigh',
    icon: '😮‍💨',
    title: 'Rầu hết sức',
  },
];

const RECENT_SKIP_MESSAGE_LIMIT = 5;

let recentSkipMessageIds: string[] = [];

export function getRandomSkipMessage(messages: readonly SkipMessage[] = skipMessages): SkipMessage {
  if (messages.length === 0) {
    recentSkipMessageIds = [fallbackSkipMessage.id].slice(-RECENT_SKIP_MESSAGE_LIMIT);
    return fallbackSkipMessage;
  }

  const blockedIds = new Set(recentSkipMessageIds);
  const pool = messages.filter((message) => !blockedIds.has(message.id));
  const selected = pickRandom(pool.length > 0 ? pool : messages) ?? fallbackSkipMessage;

  recentSkipMessageIds = [...recentSkipMessageIds, selected.id].slice(-RECENT_SKIP_MESSAGE_LIMIT);
  return selected;
}
