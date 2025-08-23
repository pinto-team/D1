// shared/i18n/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fa: { translation: faTranslations },
      ar: { translation: arTranslations },
      hi: { translation: hiTranslations },
      es: { translation: esTranslations },
      fr: { translation: frTranslations },
      bn: { translation: bnTranslations },
      pt: { translation: ptTranslations },
      ru: { translation: ruTranslations },
      ur: { translation: urTranslations },
      id: { translation: idTranslations },
      de: { translation: deTranslations },
      ja: { translation: jaTranslations },
      sw: { translation: swTranslations },
      te: { translation: teTranslations },
      tr: { translation: trTranslations },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    debug: import.meta.env.DEV
  });

export default i18n;
