import { TranslationSet } from '../types/translations';
import { zhCN } from './locales/zh-CN';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { de } from './locales/de';
import { it } from './locales/it';
import { ja } from './locales/ja';
import { zhTW } from './locales/zh-TW';
import { ar } from './locales/ar';
import { nl } from './locales/nl';
import { ko } from './locales/ko';
import { pt } from './locales/pt';

// Re-export interface for backward compatibility
export type { TranslationSet };

export const translations: Record<string, TranslationSet> = {
  "zh-CN": zhCN,
  "en": en,
  "es": es,
  "fr": fr,
  "de": de,
  "it": it,
  "ja": ja,
  "zh-TW": zhTW,
  "ar": ar,
  "nl": nl,
  "ko": ko,
  "pt": pt
};
