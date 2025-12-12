import { en } from './en';
import { km } from './km';

export type Language = 'en' | 'km';
export type TranslationKey = keyof typeof en;

export const translations = {
  en,
  km,
};

export const getTranslation = (lang: Language) => translations[lang] || translations.en;

