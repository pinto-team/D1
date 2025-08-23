import type { Locale } from "@/shared/i18n/messages";

const LOCALE_MAP: Record<Locale, string> = {
    en: "en-US",
    fa: "fa-IR",
    tr: "tr-TR",
    ar: "ar-SA",
    'zh-CN': "zh-CN",
    hi: "hi-IN",
    es: "es-ES",
    fr: "fr-FR",
    bn: "bn-BD",
    pt: "pt-PT",
    ru: "ru-RU",
    ur: "ur-PK",
    id: "id-ID",
    de: "de-DE",
    ja: "ja-JP",
    sw: "sw-TZ",
    te: "te-IN",
};

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
    const resolvedLocale = LOCALE_MAP[locale];
    return new Intl.NumberFormat(resolvedLocale, {
        maximumFractionDigits: 2,
        ...options,
    }).format(value);
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"] as const;
const HINDI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"] as const;
const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"] as const;
const TELUGU_DIGITS = ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"] as const;// Urdu uses the same digits as Persian

// Define a union type for all possible digit literals
type DigitLiteral =
    | typeof PERSIAN_DIGITS[number]
    | typeof HINDI_DIGITS[number]
    | typeof BENGALI_DIGITS[number]
    | typeof TELUGU_DIGITS[number];

export function toScriptDigits(input: string | number, digits: readonly string[]): string {
    return String(input).replace(/[0-9]/g, (d) => digits[Number(d)]);
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
        case "tr": // اضافه کردن زبان ترکی
        default:
            return toEnglishDigits(input);
    }
}