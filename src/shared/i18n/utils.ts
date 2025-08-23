import type { Locale } from './messages';

// Define RTL languages
export const RTL_LANGUAGES: Locale[] = ['fa', 'ar', 'ur'];

// Check if a locale is RTL
export const isRTLLocale = (locale: Locale): boolean => {
    return RTL_LANGUAGES.includes(locale);
};

// Get text direction for a locale
export const getTextDirection = (locale: Locale): 'ltr' | 'rtl' => {
    return isRTLLocale(locale) ? 'rtl' : 'ltr';
};

// Get sidebar side for a locale
export const getSidebarSide = (locale: Locale): 'left' | 'right' => {
    return isRTLLocale(locale) ? 'right' : 'left';
};

// Get text alignment class for a locale
export const getTextAlignClass = (locale: Locale): string => {
    return isRTLLocale(locale) ? 'text-right' : 'text-left';
};

// Get margin classes for RTL support
export const getMarginClasses = (locale: Locale, baseClass: string): string => {
    if (!isRTLLocale(locale)) return baseClass;
    return baseClass
        .replace(/\bml-/g, 'mr-')
        .replace(/\bmr-/g, 'ml-')
        .replace(/\bpl-/g, 'pr-')
        .replace(/\bpr-/g, 'pl-');
};

// Get padding classes for RTL support
export const getPaddingClasses = (locale: Locale, baseClass: string): string => {
    if (!isRTLLocale(locale)) return baseClass;
    return baseClass
        .replace(/\bpl-/g, 'pr-')
        .replace(/\bpr-/g, 'pl-');
};

// Get border classes for RTL support
export const getBorderClasses = (locale: Locale, baseClass: string): string => {
    if (!isRTLLocale(locale)) return baseClass;
    return baseClass
        .replace(/\bborder-l\b/g, 'border-r')
        .replace(/\bborder-r\b/g, 'border-l')
        .replace(/\brounded-l-/g, 'rounded-r-')
        .replace(/\brounded-r-/g, 'rounded-l-');
};

// Get flex direction for RTL support
export const getFlexDirection = (locale: Locale, baseDirection: 'row' | 'row-reverse' | 'col' | 'col-reverse'): string => {
    if (!isRTLLocale(locale)) return baseDirection;
    if (baseDirection === 'row') return 'row-reverse';
    if (baseDirection === 'row-reverse') return 'row';
    return baseDirection;
};

// Get justify content for RTL support
export const getJustifyContent = (locale: Locale, baseJustify: string): string => {
    if (!isRTLLocale(locale)) return baseJustify;
    if (baseJustify === 'justify-start') return 'justify-end';
    if (baseJustify === 'justify-end') return 'justify-start';
    return baseJustify;
};

// Get items alignment for RTL support
export const getItemsAlignment = (locale: Locale, baseAlign: string): string => {
    if (!isRTLLocale(locale)) return baseAlign;
    if (baseAlign === 'items-start') return 'items-end';
    if (baseAlign === 'items-end') return 'items-start';
    return baseAlign;
};

// Get self alignment for RTL support
export const getSelfAlignment = (locale: Locale, baseAlign: string): string => {
    if (!isRTLLocale(locale)) return baseAlign;
    if (baseAlign === 'self-start') return 'self-end';
    if (baseAlign === 'self-end') return 'self-start';
    return baseAlign;
};

// Get transform for RTL support (useful for icons)
export const getRTLTransform = (locale: Locale, baseTransform?: string): string => {
    if (!isRTLLocale(locale)) return baseTransform || '';
    if (!baseTransform) return 'scaleX(-1)';
    return `${baseTransform} scaleX(-1)`;
};

// Get locale display name
// Get locale display name
export const getLocaleDisplayName = (locale: Locale): string => {
    const names: Record<Locale, string> = {
        en: 'English',
        fa: 'فارسی',
        ar: 'العربية',
        hi: 'हिन्दी',
        es: 'Español',
        fr: 'Français',
        bn: 'বাংলা',
        pt: 'Português',
        ru: 'Русский',
        ur: 'اردو',
        id: 'Bahasa Indonesia',
        de: 'Deutsch',
        ja: '日本語',
        sw: 'Kiswahili',
        te: 'తెలుగు',
        tr: 'Türkçe'
    };
    return names[locale] || locale;
};

// Get locale flag emoji (for UI display)
export const getLocaleFlag = (locale: Locale): string => {
    const flags: Record<Locale, string> = {
        en: '🇺🇸',
        fa: '🇮🇷',
        tr: '🇹🇷',
        ar: '🇸🇦',
        hi: '🇮🇳',
        es: '🇪🇸',
        fr: '🇫🇷',
        bn: '🇧🇩',
        pt: '🇵🇹',
        ru: '🇷🇺',
        ur: '🇵🇰',
        id: '🇮🇩',
        de: '🇩🇪',
        ja: '🇯🇵',
        sw: '🇹🇿',
        te: '🇮🇳'
    };
    return flags[locale] || '🌐';
};