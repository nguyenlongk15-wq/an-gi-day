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
];

let lastSkipMessageId: string | null = null;

export function getRandomSkipMessage(messages: readonly SkipMessage[] = skipMessages): SkipMessage {
  if (messages.length === 0) {
    lastSkipMessageId = fallbackSkipMessage.id;
    return fallbackSkipMessage;
  }

  const pool =
    messages.length > 1 && lastSkipMessageId
      ? messages.filter((message) => message.id !== lastSkipMessageId)
      : messages;
  const selected = pickRandom(pool.length > 0 ? pool : messages) ?? fallbackSkipMessage;

  lastSkipMessageId = selected.id;
  return selected;
}
