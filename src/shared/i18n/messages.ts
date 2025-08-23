export type Locale = "en" | "fa" | "ar" | "hi" | "es" | "fr" | "bn" | "pt" | "ru" | "ur" | "id" | "de" | "ja" | "sw" | "te" | "tr";

// Import translations from JSON files
import enTranslations from './locales/en.json';
import faTranslations from './locales/fa.json';
import arTranslations from './locales/ar.json';
import hiTranslations from './locales/hi.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import bnTranslations from './locales/bn.json';
import ptTranslations from './locales/pt.json';
import ruTranslations from './locales/ru.json';
import urTranslations from './locales/ur.json';
import idTranslations from './locales/id.json';
import deTranslations from './locales/de.json';
import jaTranslations from './locales/ja.json';
import swTranslations from './locales/sw.json';
import teTranslations from './locales/te.json';
import trTranslations from './locales/tr.json';

export const messages: Record<Locale, Record<string, string>> = {
  en: enTranslations,
  fa: faTranslations,
  ar: arTranslations,
  hi: hiTranslations,
  es: esTranslations,
  fr: frTranslations,
  bn: bnTranslations,
  pt: ptTranslations,
  ru: ruTranslations,
  ur: urTranslations,
  id: idTranslations,
  de: deTranslations,
  ja: jaTranslations,
  sw: swTranslations,
  te: teTranslations,
  tr: trTranslations,
};