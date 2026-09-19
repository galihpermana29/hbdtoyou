export interface BoardOfUsMemory {
  imageUrl: string;
  label: string;
  caption: string;
  alt?: string;
}

export interface BoardOfUsData {
  title: string;
  recipientName: string;
  occasion: 'birthday' | 'anniversary' | 'both';
  token: {
    nickname: string;
    color: string;
  };
  memories: BoardOfUsMemory[];
  chanceTexts: string[];
  finishMessage: string;
  isPublic?: boolean;
}

const DEFAULT_CHANCE_TEXTS = [
  'Share one tiny thing you love about us.',
  'Pick our next little adventure.',
  'Make a wish for our next year together.',
];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function normalizeBoardOfUsData(
  value: unknown
): BoardOfUsData | null {
  if (!value || typeof value !== 'object') return null;

  const raw = value as Partial<BoardOfUsData>;
  const memories = Array.isArray(raw.memories)
    ? raw.memories
        .filter(
          (memory): memory is BoardOfUsMemory =>
            Boolean(
              memory &&
                typeof memory.imageUrl === 'string' &&
                memory.imageUrl.trim() &&
                typeof memory.label === 'string' &&
                memory.label.trim()
            )
        )
        .slice(0, 12)
        .map((memory) => ({
          imageUrl: memory.imageUrl.trim(),
          label: memory.label.trim().slice(0, 32),
          caption:
            typeof memory.caption === 'string'
              ? memory.caption.trim().slice(0, 160)
              : '',
          alt:
            typeof memory.alt === 'string' && memory.alt.trim()
              ? memory.alt.trim()
              : undefined,
        }))
    : [];

  if (memories.length < 8) return null;

  const chanceTexts = Array.isArray(raw.chanceTexts)
    ? raw.chanceTexts
        .filter(
          (text): text is string =>
            typeof text === 'string' && Boolean(text.trim())
        )
        .slice(0, 5)
        .map((text) => text.trim().slice(0, 180))
    : [];

  return {
    title:
      typeof raw.title === 'string' && raw.title.trim()
        ? raw.title.trim().slice(0, 40)
        : 'Board of Us',
    recipientName:
      typeof raw.recipientName === 'string' && raw.recipientName.trim()
        ? raw.recipientName.trim().slice(0, 30)
        : 'Someone special',
    occasion:
      raw.occasion === 'anniversary' || raw.occasion === 'both'
        ? raw.occasion
        : 'birthday',
    token: {
      nickname:
        typeof raw.token?.nickname === 'string' && raw.token.nickname.trim()
          ? raw.token.nickname.trim().slice(0, 18)
          : 'Lovebug',
      color:
        typeof raw.token?.color === 'string' &&
        HEX_COLOR.test(raw.token.color)
          ? raw.token.color
          : '#f05f78',
    },
    memories,
    chanceTexts:
      chanceTexts.length >= 3 ? chanceTexts : DEFAULT_CHANCE_TEXTS,
    finishMessage:
      typeof raw.finishMessage === 'string' && raw.finishMessage.trim()
        ? raw.finishMessage.trim().slice(0, 800)
        : 'Every stop with you is my favorite place to be. Here is to another lap together.',
    isPublic: Boolean(raw.isPublic),
  };
}
