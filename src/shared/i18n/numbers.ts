import type { Locale } from "@/shared/i18n/messages";

const LOCALE_MAP: Record<Locale, string> = {
    en: "English",
    fa: "فارسی",
    tr: "Türkçe",
    ar: "العربية",
    hi: "हिन्दी",
    es: "Español",
    fr: "Français",
    bn: "বাংলা",
    pt: "Português",
    ru: "Русский",
    ur: "اردو",
    id: "Bahasa Indonesia",
    de: "Deutsch",
    ja: "日本語",
    sw: "Kiswahili",
    te: "తెలుగు",
};

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
    const intlLocaleMap: Record<string, string> = {
        English: "en-US",
        فارسی: "fa-IR",
        Türkçe: "tr-TR",
        العربية: "ar-SA",
        हिन्दी: "hi-IN",
        Español: "es-ES",
        Français: "fr-FR",
        বাংলা: "bn-BD",
        Português: "pt-PT",
        Русский: "ru-RU",
        اردو: "ur-PK",
        "Bahasa Indonesia": "id-ID",
        Deutsch: "de-DE",
        日本語: "ja-JP",
        Kiswahili: "sw-TZ",
        తెలుగు: "te-IN",
    };
    const resolvedLocale = intlLocaleMap[LOCALE_MAP[locale]] || "en-US";
    return new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const HINDI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] as const;
const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;
const TELUGU_DIGITS = ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"] as const;

type DigitLiteral =
    | typeof PERSIAN_DIGITS[number]
    | typeof HINDI_DIGITS[number]
    | typeof BENGALI_DIGITS[number]
    | typeof TELUGU_DIGITS[number];

export function toScriptDigits(input: string | number, digits: readonly string[]): string {
    return String(input).replace(/[0-9]/g, (d) => digits[Number(d)] || d);
}

export function toEnglishDigits(input: string | number): string {
    const allDigits: readonly (readonly DigitLiteral[])[] = [
        PERSIAN_DIGITS,
        HINDI_DIGITS,
        BENGALI_DIGITS,
        TELUGU_DIGITS,
    ];
    return String(input).replace(/[۰-۹০-৯०-९౦-౯]/g, (d: string) => {
        for (const digits of allDigits) {
            const index = digits.indexOf(d as DigitLiteral);
            if (index !== -1) return String(index);
        }
        return d;
    });
}

export function convertDigitsByLocale(input: string | number, locale: Locale): string {
    switch (locale) {
        case "fa":
        case "ur":
            return toScriptDigits(input, PERSIAN_DIGITS);
        case "hi":
            return toScriptDigits(input, HINDI_DIGITS);
        case "bn":
            return toScriptDigits(input, BENGALI_DIGITS);
        case "te":
            return toScriptDigits(input, TELUGU_DIGITS);
        default:
            return toEnglishDigits(input);
    }
}