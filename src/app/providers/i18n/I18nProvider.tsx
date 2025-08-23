import { useEffect, useMemo, useState, type ReactNode } from "react";
import { I18nCtx } from "./i18n-context.ts";
import { messages, type Locale } from "@/shared/i18n/messages.ts";
import { convertDigitsByLocale } from "@/shared/i18n/numbers.ts";
import { isRTLLocale, getTextDirection } from "@/shared/i18n/utils.ts";

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>(() => {
        const saved = localStorage.getItem("locale") as Locale | null;
        return saved ?? "en";
    });

    useEffect(() => {
        const root = document.documentElement;
        const isRTL = isRTLLocale(locale);
        const direction = getTextDirection(locale);

        // Set language and direction
        root.setAttribute("lang", locale);
        root.setAttribute("dir", direction);

        // Add RTL class for CSS targeting
        root.classList.toggle("rtl", isRTL);
        root.classList.toggle("ltr", !isRTL);

        localStorage.setItem("locale", locale);
    }, [locale]);

    const t = useMemo(() => {
        const dict = messages[locale] || {};
        return (key: string, params?: Record<string, string | number>) => {
            const template = dict[key] ?? key;
            if (!params) return template;
            return Object.keys(params).reduce((acc, k) => {
                const raw = params[k]!;
                const value = typeof raw === "number" ? convertDigitsByLocale(raw, locale) : String(raw);
                return acc.replaceAll(`{${k}}`, value);
            }, template);
        };
    }, [locale]);

    return <I18nCtx.Provider value={{ locale, setLocale, t }}>{children}</I18nCtx.Provider>;
}
