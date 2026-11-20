import type { LandingLanguage } from './language';

/**
 * How MemoRoll is sold for now (owner, 2026-11-20): it is free until the end
 * of 2026, and a free slot is asked for on WhatsApp, at the number in the
 * site footer. The landing's price call-out, its announcement strip and its
 * questions all say this, and their buttons open that chat.
 *
 * The page says "until the end of 2026" and never a day: the owner extends
 * or ends the period by asking for the words to change (copy.tsx: `strip`,
 * `plan`, the price question, `metaDescription`). `FREE_UNTIL` is only for
 * search engines, whose price data wants a date.
 */
export const FREE_UNTIL = '2026-12-31';

/** The footer's number (components/ui/footer.tsx), as wa.me wants it. */
const WHATSAPP_NUMBER = '62895383233303';

const OPENING: Record<LandingLanguage, string> = {
  en: 'Hi Memoify, I would like a free MemoRoll slot for my event.',
  id: 'Halo Memoify, saya mau ambil slot MemoRoll gratis untuk acara saya.',
};

/** The chat a visitor asks for a free slot in, opened with a first line. */
export function freeSlotHref(language: LandingLanguage): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(OPENING[language])}`;
}
